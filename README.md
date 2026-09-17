# 💌 Website Mini Tương Tác: Rủ Người Yêu Đi Chơi (From Duy ❤️)

Website mini tương tác ngọt ngào, hài hước và tinh tế để rủ người yêu đi chơi, được tối ưu hoàn hảo cho điện thoại di động (mobile-first), hiệu ứng mượt mà và sẵn sàng deploy lên Vercel.

---

## 🌟 Tính Năng Nổi Bật

1. **Background Người Yêu Tự Động:**
   * Tự động nhận diện ảnh `src/assets/girlfriend.jpg`.
   * Tỉ lệ hiển thị hoàn hảo (`object-cover`), căn giữa, chống vỡ/méo hình.
   * Lớp phủ gradient lãng mạn (rose/dark overlay) giúp chữ luôn dễ đọc trên mọi bức ảnh.
   * Sẵn sàng cơ chế Fallback gradient nếu ảnh chưa có hoặc load chậm.

2. **Nút "Không Đi 😝" Troll Siêu Mượt:**
   * Không thể bấm trúng!
   * **Desktop:** Rê chuột đến gần là tự động né sang vị trí khác.
   * **Mobile:** Chạm tay vào là lập tức bay đi vị trí an toàn khác.
   * **Thông minh:** Không bao giờ bay ra ngoài màn hình, không che nút "Dạ đi", không che tiêu đề chính.
   * 13+ câu thoại dỗi hờn hài hước thay đổi liên tục.
   * Cột mốc đặc biệt: 5, 7, 10, 12 (báo lỗi server troll) và 15 lần (đầu hàng nhưng vẫn chạy tiếp!).
   * Đếm số lần từ chối cute.

3. **Nút "Dạ Đi ❤️":**
   * Lớn dần theo mỗi lần người yêu định ấn nút từ chối.
   * Pháo hoa và hiệu ứng ăn mừng ngay khi đồng ý.

4. **Chọn Ngày Hẹn (Custom Mini Calendar):**
   * Mini calendar bo góc glassmorphism hiện đại, hỗ trợ tiếng Việt.
   * Tự động chặn chọn ngày trong quá khứ.
   * Đánh dấu ngày hôm nay và ngày đã chọn.

5. **Chọn Giờ Đón:**
   * Thẻ giờ trực quan (08:00, 10:00, 12:00, 14:00, 17:00, 19:00, 20:00) kèm icon sinh động.
   * Cho phép tùy chọn bất kỳ khung giờ lẻ nào.

6. **Màn Hình Chốt Kèo & Easter Egg:**
   * Vé hẹn hò xinh xắn tóm tắt ngày & giờ.
   * Câu nói ngọt ngào: *"Nhớ chuẩn bị xinh đẹp nhé. À mà... Không chuẩn bị thì vẫn xinh 😌❤️"*.
   * Easter egg bí mật: Trái tim phát sáng trong bóng tối với lời nhắn gửi *"From Duy ❤️"*.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### 1. Cài đặt thư viện:
```bash
npm install
```

### 2. Chạy môi trường phát triển (Development):
```bash
npm run dev
```
Trình duyệt sẽ tự động mở tại `http://localhost:3000` (hoặc hiển thị link mạng nội bộ để bạn quét thử trên điện thoại qua Wi-Fi chung!).

### 3. Build sản phẩm để deploy Vercel / Netlify:
```bash
npm run build
```
Thư mục xuất ra là `dist/`.

---

## 📸 Cách Thay Ảnh Người Yêu

Bạn chỉ cần đặt file ảnh người yêu của bạn vào:
```text
src/assets/girlfriend.jpg
```
*Lưu ý:* Đặt đúng tên `girlfriend.jpg`. Website sẽ tự động áp dụng ngay lập tức mà **không cần sửa một dòng code nào!**

---

## ✍️ Các File Cần Chỉnh Sửa Nếu Muốn Thay Đổi Nội Dung

| Nội dung muốn đổi | File cần mở |
| :--- | :--- |
| **Các câu nói troll & milestones** | `src/utils/messages.js` |
| **Các mốc giờ định sẵn** | `src/utils/messages.js` (biến `TIME_SLOTS`) |
| **Tên người gửi (From Duy ❤️)** | `src/components/EasterEggModal.jsx` |
| **Lời nhắn thiệp ở màn hình chốt kèo** | `src/components/SuccessStep.jsx` |
| **Tiêu đề & subtitle lời mời ban đầu** | `src/components/InviteStep.jsx` |

---

## 🌐 Hướng Dẫn Deploy Lên Vercel (Miễn Phí 100%)

1. Đẩy code lên GitHub repository của bạn.
2. Đăng nhập [Vercel](https://vercel.com) bằng tài khoản GitHub.
3. Chọn **Add New Project** → Chọn repository `troll_love`.
4. Giữ nguyên cài đặt mặc định (Framework Preset: **Vite**).
5. Bấm **Deploy**!
6. Gửi link Vercel đó cho người yêu qua Zalo/Messenger/Instagram! 🥰

