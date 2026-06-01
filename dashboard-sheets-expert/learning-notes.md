# Quy Trình Nghiệp Vụ & Bài Học Kinh Nghiệm: VNPT Reward Dashboard

Tài liệu này lưu trữ quy trình và các lưu ý kỹ thuật từ dự án **VNPT - Reward Dashboard** để phục vụ việc hướng dẫn và triển khai tốt hơn trong các lần tiếp theo.

---

## 📋 1. Thông Tin Dự Án & Người Dùng

- **Chủ đầu tư / Đơn vị**: VNPT.
- **Tên dự án**: VNPT Reward Dashboard (Bảng điều khiển Khen thưởng & Điểm Khuyến khích).
- **GitHub Username**: `ttkdvp-prog`
- **GitHub Repository**: `https://github.com/ttkdvp-prog/vnpt-reward-dashboard.git`
- **Môi trường cục bộ**: Máy tính chạy hệ điều hành Windows, chưa cài đặt sẵn môi trường Node.js/NPM.
- **Giải pháp lựa chọn**: Single Page Application (SPA) viết bằng HTML5, Vanilla CSS3 (Glassmorphism) và JavaScript ES6+ thuần để đảm bảo chạy ngay lập tức không cần build, dễ dàng đẩy lên GitHub và deploy miễn phí lên Vercel.

---

## 🛠️ 2. Quy Trình & Luồng Nghiệp Vụ Cốt Lõi

1. **Tìm kiếm & Tự động tra cứu hồ sơ (Autocomplete)**:
   - Khi gõ Tên hoặc Mã nhân viên, hệ thống sẽ tự động tra cứu từ danh sách nhân viên lịch sử hiện có.
   - Khi chọn một gợi ý, hệ thống sẽ điền đầy đủ các thông tin: **Mã nhân viên**, **Tên nhân viên** và **Tổ** (Hệ thống tự khóa trường Tổ lại để tránh việc nhập sai cấu trúc tổ).
2. **Tính toán Tiền thưởng Tự động**:
   - Tỉ lệ quy đổi: $1\text{ điểm khuyến khích} = 5.000\text{ VNĐ}$.
   - Khi nhập Điểm khuyến khích, trường hiển thị số tiền sẽ tính toán theo thời gian thực và định dạng tiền tệ việt nam (VND, ví dụ: `500.000 ₫`) kèm hiệu ứng nhấp nháy thu hút sự chú ý.
3. **Thống kê Đa chiều & Biểu đồ Trực quan**:
   - Sử dụng **Chart.js** vẽ biểu đồ Phân bổ điểm theo từng Tổ (Bar Chart) và Top 5 nhân viên xuất sắc nhất tháng (Doughnut Chart).
   - Tổng hợp tự động Tổng điểm, Tổng tiền và số Nhân viên tham gia khen thưởng.
   - Hai bảng thống kê chi tiết tự động gom nhóm (Group By) và tính tổng cho từng **Tổ** và từng **Nhân viên**.
4. **Kết nối API trực tiếp Google Sheets**:
   - Kết nối thông qua **Google Apps Script** bằng cơ chế API REST (doGet/doPost).
   - Tích hợp sẵn link API chính thức của người dùng: `https://script.google.com/macros/s/AKfycbwNXm3dPsURS3F-5dX4CW-R0mTaTCBKf9yHhj0stX3Qq5CvWncwUQi56KcKmSHSxKsDbw/exec`.

---

## ⚠️ 3. Các Điểm Cần Lưu Ý Cho Lần Sau (Ghi chú Đặc biệt)

- **Ngôn ngữ Giao diện**: Giao diện người dùng **bắt buộc phải sử dụng 100% Tiếng Việt**. Không sử dụng các từ ngữ Tiếng Anh kỹ thuật làm nhãn/tiêu đề (như Dashboard, Live, Offline, Web App URL) mà phải chuyển ngữ thân thiện nhất có thể (ví dụ: *Bảng điều khiển*, *Kết nối trực tiếp*, *Chế độ ngoại tuyến*, *Đường dẫn API*).
- **Tính di động của dự án**: Vì người dùng có thể không rành về kỹ thuật cài đặt phần mềm (Node.js, Git nâng cao), các file cần được viết ở mức tối giản, dễ copy và chạy trực tiếp ngay khi nhấp đúp file.
- **Bảo toàn dữ liệu cũ**: Bảng tính Google Sheets của người dùng đã có định dạng cột sẵn: `STT`, `Tháng`, `Mã nhân viên`, `Tên Nhân viên`, `Tổ`, `Điểm khuyến khích`, `Tiền thưởng`, `Lý do`. Cần đảm bảo Apps Script tương thích 100% với tên cột này và tự động thêm cột `Thời điểm` ở cuối mà không làm hỏng cấu trúc cũ.
- **Tự động gợi ý cho trường bắt buộc (Smart Autocomplete)**: Với các trường dữ liệu mang tính định danh và bắt buộc phải nhập (như Mã nhân viên, Tên nhân viên), hệ thống **bắt buộc phải có cơ chế tự động gợi ý (Autocomplete)**. Điều này giúp tối ưu hóa đáng kể trải nghiệm nhập liệu, giảm thiểu khả năng người dùng nhập sai chính tả hoặc sai lệch thông tin đồng bộ.
