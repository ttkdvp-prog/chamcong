# Sổ Tay Prompt Kỹ Thuật (Prompt Playbook): VNPT Reward Dashboard

Tài liệu này tổng hợp toàn bộ chuỗi **Prompts (Câu lệnh cấu trúc)** tinh giản và mạnh mẽ nhất được sử dụng trong suốt quá trình xây dựng, tối ưu hóa và nâng cấp hệ thống **VNPT Reward Dashboard** (đặc thù cho đơn vị **Trung tâm Hạ tầng VNPT Phú Thọ**). 

Bạn có thể lưu giữ sổ tay này để tái tạo lại dự án, chia sẻ cho đồng nghiệp hoặc áp dụng cho các dự án quản trị bảng tính Google Sheets tương tự.

---

## 🚀 Giai Đoạn 1: Khởi Tạo Dự Án & Xây Dựng Giao Diện Nền Tảng (Base Layout & API)

### 📌 Prompt 1: Tạo giao diện cấu trúc đơn trang (SPA) Glassmorphism
> **Nội dung Prompt:**
> "Hãy tạo một ứng dụng web đơn trang (Single Page Application - SPA) quản lý điểm thưởng và tiền thưởng nhân viên, viết hoàn toàn bằng HTML5, Vanilla CSS3 và JavaScript thuần (không dùng framework hay thư viện build).
> - **Phong cách thiết kế**: Mang phong cách Glassmorphism cao cấp, tông màu tối hiện đại (Deep Royal Navy `#0f172a` phối hợp ngọc lục bảo/xanh ngọc `#00c48c`). Giao diện phải sử dụng 100% tiếng Việt thân thiện.
> - **Cấu trúc Sidebar**: Có các tab: Bảng điều khiển (Tổng quan), Ghi nhận khen thưởng, Lịch sử & Thống kê.
> - **Bảng điều khiển**: Vẽ biểu đồ phân bổ điểm theo Tổ (Cột) và Top 5 nhân viên xuất sắc (Tròn/Doughnut) bằng Chart.js. Hiển thị các thẻ KPI: Tổng điểm, Tổng tiền thưởng quy đổi (1 điểm = 5.000đ).
> - **Cơ chế hoạt động**: Hỗ trợ 2 chế độ: Live (Đồng bộ với Google Sheets qua Apps Script Web App URL) và Offline/Demo (Lưu trữ đệm qua localStorage nếu mất kết nối hoặc chưa cấu hình API)."

### 📌 Prompt 2: Viết mã nguồn Google Apps Script Backend tương thích
> **Nội dung Prompt:**
> "Hãy viết mã nguồn Google Apps Script (tệp `.gs`) tối ưu để làm Backend kết nối cho Web App trên.
> - **Yêu cầu kỹ thuật**:
>   - Hỗ trợ `doGet(e)` để trả về toàn bộ dữ liệu lịch sử khen thưởng và tự động tra cứu, trích xuất dữ liệu danh bạ từ một trang tính phụ mang tên `danhba` (nếu có).
>   - Hỗ trợ `doPost(e)` để nhận dữ liệu từ Web App, tự động kiểm tra và khởi tạo các cột chuẩn (`STT`, `Tháng`, `Mã nhân viên`, `Tên Nhân viên`, `Tổ`, `Điểm khuyến khích`, `Tiền thưởng`, `Lý do`, `Thời điểm`), tự động tính toán số thứ tự `STT` kế tiếp và định dạng cột tiền thưởng tương thích Excel."

---

## 👥 Giai Đoạn 2: Dropdown Phân Tầng Chọn Nhân Viên Từ Danh Bạ (UX Safety)

### 📌 Prompt 3: Thay thế ô nhập liệu tự do bằng Dropdown phân tầng
> **Nội dung Prompt:**
> "Để tránh việc người dùng gõ sai chính tả Mã nhân viên, Tên nhân viên và Tổ, hãy nâng cấp form nhập liệu:
> 1. Trích xuất toàn bộ danh sách nhân viên từ danh bạ Sheets (`danhba`) hoặc dữ liệu mẫu tĩnh khi chạy offline.
> 2. Bổ sung một dropdown **'Lọc Theo Tổ / Bộ Phận'** để lọc nhanh các phòng ban.
> 3. Bổ sung một dropdown **'Chọn Nhân Viên'** liên kết trực tiếp. Khi chọn một Tổ, danh sách nhân viên của tổ đó sẽ hiển thị theo bảng chữ cái.
> 4. Khi chọn một nhân viên cụ thể, hệ thống sẽ tự động điền (Auto-fill) các thông tin: **Mã nhân viên**, **Tên nhân viên**, **Tổ / Bộ Phận** vào các ô nhập liệu dạng Chỉ đọc (Readonly với thiết kế nét đứt dashed) để người dùng đối soát trước khi gửi."

