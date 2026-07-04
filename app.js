/**
 * VNPT Phú Thọ - Bảng Chấm Công Tháng Grid Logic
 * Tương thích 100% với tệp Excel mẫu chamcong.xlsx của VNPT Phú Thọ
 * Hỗ trợ: Đồng bộ API Sheets, Lọc bộ phận & tìm kiếm tên, Hệ số công quy đổi tự động.
 */

// Danh bạ nhân viên thực tế trích xuất từ chamcong.xlsx
const DEFAULT_EMPLOYEES = [
  { id: "VNPT018256", name: "Nguyễn Công Hoan", department: "Ban Giám đốc" },
  { id: "VNPT017946", name: "Nguyễn Minh Cường", department: "Ban Giám đốc" },
  { id: "VNPT018467", name: "Nguyễn Trung Kiên", department: "Ban Giám đốc" },
  { id: "VNPT018451", name: "Nguyễn Tiến Thành", department: "Tổ Hạ tầng Hòa Bình" },
  { id: "VNPT018452", name: "Trần Công Lộc", department: "Tổ Hạ tầng Hòa Bình" },
  { id: "VNPT018469", name: "Nguyễn Anh Tuấn", department: "Tổ Hạ tầng Hòa Bình" },
  { id: "VNPT018477", name: "Nguyễn Văn Trường", department: "Tổ Hạ tầng Hòa Bình" },
  { id: "VNPT018478", name: "Lã Minh Tuấn", department: "Tổ Hạ tầng Hòa Bình" },
  { id: "VNPT018479", name: "Bùi Văn Tình", department: "Tổ Hạ tầng Hòa Bình" },
  { id: "VNPT018480", name: "Nguyễn Đức Mạnh", department: "Tổ Hạ tầng Hòa Bình" },
  { id: "VNPT018481", name: "Hoàng Trung Kiên", department: "Tổ Hạ tầng Hòa Bình" },
  { id: "VNPT018482", name: "Lê Đức Hạnh", department: "Tổ Hạ tầng Hòa Bình" },
  { id: "VNPT018489", name: "Hoàng Mai Nam", department: "Tổ Hạ tầng Hòa Bình" },
  { id: "VNPT018429", name: "Bùi Văn Bản", department: "Tổ Hạ tầng Lạc Sơn" },
  { id: "VNPT018473", name: "Kiều Toàn", department: "Tổ Hạ tầng Lạc Sơn" },
  { id: "VNPT018571", name: "Hà Tuấn Lương", department: "Tổ Hạ tầng Lạc Sơn" },
  { id: "VNPT018568", name: "Phạm Trung Thành", department: "Tổ Hạ tầng Lạc Sơn" },
  { id: "VNPT018410", name: "Bùi Đăng Thành", department: "Tổ Hạ tầng Lương Sơn" },
  { id: "VNPT018549", name: "Phùng Thế Hậu", department: "Tổ Hạ tầng Lương Sơn" },
  { id: "VNPT018552", name: "Vương Xuân Tiến", department: "Tổ Hạ tầng Lương Sơn" },
  { id: "VNPT018558", name: "Bạch Công Tường", department: "Tổ Hạ tầng Lương Sơn" },
  { id: "VNPT018566", name: "Phạm Anh Tuấn", department: "Tổ Hạ tầng Lương Sơn" },
  { id: "VNPT018551", name: "Phùng Thế Nam", department: "Tổ Hạ tầng Lương Sơn" },
  { id: "VNPT018553", name: "Vũ Mạnh Khương", department: "Tổ Hạ tầng Lương Sơn" },
  { id: "VNPT018113", name: "Dương Văn Dần", department: "Tổ Hạ tầng Phúc Yên" },
  { id: "VNPT018130", name: "Nguyễn Văn Đài", department: "Tổ Hạ tầng Phúc Yên" }
];

const SYMBOL_COEFFICIENTS = {
  // Đi làm thực tế -> 1.0 công
  "X": 1.0, 
  
  // Các ký hiệu nghỉ phép/nghỉ bù/ốm/việc riêng không tính vào ngày công thực tế -> 0.0 công
  "F": 0.0,
  "NB": 0.0,
  "RO": 0.0,
  "O": 0.0,
  "": 0.0,
  
  // Hỗ trợ tương thích ngược cho dữ liệu cũ (nếu có)
  "X2": 1.0, "X3": 1.0, "X4": 1.0, "TC": 1.0, "RN": 1.0,
  "X/F": 0.5, "F/X": 0.5, "X/P": 0.5, "H1": 0.5,
  "V": 0.25,
  
  "C": 0.0, "LE": 0.0, "H": 0.0, "CĐ": 0.0, "CT": 0.0, "TS": 0.0,
  "R": 0.0, "T": 0.0, "Đ": 0.0
};

// Hàm phụ trợ tính tổng công từ mảng 31 ngày dựa theo Ký hiệu
function calculateTotalWorkdayFromDays(daysArray) {
  let sum = 0.0;
  daysArray.forEach(val => {
    const symbol = String(val || "").trim().toUpperCase();
    if (!symbol) return;
    
    // Nếu có hệ số cố định trong từ điển
    if (SYMBOL_COEFFICIENTS[symbol] !== undefined) {
      sum += SYMBOL_COEFFICIENTS[symbol];
    } else if (symbol.includes("/")) {
      // Các ca kết hợp dạng X1/H1, H1/X1, X2/H1... tính 1.0 công
      sum += 1.0;
    }
  });
  return sum;
}

// Sinh ngẫu nhiên dữ liệu chấm công tháng mẫu dạng lưới cho 26 nhân sự thực tế
function generateDefaultGridRecords(targetMonth) {
  const records = [];
  const curMonth = targetMonth || state.selectedMonth || "2026-07";
  const parts = curMonth.split("-");
  const year = Number(parts[0]);
  const monthIdx = Number(parts[1]) - 1;
  
  DEFAULT_EMPLOYEES.forEach(emp => {
    const days = [];
    
    // Tạo ngẫu nhiên dữ liệu chấm công cho 31 ngày
    for (let d = 1; d <= 31; d++) {
      let val = "";
      
      const dayOfWeek = new Date(year, monthIdx, d).getDay(); // 0: Chủ Nhật, 6: Thứ 7
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        val = ""; 
      } else {
        const rand = Math.random();
        if (rand > 0.95) val = "Ro";
        else if (rand > 0.9) val = "F";
        else if (rand > 0.88) val = "NB";
        else if (rand > 0.85) val = "O";
        else val = "X";
      }
      days.push(val);
    }
    
    const total = calculateTotalWorkdayFromDays(days);
    
    records.push({
      "Tháng": curMonth,
      "Mã nhân viên": emp.id,
      "Tên nhân viên": emp.name,
      "Tổ": emp.department,
      "Ngày": days,
      "Tổng công": total,
      "Thời điểm": "2026-07-02 17:00:00"
    });
  });
  
  return records;
}

