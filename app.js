// STATE MANAGEMENT
let state = {
    records: [],
    employees: [], // { maNV, tenNV, to }
    selectedMonth: 'all',
    filters: {
        searchName: '',
        searchId: '',
        searchTeam: ''
    },
    apiUrl: localStorage.getItem('reward_api_url') || 'https://script.google.com/macros/s/AKfycbwNXm3dPsURS3F-5dX4CW-R0mTaTCBKf9yHhj0stX3Qq5CvWncwUQi56KcKmSHSxKsDbw/exec',
    isLive: false
};

// INITIAL MOCK DATA (Lấy từ sheet thực tế của người dùng và bổ sung mẫu)
const MOCK_RECORDS = [
    {
        "STT": 1,
        "Tháng": "52026",
        "Mã nhân viên": "VNPT018220",
        "Tên Nhân viên": "Phan Tiến Dũng",
        "Tổ": "Tổ Hạ tầng Tam Đảo",
        "Điểm khuyến khích": 160,
        "Tiền thưởng": 800000,
        "Lý do": "Thực hiện điều động ứng cứu xử lý sự cố nguồn trạm BXN012 từ 17h30 đến 22h00 ngày 19/07/2025; Trực bão số 3 WIPHA đêm 21-22/07/2025; Sửa máy nổ trạm Tân Long",
        "Thời điểm": "2026-05-19 22:00:00"
    },
    {
        "STT": 2,
        "Tháng": "52026",
        "Mã nhân viên": "VNPT018220",
        "Tên Nhân viên": "Phan Tiến Dũng",
        "Tổ": "Tổ Hạ tầng Tam Đảo",
        "Điểm khuyến khích": 80,
        "Tiền thưởng": 400000,
        "Lý do": "Thực hiện BCĐ PCTT VTT trực đảm bảo cơn bão số 3 WIPHA đêm 22-23/07/2025; Tăng cường đo Drivingtest CSHT mới địa bàn tỉnh ngày 27-30/07/2025",
        "Thời điểm": "2026-05-23 02:00:00"
    },
    {
        "STT": 3,
        "Tháng": "52026",
        "Mã nhân viên": "VNPT018220",
        "Tên Nhân viên": "Phan Tiến Dũng",
        "Tổ": "Tổ Hạ tầng Tam Đảo",
        "Điểm khuyến khích": 120,
        "Tiền thưởng": 600000,
        "Lý do": "Thực hiện điều động ứng cứu sự cố đổ cột đứt cáp 24fo 48fo Vĩnh Yên - Tam Dương từ 17h00 đến 00h30 ngày 19/07/2025",
        "Thời điểm": "2026-05-19 23:30:00"
    },
    {
        "STT": 4,
        "Tháng": "52026",
        "Mã nhân viên": "VNPT018220",
        "Tên Nhân viên": "Phan Tiến Dũng",
        "Tổ": "Tổ Hạ tầng Tam Đảo",
        "Điểm khuyến khích": 230,
        "Tiền thưởng": 1150000,
        "Lý do": "Phối hợp cùng Kasati, INOC đấu chuyển dồn dịch port để thực hiện nâng cấp mạng MANE 19 tại Chùa Hà, nâng cấp Ring 13 ngày 02/07/2025",
        "Thời điểm": "2026-05-02 18:00:00"
    },
    {
        "STT": 5,
        "Tháng": "52026",
        "Mã nhân viên": "VNPT018220",
        "Tên Nhân viên": "Phan Tiến Dũng",
        "Tổ": "Tổ Hạ tầng Tam Đảo",
        "Điểm khuyến khích": 210,
        "Tiền thưởng": 1050000,
        "Lý do": "Phối hợp cùng TTVT Phúc Yên triển khai làm hạ tầng mạng LAN tại bệnh viện K74 TW ngày 10-12/07/2025",
        "Thời điểm": "2026-05-12 17:30:00"
    },
    {
        "STT": 6,
        "Tháng": "52026",
        "Mã nhân viên": "VNPT018221",
        "Tên Nhân viên": "Nguyễn Văn An",
        "Tổ": "Tổ Hạ tầng Vĩnh Yên",
        "Điểm khuyến khích": 180,
        "Tiền thưởng": 900000,
        "Lý do": "Hỗ trợ lắp đặt thiết bị MAN-E và cấu hình định tuyến cho trạm viễn thông trung tâm Vĩnh Yên",
        "Thời điểm": "2026-05-10 16:45:00"
    },
    {
        "STT": 7,
        "Tháng": "52026",
        "Mã nhân viên": "VNPT018222",
        "Tên Nhân viên": "Trần Thị Bình",
        "Tổ": "Tổ Kỹ thuật Nghiệp vụ",
        "Điểm khuyến khích": 100,
        "Tiền thưởng": 500000,
        "Lý do": "Xử lý hồ sơ nghiệm thu kỹ thuật và lập quyết toán các công trình hạ tầng mạng lưới đợt 1 năm 2026",
        "Thời điểm": "2026-05-15 15:00:00"
    },
    {
        "STT": 8,
        "Tháng": "52026",
        "Mã nhân viên": "VNPT018223",
        "Tên Nhân viên": "Lê Hoàng Châu",
        "Tổ": "Tổ Hạ tầng Bình Xuyên",
        "Điểm khuyến khích": 150,
        "Tiền thưởng": 750000,
        "Lý do": "Tăng cường ứng cứu khắc phục đứt cáp quang trục chính liên huyện ngày nghỉ cuối tuần 24/05/2026",
        "Thời điểm": "2026-05-24 11:30:00"
    }
];