---

## 🛑 Giai Đoạn 3: Ghi Nhận Điểm Trừ & Khấu Trừ Tiền Thưởng (Negative Modeling)

### 📌 Prompt 4: Tạo Tab Nhập Điểm Trừ Khấu Hao Tương Thích Ngược
> **Nội dung Prompt:**
> "Hãy bổ sung thêm tab **'Điểm trừ mới'** trên Sidebar mà không làm đứt gãy hệ thống lưu trữ hiện có:
> - **Thiết kế**: Giao diện form nhập điểm trừ đồng bộ với form điểm thưởng (lọc theo tổ, chọn nhân viên tự động).
> - **Model Điểm**: Điểm trừ sẽ được xử lý lưu trữ dưới dạng **giá trị số âm (ví dụ: `-50`)** trong cột `Điểm khuyến khích` gốc của Google Sheets. Phương án này giúp giữ nguyên cấu trúc Apps Script mà không cần thêm bớt cột trên Sheets.
> - **Trải nghiệm người dùng (UX)**: 
>   - Cho phép người dùng nhập số điểm dương (ví dụ: gõ `50` điểm trừ) cho thuận tiện. Tầng controller Javascript sẽ tự động nhân với `-1` trước khi gửi lên Sheets.
>   - Khung xem trước tiền thưởng quy đổi của điểm trừ sẽ hiển thị giá trị âm (ví dụ: `-250.000 đ`) với thiết kế viền đỏ và hiệu ứng nhấp nháy đỏ (`pulse-danger`) để cảnh báo trực quan cực kỳ chuyên nghiệp."

---

## 📊 Giai Đoạn 4: Tách Biệt KPI Chỉ Số Trên Dashboard (Separated Metrics)

### 📌 Prompt 5: Tách biệt chỉ số Điểm Cộng / Điểm Trừ và đếm riêng nhân sự
> **Nội dung Prompt:**
> "Hãy tối ưu hóa các thẻ KPI trên Bảng điều khiển (Tổng quan) để tăng tính minh bạch trong quản lý nhân sự:
> 1. Tách thẻ 'Tổng Điểm' cũ thành hai thẻ riêng biệt:
>    - **TỔNG ĐIỂM CỘNG KHEN THƯỞNG**: Chỉ cộng các bản ghi có điểm số lớn hơn `0` (Màu xanh dương/lục, icon mũi tên lên `fa-circle-up`).
>    - **TỔNG ĐIỂM TRỪ GIẢM TRỪ**: Chỉ cộng các bản ghi có điểm số nhỏ hơn `0` (Màu đỏ danger, icon mũi tên xuống `fa-circle-down`).
> 2. Giữ nguyên thẻ **THỰC CHI TIỀN THƯỞNG** tự động khấu trừ ròng giữa điểm cộng và điểm trừ (nhân với 5.000đ).
> 3. Tách biệt chỉ số đếm số lượng nhân sự tham gia:
>    - **NHÂN SỰ ĐƯỢC KHEN THƯỞNG**: Đếm số lượng nhân viên duy nhất (dựa trên Mã nhân viên) nhận được điểm thưởng (> 0) trong tháng.
>    - **NHÂN SỰ BỊ GIẢM TRỪ**: Đếm số lượng nhân viên duy nhất bị trừ điểm (< 0) trong tháng.
>    - *Yêu cầu kỹ thuật*: Sử dụng cấu trúc dữ liệu `Set` trong Javascript để tự động loại bỏ trùng lặp mã nhân viên khi đếm."

---

## 🛠️ Giai Đoạn 5: Khắc Phục Sai Lệch Tên Nhân Viên & Nhóm Biểu Đồ (Data Mapping)