// Quản lý trạng thái ứng dụng (State)
const state = {
  apiUrl: "https://script.google.com/macros/s/AKfycbyiMDOaZVbjE4jVtZAvRP7Nb0lS3u7NsH4zD2F8xsYS5PYW_3JmJ7rzvtoy-4yMyBl6/exec",
  employees: [...DEFAULT_EMPLOYEES],
  records: [],
  confirmations: [],
  isLive: false,
  activeTab: "attendance",
  selectedMonth: "2026-07",
  selectedDept: "",
  searchQuery: "",
  reviewMode: false,
  incompleteOnly: false,
  
  // Trạng thái ô đang chỉnh sửa qua Popover
  activeCell: {
    empId: null,
    dayNum: null,
    cellElement: null
  }
};

// Cấu hình biểu đồ Chart.js
let punctualityChart = null;
let departmentWorkdaysChart = null;

// Khởi chạy ứng dụng
document.addEventListener("DOMContentLoaded", () => {
  localStorage.removeItem("vnpt_attendance_api");
  setupEventListeners();
  initMobileMenu();
  initTabRouting();
  initMonthFilters();
  
  // Tải dữ liệu ban đầu
  refreshData();
});

/* ==========================================================================
   1. ĐIỀU HƯỚNG TAB & RESPONSIVE DRAWER
   ========================================================================== */
function initTabRouting() {
  const navButtons = document.querySelectorAll(".nav-button");
  const tabPanes = document.querySelectorAll(".tab-pane");
  const pageTitleEl = document.getElementById("page-title");
  
  const tabTitles = {
    attendance: "Bảng Chấm Công Tháng",
    dashboard: "Thống Kê KPI Chuyên Cần",
    verification: "Xác Nhận & Thống Kê Phê Duyệt Số Liệu"
  };

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      
      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      tabPanes.forEach(pane => pane.classList.remove("active"));
      const targetPane = document.getElementById(`${tabId}-tab`);
      if (targetPane) targetPane.classList.add("active");
      
      pageTitleEl.textContent = tabTitles[tabId] || "Chấm Công";
      state.activeTab = tabId;
      
      // Xử lý các nghiệp vụ đặc thù của tab khi active
      if (tabId === "dashboard") {
        updateDashboardKPIs();
        updateCharts();
        renderDashboardSummaryTable();
      } else if (tabId === "attendance") {
        renderGrid();
      } else if (tabId === "verification") {
        renderVerificationTab();
      }
      
      hidePopover();
      
      // Đóng sidebar trên mobile
      const sidebar = document.getElementById("sidebar");
      if (sidebar.classList.contains("mobile-open")) {
        sidebar.classList.remove("mobile-open");
      }
    });
  });
}

function initMobileMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");
  
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebar.classList.toggle("mobile-open");
  });
  
  document.addEventListener("click", (e) => {
    if (sidebar.classList.contains("mobile-open") && !sidebar.contains(e.target) && e.target !== menuToggle) {
      sidebar.classList.remove("mobile-open");
    }
  });
}

/* ==========================================================================
   2. KHỞI TẠO BỘ LỌC THÁNG
   ========================================================================== */
function initMonthFilters() {
  const gridMonthFilter = document.getElementById("grid-month-filter");
  const dashMonthFilter = document.getElementById("dashboard-month-filter");
  const verifyMonthFilter = document.getElementById("verification-month-filter");
  
  const months = [];
  const now = new Date();
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    months.push(mStr);
  }
  
  state.selectedMonth = months[0];
  
  const filters = [gridMonthFilter, dashMonthFilter, verifyMonthFilter].filter(f => f !== null);
  filters.forEach(filter => {
    filter.innerHTML = "";
    months.forEach(m => {
      const option = document.createElement("option");
      option.value = m;
      const parts = m.split("-");
      option.textContent = `Tháng ${parts[1]}/${parts[0]}`;
      filter.appendChild(option);
    });
  });
  
  if (gridMonthFilter) gridMonthFilter.value = state.selectedMonth;
  if (dashMonthFilter) dashMonthFilter.value = state.selectedMonth;
  if (verifyMonthFilter) verifyMonthFilter.value = state.selectedMonth;
}

/* ==========================================================================
   3. TẢI DỮ LIỆU & ĐỒNG BỘ GOOGLE SHEETS
   ========================================================================== */

