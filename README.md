# Game Đoán Chuỗi Từ 1vs1

Web game realtime cho 2 người chơi đoán chuỗi từ của nhau.

## Luật chơi

1. Mỗi người nhập một chuỗi từ bí mật (số lượng từ do người tạo phòng chọn)
2. Từ đầu tiên luôn được hiển thị
3. Các từ còn lại được ẩn bằng dấu `_` (số lượng dấu `_` = số ký tự không dấu)
4. Người chơi phải đoán lần lượt từng từ trong chuỗi của đối thủ
5. **Đoán đúng**: Từ được mở ra, người chơi được đoán tiếp
6. **Đoán sai**: Không mở từ, chuyển lượt cho đối thủ
7. **Thắng**: Người đoán hết chuỗi của đối thủ trước

## Cài đặt

```bash
# Cài dependencies
npm install

# Chạy server
npm start
```

Server sẽ chạy tại: http://localhost:3000

## Cách chơi

1. Mở 2 trình duyệt (hoặc 2 tab)
2. Người 1: Nhập tên → Tạo phòng → Chọn số lượng từ → Nhập chuỗi bí mật → Sẵn sàng
3. Người 2: Nhập tên → Vào phòng → Nhập mã phòng → Nhập chuỗi bí mật → Sẵn sàng
4. Game bắt đầu khi cả 2 người sẵn sàng
5. Lần lượt đoán từ trong chuỗi của đối thủ

## Ví dụ

Chuỗi bí mật của đối thủ:
```
Ăn
cơm
chiên
trứng
vịt
```

Bạn sẽ thấy:
```
Ăn
___
_____
_____
___
```

Đoán đúng "cơm" → Hiển thị:
```
Ăn
cơm
_____
_____
___
```

Tiếp tục đoán cho đến khi mở hết chuỗi!

## Tính năng đặc biệt

### ✅ Validate từ tiếng Việt
- Kiểm tra từ có trong từ điển tiếng Việt (sử dụng API dict.minhqnd.com)
- Từ chối các từ không hợp lệ hoặc sai chính tả
- Fallback về danh sách từ phổ biến nếu API không khả dụng

### 💡 Gợi ý từ thông minh (Context-Aware Autocomplete)
- Gợi ý từ tiếng Việt dựa trên ngữ cảnh các từ trước đó
- Ví dụ: "ăn" → gợi ý "cơm", "phở", "bún"...
- Ví dụ: "cơm" → gợi ý "chiên", "rang", "trắng"...
- Hỗ trợ 40+ cặp từ ghép phổ biến
- Responsive và tối ưu cho mọi thiết bị (desktop, tablet, mobile)
- Hỗ trợ cả chuột và cảm ứng (touch)

## Stack công nghệ

- Frontend: HTML, CSS, JavaScript thuần
- Backend: Node.js + Express + Socket.IO
- API: dict.minhqnd.com (kiểm tra từ điển tiếng Việt)
- Lưu trữ: In-memory (không cần database)

## Deploy lên mạng

Xem hướng dẫn chi tiết trong file [DEPLOY.md](DEPLOY.md)

**Khuyên dùng:**
- **Render.com** - Miễn phí, dễ nhất cho người mới
- **Railway.app** - Nhanh, không sleep, tốt cho production

**Các bước cơ bản:**
1. Push code lên GitHub
2. Kết nối với Render/Railway
3. Deploy tự động
4. Nhận URL để chia sẻ

Chi tiết từng bước xem trong [DEPLOY.md](DEPLOY.md)
