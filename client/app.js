// Socket connection
const socket = io();

// State
let currentRoom = null;
let currentPlayer = null;
let mySocketId = null;

// DOM Elements - Screens
const screens = {
  mainMenu: document.getElementById('mainMenu'),
  createRoom: document.getElementById('createRoomScreen'),
  joinRoom: document.getElementById('joinRoomScreen'),
  waiting: document.getElementById('waitingRoom'),
  game: document.getElementById('gameScreen'),
  finished: document.getElementById('finishedScreen')
};

// Helper: Switch screen
function showScreen(screenName) {
  Object.values(screens).forEach(screen => screen.classList.remove('active'));
  screens[screenName].classList.add('active');
}

// Helper: Show error
function showError(message) {
  alert(message);
}

// ===== MAIN MENU =====
document.getElementById('createRoomBtn').addEventListener('click', () => {
  const name = document.getElementById('playerName').value.trim();
  if (!name) {
    showError('Vui lòng nhập tên');
    return;
  }
  document.getElementById('createPlayerName').value = name;
  showScreen('createRoom');
});

document.getElementById('joinRoomBtn').addEventListener('click', () => {
  const name = document.getElementById('playerName').value.trim();
  if (!name) {
    showError('Vui lòng nhập tên');
    return;
  }
  document.getElementById('joinPlayerName').value = name;
  showScreen('joinRoom');
});

// ===== CREATE ROOM =====
document.getElementById('backFromCreateBtn').addEventListener('click', () => {
  showScreen('mainMenu');
});

document.getElementById('confirmCreateBtn').addEventListener('click', () => {
  const playerName = document.getElementById('createPlayerName').value.trim();
  const wordCount = document.getElementById('wordCount').value;
  
  if (!playerName) {
    showError('Vui lòng nhập tên');
    return;
  }

  currentPlayer = playerName;
  socket.emit('createRoom', { playerName, wordCount });
});

// ===== JOIN ROOM =====
document.getElementById('backFromJoinBtn').addEventListener('click', () => {
  showScreen('mainMenu');
});

document.getElementById('confirmJoinBtn').addEventListener('click', () => {
  const playerName = document.getElementById('joinPlayerName').value.trim();
  const roomCode = document.getElementById('roomCode').value.trim().toUpperCase();
  
  if (!playerName) {
    showError('Vui lòng nhập tên');
    return;
  }
  
  if (!roomCode) {
    showError('Vui lòng nhập mã phòng');
    return;
  }

  currentPlayer = playerName;
  socket.emit('joinRoom', { playerName, roomCode });
});

