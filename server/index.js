const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const { validateWord, getSuggestions } = require('./vietnameseWords');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, '../client')));

// In-memory storage
const rooms = new Map();

// Helper: Remove Vietnamese accents
function removeVietnameseAccents(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

// Helper: Generate mask for a word
function generateMask(word) {
  const normalized = removeVietnameseAccents(word);
  return '_'.repeat(normalized.length);
}

// Helper: Generate random room code
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Create room
  socket.on('createRoom', ({ playerName, wordCount }) => {
    const roomCode = generateRoomCode();
    const room = {
      roomCode,
      wordCount: parseInt(wordCount),
      status: 'waiting', // waiting, playing, finished
      players: [
        {
          id: socket.id,
          name: playerName,
          ready: false,
          secretWords: []
        }
      ],
      revealedWords: {}, // { playerId: [revealed words array] }
      progress: {}, // { guesserPlayerId: { targetPlayerId: revealedCount } }
      turnPlayerId: null,
      history: [],
      winnerId: null
    };

    rooms.set(roomCode, room);
    socket.join(roomCode);
    socket.emit('roomCreated', { roomCode, room });
    console.log(`Room ${roomCode} created by ${playerName}`);
  });

  // Join room
  socket.on('joinRoom', ({ playerName, roomCode }) => {
    const room = rooms.get(roomCode);
    
    if (!room) {
      socket.emit('error', { message: 'Phòng không tồn tại' });
      return;
    }

    if (room.players.length >= 2) {
      socket.emit('error', { message: 'Phòng đã đầy' });
      return;
    }

    if (room.status !== 'waiting') {
      socket.emit('error', { message: 'Phòng đang chơi' });
      return;
    }

    room.players.push({
      id: socket.id,
      name: playerName,
      ready: false,
      secretWords: []
    });

    socket.join(roomCode);
    io.to(roomCode).emit('roomUpdated', { room });
    console.log(`${playerName} joined room ${roomCode}`);
  });

  // Submit secret words
  socket.on('submitSecretWords', async ({ roomCode, secretWords }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    // Validate word count
    if (secretWords.length !== room.wordCount) {
      socket.emit('error', { message: 'Số lượng từ không đúng' });
      return;
    }

    // Validate no empty words
    if (secretWords.some(w => !w.trim())) {
      socket.emit('error', { message: 'Không được để trống từ' });
      return;
    }

    // Validate each word (async)
    const invalidWords = [];
    const warnings = [];
    
    for (let i = 0; i < secretWords.length; i++) {
      const word = secretWords[i].trim();
      const validation = await validateWord(word);
      
      if (!validation.valid) {
        invalidWords.push(`Từ ${i + 1} (${word}): ${validation.message}`);
      } else if (validation.warning) {
        warnings.push(`Từ ${i + 1} (${word}): ${validation.message}`);
      }
    }

    // Nếu có từ không hợp lệ, từ chối
    if (invalidWords.length > 0) {
      socket.emit('error', { 
        message: 'Có từ không hợp lệ:\n' + invalidWords.join('\n')
      });
      return;
    }

    // Nếu có cảnh báo, gửi thông báo nhưng vẫn cho phép
    if (warnings.length > 0) {
      socket.emit('warning', { 
        message: 'Cảnh báo:\n' + warnings.join('\n')
      });
    }

    player.secretWords = secretWords.map(w => w.trim());
    player.ready = true;

    // Initialize revealed words (first word is always revealed)
    if (!room.revealedWords[socket.id]) {
      room.revealedWords[socket.id] = [player.secretWords[0]];
    }

    io.to(roomCode).emit('roomUpdated', { room });

    // Check if both players are ready
    if (room.players.length === 2 && room.players.every(p => p.ready)) {
      room.status = 'playing';
      room.turnPlayerId = room.players[0].id; // First player starts

      // Initialize progress
      room.players.forEach(guesser => {
        room.players.forEach(target => {
          if (guesser.id !== target.id) {
            if (!room.progress[guesser.id]) {
              room.progress[guesser.id] = {};
            }
            room.progress[guesser.id][target.id] = 1; // First word already revealed
          }
        });
      });

      io.to(roomCode).emit('gameStarted', { room });
      console.log(`Game started in room ${roomCode}`);
    }
  });

  // Make a guess
  socket.on('makeGuess', ({ roomCode, guess }) => {
    const room = rooms.get(roomCode);
    if (!room || room.status !== 'playing') return;

    if (room.turnPlayerId !== socket.id) {
      socket.emit('error', { message: 'Không phải lượt của bạn' });
      return;
    }

    const guesser = room.players.find(p => p.id === socket.id);
    const opponent = room.players.find(p => p.id !== socket.id);
    
    if (!guesser || !opponent) return;

    const guessNormalized = guess.trim();
    const currentProgress = room.progress[guesser.id][opponent.id];
    const targetWord = opponent.secretWords[currentProgress];

    if (!targetWord) {
      socket.emit('error', { message: 'Lỗi: không tìm thấy từ cần đoán' });
      return;
    }

    const isCorrect = guessNormalized.toLowerCase() === targetWord.toLowerCase();

    // Add to history
    room.history.push({
      playerName: guesser.name,
      guess: guessNormalized,
      correct: isCorrect,
      timestamp: Date.now()
    });

    if (isCorrect) {
      // Reveal the word
      room.revealedWords[opponent.id].push(targetWord);
      room.progress[guesser.id][opponent.id]++;

      // Check if guesser won
      if (room.progress[guesser.id][opponent.id] >= room.wordCount) {
        room.status = 'finished';
        room.winnerId = guesser.id;
        io.to(roomCode).emit('gameFinished', { room, winner: guesser.name });
        console.log(`${guesser.name} won in room ${roomCode}`);
        return;
      }

      // Correct guess: keep turn
      io.to(roomCode).emit('guessResult', { 
        room, 
        correct: true, 
        guess: guessNormalized,
        guesserName: guesser.name
      });
    } else {
      // Wrong guess: switch turn
      room.turnPlayerId = opponent.id;
      io.to(roomCode).emit('guessResult', { 
        room, 
        correct: false, 
        guess: guessNormalized,
        guesserName: guesser.name
      });
    }
  });

  // Get masked words for opponent
  socket.on('getMaskedWords', ({ roomCode, targetPlayerId }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    const target = room.players.find(p => p.id === targetPlayerId);
    if (!target) return;

    const revealedWords = room.revealedWords[targetPlayerId] || [];
    const maskedWords = target.secretWords.map((word, index) => {
      if (index < revealedWords.length) {
        return word;
      } else {
        return generateMask(word);
      }
    });

    socket.emit('maskedWords', { maskedWords });
  });

  // Get word suggestions
  socket.on('getSuggestions', ({ prefix, previousWords }) => {
    const suggestions = getSuggestions(prefix, previousWords, 10);
    socket.emit('suggestions', { suggestions });
  });

  // Validate a single word
  socket.on('validateWord', ({ word }) => {
    const validation = validateWord(word);
    socket.emit('wordValidation', { word, validation });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Find and clean up rooms
    rooms.forEach((room, roomCode) => {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        
        if (room.players.length === 0) {
          rooms.delete(roomCode);
          console.log(`Room ${roomCode} deleted (empty)`);
        } else {
          io.to(roomCode).emit('playerLeft', { room });
        }
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
