/**
 * VNPT Monthly Grid Time Attendance Backend (Google Apps Script)
 * Tương thích 100% với tệp Excel mẫu chamcong.xlsx của VNPT Phú Thọ
 * Hỗ trợ: Tự động bổ sung cột Tổng công, Đọc danh bạ (bỏ qua hàng 2 trống), Quy đổi hệ số công tự động.
 */

var SHEET_CHAM_CONG_THANG = "chamcong"; // Tên sheet chính chứa bảng chấm công tháng
var SHEET_DANH_BA = "danhba";
var SHEET_XAC_NHAN = "xacnhan";

function isValidSheetName(name) {
  var monthPattern = /^\d{4}-\d{2}$/;
  return name === SHEET_CHAM_CONG_THANG || name === SHEET_DANH_BA || name === SHEET_XAC_NHAN || monthPattern.test(name);
}

function doGet(e) {
  var response = {};
  try {
    // Hỗ trợ ghi dữ liệu qua GET để tránh lỗi CORS với redirect của Google Apps Script
    if (e && e.parameter && e.parameter.action) {
      return handleAction(e.parameter);
    }
    
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. Đọc Danh bạ nhân sự (bỏ qua hàng 2 trống, lấy cột Bộ phận làm Tổ)
    var sheetDanhBa = doc.getSheetByName(SHEET_DANH_BA);
    var employees = [];
    if (sheetDanhBa) {
      var data = sheetDanhBa.getDataRange().getValues();
      // data[0] là tiêu đề: STT, Bộ phận, Mã nhân viên, Họ và tên...
      // data[1] là dòng trống thứ 2.
      // Dữ liệu nhân viên thật bắt đầu từ data[2] (hàng thứ 3)
      for (var i = 2; i < data.length; i++) {
        var row = data[i];
        var empId = String(row[2] || "").trim(); // Cột C: Mã nhân viên
        var empName = String(row[3] || "").trim(); // Cột D: Họ và tên
        var dept = String(row[1] || "").trim(); // Cột B: Bộ phận
        
        if (empId) {
          employees.push({
            id: empId,
            name: empName,
            department: dept
          });
        }
      }
    } else {
      // Khởi tạo sheet danh bạ nếu chưa có
      sheetDanhBa = doc.insertSheet(SHEET_DANH_BA);
      sheetDanhBa.appendRow(["STT", "Bộ phận", "Mã nhân viên", "Họ và tên", "Ngày tháng năm sinh", "Vị trí công việc", "Email", "Số ĐT"]);
      sheetDanhBa.appendRow(["", "", "", "", "", "", "", ""]); // Hàng 2 trống
      sheetDanhBa.appendRow(["1", "Tổ Hạ tầng Hòa Bình", "VNPT018451", "Nguyễn Tiến Thành", "29928", "Kỹ thuật viên", "thanhnt.hbh@vnpt.vn", "915225103"]);
      sheetDanhBa.appendRow(["2", "Tổ Hạ tầng Hòa Bình", "VNPT018452", "Trần Công Lộc", "27060", "Kỹ thuật viên", "loctc.hbh@vnpt.vn", "912664497"]);
      employees = [
        { id: "VNPT018451", name: "Nguyễn Tiến Thành", department: "Tổ Hạ tầng Hòa Bình" },
        { id: "VNPT018452", name: "Trần Công Lộc", department: "Tổ Hạ tầng Hòa Bình" }
      ];
    }
    
    // Lấy tham số tháng được chọn từ client (ví dụ: ?month=2026-07)
    var targetMonth = "";
    if (e && e.parameter && e.parameter.month) {
      targetMonth = String(e.parameter.month).trim();
    } else {
      var now = new Date();
      targetMonth = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM");
    }
    
    // Kiểm soát phạm vi bảo mật tên sheet
    if (!isValidSheetName(targetMonth)) {
      throw new Error("Tên trang tính yêu cầu không hợp lệ.");
    }
    
    // Xác định tên sheet cần đọc: 
    // Ưu tiên sheet có tên trùng với tháng (ví dụ: "2026-07"). Nếu không có, đọc sheet "chamcong" mặc định.
    var activeSheetName = SHEET_CHAM_CONG_THANG;
    var sheetChamCong = doc.getSheetByName(targetMonth);
    if (sheetChamCong) {
      activeSheetName = targetMonth;
    } else {
      sheetChamCong = doc.getSheetByName(SHEET_CHAM_CONG_THANG);
      if (!sheetChamCong) {
        // Khởi tạo sheet chamcong mặc định nếu chưa có
        sheetChamCong = doc.insertSheet(SHEET_CHAM_CONG_THANG);
        var initHeaders = ["STT", "mã nhân vien", "Họ tên", "tổ"];
        for (var d = 1; d <= 31; d++) {
          initHeaders.push(String(d));
        }
        initHeaders.push("Tổng công");
        initHeaders.push("Thời điểm");
        sheetChamCong.appendRow(initHeaders);
      }
    }
    
    // Đọc hàng tiêu đề và nâng cấp các cột Tổng công + Thời điểm nếu cần
    var lastCol = sheetChamCong.getLastColumn();
    var headers = sheetChamCong.getRange(1, 1, 1, lastCol).getValues()[0];
    var colIdx = getColumnIndexes(headers);
    
    var hasTotal = colIdx["Tổng công"] !== undefined;
    var hasTime = colIdx["Thời điểm"] !== undefined;
    
    if (!hasTotal || !hasTime) {
      if (!hasTotal) {
        sheetChamCong.getRange(1, lastCol + 1).setValue("Tổng công");
        lastCol++;
      }
      if (!hasTime) {
        sheetChamCong.getRange(1, lastCol + 1).setValue("Thời điểm");
      }
      // Đọc lại headers sau khi bổ sung
      headers = sheetChamCong.getRange(1, 1, 1, lastCol).getValues()[0];
      colIdx = getColumnIndexes(headers);
    }
    
    var data = sheetChamCong.getDataRange().getValues();
    var monthRecords = [];
    
    // Đọc tất cả các bản ghi chấm công từ Sheet hoạt động
    // Lưu ý: Đối với sheet mặc định "chamcong", do bảng của người dùng không có cột "Tháng",
    // chúng ta sẽ ngầm coi dữ liệu của sheet này thuộc về Month hiện tại để dễ tương tác.
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (row[colIdx["mã nhân vien"]]) {
        var rec = parseRowToRecord(row, targetMonth, headers, colIdx);
        monthRecords.push(rec);
      }
    }
    
    // Không tự động tạo sheet mới để tránh làm mất dữ liệu của tab mặc định 'chamcong'.
    // Người dùng chỉ cần làm việc trên tab mặc định hoặc tự tạo thêm các tab tháng khác trên Google Sheets.
    
    // 2. Đọc trạng thái Xác nhận của các tổ
    var sheetXacNhan = doc.getSheetByName(SHEET_XAC_NHAN);
    var confirmations = [];
    if (!sheetXacNhan) {
      // Khởi tạo sheet xacnhan nếu chưa có
      sheetXacNhan = doc.insertSheet(SHEET_XAC_NHAN);
      sheetXacNhan.appendRow(["STT", "Tổ", "Tháng", "đồng ý (không sửa)", "có sửa đổi", "Thời điểm xác nhận"]);
    }
    
    var confirmData = sheetXacNhan.getDataRange().getValues();
    for (var i = 1; i < confirmData.length; i++) {
      var cRow = confirmData[i];
      if (cRow.length < 6) continue;
      
      var cDept = String(cRow[1] || "").trim(); // Cột B: Tổ
      var cMonthRaw = String(cRow[2] || "").trim(); // Cột C: Tháng (định dạng "2026-07")
      
      // Hỗ trợ cả 2 định dạng: "2026-07" (mới) và "Tháng 07/2026" (cũ nếu có)
      var cMonth = cMonthRaw;
      if (/^Tháng\s+\d{2}\/\d{4}$/.test(cMonthRaw)) {
        cMonth = sheetMonthToClientMonth(cMonthRaw); // fallback cho dữ liệu cũ
      }
      
      var isAgree = String(cRow[3] || "").trim() !== ""; // Cột D: đồng ý (không sửa)
      var isModify = String(cRow[4] || "").trim() !== ""; // Cột E: có sửa đổi
      
      var cStatus = "";
      if (isAgree) {
        cStatus = "Không sửa";
      } else if (isModify) {
        cStatus = "Có sửa";
      }
      
      var cTime = cRow[5]; // Cột F: Thời điểm xác nhận
      
      if (cMonth === targetMonth) {
        var timeStr = "";
        if (cTime instanceof Date) {
          timeStr = Utilities.formatDate(cTime, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
        } else {
          timeStr = String(cTime || "");
        }
        confirmations.push({
          month: cMonth,
          department: cDept,
          status: cStatus,
          timestamp: timeStr
        });
      }
    }
    
    response = {
      success: true,
      month: targetMonth,
      sheetUsed: activeSheetName,
      employees: employees,
      records: monthRecords,
      confirmations: confirmations
    };
    
  } catch (error) {
    response = {
      success: false,
      message: error.toString()
    };
  }
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var response = {};
  try {
    var postData = JSON.parse(e.postData.contents);
    var action = postData.action || "save-cell";
    var targetMonth = String(postData.month).trim();
    
    // Kiểm soát phạm vi bảo mật tên sheet
    if (!isValidSheetName(targetMonth)) {
      throw new Error("Tên trang tính yêu cầu không hợp lệ.");
    }
    
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    
    // Xử lý lưu trạng thái xác nhận của tổ
    if (action === "save-confirmation") {
      var department = String(postData.department).trim();
      var status = String(postData.status).trim(); // "Không sửa" hoặc "Có sửa"
      
      if (status !== "Không sửa" && status !== "Có sửa") {
        throw new Error("Trạng thái xác nhận không hợp lệ.");
      }
      
      var sheetXacNhan = doc.getSheetByName(SHEET_XAC_NHAN);
      if (!sheetXacNhan) {
        sheetXacNhan = doc.insertSheet(SHEET_XAC_NHAN);
        sheetXacNhan.appendRow(["STT", "Tổ", "Tháng", "đồng ý (không sửa)", "có sửa đổi", "Thời điểm xác nhận"]);
      }
      
      var confirmData = sheetXacNhan.getDataRange().getValues();
      var targetRowIndex = -1;
      // Dùng trực tiếp targetMonth ("2026-07") để khớp với dữ liệu trong sheet xacnhan
      
      for (var i = 1; i < confirmData.length; i++) {
        var cDept = String(confirmData[i][1]).trim(); // Cột B: Tổ
        var cMonthRaw = String(confirmData[i][2]).trim(); // Cột C: Tháng
        if (cMonthRaw === targetMonth && cDept === department) {
          targetRowIndex = i + 1; // 1-based index
          break;
        }
      }
      
      var now = new Date();
      var valAgree = (status === "Không sửa") ? "x" : "";
      var valModify = (status === "Có sửa") ? "x" : "";
      
      if (targetRowIndex !== -1) {
        // Cập nhật dòng đã có
        sheetXacNhan.getRange(targetRowIndex, 4).setValue(valAgree); // Cột D (4)
        sheetXacNhan.getRange(targetRowIndex, 5).setValue(valModify); // Cột E (5)
        sheetXacNhan.getRange(targetRowIndex, 6).setValue(now); // Cột F (6)
      } else {
        // Tạo dòng mới
        var nextStt = 1;
        if (confirmData.length > 1) {
          var lastSttVal = Number(confirmData[confirmData.length - 1][0]);
          if (!isNaN(lastSttVal)) {
            nextStt = lastSttVal + 1;
          } else {
            nextStt = confirmData.length;
          }
        }
        sheetXacNhan.appendRow([nextStt, department, targetMonth, valAgree, valModify, now]);
      }
      
      response = {
        success: true,
        message: "Cập nhật xác nhận số liệu thành công!",
        month: targetMonth,
        department: department,
        status: status,
        timestamp: Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss")
      };
      
      return ContentService.createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var employeeId = String(postData.employeeId || "").trim();
    
    // Ưu tiên tìm sheet trùng tên tháng, nếu không có dùng sheet mặc định "chamcong"
    var sheetChamCong = doc.getSheetByName(targetMonth);
    if (!sheetChamCong) {
      sheetChamCong = doc.getSheetByName(SHEET_CHAM_CONG_THANG);
    }
    if (!sheetChamCong) {
      throw new Error("Không tìm thấy trang tính chấm công trên Google Sheets.");
    }
    
    var data = sheetChamCong.getDataRange().getValues();
    var headers = data[0];
    var colIdx = getColumnIndexes(headers);
    
    // Tìm dòng của nhân viên theo Mã nhân viên (Cột "mã nhân vien" index 1)
    var targetRowIndex = -1;
    var foundRow = null;
    for (var i = 1; i < data.length; i++) {
      var rowEmpId = String(data[i][colIdx["mã nhân vien"]]).trim();
      if (rowEmpId === employeeId) {
        targetRowIndex = i + 1; // 1-based index
        foundRow = data[i];
        break;
      }
    }
    
    if (targetRowIndex === -1) {
      throw new Error("Không tìm thấy dòng của nhân viên " + employeeId + " trên Google Sheets.");
    }
    
    if (action === "save-cell") {
      var day = Number(postData.day);
      var value = String(postData.value !== undefined ? postData.value : "").trim();
      
      if (day < 1 || day > 31) {
        throw new Error("Số ngày phải nằm trong khoảng 1-31.");
      }
      
      var colNum = colIdx[String(day)] + 1; // Cột ngày 1-31
      
      // 1. Cập nhật giá trị ô ngày
      sheetChamCong.getRange(targetRowIndex, colNum).setValue(value);
      
      // 2. Tính toán lại tổng công của dòng
      var rowRangeValues = sheetChamCong.getRange(targetRowIndex, 1, 1, headers.length).getValues()[0];
      rowRangeValues[colIdx[String(day)]] = value; // Cập nhật tạm để tính tổng công
      
      var totalWorkday = calculateTotalWorkdays(rowRangeValues, colIdx);
      
      // 3. Ghi tổng công và thời điểm cập nhật
      sheetChamCong.getRange(targetRowIndex, colIdx["Tổng công"] + 1).setValue(totalWorkday);
      sheetChamCong.getRange(targetRowIndex, colIdx["Thời điểm"] + 1).setValue(new Date());
      
      response = {
        success: true,
        message: "Cập nhật ô ngày công thành công!",
        employeeId: employeeId,
        day: day,
        value: value,
        total: totalWorkday
      };
      
    } else if (action === "save-row") {
      var daysArray = postData.days;
      if (!daysArray || daysArray.length !== 31) {
        throw new Error("Mảng ngày phải chứa đúng 31 phần tử.");
      }
      
      // Ghi đè cả dòng
      for (var d = 1; d <= 31; d++) {
        var val = String(daysArray[d - 1] !== undefined ? daysArray[d - 1] : "").trim();
        sheetChamCong.getRange(targetRowIndex, colIdx[String(d)] + 1).setValue(val);
        foundRow[colIdx[String(d)]] = val;
      }
      
      var totalWorkday = calculateTotalWorkdays(foundRow, colIdx);
      sheetChamCong.getRange(targetRowIndex, colIdx["Tổng công"] + 1).setValue(totalWorkday);
      sheetChamCong.getRange(targetRowIndex, colIdx["Thời điểm"] + 1).setValue(new Date());
      
      response = {
        success: true,
        message: "Cập nhật hàng ngày công thành công!",
        total: totalWorkday
      };
    } else {
      throw new Error("Hành động không hợp lệ.");
    }
    
  } catch (error) {
    response = {
      success: false,
      message: error.toString()
    };
  }
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// Hàm xử lý tất cả các hành động ghi dữ liệu qua GET để tránh lỗi CORS redirect
function handleAction(params) {
  var response = {};
  try {
    var action = String(params.action || "").trim();
    var targetMonth = String(params.month || "").trim();
    
    if (!isValidSheetName(targetMonth)) {
      throw new Error("Tên trang tính yêu cầu không hợp lệ.");
    }
    
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    
    // --- Xử lý Xác nhận số liệu ---
    if (action === "save-confirmation") {
      var department = String(params.department || "").trim();
      var status = String(params.status || "").trim();
      
      if (status !== "Không sửa" && status !== "Có sửa") {
        throw new Error("Trạng thái xác nhận không hợp lệ.");
      }
      
      var sheetXacNhan = doc.getSheetByName(SHEET_XAC_NHAN);
      if (!sheetXacNhan) {
        sheetXacNhan = doc.insertSheet(SHEET_XAC_NHAN);
        sheetXacNhan.appendRow(["STT", "Tổ", "Tháng", "đồng ý (không sửa)", "có sửa đổi", "Thời điểm xác nhận"]);
      }
      
      var confirmData = sheetXacNhan.getDataRange().getValues();
      var targetRowIndex = -1;
      // Dùng trực tiếp targetMonth ("2026-07") để khớp với dữ liệu trong sheet
      
      for (var i = 1; i < confirmData.length; i++) {
        var cDept = String(confirmData[i][1]).trim();
        var cMonthRaw = String(confirmData[i][2]).trim();
        if (cMonthRaw === targetMonth && cDept === department) {
          targetRowIndex = i + 1;
          break;
        }
      }
      
      var now = new Date();
      var valAgree = (status === "Không sửa") ? "x" : "";
      var valModify = (status === "Có sửa") ? "x" : "";
      
      if (targetRowIndex !== -1) {
        sheetXacNhan.getRange(targetRowIndex, 4).setValue(valAgree);
        sheetXacNhan.getRange(targetRowIndex, 5).setValue(valModify);
        sheetXacNhan.getRange(targetRowIndex, 6).setValue(now);
      } else {
        var nextStt = confirmData.length; // số dòng sau header = STT mới
        sheetXacNhan.appendRow([nextStt, department, targetMonth, valAgree, valModify, now]);
      }
      
      response = {
        success: true,
        message: "Cập nhật xác nhận số liệu thành công!",
        month: targetMonth,
        department: department,
        status: status,
        timestamp: Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss")
      };
      
      return ContentService.createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // --- Xử lý lưu ô chấm công (save-cell) ---
    if (action === "save-cell") {
      var employeeId = String(params.employeeId || "").trim();
      var day = Number(params.day);
      var value = String(params.value !== undefined ? params.value : "").trim();
      
      if (!employeeId) throw new Error("Thiếu mã nhân viên.");
      if (day < 1 || day > 31) throw new Error("Số ngày phải nằm trong khoảng 1-31.");
      
      var sheetChamCong = doc.getSheetByName(targetMonth) || doc.getSheetByName(SHEET_CHAM_CONG_THANG);
      if (!sheetChamCong) throw new Error("Không tìm thấy trang tính chấm công.");
      
      var data = sheetChamCong.getDataRange().getValues();
      var headers = data[0];
      var colIdx = getColumnIndexes(headers);
      var targetRowIndex = -1;
      var foundRow = null;
      
      for (var i = 1; i < data.length; i++) {
        if (String(data[i][colIdx["mã nhân vien"]]).trim() === employeeId) {
          targetRowIndex = i + 1;
          foundRow = data[i];
          break;
        }
      }
      if (targetRowIndex === -1) throw new Error("Không tìm thấy nhân viên " + employeeId);
      
      var colNum = colIdx[String(day)] + 1;
      sheetChamCong.getRange(targetRowIndex, colNum).setValue(value);
      
      var rowVals = sheetChamCong.getRange(targetRowIndex, 1, 1, headers.length).getValues()[0];
      rowVals[colIdx[String(day)]] = value;
      var totalWorkday = calculateTotalWorkdays(rowVals, colIdx);
      sheetChamCong.getRange(targetRowIndex, colIdx["Tổng công"] + 1).setValue(totalWorkday);
      sheetChamCong.getRange(targetRowIndex, colIdx["Thời điểm"] + 1).setValue(new Date());
      
      response = { success: true, message: "Cập nhật ô thành công!", employeeId: employeeId, day: day, value: value, total: totalWorkday };
      return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
    }
    
    // --- Xử lý lưu cả dòng (save-row) ---
    if (action === "save-row") {
      var employeeId = String(params.employeeId || "").trim();
      var daysJson = String(params.days || "[]");
      var daysArray = JSON.parse(daysJson);
      
      if (!employeeId) throw new Error("Thiếu mã nhân viên.");
      if (!daysArray || daysArray.length !== 31) throw new Error("Mảng ngày phải chứa đúng 31 phần tử.");
      
      var sheetChamCong = doc.getSheetByName(targetMonth) || doc.getSheetByName(SHEET_CHAM_CONG_THANG);
      if (!sheetChamCong) throw new Error("Không tìm thấy trang tính chấm công.");
      
      var data = sheetChamCong.getDataRange().getValues();
      var headers = data[0];
      var colIdx = getColumnIndexes(headers);
      var targetRowIndex = -1;
      var foundRow = null;
      
      for (var i = 1; i < data.length; i++) {
        if (String(data[i][colIdx["mã nhân vien"]]).trim() === employeeId) {
          targetRowIndex = i + 1;
          foundRow = data[i];
          break;
        }
      }
      if (targetRowIndex === -1) throw new Error("Không tìm thấy nhân viên " + employeeId);
      
      for (var d = 1; d <= 31; d++) {
        var val = String(daysArray[d - 1] !== undefined ? daysArray[d - 1] : "").trim();
        sheetChamCong.getRange(targetRowIndex, colIdx[String(d)] + 1).setValue(val);
        foundRow[colIdx[String(d)]] = val;
      }
      var totalWorkday = calculateTotalWorkdays(foundRow, colIdx);
      sheetChamCong.getRange(targetRowIndex, colIdx["Tổng công"] + 1).setValue(totalWorkday);
      sheetChamCong.getRange(targetRowIndex, colIdx["Thời điểm"] + 1).setValue(new Date());
      
      response = { success: true, message: "Cập nhật hàng thành công!", total: totalWorkday };
      return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
    }
    
    throw new Error("Hành động không hợp lệ: " + action);
    
  } catch (err) {
    response = { success: false, message: err.toString() };
    return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
  }
}


function getColumnIndexes(headers) {
  var idx = {};
  for (var i = 0; i < headers.length; i++) {
    idx[String(headers[i]).trim()] = i;
  }
  return idx;
}

// Helper: Chuyển dữ liệu dòng Excel thành Object JSON
function parseRowToRecord(row, month, headers, colIdx) {
  var rec = {};
  rec["Tháng"] = month;
  rec["Mã nhân viên"] = String(row[colIdx["mã nhân vien"]]).trim();
  rec["Tên nhân viên"] = String(row[colIdx["Họ tên"]]).trim();
  rec["Tổ"] = String(row[colIdx["tổ"]] || "").trim();
  
  rec["Ngày"] = [];
  for (var d = 1; d <= 31; d++) {
    rec["Ngày"].push(String(row[colIdx[String(d)]] || "").trim());
  }
  
  rec["Tổng công"] = calculateTotalWorkdays(row, colIdx);
  
  var timeVal = row[colIdx["Thời điểm"]];
  if (timeVal instanceof Date) {
    rec["Thời điểm"] = Utilities.formatDate(timeVal, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
  } else {
    rec["Thời điểm"] = String(timeVal || "");
  }
  
  return rec;
}

// Helper: Tính toán tổng ngày công dựa theo hệ số quy định
function calculateTotalWorkdays(row, colIdx) {
  var sum = 0.0;
  for (var d = 1; d <= 31; d++) {
    var val = String(row[colIdx[String(d)]] || "").trim().toUpperCase();
    if (!val) continue;
    
    // Quy đổi hệ số công thực tế
    if (val === "X" || val === "X2" || val === "X3" || val === "X4" || val === "TC" || val === "RN") {
      sum += 1.0;
    } else if (val === "X/F" || val === "F/X" || val === "X/P" || val === "H1") {
      sum += 0.5;
    } else if (val === "V") {
      sum += 0.25; // vắng mặt tính 2h làm việc = 2/8 = 0.25 công
    }
    // Các ký hiệu F (Phép), NB (Nghỉ bù), O (Ốm), Ro (Không lương)... không được tính vào tổng ngày công thực tế (cộng thêm 0.0)
  }
  return sum;
}

// Helper: Chuyển đổi định dạng tháng từ Client sang Google Sheets (ví dụ: "2026-06" -> "Tháng 06/2026")
function clientMonthToSheetMonth(m) {
  if (!m) return "";
  var parts = m.split("-");
  if (parts.length !== 2) return m;
  return "Tháng " + parts[1] + "/" + parts[0];
}

// Helper: Chuyển đổi định dạng tháng từ Google Sheets sang Client (ví dụ: "Tháng 06/2026" -> "2026-06")
function sheetMonthToClientMonth(sm) {
  if (!sm) return "";
  var match = sm.match(/Tháng\s+(\d{2})\/(\d{4})/);
  if (match) {
    return match[2] + "-" + match[1];
  }
  return sm;
}