// ===== WAITING ROOM =====
function renderWaitingRoom(room) {
  currentRoom = room;
  
  const roomCodeElement = document.getElementById('displayRoomCode');
  roomCodeElement.textContent = room.roomCode;
  
  // Add click to copy functionality
  roomCodeElement.onclick = () => {
    navigator.clipboard.writeText(room.roomCode).then(() => {
      // Visual feedback
      const originalText = roomCodeElement.textContent;
      roomCodeElement.textContent = '✓ Đã sao chép!';
      roomCodeElement.style.color = '#27ae60';
      
      setTimeout(() => {
        roomCodeElement.textContent = originalText;
        roomCodeElement.style.color = '';
      }, 1500);
    }).catch(err => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = room.roomCode;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        const originalText = roomCodeElement.textContent;
        roomCodeElement.textContent = '✓ Đã sao chép!';
        roomCodeElement.style.color = '#27ae60';
        setTimeout(() => {
          roomCodeElement.textContent = originalText;
          roomCodeElement.style.color = '';
        }, 1500);
      } catch (err) {
        alert('Không thể sao chép. Vui lòng copy thủ công: ' + room.roomCode);
      }
      document.body.removeChild(textArea);
    });
  };
  
  document.getElementById('displayWordCount').textContent = room.wordCount;
  
  // Render players list
  const playersList = document.getElementById('playersList');
  playersList.innerHTML = '';
  room.players.forEach(player => {
    const li = document.createElement('li');
    li.textContent = player.name;
    if (player.ready) {
      li.classList.add('ready');
    }
    playersList.appendChild(li);
  });
  
  // Render secret words inputs
  const secretWordsInputs = document.getElementById('secretWordsInputs');
  secretWordsInputs.innerHTML = '';
  
  for (let i = 1; i <= room.wordCount; i++) {
    const div = document.createElement('div');
    div.className = 'secret-word-input';
    div.innerHTML = `
      <span>${i}.</span>
      <input type="text" class="secret-word" placeholder="Nhập từ thứ ${i}..." data-index="${i-1}">
    `;
    secretWordsInputs.appendChild(div);
  }
  
  // Add input listeners to check if ready button should be enabled
  const inputs = document.querySelectorAll('.secret-word');
  inputs.forEach((input, index) => {
    input.addEventListener('input', checkReadyButton);
    
    // Add autocomplete suggestions with context
    input.addEventListener('input', (e) => {
      const value = e.target.value;
      
      // Lấy các từ đã nhập trước đó
      const allInputs = document.querySelectorAll('.secret-word');
      const previousWords = [];
      for (let i = 0; i < index; i++) {
        const prevValue = allInputs[i].value.trim();
        if (prevValue) {
          previousWords.push(prevValue);
        }
      }
      
      if (value.length >= 1 || previousWords.length > 0) {
        socket.emit('getSuggestions', { prefix: value, previousWords });
      } else {
        hideSuggestions();
      }
    });
    
    // Hiển thị gợi ý khi focus vào ô input (dựa trên từ trước)
    input.addEventListener('focus', (e) => {
      const allInputs = document.querySelectorAll('.secret-word');
      const previousWords = [];
      for (let i = 0; i < index; i++) {
        const prevValue = allInputs[i].value.trim();
        if (prevValue) {
          previousWords.push(prevValue);
        }
      }
      
      if (previousWords.length > 0 && !e.target.value) {
        socket.emit('getSuggestions', { prefix: '', previousWords });
      }
    });
  });
  
  // Update status
  const myPlayer = room.players.find(p => p.id === mySocketId);
  if (myPlayer && myPlayer.ready) {
    document.getElementById('waitingStatus').textContent = 'Đang chờ đối thủ sẵn sàng...';
    document.getElementById('readyBtn').disabled = true;
  } else {
    document.getElementById('waitingStatus').textContent = 'Nhập chuỗi bí mật và nhấn Sẵn sàng';
    checkReadyButton();
  }
}

function checkReadyButton() {
  const inputs = document.querySelectorAll('.secret-word');
  const allFilled = Array.from(inputs).every(input => input.value.trim() !== '');
  document.getElementById('readyBtn').disabled = !allFilled;
}

document.getElementById('readyBtn').addEventListener('click', () => {
  const inputs = document.querySelectorAll('.secret-word');
  const secretWords = Array.from(inputs).map(input => input.value.trim());
  
  if (secretWords.some(w => !w)) {
    showError('Vui lòng nhập đủ tất cả các từ');
    return;
  }
  
  socket.emit('submitSecretWords', { 
    roomCode: currentRoom.roomCode, 
    secretWords 
  });
});

// ===== GAME SCREEN =====
function renderGameScreen(room) {
  currentRoom = room;
  
  document.getElementById('gameRoomCode').textContent = room.roomCode;
  document.getElementById('player1Name').textContent = room.players[0].name;
  document.getElementById('player2Name').textContent = room.players[1].name;
  
  // Find me and opponent
  const me = room.players.find(p => p.id === mySocketId);
  const opponent = room.players.find(p => p.id !== mySocketId);
  document.getElementById('opponentName').textContent = opponent.name;
  
  // Update turn indicator
  const currentTurnPlayer = room.players.find(p => p.id === room.turnPlayerId);
  document.getElementById('currentTurnPlayer').textContent = currentTurnPlayer.name;
  
  // Render my secret words
  renderMySecretWords(me.secretWords);
  
  // Render masked words
  renderMaskedWords(room, opponent.id);
  
  // Enable/disable guess input based on turn
  const isMyTurn = room.turnPlayerId === mySocketId;
  document.getElementById('guessInput').disabled = !isMyTurn;
  document.getElementById('guessBtn').disabled = !isMyTurn;
  
  if (!isMyTurn) {
    document.getElementById('guessInput').placeholder = 'Đang chờ lượt của bạn...';
  } else {
    document.getElementById('guessInput').placeholder = 'Nhập từ tiếp theo...';
  }
  
  // Render progress
  renderProgress(room);
  
  // Render history
  renderHistory(room);
}

