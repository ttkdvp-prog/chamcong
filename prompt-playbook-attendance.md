# Sổ Tay Prompt Kỹ Thuật: Bảng Chấm Công Tháng (Theo Mẫu chamcong.xlsx)

Tài liệu này tổng hợp toàn bộ chuỗi **Prompts (Câu lệnh cấu trúc)** tối ưu nhất để xây dựng, hoàn thiện và nâng cấp hệ thống **Bảng Chấm Công Tháng Dạng Lưới (Grid SPA)** kết nối Google Sheets tương thích 100% với tệp Excel mẫu [chamcong.xlsx](file:///d:/OneDrive%20-%20VNPT/AI/1chamcong/chamcong.xlsx). Bạn có thể sử dụng các prompt này để yêu cầu AI chỉnh sửa hoặc tái tạo lại ứng dụng từ đầu.

---

## 🚀 Giai Đoạn 1: Thiết Kế Giao Diện Lưới Chấm Công Glassmorphism

### 📌 Prompt 1: Tạo cấu trúc giao diện đơn trang SPA bảng lưới chấm công theo mẫu Excel
> **Nội dung Prompt:**
> "Hãy tạo một ứng dụng web đơn trang (SPA) quản lý bảng chấm công tháng dạng lưới (Grid), viết hoàn toàn bằng HTML5, Vanilla CSS3 và JavaScript thuần (không dùng framework hay thư viện build).
> - **Phong cách thiết kế**: Mang phong cách Glassmorphism cao cấp, tông màu tối hiện đại (Deep Slate Navy `#0b0f19` kết hợp màu xanh lục Emerald `#10b981`, xanh dương Cyan `#06b6d4` và đỏ hồng `#f43f5e`). Giao diện sử dụng 100% tiếng Việt.
> - **Cấu trúc cột của lưới**: STT, Mã NV, Họ và tên, Tổ (Bộ phận), cột ngày từ 1 đến 31, và cột Tổng công ở cuối.
> - **Lọc & Tìm kiếm**: Có bộ lọc chọn Tháng/Năm, bộ lọc Tổ/Bộ phận trích xuất động, ô tìm kiếm Họ tên hoặc Mã NV, và bộ lọc checkbox 'Chỉ hiện nhân viên thiếu công'.
> - **Bộ soát lỗi**: Nút 'Soát ô trống' để highlight viền đỏ tất cả các ngày công chưa chấm ký hiệu và thống kê số ô còn thiếu lên banner."

---

## 🛠️ Giai Đoạn 2: Xây Dựng Backend Google Apps Script Đọc Dữ Liệu Lưới 35 Cột

### 📌 Prompt 2: Viết mã nguồn Google Apps Script quản lý dữ liệu dạng lưới 35 cột và Danh bạ
> **Nội dung Prompt:**
> "Hãy viết mã nguồn Google Apps Script (tệp `.gs`) để làm backend kết nối Google Sheets cho bảng chấm công lưới tương thích mẫu Excel:
> - **Yêu cầu các trang tính**:
>   - Trang `danhba`: Chứa danh bạ nhân sự. Dòng 1 là tiêu đề: `STT`, `Bộ phận`, `Mã nhân viên`, `Họ và tên`, `Ngày tháng năm sinh`, `Vị trí công việc`, `Email`, `Số ĐT`. Hàng 2 là hàng trống, dữ liệu thật bắt đầu từ hàng 3.
>   - Trang `chamcong`: Cột tiêu đề gồm: `STT`, `mã nhân vien`, `Họ tên`, `tổ`, các cột từ ngày `1` đến ngày `31`. (Bổ sung thêm cột `Tổng công` và `Thời điểm` ở cuối).
> - **Yêu cầu xử lý**:
>   - **`doGet(e)`**: 
>     - Đọc dữ liệu từ sheet `danhba` (bỏ qua hàng 2 trống), dùng cột `Bộ phận` làm Tổ chính thức của nhân viên.
>     - Đọc sheet chấm công tương ứng với tháng yêu cầu (ví dụ: tab tên `2026-07` hoặc tab mặc định `chamcong`). Nếu tháng yêu cầu chưa có tab nào, tự động sao chép danh sách nhân viên từ danh bạ sang tạo tab mới dạng lưới 31 ngày trống.
>   - **`doPost(e)`**: Nhận `payload` hành động:
>     - `save-cell`: Nhận Mã NV, Số ngày (1-31), Ký hiệu mới (X, X/2, V, Ro, trống...) và cập nhật đúng ô trên Google Sheets. Đồng thời tự động tính lại tổng công của dòng theo hệ số quy đổi (X = 1.0, X/2 = 0.5, V = 0.25, vắng không lương = 0.0) và ghi nhận vào cột Tổng công.
>     - `save-row`: Cập nhật toàn bộ mảng 31 ngày của nhân viên."

---

## 🔍 Giai Đoạn 3: Hệ Số Quy Đổi Ký Hiệu Chấm Công Tự Động

### 📌 Prompt 3: Cấu hình bảng hệ số quy đổi ngày công tự động
> **Nội dung Prompt:**
> "Hãy cấu hình logic tính toán cột 'Tổng công' của mỗi nhân viên dựa vào bảng quy đổi ký hiệu chấm công:
> 1. Thiết lập một từ điển hệ số ngày công trong file Javascript và Apps Script:
>    - **Hệ số 1.0 (Đi làm đầy đủ/Hưởng lương)**: `X` (Đi làm), `C` (Cưới), `Le` (Lễ), `F` (Phép năm), `NB` (Nghỉ bù), `RN` (Ra ngoài việc công ty), `H` (Đi học), `CĐ` (Chế độ), `CT` (Công tác), `TS` (Thai sản), `R` (Việc riêng hưởng lương), `T` (Tang), `Đ` (Làm đêm), và các ca làm việc kết hợp (`X2`, `X3`, `X4`, `TC`, `X1/H1`, `H1/X1`, `H1/X2`, `X2/H1`, `X3/H1`, `H1/X3`, `H1/X4`, `X4/H1`).
>    - **Hệ số 0.5 (Nửa ngày công)**: `X/F` (Nghỉ phép chiều), `F/X` (Nghỉ phép sáng), `X/P` (Làm sáng chiều phép), `H1` (Học/Họp 4h).
>    - **Hệ số 0.25 (Nửa ngày làm việc ngắn)**: `V` (Đến nhận ca nhưng nghỉ đột xuất tính 2h).
>    - **Hệ số 0.0 (Không lương/Vắng mặt)**: `Ro` (Việc riêng không lương), `Rv` (Vô kỷ luật), `O` (Ốm), `CO` (Con ốm), hoặc để trống.
> 2. Cột 'Tổng công' tự động cộng dồn tất cả các ngày công trong tháng nhân với hệ số tương ứng, làm tròn 1 chữ số thập phân."

---

## ✏️ Giai Đoạn 4: Menu Chọn Nhanh Ký Hiệu (Cell Popover Picker)

### 📌 Prompt 4: Triển khai bảng popover chọn nhanh ký hiệu chấm công
> **Nội dung Prompt:**
> "Hãy xây dựng trải nghiệm chấm công nhanh trên giao diện:
> 1. Khi click đơn vào một ô ngày công, hiển thị một bảng menu nhỏ lơ lửng (Cell Popover) ngay dưới vị trí con trỏ chuột.
> 2. Menu popover gồm 4 nút bấm nhanh: `X` (Đi làm đầy đủ), `X/2` (Nửa ngày), `V` (Vắng tính 2h), và nút `Xóa` (thùng rác).
> 3. Khi bấm chọn một nút, cập nhật ngay ký hiệu tương ứng vào ô ngày công, đổi màu nền ô ngày công tương ứng (`cell-x` xanh lá, `cell-half` vàng, `cell-v` đỏ), đóng popover và tự động tính lại tổng ngày công của dòng nhân viên đó."