async function refreshData() {
  if (!state.apiUrl) {
    setConnectionStatus(false);
    // Sử dụng dữ liệu cache localStorage nếu có, nếu không sinh ngẫu nhiên
    const cachedRecords = localStorage.getItem("vnpt_cached_grid_records");
    const cachedEmployees = localStorage.getItem("vnpt_cached_employees");
    const cachedConfirmations = localStorage.getItem("vnpt_cached_confirmations");
    
    if (cachedRecords) {
      state.records = JSON.parse(cachedRecords).map(r => {
        r["Tổng công"] = calculateTotalWorkdayFromDays(r["Ngày"]);
        return r;
      });
    }
    
    if (cachedConfirmations) {
      state.confirmations = JSON.parse(cachedConfirmations);
    } else {
      state.confirmations = [];
    }
    
    // Đảm bảo luôn sinh dữ liệu mẫu cho tháng hiện tại nếu chưa tồn tại
    const hasRecordsForMonth = state.records.some(r => r["Tháng"] === state.selectedMonth);
    if (!hasRecordsForMonth) {
      const newRecords = generateDefaultGridRecords(state.selectedMonth);
      state.records = [...state.records.filter(r => r["Tháng"] !== state.selectedMonth), ...newRecords];
      saveLocalRecords();
    }
    
    if (cachedEmployees) {
      state.employees = JSON.parse(cachedEmployees);
    } else {
      state.employees = [...DEFAULT_EMPLOYEES];
      localStorage.setItem("vnpt_cached_employees", JSON.stringify(state.employees));
    }
    
    setupDeptFilters();
    triggerActiveTabRender();
    return;
  }
  
  showToast("Đang tải dữ liệu từ Google Sheets...", "info");
  
  try {
    const requestUrl = `${state.apiUrl}?month=${state.selectedMonth}`;
    const response = await fetch(requestUrl, { method: "GET", mode: "cors", redirect: "follow" });
    const result = await response.json();
    
    if (result && result.success) {
      state.records = (result.records || []).map(r => {
        r["Tổng công"] = calculateTotalWorkdayFromDays(r["Ngày"]);
        return r;
      });
      state.employees = result.employees || [];
      state.confirmations = result.confirmations || [];
      state.isLive = true;
      
      // Lưu trữ cache offline
      localStorage.setItem("vnpt_cached_grid_records", JSON.stringify(state.records));
      localStorage.setItem("vnpt_cached_employees", JSON.stringify(state.employees));
      localStorage.setItem("vnpt_cached_confirmations", JSON.stringify(state.confirmations));
      
      setConnectionStatus(true);
      showToast("Tải dữ liệu thành công!", "success");
    } else {
      throw new Error(result.message || "Lỗi phản hồi API.");
    }
  } catch (error) {
    console.error("Fetch error:", error);
    state.isLive = false;
    setConnectionStatus(false);
    showToast("Không thể kết nối Google Sheets. Đang dùng dữ liệu cục bộ.", "error");
    
    const cachedRecords = localStorage.getItem("vnpt_cached_grid_records");
    if (cachedRecords) {
      state.records = JSON.parse(cachedRecords);
    }
    const cachedConfirmations = localStorage.getItem("vnpt_cached_confirmations");
    if (cachedConfirmations) {
      state.confirmations = JSON.parse(cachedConfirmations);
    } else {
      state.confirmations = [];
    }
    
    // Đảm bảo luôn sinh dữ liệu mẫu cho tháng hiện tại nếu cache trống để tránh màn hình trống
    const hasRecordsForMonth = state.records.some(r => r["Tháng"] === state.selectedMonth);
    if (!hasRecordsForMonth) {
      const newRecords = generateDefaultGridRecords(state.selectedMonth);
      state.records = [...state.records.filter(r => r["Tháng"] !== state.selectedMonth), ...newRecords];
      saveLocalRecords();
    }
  }
  
  setupDeptFilters();
  triggerActiveTabRender();
}

function triggerActiveTabRender() {
  if (state.activeTab === "attendance") {
    renderGrid();
  } else if (state.activeTab === "dashboard") {
    updateDashboardKPIs();
    updateCharts();
    renderDashboardSummaryTable();
  } else if (state.activeTab === "verification") {
    renderVerificationTab();
  }
}

function setConnectionStatus(isLive) {
  const badge = document.getElementById("connection-status");
  const text = badge.querySelector(".status-text");
  
  if (isLive) {
    badge.className = "status-badge live";
    text.textContent = "Kết nối trực tiếp";
  } else {
    badge.className = "status-badge offline";
    text.textContent = "Chế độ ngoại tuyến";
  }
}

function setupDeptFilters() {
  const gridDeptFilter = document.getElementById("grid-dept-filter");
  const dashDeptFilter = document.getElementById("dashboard-dept-filter");
  const departments = [...new Set(state.employees.map(emp => emp.department))].sort();
  
  gridDeptFilter.innerHTML = '<option value="">Tất cả các tổ</option>';
  departments.forEach(d => {
    const option = document.createElement("option");
    option.value = d;
    option.textContent = d;
    gridDeptFilter.appendChild(option);
  });
  gridDeptFilter.value = state.selectedDept;
  
  if (dashDeptFilter) {
    dashDeptFilter.innerHTML = '<option value="">Tất cả các tổ</option>';
    departments.forEach(d => {
      const option = document.createElement("option");
      option.value = d;
      option.textContent = d;
      dashDeptFilter.appendChild(option);
    });
    dashDeptFilter.value = state.selectedDashboardDept || "";
  }
}

/* ==========================================================================
   4. DỰNG BẢNG LƯỚI CHẤM CÔNG THÁNG ĐỘNG
   ========================================================================== */