function renderMySecretWords(secretWords) {
  const myWordsDiv = document.getElementById('mySecretWords');
  myWordsDiv.innerHTML = '';
  
  secretWords.forEach((word, index) => {
    const div = document.createElement('div');
    div.className = 'word-item';
    div.textContent = `${index + 1}. ${word}`;
    myWordsDiv.appendChild(div);
  });
}

function renderMaskedWords(room, opponentId) {
  const maskedWordsDiv = document.getElementById('maskedWords');
  maskedWordsDiv.innerHTML = '';
  
  const opponent = room.players.find(p => p.id === opponentId);
  const revealedWords = room.revealedWords[opponentId] || [];
  
  opponent.secretWords.forEach((word, index) => {
    const div = document.createElement('div');
    div.className = 'word-item';
    
    if (index < revealedWords.length) {
      div.textContent = word;
    } else {
      div.textContent = generateMask(word);
      div.classList.add('masked');
    }
    
    maskedWordsDiv.appendChild(div);
  });
}

function generateMask(word) {
  const normalized = word
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
  return '_'.repeat(normalized.length);
}

function renderProgress(room) {
  const progressDiv = document.getElementById('progressDisplay');
  progressDiv.innerHTML = '';
  
  room.players.forEach(player => {
    const opponent = room.players.find(p => p.id !== player.id);
    const progress = room.progress[player.id] ? room.progress[player.id][opponent.id] : 0;
    
    const div = document.createElement('div');
    div.className = 'progress-item';
    div.textContent = `${player.name}: ${progress} / ${room.wordCount}`;
    progressDiv.appendChild(div);
  });
}

function renderHistory(room) {
  const historyDiv = document.getElementById('historyDisplay');
  historyDiv.innerHTML = '';
  
  // Show last 10 entries
  const recentHistory = room.history.slice(-10).reverse();
  
  recentHistory.forEach(entry => {
    const div = document.createElement('div');
    div.className = `history-item ${entry.correct ? 'correct' : 'incorrect'}`;
    div.textContent = `${entry.playerName} đoán: ${entry.guess} ${entry.correct ? '✅' : '❌'}`;
    historyDiv.appendChild(div);
  });
  
  if (room.history.length === 0) {
    historyDiv.innerHTML = '<p style="color: #999; text-align: center;">Chưa có lượt đoán nào</p>';
  }
}

document.getElementById('guessBtn').addEventListener('click', makeGuess);
document.getElementById('guessInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    makeGuess();
  }
});

function makeGuess() {
  const guess = document.getElementById('guessInput').value.trim();
  
  if (!guess) {
    showError('Vui lòng nhập từ cần đoán');
    return;
  }
  
  socket.emit('makeGuess', { 
    roomCode: currentRoom.roomCode, 
    guess 
  });
  
  document.getElementById('guessInput').value = '';
}

// ===== FINISHED SCREEN =====
function renderFinishedScreen(winner) {
  document.getElementById('winnerText').textContent = `${winner} đã thắng!`;
  showScreen('finished');
}

document.getElementById('backToMenuBtn').addEventListener('click', () => {
  currentRoom = null;
  currentPlayer = null;
  showScreen('mainMenu');
});

// ===== SOCKET EVENTS =====
socket.on('connect', () => {
  mySocketId = socket.id;
  console.log('Connected:', mySocketId);
});

socket.on('roomCreated', ({ roomCode, room }) => {
  renderWaitingRoom(room);
  showScreen('waiting');
});

socket.on('roomUpdated', ({ room }) => {
  renderWaitingRoom(room);
  if (!screens.waiting.classList.contains('active')) {
    showScreen('waiting');
  }
});

socket.on('gameStarted', ({ room }) => {
  renderGameScreen(room);
  showScreen('game');
});

socket.on('guessResult', ({ room }) => {
  renderGameScreen(room);
});

socket.on('gameFinished', ({ room, winner }) => {
  renderFinishedScreen(winner);
});

