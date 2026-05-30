# Hướng dẫn đưa game lên mạng chơi online

## Phương án 1: Render.com (Miễn phí, Dễ nhất) ⭐ KHUYÊN DÙNG

### Bước 1: Chuẩn bị code
```bash
# Tạo file .gitignore
echo node_modules/ > .gitignore
echo .env >> .gitignore

# Khởi tạo git (nếu chưa có)
git init
git add .
git commit -m "Initial commit"
```

### Bước 2: Đẩy code lên GitHub
1. Vào https://github.com và tạo repository mới (ví dụ: `word-guessing-game`)
2. Chạy lệnh:
```bash
git remote add origin https://github.com/USERNAME/word-guessing-game.git
git branch -M main
git push -u origin main
```

### Bước 3: Deploy trên Render.com
1. Vào https://render.com và đăng ký tài khoản (dùng GitHub)
2. Click **"New +"** → **"Web Service"**
3. Kết nối với GitHub repository vừa tạo
4. Cấu hình:
   - **Name**: `word-guessing-game` (hoặc tên bạn muốn)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Chọn **Free**
5. Click **"Create Web Service"**
6. Đợi 3-5 phút để deploy xong
7. Render sẽ cho bạn URL dạng: `https://word-guessing-game.onrender.com`

**Lưu ý:** Free plan của Render sẽ sleep sau 15 phút không dùng, lần đầu truy cập sẽ mất ~30s để wake up.

---

## Phương án 2: Railway.app (Miễn phí, Nhanh)

### Bước 1: Chuẩn bị code (giống Phương án 1)

### Bước 2: Deploy trên Railway
1. Vào https://railway.app và đăng ký (dùng GitHub)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Chọn repository của bạn
4. Railway tự động detect và deploy
5. Vào **Settings** → **Generate Domain** để có URL public
6. URL sẽ dạng: `https://word-guessing-game.up.railway.app`

**Ưu điểm:** Không sleep, luôn online, nhanh hơn Render.

**Hạn chế:** Free plan có giới hạn 500 giờ/tháng (đủ dùng cho project nhỏ).

---

## Phương án 3: Glitch.com (Dễ nhất, Không cần Git)

### Bước 1: Tạo project trên Glitch
1. Vào https://glitch.com và đăng ký
2. Click **"New Project"** → **"glitch-hello-node"**
3. Xóa code mẫu

### Bước 2: Upload code
1. Click **"Tools"** → **"Import from GitHub"**
2. Hoặc copy-paste từng file:
   - `package.json`
   - `server/index.js`
   - `server/vietnameseWords.js`
   - `client/index.html`
   - `client/style.css`
   - `client/app.js`

### Bước 3: Chỉnh sửa package.json
Đảm bảo có:
```json
{
  "scripts": {
    "start": "node server/index.js"
  }
}
```

4. Glitch tự động deploy, URL dạng: `https://your-project-name.glitch.me`

**Lưu ý:** Glitch cũng sleep sau 5 phút không dùng.

---

## Phương án 4: Vercel (Cho frontend) + Backend riêng

Nếu muốn tách frontend và backend:

### Frontend (Vercel)
1. Tạo folder `public` và chuyển `client/*` vào đó
2. Deploy lên Vercel: https://vercel.com

### Backend (Render/Railway)
1. Deploy backend như hướng dẫn trên
2. Sửa `client/app.js`:
```javascript
const socket = io('https://your-backend-url.onrender.com');
```

---

## Phương án 5: VPS riêng (Nâng cao)

Nếu có VPS (DigitalOcean, AWS, Google Cloud...):

```bash
# SSH vào VPS
ssh user@your-server-ip

# Cài Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone code
git clone https://github.com/USERNAME/word-guessing-game.git
cd word-guessing-game

# Cài dependencies
npm install

# Chạy với PM2 (để luôn online)
sudo npm install -g pm2
pm2 start server/index.js --name word-game
pm2 startup
pm2 save

# Cấu hình Nginx (reverse proxy)
sudo apt install nginx
sudo nano /etc/nginx/sites-available/word-game
```

Nội dung file nginx:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/word-game /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## So sánh các phương án

| Phương án | Độ khó | Miễn phí | Tốc độ | Sleep? | Khuyên dùng |
|-----------|--------|----------|--------|--------|-------------|
| Render.com | ⭐ | ✅ | Trung bình | Có (15 phút) | ✅ Tốt nhất cho người mới |
| Railway.app | ⭐⭐ | ✅ (giới hạn) | Nhanh | Không | ✅ Tốt cho production nhỏ |
| Glitch.com | ⭐ | ✅ | Chậm | Có (5 phút) | Tạm dùng test |
| Vercel + Backend | ⭐⭐⭐ | ✅ | Nhanh | Không | Cho dự án lớn |
| VPS | ⭐⭐⭐⭐⭐ | ❌ | Rất nhanh | Không | Chuyên nghiệp |

---

## Checklist sau khi deploy

✅ Kiểm tra game hoạt động trên URL mới
✅ Test tạo phòng, vào phòng, chơi game
✅ Test trên mobile
✅ Chia sẻ link cho bạn bè thử
✅ Theo dõi logs nếu có lỗi

---

## Lưu ý quan trọng

1. **Port**: Các platform sẽ tự động set biến môi trường `PORT`, đảm bảo code của bạn dùng:
```javascript
const PORT = process.env.PORT || 3000;
```
(Code hiện tại đã đúng rồi)

2. **CORS**: Nếu tách frontend/backend, cần config CORS trong `server/index.js`

3. **Environment Variables**: Nếu có API key, đặt trong Settings của platform, không commit vào Git

4. **Custom Domain**: Sau khi deploy, có thể mua domain và trỏ về URL của platform

---

## Cần hỗ trợ?

Nếu gặp vấn đề khi deploy, hãy:
1. Check logs trên platform
2. Đảm bảo `package.json` có đầy đủ dependencies
3. Test local trước khi deploy: `npm start`
4. Đọc docs của platform: Render, Railway, Glitch đều có docs rất chi tiết

Chúc bạn deploy thành công! 🚀