function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function renderGrid() {
  const table = document.getElementById("attendance-grid-table");
  const tbody = document.getElementById("attendance-grid-body");
  
  const parts = state.selectedMonth.split("-");
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const daysInMonth = getDaysInMonth(year, month);
  
  // 1. Dựng Tiêu đề bảng (Header)
  let headerHtml = `
    <tr>
      <th class="sticky-col-stt">STT</th>
      <th class="sticky-col-id">Mã NV</th>
      <th class="sticky-col-name">Họ và tên</th>
      <th class="sticky-col-dept">Tổ</th>
  `;
  for (let d = 1; d <= daysInMonth; d++) {
    headerHtml += `<th class="day-header">${d}</th>`;
  }
  headerHtml += `
      <th class="sticky-col-total">Công</th>
      <th style="min-width: 60px;">Sửa</th>
    </tr>
  `;
  table.querySelector("thead").innerHTML = headerHtml;
  
  // 2. Lọc dữ liệu hiển thị
  const filteredRecords = state.records.filter(r => {
    if (r["Tháng"] !== state.selectedMonth) return false;
    
    // Lọc Tổ
    const matchDept = state.selectedDept ? r["Tổ"] === state.selectedDept : true;
    
    // Tìm kiếm Tên/Mã
    const query = state.searchQuery.toLowerCase();
    const matchSearch = r["Tên nhân viên"].toLowerCase().includes(query) || r["Mã nhân viên"].toLowerCase().includes(query);
    
    // Lọc nhân viên thiếu công (có ít nhất 1 ô trống)
    let matchIncomplete = true;
    if (state.incompleteOnly) {
      matchIncomplete = false;
      for (let d = 0; d < daysInMonth; d++) {
        if (r["Ngày"][d] === "") {
          matchIncomplete = true;
          break;
        }
      }
    }
    
    return matchDept && matchSearch && matchIncomplete;
  });
  
  // Sắp xếp Alphabet theo tên nhân viên
  filteredRecords.sort((a, b) => a["Tên nhân viên"].localeCompare(b["Tên nhân viên"], "vi"));
  
  // 3. Dựng Thân bảng (Body)
  tbody.innerHTML = "";
  if (filteredRecords.length === 0) {
    tbody.innerHTML = `<tr><td colspan="${5 + daysInMonth}" style="text-align: center; color: var(--color-text-muted); padding: 40px;">Không tìm thấy dữ liệu nhân viên nào phù hợp.</td></tr>`;
    updateReviewBanner(0);
    return;
  }
  
  let emptyCellsCount = 0;
  
  filteredRecords.forEach((r, idx) => {
    const tr = document.createElement("tr");
    
    let rowHtml = `
      <td class="sticky-col-stt">${idx + 1}</td>
      <td class="sticky-col-id" style="font-size: 0.75rem; color: var(--color-text-muted); font-weight: 600;">${r["Mã nhân viên"]}</td>
      <td class="sticky-col-name" style="font-weight: 600;">${r["Tên nhân viên"]}</td>
      <td class="sticky-col-dept" style="font-size: 0.8rem; color: var(--color-text-muted);">${r["Tổ"]}</td>
    `;
    
    // Dựng 31 ô ngày công
    for (let d = 1; d <= daysInMonth; d++) {
      const val = r["Ngày"][d - 1] || "";
      let cellClass = "cell-empty";
      const uVal = val.toUpperCase();
      
      if (uVal === "X") {
        cellClass = "cell-x";
      } else if (uVal === "RO" || uVal === "O") {
        cellClass = "cell-ro";
      } else if (uVal === "F") {
        cellClass = "cell-f";
      } else if (uVal === "NB") {
        cellClass = "cell-nb";
      } else if (uVal === "") {
        cellClass = "cell-empty";
        emptyCellsCount++;
      } else {
        // Hỗ trợ hiển thị màu các ký hiệu cũ nếu có trong sheet
        if (uVal === "X2" || uVal === "X3" || uVal === "X4" || uVal === "TC" || uVal === "RN") {
          cellClass = "cell-x";
        } else if (uVal === "X/F" || uVal === "F/X" || uVal === "X/P" || uVal === "H1") {
          cellClass = "cell-half";
        } else if (uVal === "V") {
          cellClass = "cell-v";
        } else {
          cellClass = "cell-x";
        }
      }
      
      rowHtml += `
        <td class="day-cell ${cellClass}" 
            data-emp-id="${r["Mã nhân viên"]}" 
            data-day="${d}"
            onclick="handleCellClick(event, '${r["Mã nhân viên"]}', ${d})"
            ondblclick="handleCellDblClick(event, '${r["Mã nhân viên"]}', ${d})">
          ${val}
        </td>
      `;
    }
    
    rowHtml += `
      <td class="sticky-col-total" id="total-val-${r["Mã nhân viên"]}">${Number(r["Tổng công"] || 0).toFixed(1)}</td>
      <td>
        <button class="btn-icon edit" onclick="openRowEditModal('${r["Mã nhân viên"]}')" style="margin: 0 auto;">
          <i class="fa-solid fa-user-pen"></i>
        </button>
      </td>
    `;
    
    tr.innerHTML = rowHtml;
    tbody.appendChild(tr);
  });
  
  updateReviewBanner(emptyCellsCount);
}

/* ==========================================================================
   5. XỬ LÝ SỰ KIỆN CLICK Ô - POPOVER CHỌN NHANH & CLICK ĐÚP
   ========================================================================== */

function handleCellDblClick(event, empId, dayNum) {
  event.stopPropagation();
  hidePopover();
  
  const cell = event.currentTarget;
  const currentVal = cell.textContent.trim().toUpperCase();
  let newVal = "";
  
  if (currentVal === "") newVal = "X";
  else if (currentVal === "X") newVal = "Ro";
  else if (currentVal === "RO") newVal = "F";
  else if (currentVal === "F") newVal = "NB";
  else if (currentVal === "NB") newVal = "O";
  else if (currentVal === "O") newVal = "";
  else newVal = "X";
  
  updateCellState(empId, dayNum, newVal, cell);
}

function handleCellClick(event, empId, dayNum) {
  event.stopPropagation();
  
  const cell = event.currentTarget;
  state.activeCell = {
    empId: empId,
    dayNum: dayNum,
    cellElement: cell
  };
  
  const popover = document.getElementById("cell-popover");
  popover.style.display = "flex";
  
  const rect = cell.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  popover.style.left = `${rect.left + scrollLeft - (popover.offsetWidth / 2) + (rect.width / 2)}px`;
  popover.style.top = `${rect.bottom + scrollTop + 6}px`;
}

function hidePopover() {
  const popover = document.getElementById("cell-popover");
  if (popover) popover.style.display = "none";
  state.activeCell = { empId: null, dayNum: null, cellElement: null };
}

