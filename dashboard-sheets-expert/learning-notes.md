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
  - **Giải pháp UX/UI tinh tế (Optimistic UI & Glassmorphism Modal)**: Sử dụng Modal chỉnh sửa Glassmorphism hiển thị nổi bật dạng che phủ mờ (overlay). Các trường định danh (Họ tên, Mã nhân viên) hiển thị dạng chỉ đọc nét đứt để đối soát thông tin. Khi submit Sửa/Xóa, hệ thống áp dụng kỹ thuật cập nhật lạc quan (Optimistic UI): thay đổi lập tức dữ liệu trong bộ đệm local và `localStorage` để giao diện, biểu đồ phản hồi ngay không độ trễ, sau đó tiến hành gọi API ngầm đồng bộ và tự động làm mới (refresh) dữ liệu thật từ Google Sheets sau 2 giây để bảo đảm tính chuẩn xác tuyệt đối.
