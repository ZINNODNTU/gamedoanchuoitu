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
  // Ăn uống
  'ăn': ['cơm', 'phở', 'bún', 'bánh', 'sáng', 'trưa', 'tối', 'uống', 'ngon', 'no', 'vội', 'chay'],
  'uống': ['nước', 'trà', 'cà phê', 'sữa', 'bia', 'rượu', 'thuốc', 'say'],
  'cơm': ['chiên', 'rang', 'trắng', 'nóng', 'nguội', 'tấm', 'niêu', 'hộp'],
  'phở': ['bò', 'gà', 'tái', 'nóng', 'hà nội'],
  'bún': ['bò', 'chả', 'riêu', 'thịt', 'măng'],
  'bánh': ['mì', 'bao', 'mỳ', 'ngọt', 'tráng', 'cuốn', 'xèo', 'chưng'],
  'chiên': ['trứng', 'gà', 'cá', 'rau', 'giòn', 'vàng'],
  'trứng': ['gà', 'vịt', 'chiên', 'luộc', 'ốp la', 'rán'],
  'vịt': ['quay', 'nướng', 'luộc', 'om', 'hấp'],
  'gà': ['rán', 'nướng', 'luộc', 'quay', 'ta', 'công nghiệp', 'hấp'],
  'cá': ['rô', 'hồi', 'ngừ', 'thu', 'nướng', 'chiên', 'kho', 'hấp', 'viên'],
  'thịt': ['bò', 'heo', 'gà', 'nướng', 'kho', 'luộc', 'xào'],
  'bò': ['nướng', 'kho', 'xào', 'viên', 'tái', 'lúc lắc'],
  'heo': ['quay', 'nướng', 'kho', 'luộc', 'xào'],
  'rau': ['xào', 'luộc', 'sống', 'muống', 'cải', 'thơm'],
  'canh': ['chua', 'rau', 'cá', 'thịt', 'nóng'],
  'xào': ['rau', 'thịt', 'tỏi', 'nhanh', 'giòn'],
  'nướng': ['thịt', 'cá', 'gà', 'than', 'mỡ'],
  'luộc': ['gà', 'trứng', 'rau', 'thịt', 'chín'],
  'kho': ['thịt', 'cá', 'trứng', 'tàu', 'tiêu'],
  
  // Di chuyển
  'đi': ['học', 'chơi', 'làm', 'ngủ', 'về', 'bộ', 'xe', 'máy bay', 'du lịch', 'dạo', 'nhanh', 'chậm'],
  'về': ['nhà', 'quê', 'sớm', 'muộn', 'nước'],
  'đến': ['trường', 'nhà', 'nơi', 'đây', 'đó'],
  'xe': ['đạp', 'máy', 'hơi', 'buýt', 'lửa', 'tải', 'con'],
  'máy': ['bay', 'tính', 'giặt', 'lạnh', 'ảnh', 'móc', 'xay'],
  'tàu': ['hỏa', 'thủy', 'điện', 'ngầm', 'bay'],
  'bay': ['cao', 'xa', 'nhanh', 'thẳng'],
  
  // Học tập
  'học': ['sinh', 'bài', 'hành', 'tập', 'giỏi', 'kém', 'chăm', 'lười'],
  'sinh': ['viên', 'nhật', 'hoạt', 'ra', 'đẻ'],
  'viên': ['chức', 'gạch', 'bi', 'thuốc'],
  'bài': ['tập', 'học', 'hát', 'thơ', 'văn', 'kiểm tra'],
  'tập': ['thể dục', 'viết', 'đọc', 'hát', 'trung'],
  'giáo': ['viên', 'dục', 'sư', 'trình'],
  'trường': ['học', 'đại học', 'tiểu học', 'mầm non'],
  'lớp': ['học', 'trưởng', 'một', 'hai'],
  
  // Thể thao
  'bóng': ['đá', 'chuyền', 'rổ', 'bàn', 'chày', 'tennis', 'bay', 'nước'],
  'chuyền': ['bóng', 'banh', 'tay', 'hơi'],
  'đá': ['bóng', 'banh', 'phạt', 'penalty', 'góc'],
  'banh': ['vàng', 'tròn', 'to', 'nhỏ'],
  'chạy': ['bộ', 'nhanh', 'chậm', 'marathon', 'thi'],
  'bơi': ['lội', 'giỏi', 'nhanh', 'sải', 'ếch'],
  'nhảy': ['múa', 'đẹp', 'cao', 'xa', 'dây'],
  'đấu': ['võ', 'kiếm', 'boxing', 'vật'],
  
  // Công việc
  'làm': ['việc', 'bài', 'ăn', 'giàu', 'nghề'],
  'việc': ['nhà', 'công ty', 'quan trọng', 'khó'],
  'công': ['viên', 'nhân', 'ty', 'việc', 'an', 'trình'],
  'nhân': ['viên', 'dân', 'tài', 'lực', 'vật'],
  'bác': ['sĩ', 'gái', 'trai', 'hàng xóm'],
  'sĩ': ['quan', 'phu', 'tử'],
  'thầy': ['giáo', 'thuốc', 'cô', 'trò'],
  'cô': ['giáo', 'gái', 'đơn', 'bé'],
  
  // Địa điểm
  'thành': ['phố', 'công', 'thật', 'lập'],
  'phố': ['cổ', 'đi bộ', 'lớn', 'nhỏ'],
  'đường': ['phố', 'sá', 'cao tốc', 'đi', 'ray'],
  'sân': ['bay', 'vườn', 'khấu', 'bóng', 'thượng'],
  'bệnh': ['viện', 'nhân', 'tật', 'viện'],
  'siêu': ['thị', 'nhân', 'xe', 'tốc'],
  'chợ': ['đầu mối', 'trời', 'lớn', 'nhỏ'],
  'nhà': ['hàng', 'thờ', 'máy', 'trọ', 'nghỉ', 'ở'],
  'khách': ['sạn', 'hàng', 'du lịch', 'mời'],
  
  // Thiên nhiên
  'núi': ['cao', 'non', 'rừng', 'đá', 'lửa'],
  'sông': ['nước', 'ngòi', 'lớn', 'nhỏ', 'hồng'],
  'biển': ['cả', 'xanh', 'đẹp', 'lớn', 'động'],
  'rừng': ['già', 'rậm', 'xanh', 'núi', 'cây'],
  'cây': ['xanh', 'cối', 'cao', 'thấp', 'ăn quả'],
  'hoa': ['hồng', 'lan', 'đào', 'mai', 'tươi', 'đẹp'],
  'trời': ['mưa', 'nắng', 'đẹp', 'xanh', 'cao'],
  'mưa': ['to', 'nhỏ', 'rào', 'dầm', 'đá'],
  'nắng': ['gắt', 'đẹp', 'ấm', 'chang chang', 'nóng'],
  'gió': ['mạnh', 'nhẹ', 'mát', 'lạnh', 'bão'],
  
  // Thời tiết & thời gian
  'lạnh': ['giá', 'buốt', 'cóng', 'run'],
  'nóng': ['bức', 'oi', 'nực', 'ran'],
  'ấm': ['áp', 'lên', 'nóng'],
  'mát': ['mẻ', 'lạnh', 'dịu'],
  'ngày': ['mai', 'hôm qua', 'nay', 'kia', 'tháng'],
  'đêm': ['nay', 'qua', 'khuya', 'tối'],
  'sáng': ['sớm', 'nay', 'mai', 'nắng'],
  'trưa': ['nay', 'hôm qua', 'nắng', 'ăn'],
  'chiều': ['nay', 'tối', 'mát', 'đẹp'],
  'tối': ['nay', 'hôm qua', 'tăm tối', 'đen'],
  
  // Quần áo
  'áo': ['dài', 'sơ mi', 'khoác', 'len', 'thun', 'vest'],
  'quần': ['áo', 'jean', 'dài', 'ngắn', 'tây', 'đùi'],
  'váy': ['dài', 'ngắn', 'đẹp', 'xòe'],
  'giày': ['dép', 'thể thao', 'cao gót', 'da', 'vải'],
  'dép': ['lê', 'xỏ ngón', 'cao su', 'quai'],
  'mũ': ['lưỡi trai', 'len', 'rộng vành', 'bảo hiểm'],
  
  // Mua bán
  'mua': ['sắm', 'bán', 'hàng', 'vui', 'đắt', 'rẻ'],
  'bán': ['hàng', 'buôn', 'lẻ', 'chạy', 'đắt'],
  'sắm': ['đồ', 'quần áo', 'hàng'],
  'hàng': ['hóa', 'đẹp', 'xấu', 'giả', 'thật'],
  'tiền': ['bạc', 'mặt', 'lẻ', 'to', 'nhiều'],
  'đắt': ['đỏ', 'quá', 'lắm'],
  'rẻ': ['mạt', 'quá', 'lắm'],
  
  // Điện tử
  'điện': ['thoại', 'tử', 'lực', 'thoại', 'tích'],
  'thoại': ['di động', 'thông minh', 'cố định'],
  'máy': ['tính', 'giặt', 'lạnh', 'ảnh', 'bay', 'móc'],
  'tính': ['toán', 'cách', 'năng'],
  
  // Tính từ
  'đẹp': ['trai', 'gái', 'lắm', 'quá', 'lung linh'],
  'xấu': ['xí', 'trai', 'gái', 'xa', 'lắm'],
  'tốt': ['bụng', 'đẹp', 'lành', 'nghiệp'],
  'cao': ['lớn', 'ráo', 'thấp', 'su'],
  'thấp': ['bé', 'lùn', 'thoáng'],
  'to': ['lớn', 'con', 'béo'],
  'nhỏ': ['bé', 'xíu', 'con', 'nhắn'],
  'dài': ['ngoằng', 'thòng', 'lê thê'],
  'ngắn': ['cũn', 'ngủn', 'lủn'],
  'nhanh': ['nhẹn', 'chóng', 'lẹ'],
  'chậm': ['chạp', 'rãi', 'lụt'],
  'khỏe': ['mạnh', 'khoắn', 're'],
  'yếu': ['đuối', 'ớt', 'kém'],
  'giàu': ['có', 'sang', 'lắm'],
  'nghèo': ['khó', 'túng', 'lắm'],
  
  // Động từ
  'đọc': ['sách', 'báo', 'truyện', 'thơ', 'văn'],
  'viết': ['bài', 'văn', 'thư', 'chữ', 'tay'],
  'hát': ['karaoke', 'hay', 'dở', 'ca', 'nhạc'],
  'nói': ['chuyện', 'to', 'nhỏ', 'thật', 'dối'],
  'nghe': ['nhạc', 'radio', 'kể', 'lời'],
  'nhìn': ['thấy', 'xa', 'gần', 'rõ'],
  'thấy': ['rõ', 'mờ', 'xa', 'gần'],
  
  // Thêm các từ còn thiếu
  'chơi': ['game', 'bóng', 'đùa', 'vui', 'tennis', 'cờ'],
  'ngủ': ['ngon', 'say', 'dậy', 'sớm', 'muộn', 'trưa'],
  'dậy': ['sớm', 'muộn', 'thức'],
  'thức': ['khuya', 'dậy', 'giấc'],
  'yêu': ['thương', 'quý', 'mến', 'đương'],
  'thương': ['yêu', 'mến', 'nhớ'],
  'thích': ['lắm', 'quá', 'nhất'],
  'ghét': ['lắm', 'cay', 'cú'],
  'muốn': ['có', 'được', 'làm', 'ăn'],
  'cần': ['thiết', 'phải', 'gấp'],
  'biết': ['rồi', 'đâu', 'gì', 'làm'],
  'hiểu': ['rồi', 'biết', 'nhầm'],
  
  // Màu sắc mở rộng
  'đỏ': ['tươi', 'thẫm', 'nhạt', 'au'],
  'xanh': ['lá', 'da trời', 'lơ', 'biển', 'lục'],
  'vàng': ['tươi', 'nhạt', 'kim', 'chanh', 'óng'],
  'trắng': ['tinh', 'bóc', 'xóa', 'muốt'],
  'đen': ['thui', 'tuyền', 'bóng', 'nhẻm'],
  'hồng': ['phấn', 'sen', 'tươi'],
  'tím': ['than', 'nhạt', 'đậm'],
  'cam': ['tươi', 'nhạt'],
  'nâu': ['đất', 'nhạt', 'đậm'],
  'xám': ['xịt', 'nhạt', 'đen'],
  
  // Gia đình
  'bố': ['mẹ', 'con', 'già', 'trẻ'],
  'mẹ': ['con', 'già', 'trẻ', 'đẻ'],
  'con': ['trai', 'gái', 'cái', 'út', 'cả'],
  'anh': ['em', 'trai', 'cả', 'hai', 'rể'],
  'chị': ['em', 'gái', 'cả', 'hai', 'dâu'],
  'em': ['trai', 'gái', 'út', 'bé'],
  'ông': ['bà', 'nội', 'ngoại', 'già'],
  'bà': ['nội', 'ngoại', 'già', 'con'],
  
  // Số đếm mở rộng
  'một': ['hai', 'mình', 'lần', 'chút'],
  'hai': ['ba', 'người', 'lần', 'mươi'],
  'ba': ['bốn', 'người', 'lần', 'mươi'],
  'bốn': ['năm', 'người', 'mươi'],
  'năm': ['sáu', 'người', 'mươi', 'tháng'],
  'sáu': ['bảy', 'mươi'],
  'bảy': ['tám', 'mươi'],
  'tám': ['chín', 'mươi'],
  'chín': ['mười', 'mươi'],
  'mười': ['một', 'lăm', 'mốt'],
  
  // Trái cây
  'táo': ['đỏ', 'xanh', 'ngọt', 'chua'],
  'cam': ['ngọt', 'chua', 'vàng', 'tươi'],
  'chuối': ['tiêu', 'già', 'xanh', 'chín'],
  'xoài': ['chín', 'xanh', 'chua', 'ngọt'],
  'dưa': ['hấu', 'lưới', 'gang', 'chuột'],
  'ổi': ['nước', 'ta', 'ngọt'],
  
  // Đồ uống
  'trà': ['xanh', 'đá', 'nóng', 'sữa', 'đào'],
  'cà phê': ['đen', 'sữa', 'nóng', 'đá'],
  'sữa': ['tươi', 'chua', 'đặc', 'bột', 'nóng'],
  'nước': ['lọc', 'suối', 'ngọt', 'mắm', 'tương', 'chanh'],
  'bia': ['tươi', 'chai', 'lon', 'hơi'],
  'rượu': ['vang', 'nếp', 'mạnh', 'nhẹ'],
  
  // Thời tiết chi tiết
  'bão': ['lớn', 'to', 'số'],
  'sấm': ['chớp', 'sét', 'động'],
  'chớp': ['sáng', 'nhoáng'],
  'sét': ['đánh', 'đập'],
  'mây': ['trắng', 'đen', 'xám', 'mù'],
  'sương': ['mù', 'sớm', 'giá'],
  'tuyết': ['rơi', 'trắng', 'lạnh'],
  'băng': ['giá', 'tuyết'],
  
  // Cảm xúc
  'vui': ['vẻ', 'mừng', 'sướng', 'tươi'],
  'buồn': ['bã', 'rầu', 'thiu'],
  'giận': ['dữ', 'hờn', 'lắm'],
  'sợ': ['hãi', 'run', 'lắm'],
  'lo': ['lắng', 'âu', 'sợ'],
  'nhớ': ['thương', 'nhung', 'mong'],
  'mong': ['chờ', 'đợi', 'ước'],
  'chờ': ['đợi', 'mong', 'lâu'],
  'đợi': ['chờ', 'lâu', 'mãi'],
  
  // Hoạt động hàng ngày
  'thức': ['dậy', 'khuya', 'giấc'],
  'rửa': ['mặt', 'tay', 'chén', 'bát', 'xe'],
  'mặt': ['mũi', 'trời', 'đất', 'nước'],
  'đánh': ['răng', 'bóng', 'nhau', 'trống'],
  'răng': ['nanh', 'hàm', 'sữa'],
  'tắm': ['rửa', 'nóng', 'lạnh', 'gội'],
  'gội': ['đầu', 'sạch'],
  'đầu': ['óc', 'tóc', 'tiên'],
  'chải': ['tóc', 'đầu', 'lông'],
  'tóc': ['dài', 'ngắn', 'đen', 'bạc'],
  'mặc': ['áo', 'quần', 'đồ', 'đẹp'],
  'đồ': ['ăn', 'uống', 'chơi', 'dùng', 'cũ'],
  'cởi': ['áo', 'quần', 'giày', 'ra'],
  'thay': ['đổi', 'quần áo', 'mới'],
  'đổi': ['mới', 'khác', 'thay'],
  
  // Nhà cửa
  'cửa': ['sổ', 'chính', 'sau', 'trước'],
  'sổ': ['tay', 'sách', 'cửa'],
  'tường': ['nhà', 'cao', 'thấp', 'dày'],
  'mái': ['nhà', 'tôn', 'ngói', 'tranh'],
  'nền': ['nhà', 'gạch', 'xi măng'],
  'phòng': ['ngủ', 'khách', 'bếp', 'tắm', 'học'],
  'bếp': ['ga', 'điện', 'lửa', 'nấu'],
  'nấu': ['ăn', 'cơm', 'canh', 'nướng'],
  'bàn': ['ăn', 'học', 'làm việc', 'tròn', 'vuông'],
  'ghế': ['ngồi', 'sofa', 'gỗ', 'nhựa'],
  'giường': ['ngủ', 'gỗ', 'sắt', 'đơn', 'đôi'],
  'tủ': ['quần áo', 'lạnh', 'sách', 'bếp'],
  'đèn': ['điện', 'dầu', 'pin', 'sáng', 'tắt'],
  'quạt': ['trần', 'máy', 'điện', 'mát'],
  
  // Động vật mở rộng
  'chó': ['mèo', 'con', 'sói', 'nhà'],
  'mèo': ['con', 'rừng', 'nhà', 'hoang'],
  'ngựa': ['chạy', 'phi', 'vằn', 'đua'],
  'trâu': ['bò', 'cày', 'nước'],
  'lợn': ['rừng', 'nhà', 'con'],
  'dê': ['cừu', 'núi', 'con'],
  'cừu': ['non', 'lông'],
  'voi': ['to', 'lớn', 'con', 'rừng'],
  'hổ': ['dữ', 'con', 'rừng'],
  'sư tử': ['dữ', 'con', 'rừng'],
  'khỉ': ['con', 'rừng', 'nhà'],
  'chim': ['bay', 'hót', 'cánh', 'non'],
  'cánh': ['chim', 'bướm', 'cửa'],
  'bướm': ['bay', 'đẹp', 'hoa'],
  'ong': ['mật', 'bay', 'đốt'],
  'kiến': ['đen', 'đỏ', 'bò'],
  
  // Công cụ & dụng cụ
  'dao': ['kéo', 'cắt', 'sắc', 'cùn'],
  'kéo': ['cắt', 'sắc', 'cùn'],
  'búa': ['đóng', 'đinh', 'tạ'],
  'đinh': ['sắt', 'đóng', 'ghim'],
  'cưa': ['gỗ', 'cây', 'sắt'],
  'búa': ['tạ', 'đóng', 'đinh'],
  'thước': ['kẻ', 'đo', 'dài'],
  'bút': ['chì', 'mực', 'bi', 'viết'],
  'vở': ['viết', 'học', 'tập', 'mới'],
  'sách': ['vở', 'giáo khoa', 'truyện', 'mới', 'cũ'],
  
  // Thể thao bổ sung
  'tennis': ['bàn', 'cầu lông'],
  'cầu': ['lông', 'mây'],
  'vợt': ['cầu lông', 'tennis'],
  'sân': ['bóng', 'tennis', 'cầu lông', 'bay', 'vườn'],
  'trận': ['đấu', 'bóng', 'chiến'],
  'thi': ['đấu', 'cử', 'chạy'],
  'đua': ['xe', 'ngựa', 'thuyền'],
  'leo': ['núi', 'trèo', 'cao'],
  'trèo': ['cây', 'tường', 'cao'],
  
  // Y tế
  'thuốc': ['men', 'uống', 'bôi', 'tiêm'],
  'bệnh': ['viện', 'tật', 'nhân', 'nặng', 'nhẹ'],
  'đau': ['đầu', 'bụng', 'răng', 'lưng'],
  'khỏe': ['mạnh', 'khoắn', 'lại'],
  'ốm': ['đau', 'yếu', 'nặng'],
  'chữa': ['bệnh', 'trị', 'khỏi'],
  'khám': ['bệnh', 'sức khỏe'],
  'tiêm': ['thuốc', 'kim'],
  
  // Giao thông
  'đường': ['phố', 'sá', 'cao tốc', 'ray', 'bộ'],
  'phố': ['đường', 'cổ', 'đi bộ'],
  'ngã': ['tư', 'ba', 'rẽ'],
  'rẽ': ['trái', 'phải', 'ngoặt'],
  'trái': ['phải', 'tim', 'cây'],
  'phải': ['trái', 'không', 'lẽ'],
  'thẳng': ['đường', 'lưng', 'tính'],
  'cong': ['queo', 'vòng'],
  'vòng': ['tròn', 'quanh', 'xoay'],
  
  // Học vấn
  'thi': ['cử', 'đậu', 'rớt', 'lại'],
  'đậu': ['rớt', 'đỗ', 'phộng'],
  'rớt': ['trượt', 'thi', 'lại'],
  'điểm': ['số', 'cao', 'thấp', 'tốt'],
  'số': ['học', 'điểm', 'lượng'],
  'giỏi': ['kém', 'lắm', 'nhất'],
  'kém': ['giỏi', 'hơn', 'lắm'],
  'chăm': ['chỉ', 'học', 'làm'],
  'lười': ['biếng', 'nhác', 'học']
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
