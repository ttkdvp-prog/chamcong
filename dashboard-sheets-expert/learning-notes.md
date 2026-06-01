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
- **Hộp chọn Dropdown phân tầng từ Danh bạ (Cascading Dropdown Select)**: Khi số lượng nhân sự lớn (150+), việc nhập văn bản tự do kết hợp gợi ý có thể vẫn gây khó khăn. Thay thế bằng hai dropdown phân tầng **Lọc Theo Tổ** và **Chọn Nhân Viên** mang lại độ an toàn tuyệt đối:
  - **Dropdown Tổ**: Trích xuất động các tổ duy nhất hiện có trong danh bạ để người dùng chọn tổ trước.
  - **Dropdown Nhân viên**: Lọc động danh sách nhân sự tương ứng của tổ được chọn, sắp xếp Alphabetical để chọn nhân sự ngay tức thì.
  - **Trường Chỉ đọc (Read-only Confirmation)**: Giữ các trường Mã NV, Tên NV, Tổ hiển thị dạng viền nét đứt (dashed readonly) để người dùng xác nhận thông tin chi tiết của nhân viên vừa chọn, đồng thời giữ nguyên cấu trúc truyền nhận Form Submit nguyên bản.
- **Xóa trạng thái lỗi thời (Stale State Cleanup)**: Khi bộ lọc phân tầng (ví dụ: Tổ) thay đổi, nhân viên đã chọn ở tổ cũ phải lập tức bị xóa khỏi UI và bộ đệm Form để tránh trường hợp người dùng cố tình gửi dữ liệu không đồng nhất (nhân viên tổ A nhưng lưu kèm tổ B).
- **Styling Premium cho Thẻ Select**: Dropdown Glassmorphism đòi hỏi ẩn nút chọn mặc định của trình duyệt (`appearance: none`), vẽ lại chevron chất lượng cao bằng SVG nhúng sẵn tự thay đổi màu theo Sáng/Tối, và gán màu nền tĩnh cho thẻ `option` để tránh bị trình duyệt ghi đè màu hệ thống gây lỗi hiển thị.
- **Thiết kế Mô hình Điểm Trừ Khấu hao (Deduction Modeling)**: Khi tích hợp thêm tab Ghi nhận Điểm Trừ (deduction tab), cách tinh giản và an toàn nhất là lưu trữ dưới dạng **giá trị âm (negative values)** trong cột `Điểm khuyến khích` gốc (ví dụ: `-50`). Phương án này mang lại 3 ưu điểm vượt trội:
  - **Tương thích 100%**: Không cần sửa bất kỳ dòng code Apps Script hay thêm bớt cột nào trên Google Sheets của người dùng.
  - **Tự động cộng trừ lũy kế**: Các hàm tính tổng (sum/reduce) và biểu đồ (Chart.js) trong Dashboard tự động tính toán trừ điểm và trừ tiền thưởng chính xác theo công thức toán học cơ bản (`100 + (-50) = 50`).
  - **Trải nghiệm người dùng (UX)**: Giao diện nhập liệu vẫn cho phép người dùng gõ số dương (ví dụ: gõ `50` điểm trừ) để thuận tiện, và hệ thống tự động đổi sang số âm (`-50`) ở tầng controller trước khi lưu. Khung xem trước số tiền quy đổi âm (ví dụ: `-250.000 đ`) sử dụng hiệu ứng `@keyframes pulse-danger` đỏ nhấp nháy tạo cảnh báo trực quan rất chuyên nghiệp.
- **Tái cấu trúc mã nguồn dạng Mô-đun (Modular Code Reuse)**: Khi phát sinh form/giao diện tương đồng (như form Khen thưởng và form Điểm trừ), bắt buộc phải tách các khối logic chung (như điền thông tin tự động, lắng nghe thay đổi dropdown lọc tổ) thành các hàm helper tham số hóa như `populateEmployeeSelectForId()` và `setupFormSelects()`. Việc này giảm thiểu 50% trùng lặp mã nguồn, tăng tốc bảo trì và tránh hoàn toàn lỗi logic không đồng đều giữa các tab.
- **Tách Biệt Chỉ Số Thưởng/Phạt trên Bảng điều khiển (Deduction Dashboard Metrics)**: Khi biểu diễn cả khen thưởng và kỷ luật, Bảng điều khiển (Dashboard) không nên chỉ hiển thị một chỉ số điểm ròng tổng hợp. Việc tách chỉ số làm hai phần rõ rệt: **Tổng Điểm Cộng** (chỉ tính các giá trị > 0) và **Tổng Điểm Trừ** (chỉ tính các giá trị < 0) mang lại tính minh bạch vượt trội trong quản trị nhân sự. Ngân sách tài chính chi trả vẫn tự động cấn trừ chính xác theo tổng điểm ròng thực tế, giúp người dùng nắm bắt trọn vẹn cả lượng điểm thưởng phát ra và lượng điểm phạt đã khấu trừ trong kỳ đối soát. Giao diện KPI của điểm trừ nên sử dụng tông màu đỏ và icon hướng xuống (`fa-circle-down`) để tạo sự tương phản trực quan hoàn hảo.
