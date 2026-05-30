// Danh sách từ tiếng Việt phổ biến để validate và gợi ý
// Kết hợp với API check online
const commonVietnameseWords = [
  // Động từ phổ biến
  'ăn', 'uống', 'ngủ', 'đi', 'đến', 'về', 'làm', 'học', 'chơi', 'nói', 'nghe', 'nhìn', 'thấy',
  'biết', 'hiểu', 'yêu', 'thích', 'ghét', 'muốn', 'cần', 'có', 'được', 'cho', 'lấy', 'mua', 'bán',
  'viết', 'đọc', 'hát', 'nhảy', 'chạy', 'đứng', 'ngồi', 'nằm', 'bay', 'bơi', 'leo', 'trèo',
  
  // Danh từ phổ biến - Đồ ăn
  'cơm', 'phở', 'bún', 'bánh', 'mì', 'canh', 'súp', 'xôi', 'chè', 'trà', 'cà phê', 'nước',
  'thịt', 'cá', 'gà', 'vịt', 'bò', 'heo', 'tôm', 'cua', 'mực', 'rau', 'củ', 'quả', 'trái',
  'trứng', 'sữa', 'bơ', 'phô mai', 'dầu', 'muối', 'đường', 'tiêu', 'tỏi', 'hành', 'gừng',
  'chuối', 'táo', 'cam', 'xoài', 'dưa', 'ổi', 'mít', 'sầu riêng', 'chôm chôm', 'nhãn',
  'chiên', 'xào', 'luộc', 'nướng', 'hấp', 'kho', 'rim', 'rang',
  
  // Danh từ - Đồ vật
  'nhà', 'cửa', 'bàn', 'ghế', 'giường', 'tủ', 'kệ', 'đèn', 'quạt', 'máy', 'tivi', 'điện thoại',
  'xe', 'ô tô', 'máy bay', 'tàu', 'thuyền', 'đạp', 'mô tô', 'xe đạp',
  'sách', 'vở', 'bút', 'thước', 'cặp', 'túi', 'áo', 'quần', 'váy', 'giày', 'dép', 'mũ',
  'cây', 'hoa', 'lá', 'cỏ', 'rừng', 'núi', 'sông', 'biển', 'hồ', 'suối',
  
  // Danh từ - Con vật
  'chó', 'mèo', 'chuột', 'ngựa', 'trâu', 'dê', 'cừu', 'hổ', 'sư tử', 'voi', 'khỉ',
  'chim', 'bồ câu', 'gà', 'vịt', 'ngỗng', 'công', 'đà điểu',
  'rắn', 'rùa', 'cá sấu', 'ếch', 'nhái', 'bướm', 'ong', 'kiến', 'muỗi', 'ruồi',
  
  // Tính từ
  'đẹp', 'xấu', 'tốt', 'xấu', 'cao', 'thấp', 'to', 'nhỏ', 'dài', 'ngắn', 'rộng', 'hẹp',
  'nóng', 'lạnh', 'ấm', 'mát', 'nặng', 'nhẹ', 'cứng', 'mềm', 'sạch', 'bẩn',
  'vui', 'buồn', 'giận', 'sợ', 'ngạc nhiên', 'hạnh phúc', 'khó chịu',
  'nhanh', 'chậm', 'mạnh', 'yếu', 'khỏe', 'ốm', 'già', 'trẻ', 'mới', 'cũ',
  
  // Màu sắc
  'đỏ', 'xanh', 'vàng', 'trắng', 'đen', 'xám', 'nâu', 'hồng', 'tím', 'cam', 'lục',
  
  // Số đếm
  'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín', 'mười',
  
  // Thời gian
  'ngày', 'đêm', 'sáng', 'trưa', 'chiều', 'tối', 'giờ', 'phút', 'giây',
  'thứ hai', 'thứ ba', 'thứ tư', 'thứ năm', 'thứ sáu', 'thứ bảy', 'chủ nhật',
  'tháng', 'năm', 'tuần', 'hôm nay', 'hôm qua', 'ngày mai',
  
  // Người
  'người', 'bạn', 'gia đình', 'bố', 'mẹ', 'anh', 'chị', 'em', 'con', 'ông', 'bà',
  'thầy', 'cô', 'giáo viên', 'học sinh', 'sinh viên', 'bác sĩ', 'y tá', 'công nhân',
  
  // Địa điểm
  'trường', 'lớp', 'bệnh viện', 'chợ', 'siêu thị', 'công viên', 'sân bay', 'bến xe',
  'thành phố', 'làng', 'quê', 'đường', 'phố', 'ngõ', 'hẻm',
  
  // Khác
  'và', 'hoặc', 'nhưng', 'vì', 'nếu', 'thì', 'rất', 'quá', 'lắm', 'nhiều', 'ít',
  'tất cả', 'một số', 'không', 'có', 'là', 'ở', 'trong', 'ngoài', 'trên', 'dưới'
];