// CHART INSTANCES
let teamChart = null;
let employeeChart = null;

// DOM ELEMENTS & INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
    initApp();
    setupEventListeners();
});

// INITIALIZE APP
async function initApp() {
    loadLocalSettings();
    showToast("Đang khởi tạo ứng dụng...", "info");
    
    // Nạp dữ liệu
    await refreshData();
    
    // Mặc định chọn tab dashboard
    switchTab('dashboard');
}

// LOAD SETTINGS FROM LOCALSTORAGE
function loadLocalSettings() {
    const defaultUrl = 'https://script.google.com/macros/s/AKfycbwNXm3dPsURS3F-5dX4CW-R0mTaTCBKf9yHhj0stX3Qq5CvWncwUQi56KcKmSHSxKsDbw/exec';
    const savedUrl = localStorage.getItem('reward_api_url');
    if (savedUrl) {
        state.apiUrl = savedUrl;
        document.getElementById('api-url-input').value = savedUrl;
    } else {
        state.apiUrl = defaultUrl;
        document.getElementById('api-url-input').value = defaultUrl;
    }
    
    // Tự động điền tháng hiện tại vào form nhập
    const now = new Date();
    const currentMonthFormatted = (now.getMonth() + 1) + "" + now.getFullYear();
    document.getElementById('reward-month').value = currentMonthFormatted;
}

// REFRESH DATA FROM API OR MOCK
async function refreshData() {
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');
    
    if (state.apiUrl) {
        try {
            statusText.textContent = "Đang kết nối...";
            statusDot.className = "status-dot";
            
            const response = await fetch(state.apiUrl, { method: 'GET' });
            const result = await response.json();
            
            if (result.status === "success") {
                // Nhận diện dữ liệu thành công từ Google Sheets
                // Map các tên cột sang định dạng chuẩn trong App
                state.records = parseSheetsData(result.data);
                
                // Nếu có danh sách danh bạ từ sheet danhba, lưu trữ làm autocomplete chính thức
                if (result.employees && result.employees.length > 0) {
                    state.employees = result.employees;
                }
                
                state.isLive = true;
                
                statusDot.className = "status-dot connected";
                statusText.textContent = "Đã kết nối trực tiếp";
                showToast("Đã tải dữ liệu trực tiếp từ Google Sheets!", "success");
            } else {
                throw new Error(result.message || "Lỗi API");
            }
        } catch (error) {
            console.error("Cảnh báo: Không thể tải dữ liệu từ API, chuyển sang Mock Data.", error);
            loadMockData();
            statusDot.className = "status-dot";
            statusText.textContent = "Chế độ Ngoại tuyến";
            showToast("Kết nối API lỗi. Đã tải dữ liệu Demo tích hợp sẵn.", "error");
        }
    } else {
        loadMockData();
        statusDot.className = "status-dot";
        statusText.textContent = "Chế độ Demo (Chưa cấu hình)";
    }
    
    extractEmployeeDatabase();
    populateMonthSelectors();
    updateUI();
}

