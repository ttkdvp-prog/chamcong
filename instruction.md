# HƯỚNG DẪN CHI TIẾT TRIỂN KHAI DASHBOARD KHEN THƯỞNG VNPT

Chào bạn! Dưới đây là hướng dẫn chi tiết từng bước để tích hợp Google Sheets với mã nguồn của Dashboard, đẩy mã nguồn lên GitHub, và triển khai trang web trực tiếp trên mạng Internet thông qua Vercel. Hãy làm theo lần lượt các bước nhé!

---

## BƯỚC 1: TÍCH HỢP GOOGLE SHEETS & GOOGLE APPS SCRIPT (BACKEND)

Ứng dụng của bạn sẽ đọc và ghi điểm thưởng trực tiếp vào file Google Sheets của bạn. Hãy thiết lập cổng API như sau:

1. Mở bảng tính Google Sheets của bạn.
2. Trên thanh công cụ, chọn **Tiện ích mở rộng (Extensions)** > **Apps Script**.
3. Một giao diện lập trình sẽ mở ra. Xóa sạch mọi mã nguồn mặc định có sẵn (nếu có).
4. Mở file [google-apps-script.js](file:///c:/Users/Admin/OneDrive - VNPT/AI/Webapp/google-apps-script.js) trong thư mục dự án này, copy toàn bộ nội dung của nó và dán vào Apps Script.
5. Nhấn biểu tượng **Lưu** (hình đĩa mềm) hoặc tổ hợp phím `Ctrl + S`.
6. Nhấn nút **Triển khai (Deploy)** ở góc trên bên phải > Chọn **Triển khai mới (New deployment)**.
7. Nhấp vào biểu tượng bánh răng ở cạnh mục "Chọn loại cấu hình" > Chọn **Ứng dụng web (Web app)**.
8. Điền các cấu hình như sau:
   - **Mô tả (Description)**: *API Khen thưởng VNPT*
   - **Thực thi dưới danh nghĩa (Execute as)**: Chọn **Tôi (Me - email của bạn)**.
   - **Ai có quyền truy cập (Who has access)**: Chọn **Mọi người (Anyone)**. (Đây là lựa chọn bắt buộc để Dashboard có thể gửi dữ liệu lên).
9. Nhấn nút **Triển khai (Deploy)**.
10. Hệ thống sẽ hiển thị bảng yêu cầu cấp quyền truy cập tài khoản Google. Hãy nhấn **Ủy quyền truy cập (Authorize access)** > Chọn tài khoản của bạn > Nhấn **Advanced (Nâng cao)** > Nhấn **Go to... (Không an toàn)** > Nhấn **Allow (Cho phép)**.
11. Sau khi hoàn tất triển khai, một hộp thoại chứa **URL ứng dụng web (Web app URL)** sẽ hiện ra. Nó có dạng: `https://script.google.com/macros/s/XXXXXX/exec`.
12. **Sao chép URL này**.

---

## BƯỚC 2: CẤU HÌNH DASHBOARD KẾT NỐI SHEETS

Tuyệt vời! Bạn đã tạo thành công Apps Script và gửi link cho tôi. **Tôi đã tích hợp trực tiếp link API của bạn vào mặc định mã nguồn của Dashboard!**

1. Bạn chỉ cần mở tệp `index.html` của dự án bằng trình duyệt (chỉ cần kích đúp chuột vào file).
2. Bạn sẽ thấy dấu chấm trạng thái ở góc trên bên phải tự động chuyển sang màu xanh lục và hiện chữ **Google Sheets Live** mà không cần phải dán thủ công nữa!
3. (Tùy chọn) Nếu sau này bạn có thay đổi URL Apps Script khác, bạn luôn có thể chuyển sang tab **Cài đặt hệ thống** ở sidebar bên trái, dán URL mới vào và nhấn nút **Lưu & Kết Nối Trực Tiếp**.

*Từ giờ, bất kỳ thông tin khen thưởng nào bạn nhập ở form "Khen thưởng mới" sẽ tự động đồng bộ lên Google Sheets của bạn sau 2 giây!*

---

## BƯỚC 3: ĐẨY MÃ NGUỒN LÊN GITHUB

Hãy lưu trữ mã nguồn của bạn lên GitHub để quản lý phiên bản và kết nối triển khai lên Vercel:

1. **Đăng ký tài khoản GitHub**: Nếu bạn chưa có, hãy truy cập [github.com](https://github.com/) để đăng ký miễn phí.
2. **Cài đặt Git**: Đảm bảo máy tính đã cài đặt Git.
3. Mở terminal (PowerShell trên Windows) tại thư mục `c:\Users\Admin\OneDrive - VNPT\AI\Webapp`.
4. Khởi tạo Git repository bằng các lệnh sau:
   ```powershell
   # Khởi tạo git
   git init

   # Thêm toàn bộ file trong thư mục vào hàng chờ commit
   git add .

   # Tạo bản ghi nhận đầu tiên
   git commit -m "Initial commit - VNPT Reward Dashboard"
   ```
5. Truy cập GitHub, nhấp vào nút **New** (hoặc dấu cộng ở góc trên bên phải) để tạo một Repository mới:
   - **Repository name**: `vnpt-reward-dashboard`
   - Thiết lập quyền riêng tư: Chọn **Public** hoặc **Private** tùy ý (để riêng tư thì chỉ mình bạn thấy).
   - Không chọn tích hợp thêm README, .gitignore hay license.
   - Nhấn **Create repository**.
6. GitHub sẽ hiển thị các dòng lệnh hướng dẫn đẩy code lên. Sao chép và chạy các dòng lệnh tương ứng trong terminal của bạn:
   ```powershell
   # Tạo nhánh chính là main
   git branch -M main

   # Liên kết thư mục local với repo trên GitHub (Đã điền tài khoản ttkdvp-prog của bạn)
   git remote add origin https://github.com/ttkdvp-prog/vnpt-reward-dashboard.git

   # Đẩy code lên GitHub
   git push -u origin main
   ```

---

## BƯỚC 4: TRIỂN KHAI TRANG WEB MIỄN PHÍ TRÊN VERCEL

Vercel là dịch vụ lưu trữ trang web tĩnh mạnh mẽ và miễn phí tốt nhất thế giới hiện nay. Dự án của chúng ta được thiết kế tối ưu để deploy trên Vercel chỉ với vài cú click chuột:

1. Truy cập [vercel.com](https://vercel.com/) và đăng ký tài khoản. Bạn nên chọn phương thức đăng nhập bằng **GitHub** để tự động liên kết tài khoản.
2. Tại trang tổng quan (Dashboard) của Vercel, nhấn nút **Add New...** ở góc trên bên phải > Chọn **Project**.
3. Danh sách các Repository của bạn trên GitHub sẽ xuất hiện. Tìm repo `vnpt-reward-dashboard` bạn vừa tạo ở Bước 3 và nhấn nút **Import**.
4. Cấu hình dự án (Configure Project):
   - **Framework Preset**: Vercel sẽ tự động nhận diện là `Other` (vì đây là HTML/CSS/JS thuần). Hãy giữ nguyên.
   - **Build and Output Settings**: Giữ nguyên mặc định.
   - **Environment Variables**: Không cần thêm gì cả.
5. Nhấn nút **Deploy** ở dưới cùng.
6. Đợi khoảng 15 - 30 giây để Vercel nạp file và phân phối. Khi hoàn tất, màn hình sẽ chúc mừng và cung cấp cho bạn một **URL truy cập công khai** (Ví dụ: `vnpt-reward-dashboard.vercel.app`).
7. Nhấp vào link đó để mở Dashboard trên Internet!

> [!TIP]
> **Tính năng CI/CD tự động**: Từ nay về sau, nếu bạn sửa đổi code trên máy tính và chạy lệnh đẩy lên GitHub (`git add .`, `git commit`, `git push`), Vercel sẽ tự động phát hiện thay đổi và triển khai bản cập nhật mới nhất lên trang web chỉ trong 10 giây! Bạn không cần làm lại bước deploy thủ công.