// Normalize để so sánh (lowercase + trim)
const normalizedWords = new Set(
  commonVietnameseWords.map(w => w.toLowerCase().trim())
);

// Kiểm tra từ có trong danh sách cơ bản không
function isCommonWord(word) {
  return normalizedWords.has(word.toLowerCase().trim());
}

// Từ ghép phổ biến trong tiếng Việt (context-aware)
const wordPairs = {
  'ăn': ['cơm', 'phở', 'bún', 'bánh', 'sáng', 'trưa', 'tối', 'uống', 'ngon'],
  'uống': ['nước', 'trà', 'cà phê', 'sữa', 'bia', 'rượu'],
  'đi': ['học', 'chơi', 'làm', 'ngủ', 'về', 'bộ', 'xe', 'máy bay'],
  'học': ['sinh', 'bài', 'hành', 'tập', 'giỏi'],
  'sinh': ['viên', 'nhật', 'hoạt', 'ra'],
  'cơm': ['chiên', 'rang', 'trắng', 'nóng', 'nguội'],
  'chiên': ['trứng', 'gà', 'cá', 'rau', 'giòn'],
  'trứng': ['gà', 'vịt', 'chiên', 'luộc', 'ốp la'],
  'vịt': ['quay', 'nướng', 'luộc', 'om'],
  'gà': ['rán', 'nướng', 'luộc', 'quay', 'ta'],
  'cá': ['rô', 'hồi', 'ngừ', 'thu', 'nướng', 'chiên'],
  'xe': ['đạp', 'máy', 'hơi', 'buýt', 'lửa'],
  'máy': ['bay', 'tính', 'giặt', 'lạnh', 'ảnh'],
  'điện': ['thoại', 'thoại', 'tử', 'lực'],
  'thoại': ['di động', 'thông minh'],
  'bác': ['sĩ', 'gái', 'trai'],
  'giáo': ['viên', 'dục', 'sư'],
  'công': ['viên', 'nhân', 'ty', 'việc'],
  'siêu': ['thị', 'nhân', 'xe'],
  'bệnh': ['viện', 'nhân', 'tật'],
  'sân': ['bay', 'vườn', 'khấu'],
  'thành': ['phố', 'công'],
  'đường': ['phố', 'sá', 'cao tốc'],
  'màu': ['đỏ', 'xanh', 'vàng', 'trắng', 'đen'],
  'áo': ['dài', 'sơ mi', 'khoác', 'len'],
  'quần': ['áo', 'jean', 'dài', 'ngắn'],
  'giày': ['dép', 'thể thao', 'cao gót'],
  'mua': ['sắm', 'bán', 'hàng'],
  'bán': ['hàng', 'buôn', 'lẻ'],
  'làm': ['việc', 'bài', 'ăn'],
  'chơi': ['game', 'bóng', 'đùa'],
  'đọc': ['sách', 'báo', 'truyện'],
  'viết': ['bài', 'văn', 'thư'],
  'hát': ['karaoke', 'hay', 'dở'],
  'nhảy': ['múa', 'đẹp'],
  'chạy': ['bộ', 'nhanh', 'chậm'],
  'bơi': ['lội', 'giỏi'],
  'núi': ['cao', 'non', 'rừng'],
  'sông': ['nước', 'ngòi'],
  'biển': ['cả', 'xanh', 'đẹp'],
  'trời': ['mưa', 'nắng', 'đẹp'],
  'mưa': ['to', 'nhỏ', 'rào'],
  'nắng': ['gắt', 'đẹp', 'ấm'],
  'lạnh': ['giá', 'buốt'],
  'nóng': ['bức', 'oi'],
  'đẹp': ['trai', 'gái', 'lắm'],
  'xấu': ['xí', 'trai', 'gái']
};