// PARSE SHEET COLUMNS DYNAMICALLY
function parseSheetsData(sheetRows) {
    return sheetRows.map(row => {
        return {
            "STT": parseInt(row["STT"]) || 0,
            "Tháng": (row["Tháng"] || "").toString().trim(),
            "Mã nhân viên": (row["Mã nhân viên"] || "").toString().trim(),
            "Tên Nhân viên": (row["Tên Nhân viên"] || "").toString().trim(),
            "Tổ": (row["Tổ"] || "").toString().trim(),
            "Điểm khuyến khích": parseFloat(row["Điểm khuyến khích"]) || 0,
            "Tiền thưởng": parseFloat(row["Tiền thưởng"]) || 0,
            "Lý do": (row["Lý do"] || "").toString().trim(),
            "Thời điểm": (row["Thời điểm"] || "").toString().trim()
        };
    });
}

// LOAD DATA FROM MOCK AND LOCAL STORAGE
function loadMockData() {
    state.isLive = false;
    const localRecords = localStorage.getItem('demo_records');
    if (localRecords) {
        state.records = JSON.parse(localRecords);
    } else {
        state.records = [...MOCK_RECORDS];
        localStorage.setItem('demo_records', JSON.stringify(state.records));
    }
}

// EXTRACT UNIQUE EMPLOYEES FOR AUTOCOMPLETE
function extractEmployeeDatabase() {
    // Nếu ở chế độ Live và đã có dữ liệu danh bạ chính thức từ sheet danhba, giữ nguyên
    if (state.isLive && state.employees && state.employees.length > 0) {
        return;
    }
    const empMap = new Map();
    state.records.forEach(r => {
        if (r["Mã nhân viên"] && r["Tên Nhân viên"]) {
            const key = r["Mã nhân viên"].toLowerCase();
            if (!empMap.has(key)) {
                empMap.set(key, {
                    maNV: r["Mã nhân viên"],
                    tenNV: r["Tên Nhân viên"],
                    to: r["Tổ"] || ""
                });
            } else if (r["Tổ"] && !empMap.get(key).to) {
                // Cập nhật Tổ nếu trước đó bị thiếu
                empMap.get(key).to = r["Tổ"];
            }
        }
    });
    state.employees = Array.from(empMap.values());
}

// POPULATE MONTH SELECTION DROPDOWNS
function populateMonthSelectors() {
    const filterMonth = document.getElementById('filter-month');
    const months = [...new Set(state.records.map(r => r["Tháng"]))].filter(Boolean);
    
    // Sắp xếp tháng từ mới nhất đến cũ nhất
    months.sort((a, b) => b.localeCompare(a));
    
    // Lưu giá trị hiện tại để khôi phục
    const currentVal = filterMonth.value;
    
    // Tạo option
    filterMonth.innerHTML = '<option value="all">Tất cả các tháng</option>';
    months.forEach(m => {
        const option = document.createElement('option');
        option.value = m;
        // Định dạng tháng hiển thị thân thiện (ví dụ: "52026" -> "Tháng 5/2026")
        option.textContent = formatMonthDisplay(m);
        filterMonth.appendChild(option);
    });
    
    if (months.includes(currentVal)) {
        filterMonth.value = currentVal;
    } else {
        filterMonth.value = 'all';
        state.selectedMonth = 'all';
    }
}

// FORMAT MONTH DISPLAY STRING
function formatMonthDisplay(monthStr) {
    if (!monthStr) return "";
    const s = monthStr.toString();
    if (s.length >= 5) {
        // ví dụ 52026 -> Tháng 5/2026 hoặc 112026 -> Tháng 11/2026
        const year = s.substring(s.length - 4);
        const month = s.substring(0, s.length - 4);
        return `Tháng ${month}/${year}`;
    }
    return `Tháng ${s}`;
}

