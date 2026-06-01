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
- **Tách Biệt Đếm Nhân Sự Thưởng & Phạt (Separate Employee Count Metrics)**: Tương tự như điểm số, chỉ số đếm số lượng nhân sự tham gia cũng cần được tách biệt rõ ràng thành **Nhân sự được khen thưởng** (những người có ít nhất một bản ghi điểm > 0) và **Nhân sự bị giảm trừ** (những người có ít nhất một bản ghi điểm < 0). Các con số này được đếm độc lập bằng cách lọc các bản ghi tương ứng, ánh xạ sang mã nhân sự, rồi dùng cấu trúc `Set` để tự động loại bỏ các mã nhân sự trùng lặp trong kỳ đối soát, đảm bảo kết quả đếm chuẩn xác nhất.
- **Ánh Xạ Tên Nhân Viên Theo Khóa Chính (Dynamic Employee Name Resolution)**: Dữ liệu ghi nhận trong tệp Google Sheets (lịch sử) có thể có sai lệch, viết tắt hoặc chứa lỗi chính tả cũ về tên nhân viên. Để đảm bảo tính nhất quán tuyệt đối, hệ thống **bắt buộc phải dùng Mã nhân viên làm khóa chính** để thực hiện tra cứu động (Dynamic Lookup) tên chuẩn từ danh bạ chính thức (`state.employees`) trong tất cả các giao diện hiển thị:
  - **Bảng lịch sử**: Hiển thị tên đã được ánh xạ chuẩn từ danh bạ thay vì tên gốc lưu trong bảng tính.
  - **Bảng thống kê nhân sự**: Gom nhóm và kết xuất tên chuẩn.
  - **Biểu đồ Top 5 nhân sự xuất sắc**: Gom nhóm điểm theo `Mã nhân viên` trước (tránh trường hợp một nhân viên có hai tên ghi nhận khác nhau bị tách làm hai người trên biểu đồ), sau đó ánh xạ nhãn biểu đồ sang tên chuẩn của danh bạ. Nếu nhân sự không tồn tại trong danh bạ, hệ thống sẽ tự động sử dụng tên lưu trong bản ghi làm phương án dự phòng an toàn.
- **Bảo Mật API Google Sheets (Tab Removal & Defensive Routing)**: Google Sheets Apps Script Web App URL là một thông tin nhạy cảm. Để bảo mật tối đa và tăng tính chuyên nghiệp, tab **Cài đặt hệ thống** chứa ô nhập link API và hướng dẫn tích hợp đã được loại bỏ hoàn toàn khỏi giao diện người dùng. Việc bảo mật được củng cố bằng:
  - **Lập trình phòng thủ (Defensive Programming)**: Kiểm tra sự tồn tại của trường nhập liệu `#api-url-input` trong `loadLocalSettings()` bằng câu lệnh điều kiện trước khi thao tác gán giá trị, tránh hoàn toàn lỗi JavaScript gây dừng luồng chạy của Dashboard.
  - **Định tuyến an toàn (Safe Routing)**: Loại bỏ tùy chọn `'config'` khỏi danh sách các tab hợp lệ (`validTabs`) của bộ định tuyến bằng mã băm URL (`handleHashRouting()`). Nếu người dùng cố tình gõ `#config` lên thanh địa chỉ trình duyệt, hệ thống sẽ tự động chuyển hướng mượt mà về trang **Tổng quan** (`#dashboard`).