async function updateCellState(empId, dayNum, value, cellElement) {
  const record = state.records.find(r => r["Mã nhân viên"] === empId && r["Tháng"] === state.selectedMonth);
  if (!record) return;
  
  // Cập nhật giá trị mảng ngày
  record["Ngày"][dayNum - 1] = value;
  
  // Tính toán lại tổng công
  const total = calculateTotalWorkdayFromDays(record["Ngày"]);
  record["Tổng công"] = total;
  record["Thời điểm"] = Utilities_formatDateTime(new Date());
  
  // Cập nhật giao diện lập tức (Optimistic UI)
  cellElement.textContent = value;
  cellElement.className = "day-cell"; // Reset
  
  const uVal = value.toUpperCase();
  if (uVal === "X") {
    cellElement.classList.add("cell-x");
  } else if (uVal === "RO" || uVal === "O") {
    cellElement.classList.add("cell-ro");
  } else if (uVal === "F") {
    cellElement.classList.add("cell-f");
  } else if (uVal === "NB") {
    cellElement.classList.add("cell-nb");
  } else if (uVal === "") {
    cellElement.classList.add("cell-empty");
  } else {
    // Để tương thích ngược với dữ liệu cũ
    if (uVal === "X2" || uVal === "X3" || uVal === "X4" || uVal === "TC" || uVal === "RN") {
      cellElement.classList.add("cell-x");
    } else if (uVal === "X/F" || uVal === "F/X" || uVal === "X/P" || uVal === "H1") {
      cellElement.classList.add("cell-half");
    } else if (uVal === "V") {
      cellElement.classList.add("cell-v");
    } else {
      cellElement.classList.add("cell-x");
    }
  }
  
  const totalEl = document.getElementById(`total-val-${empId}`);
  if (totalEl) totalEl.textContent = total.toFixed(1);
  
  recalculateIncompleteBannerCount();
  saveLocalRecords();
  
  // Gửi API đồng bộ dưới nền
  const payload = {
    action: "save-cell",
    month: state.selectedMonth,
    employeeId: empId,
    day: dayNum,
    value: value
  };
  
  try {
    const res = await sendPostRequest(payload);
    if (res && res.success) {
      console.log(`Synced cell success: ${empId} ngày ${dayNum} = ${value}`);
    } else {
      throw new Error(res ? res.message : "Sync error");
    }
  } catch (err) {
    console.error("Sync Error:", err);
    showToast(`Bản ghi ${empId} được lưu tạm ở máy, chưa thể đẩy lên Sheets.`, "warning");
  }
}

/* ==========================================================================
   6. SOÁT LỖI Ô TRỐNG (REVIEW MODE)
   ========================================================================== */
function toggleReviewMode() {
  const btn = document.getElementById("btn-toggle-review");
  const table = document.getElementById("attendance-grid-table");
  
  state.reviewMode = !state.reviewMode;
  
  if (state.reviewMode) {
    btn.classList.add("active");
    table.classList.add("review-mode-active");
    document.getElementById("review-banner").style.display = "flex";
    recalculateIncompleteBannerCount();
  } else {
    btn.classList.remove("active");
    table.classList.remove("review-mode-active");
    document.getElementById("review-banner").style.display = "none";
  }
}

function recalculateIncompleteBannerCount() {
  if (!state.reviewMode) return;
  
  const parts = state.selectedMonth.split("-");
  const daysInMonth = getDaysInMonth(Number(parts[0]), Number(parts[1]));
  
  let totalEmpty = 0;
  
  state.records.forEach(r => {
    if (r["Tháng"] !== state.selectedMonth) return;
    if (state.selectedDept && r["Tổ"] !== state.selectedDept) return;
    
    const query = state.searchQuery.toLowerCase();
    const matchSearch = r["Tên nhân viên"].toLowerCase().includes(query) || r["Mã nhân viên"].toLowerCase().includes(query);
    if (!matchSearch) return;
    
    for (let d = 0; d < daysInMonth; d++) {
      if (r["Ngày"][d] === "") totalEmpty++;
    }
  });
  
  updateReviewBanner(totalEmpty);
}

function updateReviewBanner(count) {
  const banner = document.getElementById("review-banner");
  const textEl = document.getElementById("review-summary-text");
  
  if (!state.reviewMode) {
    banner.style.display = "none";
    return;
  }
  
  banner.style.display = "flex";
  if (count > 0) {
    textEl.innerHTML = `Tìm thấy <b style="color: var(--color-danger); font-size: 1.1rem; animation: pulse-dot 1s infinite;">${count} ô trống chưa chấm</b>. Vui lòng chấm bổ sung ký hiệu (X, X/2, V, Phép, Lễ...) để hoàn thành đối soát.`;
  } else {
    textEl.innerHTML = `<span style="color: var(--color-success);"><i class="fa-solid fa-circle-check"></i> Hoàn hảo! Bảng chấm công đã được chấm đầy đủ thông tin các ngày trong tháng.</span>`;
  }
}

/* ==========================================================================
   7. BẢNG THỐNG KÊ (DASHBOARD STATS) & BIỂU ĐỒ CHART.JS
   ========================================================================== */
function updateDashboardKPIs() {
  const filtered = state.records.filter(r => r["Tháng"] === state.selectedMonth);
  const parts = state.selectedMonth.split("-");
  const daysInMonth = getDaysInMonth(Number(parts[0]), Number(parts[1]));
  
  let totalWorkdays = 0;
  let countX = 0;
  let countHalf = 0;
  let emptyCount = 0;
  
  filtered.forEach(r => {
    totalWorkdays += Number(r["Tổng công"] || 0);
    
    r["Ngày"].forEach((val, idx) => {
      if (idx < daysInMonth) {
        const uVal = val.toUpperCase();
        if (uVal === "X") countX++;
        else if (uVal === "X/F" || uVal === "F/X" || uVal === "X/P" || uVal === "H1") countHalf++;
        else if (uVal === "") emptyCount++;
      }
    });
  });
  
  document.getElementById("kpi-total-workdays").textContent = totalWorkdays.toFixed(1);
  document.getElementById("kpi-x-count").textContent = `${countX} lượt`;
  document.getElementById("kpi-half-count").textContent = `${countHalf} lượt`;
  document.getElementById("kpi-empty-count").textContent = `${emptyCount} ô`;
}