// SETUP EVENT LISTENERS
function setupEventListeners() {
    // Sidebar Navigation
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const tabName = item.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Close sidebar on mobile clicking item
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                sidebar.classList.remove('active');
            });
        });
    }

    // Config: Save API URL
    const saveApiBtn = document.getElementById('save-api-btn');
    if (saveApiBtn) {
        saveApiBtn.addEventListener('click', () => {
            const urlInput = document.getElementById('api-url-input').value.trim();
            localStorage.setItem('reward_api_url', urlInput);
            state.apiUrl = urlInput;
            showToast("Đã lưu thiết lập API Google Sheets!", "success");
            refreshData();
        });
    }

    // Search and Filters in Lịch sử
    document.getElementById('search-name').addEventListener('input', (e) => {
        state.filters.searchName = e.target.value.toLowerCase();
        updateUI();
    });
    document.getElementById('search-id').addEventListener('input', (e) => {
        state.filters.searchId = e.target.value.toLowerCase();
        updateUI();
    });
    document.getElementById('search-team').addEventListener('input', (e) => {
        state.filters.searchTeam = e.target.value.toLowerCase();
        updateUI();
    });
    document.getElementById('filter-month').addEventListener('change', (e) => {
        state.selectedMonth = e.target.value;
        updateUI();
    });

    // Form logic: Auto-calculate reward money
    const pointsInput = document.getElementById('reward-points');
    const moneyPreview = document.getElementById('money-amount-preview');
    if (pointsInput) {
        pointsInput.addEventListener('input', (e) => {
            const points = parseFloat(e.target.value) || 0;
            const money = points * 5000;
            moneyPreview.textContent = formatCurrency(money);
        });
    }

    // Form logic: Autocomplete for Name and ID
    const nameInput = document.getElementById('reward-name');
    const idInput = document.getElementById('reward-id');
    const teamInput = document.getElementById('reward-team');

    setupAutocomplete(nameInput, 'tenNV', (selected) => {
        nameInput.value = selected.tenNV;
        idInput.value = selected.maNV;
        teamInput.value = selected.to;
    });

    setupAutocomplete(idInput, 'maNV', (selected) => {
        nameInput.value = selected.tenNV;
        idInput.value = selected.maNV;
        teamInput.value = selected.to;
    });

    // Form submission
    const submitBtn = document.getElementById('submit-reward-btn');
    const rewardForm = document.getElementById('reward-points-form');
    if (rewardForm) {
        rewardForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const thang = document.getElementById('reward-month').value.trim();
            const maNV = document.getElementById('reward-id').value.trim();
            const tenNV = document.getElementById('reward-name').value.trim();
            const to = document.getElementById('reward-team').value.trim();
            const diem = parseFloat(pointsInput.value) || 0;
            const lyDo = document.getElementById('reward-reason').value.trim();
            
            if (!maNV || !tenNV || !diem) {
                showToast("Vui lòng nhập đầy đủ thông tin bắt buộc!", "error");
                return;
            }
            
            submitBtn.disabled = true;
            submitBtn.textContent = "Đang xử lý...";
            
            const timestamp = getNowTimestampString();
            const newRecord = {
                thang,
                maNV,
                tenNV,
                to,
                diem,
                lyDo,
                timestamp
            };
            
            if (state.isLive && state.apiUrl) {
                // Gửi lên Google Sheets API
                try {
                    const res = await fetch(state.apiUrl, {
                        method: 'POST',
                        mode: 'no-cors', // Sử dụng no-cors tránh lỗi tiền kiểm định pre-flight CORS
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newRecord)
                    });
                    
                    showToast("Điểm thưởng đang được gửi tới Google Sheets!", "success");
                    rewardForm.reset();
                    moneyPreview.textContent = "0 đ";
                    
                    // Đợi 2 giây rồi tải lại dữ liệu từ Google Sheets
                    setTimeout(async () => {
                        await refreshData();
                        submitBtn.disabled = false;
                        submitBtn.textContent = "Lưu Điểm Khuyến khích";
                        switchTab('history');
                    }, 2000);
                } catch (error) {
                    showToast("Không thể gửi dữ liệu tới Google Sheets. Đang chuyển lưu offline.", "error");
                    console.error(error);
                    saveOffline(newRecord);
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Lưu Điểm Khuyến khích";
                }
            } else {
                // Chế độ demo offline
                saveOffline(newRecord);
                submitBtn.disabled = false;
                submitBtn.textContent = "Lưu Điểm Khuyến khích";
                rewardForm.reset();
                moneyPreview.textContent = "0 đ";
                switchTab('history');
            }
        });
    }

    // Export CSV Button
    const exportCsvBtn = document.getElementById('export-csv-btn');
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', () => {
            exportToCSV();
        });
    }
}