- **Hỗ Trợ Sửa & Xóa Bản Ghi Trực Tiếp (Dynamic Edit & Delete Operations)**: Để tối ưu hóa trải nghiệm quản lý dữ liệu, Dashboard được tích hợp nút bấm thao tác **Sửa** và **Xóa** trực tiếp trên bảng Lịch sử, hỗ trợ đầy đủ 2 chế độ (Offline & Live):
  - **Kiến trúc Backend tương thích ngược (Backward Compatibility)**: Google Apps Script được nâng cấp hàm `doPost()` để nhận diện tham số hành động `payload.action` (`edit`/`delete`). Nếu không có tham số này, mặc định hệ thống sẽ xử lý thêm mới (`add`), tránh hoàn toàn việc làm đứt gãy các kết nối hoặc làm hỏng dữ liệu thô cũ.
  - **Cơ chế Cập nhật Tức thì cải tiến (Optimistic UI & Instant Modal Close)**: Khi người dùng submit Sửa/Xóa, hệ thống lập tức cập nhật dữ liệu cục bộ (`state.records`) và gọi `updateUI()` để cập nhật trực quan trên bảng lịch sử + vẽ lại KPI & biểu đồ ngay lập tức dưới 0.1 giây, đồng thời đóng Modal ngay lập tức. Quá trình gửi request API lên Google Sheets được đưa vào chạy nền (Background Sync), tránh việc người dùng phải chờ đợi 2 giây rất khó chịu. Sau khi chạy nền, hệ thống mới gọi `refreshData()` để đồng bộ lại nguồn dữ liệu thật từ Sheets về bộ đệm.
  - **So sánh Số thứ tự Kiểu Số An toàn (Type-safe STT Matching)**: Tránh so sánh nghiêm ngặt `===` hoặc `!==` trực tiếp giữa `r["STT"]` và `stt` của form chỉnh sửa do sự không đồng nhất kiểu dữ liệu (chuỗi văn bản từ form và số từ Excel). Bắt buộc phải ép kiểu số an toàn: `Number(r["STT"]) === Number(stt)` trong tất cả các logic sửa, xóa, tìm kiếm bản ghi để loại bỏ triệt để lỗi không khớp STT.
  - **Gỡ lỗi đồng bộ và Hướng dẫn Triển khai lại Apps Script (Live Sync Debugging)**: Khi gặp hiện tượng người dùng chỉnh sửa/xóa thành công tạm thời nhưng 2 giây sau bị khôi phục lại dữ liệu cũ, nguyên nhân 100% là do Apps Script live trên Google Drive của họ vẫn chạy phiên bản cũ (chỉ nhận lệnh thêm mới, bỏ qua lệnh sửa/xóa và trả về lỗi thiếu thông tin mã/tên nhân sự). Cần viết kịch bản Python/Node kiểm thử live để đối soát và cung cấp hướng dẫn bằng tiếng Việt cực kỳ chi tiết từng bước cho người dùng thực hiện **Triển khai lại phiên bản mới (Manage deployments -> Edit -> Version: New version -> Deploy)** của Google Apps Script để lưu vĩnh viễn thay đổi.

---

## 🎨 4. Các Tùy Biến Giao Diện & Thương Hiệu Đặc Thù (Branding & UX Labels)

Để giao diện chuyên nghiệp, thân thiện và đồng bộ hoàn toàn với đặc thù nghiệp vụ của đơn vị **Trung tâm Hạ tầng VNPT Phú Thọ**, các nhãn chữ và thương hiệu hiển thị đã được tùy chỉnh chuẩn hóa:

1. **Chuẩn hóa nhãn chữ trong tab "Điểm trừ mới" (Deduct Tab Labels)**:
   - Sửa nhãn nhập kỳ thời gian: **"Tháng giảm trừ"** (thay vì *"Tháng Khấu Trừ"* trước đây).
   - Sửa nhãn nhập điểm số: **"Số điểm giảm trừ"** (thay vì *"Số Điểm Khấu Trừ Khuyến Khích"*).
   - Sửa nhãn tính quy đổi tiền thưởng: **"Thành tiền giảm trừ (1 điểm = -5.000đ)"** (thay vì *"Thành tiền khấu trừ"*).
   - Sửa nhãn lý do giảm trừ: **"Lý Do / Nội dung giảm trừ"** (thay vì *"Lý Do / Nội Dung Khấu Trừ Điểm"*).
2. **Sửa mô tả phụ toàn cục trên Thanh tiêu đề trên cùng (Global Subtitle)**:
   - Sửa thành: **"Theo dõi điểm khuyến khích & tính tiền thưởng nhân viên"** (thay vì câu chữ dài dòng *"Theo dõi điểm khuyến khích & tự động tính tiền thưởng nhân viên"*), hiển thị thống nhất trên toàn bộ các tab.
3. **Tùy biến Thương hiệu cao cấp hiển thị trên Sidebar & Mobile Header (Premium Vertical Branding)**:
   - Do có giới hạn độ rộng Sidebar (280px), nhãn chữ thương hiệu được viết theo dạng flex dọc sang trọng, ghi đè hiệu ứng trong suốt mặc định của CSS để hiển thị rõ ràng, sinh động:
     - Dòng 1: **Trung tâm Hạ tầng** (chữ nhỏ, màu nhạt `var(--text-muted)`, uppercase, tăng khoảng cách chữ).
     - Dòng 2: **VNPT Phú Thọ** (chữ đậm nét, màu `var(--text-main)` chính thức, kích thước 1.05rem).
     - Dòng 3: **ĐIỂM THƯỞNG** (chữ cực đậm màu xanh ngọc Emerald lấp lánh `var(--color-accent)`, uppercase, tăng khoảng cách chữ 1.5px để tạo điểm nhấn tài chính thương lượng).
   - Trên Mobile Header, thương hiệu được thu gọn tinh tế thành 2 dòng: **TT Hạ tầng - VNPT Phú Thọ** và **ĐIỂM THƯỞNG** (màu xanh ngọc).