function updateCharts() {
  const filtered = state.records.filter(r => r["Tháng"] === state.selectedMonth);
  const parts = state.selectedMonth.split("-");
  const daysInMonth = getDaysInMonth(Number(parts[0]), Number(parts[1]));
  
  let sumX = 0;
  let sumHalf = 0;
  let sumV = 0;
  let sumEmpty = 0;
  
  filtered.forEach(r => {
    r["Ngày"].forEach((val, idx) => {
      if (idx < daysInMonth) {
        const uVal = val.toUpperCase();
        if (uVal === "X" || uVal === "X2" || uVal === "X3" || uVal === "X4" || uVal === "TC" || uVal === "NB" || uVal === "RN") {
          sumX++;
        } else if (uVal === "X/F" || uVal === "F/X" || uVal === "X/P" || uVal === "H1") {
          sumHalf++;
        } else if (uVal === "V") {
          sumV++;
        } else if (uVal === "") {
          sumEmpty++;
        } else {
          sumX++; // Các ngày hưởng lương khác gộp vào cột công có mặt
        }
      }
    });
  });
  
  const ctxPunct = document.getElementById("punctualityChart").getContext("2d");
  if (punctualityChart) punctualityChart.destroy();
  
  if (sumX === 0 && sumHalf === 0 && sumV === 0 && sumEmpty === 0) {
    punctualityChart = new Chart(ctxPunct, {
      type: 'doughnut',
      data: {
        labels: ['Không có dữ liệu'],
        datasets: [{ data: [1], backgroundColor: ['rgba(255,255,255,0.05)'], borderWidth: 0 }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, labels: { color: '#94a3b8' } } } }
    });
  } else {
    punctualityChart = new Chart(ctxPunct, {
      type: 'doughnut',
      data: {
        labels: ['Đi làm đầy đủ/Phép/Lễ', 'Nửa ca (X/2)', 'Vắng tính 2h (V)', 'Chưa chấm (Trống)'],
        datasets: [{
          data: [sumX, sumHalf, sumV, sumEmpty],
          backgroundColor: ['#10b981', '#f59e0b', '#f43f5e', 'rgba(255, 255, 255, 0.05)'],
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.08)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#94a3b8', font: { family: 'Outfit', size: 11 } }
          }
        }
      }
    });
  }
  
  // Thống kê số công theo Tổ
  const deptWorkdays = {};
  state.employees.forEach(e => {
    if (!deptWorkdays[e.department]) {
      deptWorkdays[e.department] = 0;
    }
  });
  
  filtered.forEach(r => {
    const dept = r["Tổ"];
    if (dept) {
      deptWorkdays[dept] = (deptWorkdays[dept] || 0) + Number(r["Tổng công"] || 0);
    }
  });
  
  const labels = Object.keys(deptWorkdays);
  const data = Object.values(deptWorkdays);
  
  const ctxDept = document.getElementById("departmentWorkdaysChart").getContext("2d");
  if (departmentWorkdaysChart) departmentWorkdaysChart.destroy();
  
  departmentWorkdaysChart = new Chart(ctxDept, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Tổng ngày công tích lũy',
        data: data,
        backgroundColor: 'rgba(6, 182, 212, 0.6)',
        borderColor: '#06b6d4',
        borderWidth: 1,
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#94a3b8', font: { family: 'Outfit' } } },
        y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#94a3b8', font: { family: 'Outfit' } }, beginAtZero: true }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function renderDashboardSummaryTable() {
  const tbody = document.getElementById("dashboard-summary-body");
  if (!tbody) return;
  
  let filtered = state.records.filter(r => r["Tháng"] === state.selectedMonth);
  
  if (state.selectedDashboardDept) {
    filtered = filtered.filter(r => r["Tổ"] === state.selectedDashboardDept);
  }
  
  filtered.sort((a, b) => a["Tên nhân viên"].localeCompare(b["Tên nhân viên"], "vi"));
  
  tbody.innerHTML = "";
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--color-text-muted); padding: 30px;">Không có dữ liệu nhân sự phù hợp.</td></tr>`;
    return;
  }
  
  filtered.forEach((r, idx) => {
    const tr = document.createElement("tr");
    const totalWorkdays = calculateTotalWorkdayFromDays(r["Ngày"]);
    
    tr.innerHTML = `
      <td style="text-align: center; font-weight: 500;">${idx + 1}</td>
      <td style="font-family: monospace; font-size: 0.85rem; color: var(--color-text-muted);">${r["Mã nhân viên"]}</td>
      <td style="font-weight: 600;">${r["Tên nhân viên"]}</td>
      <td style="color: var(--color-text-muted); font-size: 0.9rem;">${r["Tổ"]}</td>
      <td style="text-align: center; font-weight: 700; color: var(--color-primary); font-size: 1.05rem;">${totalWorkdays.toFixed(1)}</td>
    `;
    
    tbody.appendChild(tr);
  });
}

/* ==========================================================================
   8. TÁC VỤ DÒNG - BẢNG ĐIỀU HƯỚNG SỬA HÀNG LOẠT (BULK ACTIONS)
   ========================================================================== */
window.openRowEditModal = function(empId) {
  const record = state.records.find(r => r["Mã nhân viên"] === empId && r["Tháng"] === state.selectedMonth);
  if (!record) return;
  
  document.getElementById("edit-name").value = record["Tên nhân viên"];
  document.getElementById("edit-id").value = record["Mã nhân viên"];
  document.getElementById("edit-dept").value = record["Tổ"];
  
  hidePopover();
  document.getElementById("edit-modal").classList.add("active");
};

function closeEditModal() {
  document.getElementById("edit-modal").classList.remove("active");
}

// Điền nhanh ký hiệu công X cho các ngày trống của nhân viên
async function handleBulkFillX() {
  const empId = document.getElementById("edit-id").value;
  const record = state.records.find(r => r["Mã nhân viên"] === empId && r["Tháng"] === state.selectedMonth);
  if (!record) return;
  
  const parts = state.selectedMonth.split("-");
  const daysInMonth = getDaysInMonth(Number(parts[0]), Number(parts[1]));
  
  // Điền X vào các ô trống
  for (let d = 0; d < daysInMonth; d++) {
    if (record["Ngày"][d] === "") {
      record["Ngày"][d] = "X";
    }
  }
  
  const total = calculateTotalWorkdayFromDays(record["Ngày"]);
  record["Tổng công"] = total;
  record["Thời điểm"] = Utilities_formatDateTime(new Date());
  
  saveLocalRecords();
  renderGrid();
  closeEditModal();
  showToast(`Đã điền X cho các ngày vắng của nhân viên ${empId}`, "success");
  
  const payload = {
    action: "save-row",
    month: state.selectedMonth,
    employeeId: empId,
    days: record["Ngày"]
  };
  
  try {
    const res = await sendPostRequest(payload);
    if (res && res.success) {
      showToast("Đồng bộ dữ liệu dòng lên Sheets thành công!", "success");
    }
  } catch (err) {
    showToast("Không thể đồng bộ hàng lên Sheets.", "warning");
  }
}