// SAVE OFFLINE DEMO RECORD
function saveOffline(payload) {
    const nextStt = state.records.length > 0 ? Math.max(...state.records.map(r => r["STT"])) + 1 : 1;
    const added = {
        "STT": nextStt,
        "Tháng": payload.thang,
        "Mã nhân viên": payload.maNV,
        "Tên Nhân viên": payload.tenNV,
        "Tổ": payload.to,
        "Điểm khuyến khích": payload.diem,
        "Tiền thưởng": payload.diem * 5000,
        "Lý do": payload.lyDo,
        "Thời điểm": payload.timestamp
    };
    
    state.records.unshift(added); // Đưa lên đầu bảng
    localStorage.setItem('demo_records', JSON.stringify(state.records));
    
    extractEmployeeDatabase();
    populateMonthSelectors();
    updateUI();
    
    showToast("Đã lưu điểm khuyến khích thành công (Offline Demo)!", "success");
}

// AUTOCOMPLETE HELPER
function setupAutocomplete(inputElement, field, onSelect) {
    if (!inputElement) return;
    const listElement = document.createElement('ul');
    listElement.className = 'autocomplete-list';
    inputElement.parentNode.appendChild(listElement);
    
    inputElement.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        listElement.innerHTML = '';
        
        if (!query) {
            listElement.classList.remove('active');
            return;
        }
        
        const matches = state.employees.filter(emp => {
            if (!emp) return false;
            const maNV = emp.maNV ? emp.maNV.toString().toLowerCase() : "";
            const tenNV = emp.tenNV ? emp.tenNV.toString().toLowerCase() : "";
            const to = emp.to ? emp.to.toString().toLowerCase() : "";
            
            return maNV.includes(query) || tenNV.includes(query) || to.includes(query);
        }).slice(0, 8); // Tối đa 8 gợi ý cho phong phú
        
        if (matches.length === 0) {
            listElement.classList.remove('active');
            return;
        }
        
        matches.forEach(match => {
            const li = document.createElement('li');
            li.className = 'autocomplete-item';
            li.innerHTML = `
                <span><strong>${match.tenNV}</strong> (${match.maNV})</span>
                <span class="sub-info">${match.to || "Chưa chia tổ"}</span>
            `;
            li.addEventListener('mousedown', (ev) => {
                ev.preventDefault();
                onSelect(match);
                listElement.classList.remove('active');
            });
            listElement.appendChild(li);
        });
        
        listElement.classList.add('active');
    });
    
    inputElement.addEventListener('blur', () => {
        setTimeout(() => {
            listElement.classList.remove('active');
        }, 200);
    });
}