// Tìm từ gợi ý dựa trên prefix và context
function getSuggestions(prefix, previousWords = [], limit = 10) {
  if (!prefix || prefix.length < 1) {
    // Nếu không có prefix nhưng có từ trước đó, gợi ý từ ghép
    if (previousWords && previousWords.length > 0) {
      const lastWord = previousWords[previousWords.length - 1].toLowerCase().trim();
      const contextSuggestions = wordPairs[lastWord] || [];
      return contextSuggestions.slice(0, limit);
    }
    return [];
  }
  
  const lowerPrefix = prefix.toLowerCase().trim();
  let suggestions = [];
  
  // Ưu tiên gợi ý từ context nếu có từ trước đó
  if (previousWords && previousWords.length > 0) {
    const lastWord = previousWords[previousWords.length - 1].toLowerCase().trim();
    const contextWords = wordPairs[lastWord] || [];
    
    // Lọc từ context phù hợp với prefix
    const contextMatches = contextWords.filter(word => 
      word.toLowerCase().startsWith(lowerPrefix)
    );
    
    suggestions = [...contextMatches];
  }
  
  // Thêm các từ phổ biến khác
  const generalMatches = commonVietnameseWords.filter(word => 
    word.toLowerCase().startsWith(lowerPrefix) &&
    !suggestions.includes(word)
  );
  
  suggestions = [...suggestions, ...generalMatches];
  
  return suggestions.slice(0, limit);
}

// Validate từ với API
async function validateWord(word) {
  const trimmed = word.trim();
  
  // Kiểm tra rỗng
  if (!trimmed) {
    return { valid: false, message: 'Từ không được để trống' };
  }
  
  // Kiểm tra độ dài
  if (trimmed.length < 2) {
    return { valid: false, message: 'Từ phải có ít nhất 2 ký tự' };
  }
  
  if (trimmed.length > 30) {
    return { valid: false, message: 'Từ quá dài (tối đa 30 ký tự)' };
  }
  
  // Kiểm tra ký tự hợp lệ (chữ cái tiếng Việt và khoảng trắng)
  const vietnameseRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/;
  
  if (!vietnameseRegex.test(trimmed)) {
    return { valid: false, message: 'Từ chỉ được chứa chữ cái tiếng Việt' };
  }
  
  // Kiểm tra trong danh sách từ phổ biến trước (nhanh hơn)
  if (isCommonWord(trimmed)) {
    return { valid: true, message: 'Từ hợp lệ' };
  }
  
  // Gọi API để kiểm tra từ điển
  try {
    const fetch = (await import('node-fetch')).default;
    const url = `https://dict.minhqnd.com/api/v1/lookup?word=${encodeURIComponent(trimmed)}`;
    const response = await fetch(url, { timeout: 3000 });
    const data = await response.json();
    
    if (data.exists) {
      return { valid: true, message: 'Từ hợp lệ (có trong từ điển)' };
    } else {
      return { 
        valid: false, 
        message: 'Từ không có trong từ điển tiếng Việt. Vui lòng kiểm tra chính tả' 
      };
    }
  } catch (error) {
    // Nếu API lỗi, fallback về kiểm tra cơ bản
    console.error('API validation error:', error.message);
    return { 
      valid: true, 
      warning: true,
      message: 'Không thể kiểm tra từ điển (lỗi kết nối). Từ được chấp nhận tạm thời' 
    };
  }
}

// Validate chuỗi từ - kiểm tra mọi cặp liền kề có nghĩa
function validateWordSequence(words) {
  if (!words || words.length < 2) {
    return { valid: true }; // Không cần validate nếu chỉ có 1 từ
  }

  const errors = [];

  for (let i = 0; i < words.length - 1; i++) {
    const currentWord = words[i].toLowerCase().trim();
    const nextWord = words[i + 1].toLowerCase().trim();
    
    // Kiểm tra xem cặp từ có hợp nghĩa không
    const validNextWords = wordPairs[currentWord] || [];
    
    if (!validNextWords.includes(nextWord)) {
      errors.push({
        position: `${i + 1}-${i + 2}`,
        pair: `"${words[i]}" + "${words[i + 1]}"`,
        message: `Cặp từ ${i + 1}-${i + 2} không hợp nghĩa: "${words[i]}" + "${words[i + 1]}"`
      });
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors: errors,
      message: errors.map(e => e.message).join('\n')
    };
  }

  return { valid: true, message: 'Chuỗi từ hợp nghĩa' };
}

module.exports = {
  isCommonWord,
  getSuggestions,
  validateWord,
  validateWordSequence,
  commonVietnameseWords
};