// Xóa trắng toàn bộ 31 ngày
async function handleBulkClear() {
  if (!confirm("Bạn có chắc chắn muốn xóa chấm công 31 ngày của nhân viên này?")) return;
  
  const empId = document.getElementById("edit-id").value;
  const record = state.records.find(r => r["Mã nhân viên"] === empId && r["Tháng"] === state.selectedMonth);
  if (!record) return;
  
  for (let d = 0; d < 31; d++) {
    record["Ngày"][d] = "";
  }
  record["Tổng công"] = 0.0;
  record["Thời điểm"] = Utilities_formatDateTime(new Date());
  
  saveLocalRecords();
  renderGrid();
  closeEditModal();
  showToast(`Đã xóa sạch chấm công của nhân viên ${empId}`, "success");
  
  const payload = {
    action: "save-row",
    month: state.selectedMonth,
    employeeId: empId,
    days: record["Ngày"]
  };
  
  try {
    const res = await sendPostRequest(payload);
    if (res && res.success) {
      showToast("Đồng bộ xóa sạch lên Sheets thành công!", "success");
    }
  } catch (err) {
    showToast("Không thể đồng bộ lệnh xóa hàng lên Sheets.", "warning");
  }
}

/* ==========================================================================
   9. QUẢN LÝ CẤU HÌNH API & CACHE
   ========================================================================== */
function saveLocalRecords() {
  localStorage.setItem("vnpt_cached_grid_records", JSON.stringify(state.records));
}


/* ==========================================================================
   10. TIỆN ÍCH HELPER (UTILITIES)
   ========================================================================== */
function Utilities_formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hrs = String(date.getHours()).padStart(2, '0');
  const mins = String(date.getMinutes()).padStart(2, '0');
  const secs = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hrs}:${mins}:${secs}`;
}

async function sendPostRequest(payload) {
  if (!state.apiUrl) return null;
  
  // Google Apps Script redirect (script.google.com -> script.googleusercontent.com)
  // bị chặn bởi CORS khi dùng POST. Giải pháp: encode payload vào URL params và dùng GET.
  const params = new URLSearchParams();
  for (const [key, val] of Object.entries(payload)) {
    if (typeof val === 'object') {
      params.set(key, JSON.stringify(val));
    } else {
      params.set(key, String(val !== undefined && val !== null ? val : ""));
    }
  }
  
  const requestUrl = `${state.apiUrl}?${params.toString()}`;
  const response = await fetch(requestUrl, {
    method: "GET",
    mode: "cors",
    redirect: "follow"
  });
  
  return await response.json();
}

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  let icon = "fa-circle-info";
  if (type === "success") icon = "fa-circle-check";
  else if (type === "error") icon = "fa-circle-exclamation";
  
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = "slideIn 0.3s ease reverse forwards";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* Thiết lập các sự kiện lắng nghe tương tác */
function setupEventListeners() {
  // Thay đổi tháng trên lưới chấm công
  document.getElementById("grid-month-filter").onchange = (e) => {
    state.selectedMonth = e.target.value;
    refreshData();
  };
  
  // Thay đổi tổ trên lưới chấm công
  document.getElementById("grid-dept-filter").onchange = (e) => {
    state.selectedDept = e.target.value;
    renderGrid();
  };
  
  // Tìm kiếm nhân viên
  document.getElementById("grid-search").oninput = (e) => {
    state.searchQuery = e.target.value.trim();
    renderGrid();
  };
  
  // Checkbox: chỉ hiện nhân viên thiếu công
  document.getElementById("chk-incomplete-only").onchange = (e) => {
    state.incompleteOnly = e.target.checked;
    renderGrid();
  };
  
  // Bật/tắt soát lỗi
  document.getElementById("btn-toggle-review").onclick = toggleReviewMode;
  
  // Thay đổi tháng trên thống kê
  document.getElementById("dashboard-month-filter").onchange = (e) => {
    state.selectedMonth = e.target.value;
    updateDashboardKPIs();
    updateCharts();
    renderDashboardSummaryTable();
  };
  
  // Thay đổi tháng trên Xác nhận số liệu
  const verifyMonthFilter = document.getElementById("verification-month-filter");
  if (verifyMonthFilter) {
    verifyMonthFilter.onchange = (e) => {
      state.selectedMonth = e.target.value;
      refreshData();
    };
  }
  
  // Thay đổi tổ trên thống kê
  const dashDeptFilter = document.getElementById("dashboard-dept-filter");
  if (dashDeptFilter) {
    dashDeptFilter.onchange = (e) => {
      state.selectedDashboardDept = e.target.value;
      renderDashboardSummaryTable();
    };
  }
  
  
  // Modal Actions
  document.getElementById("modal-close").onclick = closeEditModal;
  document.getElementById("btn-edit-close").onclick = closeEditModal;
  document.getElementById("btn-bulk-fill-x").onclick = handleBulkFillX;
  document.getElementById("btn-bulk-clear").onclick = handleBulkClear;
  
  // Lắng nghe click các nút trên Quick Popover Menu
  const popover = document.getElementById("cell-popover");
  popover.querySelectorAll(".popover-btn").forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      
      const { empId, dayNum, cellElement } = state.activeCell;
      if (!empId || !dayNum || !cellElement) return;
      
      const val = btn.getAttribute("data-val") || "";
      
      updateCellState(empId, dayNum, val, cellElement);
      hidePopover();
    };
  });
  
  document.addEventListener("click", () => {
    hidePopover();
  });
  
  window.onclick = (e) => {
    const modal = document.getElementById("edit-modal");
    if (e.target === modal) closeEditModal();
  };
}

/* ==========================================================================
   11. QUẢN LÝ XÁC NHẬN SỐ LIỆU & PHÊ DUYỆT TỔ
   ========================================================================== */
function renderVerificationTab() {
  const tbody = document.getElementById("verification-summary-body");
  if (!tbody) return;
  
  // Đồng bộ giá trị bộ lọc tháng
  const verifyMonthFilter = document.getElementById("verification-month-filter");
  if (verifyMonthFilter && verifyMonthFilter.value !== state.selectedMonth) {
    verifyMonthFilter.value = state.selectedMonth;
  }
  
  // Trích xuất danh sách các Tổ độc nhất từ Danh sách nhân viên
  const departments = [...new Set(state.employees.map(emp => emp.department))].sort();
  
  tbody.innerHTML = "";
  if (departments.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--color-text-muted); padding: 30px;">Không tìm thấy tổ bộ phận nào.</td></tr>`;
    updateVerificationKPIs(0, 0, 0);
    return;
  }
  
  let agreeCount = 0;
  let modifyCount = 0;
  
  departments.forEach((dept, idx) => {
    // Tìm trạng thái xác nhận đã lưu cho tổ này trong tháng
    const record = state.confirmations.find(c => c.department === dept && c.month === state.selectedMonth);
    const currentStatus = record ? record.status : ""; // "Không sửa", "Có sửa" hoặc trống
    const timestampStr = record ? record.timestamp : "-";
    
    if (currentStatus === "Không sửa") agreeCount++;
    else if (currentStatus === "Có sửa") modifyCount++;
    
    const tr = document.createElement("tr");
    
    // Tạo nhóm nút bấm công tắc (Segmented Toggles)
    // Dùng data-attributes thay vì inline onclick để tránh mã hoá sai ký tự tiếng Việt trong HTML
    const isAgreeActive = currentStatus === "Không sửa" ? "active" : "";
    const isModifyActive = currentStatus === "Có sửa" ? "active" : "";
    
    tr.innerHTML = `
      <td style="text-align: center; font-weight: 500;">${idx + 1}</td>
      <td style="font-weight: 600; text-align: left; padding-left: 20px;">${dept}</td>
      <td style="text-align: center;">
        <div class="status-toggle-group">
          <button class="status-toggle-btn agree ${isAgreeActive}" 
                  data-dept="${dept}" data-status="agree">
            <i class="fa-solid fa-circle-check"></i> Đồng ý (Không sửa)
          </button>
          <button class="status-toggle-btn modify ${isModifyActive}" 
                  data-dept="${dept}" data-status="modify">
            <i class="fa-solid fa-triangle-exclamation"></i> Có sửa đổi
          </button>
        </div>
      </td>
      <td style="text-align: center; color: var(--color-text-muted); font-size: 0.85rem;" id="verify-time-${dept.replace(/\s+/g, '-')}">
        ${timestampStr}
      </td>
    `;
    
    // Gắn event listener trực tiếp vào DOM element để tránh lỗi mã hoá ký tự tiếng Việt
    const agreeBtn = tr.querySelector('.status-toggle-btn.agree');
    const modifyBtn = tr.querySelector('.status-toggle-btn.modify');
    agreeBtn.addEventListener('click', function() { saveConfirmationState(dept, 'Không sửa', this); });
    modifyBtn.addEventListener('click', function() { saveConfirmationState(dept, 'Có sửa', this); });
    
    tbody.appendChild(tr);
  });
  
  updateVerificationKPIs(departments.length, agreeCount, modifyCount);
}