// SWITCH VIEWS / TABS
function switchTab(tabName) {
    const views = document.querySelectorAll('.page-view');
    views.forEach(v => v.classList.remove('active'));
    
    const targetView = document.getElementById(`${tabName}-view`);
    if (targetView) {
        targetView.classList.add('active');
    }
    
    // Cập nhật tiêu đề sidebar nếu cần
    document.querySelectorAll('.menu-item').forEach(item => {
        if (item.getAttribute('data-tab') === tabName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    if (tabName === 'dashboard') {
        renderCharts();
    }
}

// UPDATE CORE UI & TABLES
function updateUI() {
    // 1. Lọc bản ghi theo bộ lọc hiện tại
    const filteredRecords = state.records.filter(r => {
        const matchMonth = state.selectedMonth === 'all' || r["Tháng"] === state.selectedMonth;
        const matchName = !state.filters.searchName || (r["Tên Nhân viên"] || "").toLowerCase().includes(state.filters.searchName);
        const matchId = !state.filters.searchId || (r["Mã nhân viên"] || "").toLowerCase().includes(state.filters.searchId);
        const matchTeam = !state.filters.searchTeam || (r["Tổ"] || "").toLowerCase().includes(state.filters.searchTeam);
        
        return matchMonth && matchName && matchId && matchTeam;
    });

    // 2. Tính toán tổng số lượng cho KPIs (dựa trên tháng được chọn)
    const activeRecords = state.records.filter(r => state.selectedMonth === 'all' || r["Tháng"] === state.selectedMonth);
    const totalPoints = activeRecords.reduce((sum, r) => sum + (r["Điểm khuyến khích"] || 0), 0);
    const totalMoney = activeRecords.reduce((sum, r) => sum + (r["Tiền thưởng"] || 0), 0);
    const uniqueEmployeesCount = new Set(activeRecords.map(r => r["Mã nhân viên"])).size;

    // Cập nhật các KPI Card
    document.getElementById('kpi-total-points').textContent = formatNumber(totalPoints);
    document.getElementById('kpi-total-money').textContent = formatCurrency(totalMoney);
    document.getElementById('kpi-employees').textContent = uniqueEmployeesCount;
    document.getElementById('kpi-current-month').textContent = state.selectedMonth === 'all' ? "Tất cả" : formatMonthDisplay(state.selectedMonth);

    // 3. Render Bảng Lịch sử đầy đủ
    renderHistoryTable(filteredRecords);

    // 4. Render Bảng Thống kê Tổ & Nhân viên trong tháng được chọn
    renderStatsTables(activeRecords);
}

// RENDER REWARD HISTORY TABLE
function renderHistoryTable(records) {
    const tbody = document.getElementById('history-table-body');
    tbody.innerHTML = '';
    
    if (records.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted);">Không tìm thấy dữ liệu phù hợp với điều kiện tìm kiếm.</td></tr>`;
        return;
    }
    
    records.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${r["STT"]}</td>
            <td><span class="badge primary">${formatMonthDisplay(r["Tháng"])}</span></td>
            <td><code>${r["Mã nhân viên"]}</code></td>
            <td><strong>${r["Tên Nhân viên"]}</strong></td>
            <td>${r["Tổ"] || '<span style="color: var(--text-muted); font-style: italic;">Chưa phân tổ</span>'}</td>
            <td style="font-weight: 700;">${formatNumber(r["Điểm khuyến khích"])}</td>
            <td style="color: var(--color-accent); font-weight: 700;">${formatCurrency(r["Tiền thưởng"])}</td>
            <td><span title="${r["Lý do"]}">${truncateString(r["Lý do"], 60)}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

// RENDER TEAM & EMPLOYEE STATS TABLES
function renderStatsTables(activeRecords) {
    // 1. Bảng thống kê theo Tổ
    const teamStats = {};
    activeRecords.forEach(r => {
        const team = r["Tổ"] || "Chưa phân tổ";
        if (!teamStats[team]) {
            teamStats[team] = { points: 0, money: 0, employeeCount: new Set() };
        }
        teamStats[team].points += r["Điểm khuyến khích"] || 0;
        teamStats[team].money += r["Tiền thưởng"] || 0;
        teamStats[team].employeeCount.add(r["Mã nhân viên"]);
    });

    const teamTbody = document.getElementById('team-stats-tbody');
    teamTbody.innerHTML = '';
    
    const teamList = Object.keys(teamStats).map(t => ({
        name: t,
        points: teamStats[t].points,
        money: teamStats[t].money,
        count: teamStats[t].employeeCount.size
    })).sort((a, b) => b.points - a.points); // Sắp xếp theo tổng điểm giảm dần

    if (teamList.length === 0) {
        teamTbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">Không có dữ liệu thống kê.</td></tr>`;
    } else {
        teamList.forEach(t => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${t.name}</strong></td>
                <td><span class="badge">${t.count} Nhân sự</span></td>
                <td style="font-weight: 700;">${formatNumber(t.points)}</td>
                <td style="color: var(--color-accent); font-weight: 700;">${formatCurrency(t.money)}</td>
            `;
            teamTbody.appendChild(tr);
        });
    }

    // 2. Bảng thống kê theo Nhân viên
    const empStats = {};
    activeRecords.forEach(r => {
        const key = r["Mã nhân viên"];
        if (!empStats[key]) {
            empStats[key] = {
                id: r["Mã nhân viên"],
                name: r["Tên Nhân viên"],
                team: r["Tổ"] || "Chưa phân tổ",
                points: 0,
                money: 0
            };
        }
        empStats[key].points += r["Điểm khuyến khích"] || 0;
        empStats[key].money += r["Tiền thưởng"] || 0;
    });

    const empTbody = document.getElementById('employee-stats-tbody');
    empTbody.innerHTML = '';
    
    const empList = Object.values(empStats).sort((a, b) => b.points - a.points);

    if (empList.length === 0) {
        empTbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">Không có dữ liệu thống kê.</td></tr>`;
    } else {
        empList.forEach(e => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${e.name}</strong> (<code>${e.id}</code>)</td>
                <td>${e.team}</td>
                <td style="font-weight: 700;">${formatNumber(e.points)}</td>
                <td style="color: var(--color-accent); font-weight: 700;">${formatCurrency(e.money)}</td>
            `;
            empTbody.appendChild(tr);
        });
    }
}

// RENDER CHARTS
function renderCharts() {
    const activeRecords = state.records.filter(r => state.selectedMonth === 'all' || r["Tháng"] === state.selectedMonth);
    
    // Tính toán dữ liệu biểu đồ Tổ
    const teamData = {};
    activeRecords.forEach(r => {
        const team = r["Tổ"] || "Chưa phân tổ";
        teamData[team] = (teamData[team] || 0) + (r["Điểm khuyến khích"] || 0);
    });
    
    const teamLabels = Object.keys(teamData);
    const teamValues = Object.values(teamData);

    // Tính toán dữ liệu biểu đồ Nhân viên (Top 5)
    const empData = {};
    activeRecords.forEach(r => {
        const name = r["Tên Nhân viên"];
        empData[name] = (empData[name] || 0) + (r["Điểm khuyến khích"] || 0);
    });
    
    const sortedEmps = Object.entries(empData)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
        
    const empLabels = sortedEmps.map(x => x[0]);
    const empValues = sortedEmps.map(x => x[1]);

    // Vẽ biểu đồ cột cho các Tổ
    const ctxTeam = document.getElementById('teamChart').getContext('2d');
    if (teamChart) teamChart.destroy();
    
    // Tạo bảng màu HSL hài hòa cho biểu đồ
    const isDark = !document.body.classList.contains('light-theme');
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)';
    const textColor = isDark ? '#e2e8f0' : '#1e293b';

    teamChart = new Chart(ctxTeam, {
        type: 'bar',
        data: {
            labels: teamLabels,
            datasets: [{
                label: 'Tổng Điểm Khuyến Khích',
                data: teamValues,
                backgroundColor: 'rgba(0, 196, 140, 0.65)',
                borderColor: 'rgba(0, 196, 140, 1)',
                borderWidth: 1.5,
                borderRadius: 6,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let val = context.raw;
                            return `Tổng điểm: ${formatNumber(val)} điểm (${formatCurrency(val * 5000)})`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', weight: '500' } }
                },
                y: {
                    grid: { color: gridColor },
                    ticks: { color: textColor }
                }
            }
        }
    });

    // Vẽ biểu đồ tròn cho Top 5 Nhân viên
    const ctxEmp = document.getElementById('employeeChart').getContext('2d');
    if (employeeChart) employeeChart.destroy();

    employeeChart = new Chart(ctxEmp, {
        type: 'doughnut',
        data: {
            labels: empLabels.length > 0 ? empLabels : ["Không có dữ liệu"],
            datasets: [{
                data: empValues.length > 0 ? empValues : [0],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(0, 196, 140, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(139, 92, 246, 0.7)',
                    'rgba(239, 68, 68, 0.7)'
                ],
                borderColor: isDark ? '#1e293b' : '#ffffff',
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: textColor,
                        boxWidth: 12,
                        padding: 15,
                        font: { family: 'Plus Jakarta Sans', weight: '500', size: 11 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let val = context.raw;
                            return `Điểm: ${formatNumber(val)} (${formatCurrency(val * 5000)})`;
                        }
                    }
                }
            },
            cutout: '65%'
        }
    });
}

// TOGGLE THEME LIGHT/DARK
function toggleTheme() {
    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle');
    
    if (body.classList.contains('light-theme')) {
        body.classList.remove('light-theme');
        themeBtn.innerHTML = '<i class="fas fa-sun"></i> Giao diện Sáng';
        showToast("Đã chuyển sang giao diện tối hiện đại!", "info");
    } else {
        body.classList.add('light-theme');
        themeBtn.innerHTML = '<i class="fas fa-moon"></i> Giao diện Tối';
        showToast("Đã chuyển sang giao diện sáng trực quan!", "info");
    }
    
    // Vẽ lại biểu đồ để cập nhật màu chữ lưới trục
    if (document.getElementById('dashboard-view').classList.contains('active')) {
        renderCharts();
    }
}
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

// EXPORT TABLE TO CSV
function exportToCSV() {
    const activeRecords = state.records.filter(r => {
        const matchMonth = state.selectedMonth === 'all' || r["Tháng"] === state.selectedMonth;
        const matchName = !state.filters.searchName || (r["Tên Nhân viên"] || "").toLowerCase().includes(state.filters.searchName);
        const matchId = !state.filters.searchId || (r["Mã nhân viên"] || "").toLowerCase().includes(state.filters.searchId);
        const matchTeam = !state.filters.searchTeam || (r["Tổ"] || "").toLowerCase().includes(state.filters.searchTeam);
        
        return matchMonth && matchName && matchId && matchTeam;
    });

    if (activeRecords.length === 0) {
        showToast("Không có dữ liệu phù hợp để xuất!", "error");
        return;
    }

    let csvContent = "\ufeff"; // BOM hỗ trợ hiển thị tiếng Việt UTF-8 chuẩn trong Excel
    csvContent += "STT,Thang,Ma nhan vien,Ten Nhan vien,To,Diem khuyen khich,Tien thuong,Ly do,Thoi diem\n";
    
    activeRecords.forEach(r => {
        // Làm sạch dữ liệu tránh lỗi cấu trúc CSV
        const cleanName = `"${(r["Tên Nhân viên"] || '').replace(/"/g, '""')}"`;
        const cleanTeam = `"${(r["Tổ"] || '').replace(/"/g, '""')}"`;
        const cleanReason = `"${(r["Lý do"] || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`;
        const cleanTime = `"${(r["Thời điểm"] || '')}"`;
        
        csvContent += `${r["STT"]},${r["Tháng"]},${r["Mã nhân viên"]},${cleanName},${cleanTeam},${r["Điểm khuyến khích"]},${r["Tiền thưởng"]},${cleanReason},${cleanTime}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    const dateStr = new Date().toISOString().slice(0,10);
    link.setAttribute("href", url);
    link.setAttribute("download", `Diem_Khuyen_Khich_VNPT_${dateStr}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Đã tải xuống báo cáo CSV thành công!", "success");
}

// TOAST NOTIFICATIONS
function showToast(message, type = "info") {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '<i class="fas fa-info-circle"></i>';
    if (type === 'success') icon = '<i class="fas fa-check-circle" style="color: var(--color-accent);"></i>';
    if (type === 'error') icon = '<i class="fas fa-exclamation-circle" style="color: var(--color-danger);"></i>';
    
    toast.innerHTML = `
        ${icon}
        <div>${message}</div>
    `;
    
    container.appendChild(toast);
    
    // Tự động xóa sau 4 giây
    setTimeout(() => {
        toast.style.animation = 'fadeIn 0.2s reverse forwards';
        setTimeout(() => {
            container.removeChild(toast);
        }, 200);
    }, 4000);
}

// UTILITY FUNCTIONS
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function formatNumber(num) {
    return new Intl.NumberFormat('vi-VN').format(num);
}

function truncateString(str, num) {
    if (!str) return "";
    if (str.length <= num) {
        return str;
    }
    return str.slice(0, num) + '...';
}

function getNowTimestampString() {
    const now = new Date();
    const pad = (n) => n < 10 ? '0' + n : n;
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}