socket.on('error', ({ message }) => {
  showError(message);
});

socket.on('playerLeft', ({ room }) => {
  showError('Đối thủ đã rời phòng');
  showScreen('mainMenu');
});

socket.on('warning', ({ message }) => {
  if (confirm(message + '\n\nBạn có muốn tiếp tục không?')) {
    // User accepted warning, continue
  }
});

socket.on('suggestions', ({ suggestions }) => {
  showSuggestions(suggestions);
});

// ===== AUTOCOMPLETE SUGGESTIONS =====
let currentSuggestionsBox = null;
let currentInput = null;
let suggestionTimeout = null;

function showSuggestions(suggestions) {
  hideSuggestions();
  
  if (suggestions.length === 0) return;
  
  const activeInput = document.activeElement;
  if (!activeInput || !activeInput.classList.contains('secret-word')) return;
  
  currentInput = activeInput;
  
  const box = document.createElement('div');
  box.className = 'suggestions-box';
  
  suggestions.forEach(word => {
    const item = document.createElement('div');
    item.className = 'suggestion-item';
    item.textContent = word;
    
    // Support both mouse and touch events
    item.addEventListener('mousedown', (e) => {
      e.preventDefault(); // Prevent input blur
      selectSuggestion(word);
    });
    
    item.addEventListener('touchstart', (e) => {
      e.preventDefault();
      selectSuggestion(word);
    });
    
    box.appendChild(item);
  });
  
  // Position the box
  positionSuggestionsBox(box, activeInput);
  
  document.body.appendChild(box);
  currentSuggestionsBox = box;
  
  // Reposition on scroll/resize
  window.addEventListener('scroll', repositionHandler, true);
  window.addEventListener('resize', repositionHandler);
}

function selectSuggestion(word) {
  if (currentInput) {
    currentInput.value = word;
    currentInput.focus();
    checkReadyButton();
  }
  hideSuggestions();
}

function positionSuggestionsBox(box, input) {
  const rect = input.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  
  // Calculate available space
  const spaceBelow = viewportHeight - rect.bottom;
  const spaceAbove = rect.top;
  
  // Position horizontally
  let left = rect.left;
  let width = rect.width;
  
  // Ensure box doesn't overflow viewport
  if (left + width > viewportWidth - 10) {
    left = viewportWidth - width - 10;
  }
  if (left < 10) {
    left = 10;
    width = Math.min(width, viewportWidth - 20);
  }
  
  box.style.left = left + 'px';
  box.style.width = width + 'px';
  
  // Position vertically (below or above input)
  if (spaceBelow >= 150 || spaceBelow > spaceAbove) {
    // Show below
    box.style.top = (rect.bottom + 4) + 'px';
    box.style.maxHeight = Math.min(200, spaceBelow - 10) + 'px';
  } else {
    // Show above
    box.style.bottom = (viewportHeight - rect.top + 4) + 'px';
    box.style.maxHeight = Math.min(200, spaceAbove - 10) + 'px';
  }
}

function repositionHandler() {
  if (currentSuggestionsBox && currentInput) {
    positionSuggestionsBox(currentSuggestionsBox, currentInput);
  }
}

function hideSuggestions() {
  if (currentSuggestionsBox) {
    currentSuggestionsBox.remove();
    currentSuggestionsBox = null;
  }
  window.removeEventListener('scroll', repositionHandler, true);
  window.removeEventListener('resize', repositionHandler);
}

// Hide suggestions when clicking/touching outside
document.addEventListener('mousedown', (e) => {
  if (currentSuggestionsBox && !currentSuggestionsBox.contains(e.target) && e.target !== currentInput) {
    hideSuggestions();
  }
});

document.addEventListener('touchstart', (e) => {
  if (currentSuggestionsBox && !currentSuggestionsBox.contains(e.target) && e.target !== currentInput) {
    hideSuggestions();
  }
});

// Hide suggestions when input loses focus (with delay for click handling)
document.addEventListener('blur', (e) => {
  if (e.target === currentInput) {
    setTimeout(() => {
      if (document.activeElement !== currentInput) {
        hideSuggestions();
      }
    }, 200);
  }
}, true);