function updateVerificationKPIs(total, agree, modify) {
  const totalEl = document.getElementById("kpi-verify-total");
  const agreeEl = document.getElementById("kpi-verify-agree");
  const modifyEl = document.getElementById("kpi-verify-modify");
  
  if (totalEl) totalEl.textContent = `${total} Tổ`;
  if (agreeEl) agreeEl.textContent = `${agree} Tổ`;
  if (modifyEl) modifyEl.textContent = `${modify} Tổ`;
}

async function saveConfirmationState(department, status, clickedBtn) {
  // Tìm record cũ nếu có
  let record = state.confirmations.find(c => c.department === department && c.month === state.selectedMonth);
  const now = new Date();
  const timeStr = Utilities_formatDateTime(now);
  
  if (record) {
    record.status = status;
    record.timestamp = timeStr;
  } else {
    record = {
      month: state.selectedMonth,
      department: department,
      status: status,
      timestamp: timeStr
    };
    state.confirmations.push(record);
  }
  
  // Lưu cache cục bộ lập tức (Optimistic UI)
  localStorage.setItem("vnpt_cached_confirmations", JSON.stringify(state.confirmations));
  
  // Đổi trạng thái hiển thị của các nút trong group ngay lập tức
  const parentGroup = clickedBtn.parentElement;
  parentGroup.querySelectorAll(".status-toggle-btn").forEach(btn => btn.classList.remove("active"));
  clickedBtn.classList.add("active");
  
  // Cập nhật lại thời gian hiển thị trên cột
  const timeCellId = `verify-time-${department.replace(/\s+/g, '-')}`;
  const timeCell = document.getElementById(timeCellId);
  if (timeCell) {
    timeCell.textContent = timeStr;
  }
  
  // Cập nhật lại KPIs ngay lập tức
  const departments = [...new Set(state.employees.map(emp => emp.department))];
  let agreeCount = 0;
  let modifyCount = 0;
  departments.forEach(dept => {
    const rec = state.confirmations.find(c => c.department === dept && c.month === state.selectedMonth);
    if (rec) {
      if (rec.status === "Không sửa") agreeCount++;
      else if (rec.status === "Có sửa") modifyCount++;
    }
  });
  updateVerificationKPIs(departments.length, agreeCount, modifyCount);
  
  // Báo toast tiến trình
  showToast(`Đang lưu xác nhận cho ${department}...`, "info");
  
  // Gửi API đồng bộ
  const payload = {
    action: "save-confirmation",
    month: state.selectedMonth,
    department: department,
    status: status
  };
  
  try {
    const res = await sendPostRequest(payload);
    if (res && res.success) {
      showToast(`Xác nhận của ${department} đã được lưu lên Google Sheets!`, "success");
      
      // Đồng bộ thời gian thực tế trả về từ server
      if (res.timestamp) {
        record.timestamp = res.timestamp;
        if (timeCell) timeCell.textContent = res.timestamp;
        localStorage.setItem("vnpt_cached_confirmations", JSON.stringify(state.confirmations));
      }
    } else {
      throw new Error(res ? res.message : "API Error");
    }
  } catch (err) {
    console.error("Save confirmation error:", err);
    showToast(`Lưu tạm trạng thái tổ ${department} trên máy. Chưa thể đồng bộ lên Sheets.`, "warning");
  }
}

// Expose functions globally for HTML onclick event handlers
window.renderVerificationTab = renderVerificationTab;
window.saveConfirmationState = saveConfirmationState;