### 📌 Prompt 6: Nhóm điểm theo khóa chính Mã nhân viên & Ánh xạ tên chuẩn
> **Nội dung Prompt:**
> "Dữ liệu lưu trữ trong tệp Sheets (lịch sử) có thể bị viết tắt hoặc chứa lỗi chính tả cũ về tên nhân viên. Hãy viết lại cơ chế kết xuất bảng biểu và vẽ biểu đồ Top 5 nhân sự:
> 1. **Khóa chính**: Luôn sử dụng **Mã nhân viên** làm khóa chính (Primary Key) để gom nhóm dữ liệu thay vì gom nhóm theo tên trực tiếp. Điều này tránh việc một nhân viên có hai tên ghi nhận khác nhau bị chia làm hai người trên biểu đồ.
> 2. **Ánh xạ tên động (Dynamic Name Resolution)**: Khi hiển thị tên trên bảng lịch sử, bảng thống kê và nhãn biểu đồ, hãy tra cứu đối soát động từ danh bạ chính thức (`state.employees`). Nếu tìm thấy, hiển thị tên chuẩn trong danh bạ. Nếu không tìm thấy, sử dụng tên lưu trong bản ghi làm phương án dự phòng an toàn."

---

## 🔄 Giai Đoạn 6: Tính Năng Sửa & Xóa Đồng Bộ Google Sheets (Live Operations)

### 📌 Prompt 7: Tích hợp thao tác Sửa/Xóa trực tiếp và gỡ lỗi đồng bộ
> **Nội dung Prompt:**
> "Hãy tích hợp thêm cột 'Thao tác' ở bảng lịch sử với hai nút bấm **Sửa** (bút viết) và **Xóa** (thùng rác) trên mỗi hàng:
> 1. **Nâng cấp Apps Script**: Cập nhật `doPost(e)` để nhận diện `payload.action` là `"edit"` hoặc `"delete"`. Logic Sửa/Xóa sẽ định vị hàng bằng cách tìm kiếm cột `STT` tương ứng trên bảng tính rồi cập nhật/xóa hàng đó. Nếu không có `action`, mặc định xử lý thêm mới (`add`) để tương thích ngược.
> 2. **Cơ chế Cập nhật Tức thì (Optimistic UI)**: Khi người dùng nhấn lưu chỉnh sửa trên hộp thoại Modal hoặc xác nhận Xóa:
>    - Cập nhật lập tức vào bộ đệm dữ liệu local (`state.records`) và gọi `updateUI()` để giao diện cập nhật ngay lập tức không độ trễ, đồng thời đóng Modal ngay lập tức.
>    - Thực hiện gửi yêu cầu API lên Google Sheets ở chế độ **chạy nền (Background Sync)** để người dùng không cảm thấy ứng dụng bị treo. Sau đó mới gọi `refreshData()` để đồng bộ lại dữ liệu thật.
> 3. **Ép kiểu Số an toàn**: Chuyển toàn bộ các phép so sánh số thứ tự STT thành ép kiểu số `Number(r["STT"]) === Number(stt)` để loại bỏ hoàn toàn lỗi lệch kiểu dữ liệu gây mất đồng bộ."

---

## 📱 Giai Đoạn 7: Tối Ưu Hóa Trải Nghiệm Di Động Toàn Diện (Mobile First UX)

### 📌 Prompt 8: Chuyển bảng thành danh sách thẻ và tối ưu bàn phím số
> **Nội dung Prompt:**
> "Hãy nâng cấp toàn diện giao diện Web App để xem và nhập liệu cực kỳ thuận tiện trên màn hình điện thoại di động:
> 1. **Bảng dữ liệu dạng thẻ (Card-based table)**: Trên màn hình di động hẹp (dưới `580px`), bảng lịch sử thô sơ (dễ bị tràn ngang) sẽ tự động biến đổi thành dạng danh sách thẻ Glassmorphism bo tròn sang trọng. Các cột được xếp dọc, hiển thị nhãn cột in đậm tương ứng bên trái nhờ thuộc tính `data-label` và CSS `content: attr(data-label)`.
> 2. **Tự động bật bàn phím số**: Thêm thuộc tính `inputmode="numeric" pattern="[0-9]*"` vào các ô nhập Kỳ thưởng/Kỳ giảm trừ dạng số (`62026`). Khi người dùng click vào, bàn phím số chuyên dụng trên điện thoại sẽ tự động bật lên ngay lập tức.
> 3. **KPI nén 2 cột**: Trên di động, lưới chỉ số KPI nén thành 2 cột song song để tiết kiệm không gian màn hình, riêng thẻ Thực chi tiền thưởng dài được kéo giãn full width.
> 4. **Touch Target**: Tự động tăng kích thước các nút bấm Sửa/Xóa lên `42px` trên di động để bấm chạm bằng ngón tay thoải mái, không lo bấm nhầm."
