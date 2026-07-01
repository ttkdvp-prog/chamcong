/**
 * GOOGLE APPS SCRIPT BACKEND
 * 
 * Hướng dẫn sử dụng:
 * 1. Mở tệp Google Sheets của bạn.
 * 2. Vào Tiện ích mở rộng (Extensions) > Apps Script.
 * 3. Xóa mọi mã nguồn hiện có và dán toàn bộ mã này vào.
 * 4. Nhấn nút Lưu (biểu tượng thẻ nhớ).
 * 5. Nhấn nút "Triển khai" (Deploy) > "Triển khai mới" (New deployment).
 * 6. Chọn Loại cấu hình: "Ứng dụng web" (Web app).
 * 7. Cấu hình triển khai:
 *    - Mô tả: API Dashboard Khen thưởng
 *    - Thực thi dưới danh nghĩa: "Tôi" (Me)
 *    - Ai có quyền truy cập: "Mọi người" (Anyone)
 * 8. Nhấn "Triển khai" (Deploy), cấp quyền truy cập nếu được yêu cầu.
 * 9. Sao chép "URL ứng dụng web" (Web app URL) và dán vào tệp `app.js` của Dashboard.
 */

// ==========================================
// CẤU HÌNH KHÓA THÁNG & BẢO MẬT ADMIN
// ==========================================

function getConfig(ss) {
  let configSheet = ss.getSheetByName("config") || ss.getSheetByName("Config");
  if (!configSheet) {
    configSheet = ss.insertSheet("config");
    configSheet.appendRow(["Key", "Value"]);
    configSheet.appendRow(["locked_months", ""]);
    configSheet.appendRow(["admin_passcode", "vnpt_admin"]); // Mật khẩu mặc định là vnpt_admin
    SpreadsheetApp.flush();
  }
  
  const values = configSheet.getDataRange().getValues();
  const config = {};
  for (let i = 1; i < values.length; i++) {
    const key = values[i][0] ? values[i][0].toString().trim() : "";
    const val = values[i][1] ? values[i][1].toString().trim() : "";
    if (key) {
      config[key] = val;
    }
  }
  return config;
}

function saveConfig(ss, lockedMonths, passcode) {
  let configSheet = ss.getSheetByName("config") || ss.getSheetByName("Config");
  if (!configSheet) {
    configSheet = ss.insertSheet("config");
    configSheet.appendRow(["Key", "Value"]);
    configSheet.appendRow(["locked_months", ""]);
    configSheet.appendRow(["admin_passcode", "vnpt_admin"]);
    SpreadsheetApp.flush();
  }
  
  const range = configSheet.getDataRange();
  const values = range.getValues();
  
  let foundLockedMonths = false;
  let foundPasscode = false;
  
  for (let i = 1; i < values.length; i++) {
    const key = values[i][0] ? values[i][0].toString().trim() : "";
    if (key === "locked_months") {
      configSheet.getRange(i + 1, 2).setValue(lockedMonths);
      foundLockedMonths = true;
    }
    if (key === "admin_passcode") {
      configSheet.getRange(i + 1, 2).setValue(passcode);
      foundPasscode = true;
    }
  }
  
  if (!foundLockedMonths) {
    configSheet.appendRow(["locked_months", lockedMonths]);
  }
  if (!foundPasscode) {
    configSheet.appendRow(["admin_passcode", passcode]);
  }
  SpreadsheetApp.flush();
}

function isMonthLocked(month, lockedMonthsStr) {
  if (!lockedMonthsStr) return false;
  const lockedList = lockedMonthsStr.toString().split(",").map(m => m.trim());
  return lockedList.indexOf(month.toString().trim()) !== -1;
}

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Tìm sheet dữ liệu chính (bỏ qua config và danh bạ)
    let sheet = ss.getSheets().find(s => {
      const name = s.getName().toLowerCase();
      return name !== "config" && name !== "danhba" && name !== "danh bạ" && name !== "danh ba";
    }) || ss.getSheets()[0];
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();

    // Tải cấu hình khóa tháng & bảo mật Admin
    const config = getConfig(ss);
    const providedPasscode = (e && e.parameter && e.parameter.passcode) ? e.parameter.passcode.toString().trim() : "";
    const isAdmin = (providedPasscode === config.admin_passcode);

    // Tự động kiểm tra và đọc sheet danh bạ nếu tồn tại để làm autocomplete
    let employees = [];
    const dbSheet = ss.getSheetByName("danhba") || ss.getSheetByName("Danh bạ") || ss.getSheetByName("danh ba");
    if (dbSheet) {
      const dbValues = dbSheet.getDataRange().getValues();
      if (dbValues.length > 1) {
        // Dọn dẹp tiêu đề cột và loại bỏ khoảng trắng thừa
        const dbHeaders = dbValues[0].map(h => h.toString().trim().replace(/\s+/g, ' '));

        let colMaNV = -1;
        let colTenNV = -1;
        let colTo = -1;

        dbHeaders.forEach((h, i) => {
          const lowerH = h.toLowerCase();
          if (lowerH.includes("mã nhân viên") || lowerH.includes("ma nhan vien") || lowerH.includes("manv") || lowerH.includes("mã nv")) {
            colMaNV = i;
          }
          if (lowerH.includes("họ và tên") || lowerH.includes("ho va ten") || lowerH.includes("họ tên") || lowerH.includes("ho ten") || lowerH.includes("tên nhân viên") || lowerH.includes("ten nhan vien") || lowerH.includes("tên")) {
            colTenNV = i;
          }
          if (lowerH.includes("bộ phận") || lowerH.includes("bo phan") || lowerH.includes("tổ") || lowerH.includes("to") || lowerH.includes("phòng") || lowerH.includes("phong")) {
            colTo = i;
          }
        });

        if (colMaNV !== -1 && colTenNV !== -1) {
          for (let i = 1; i < dbValues.length; i++) {
            const r = dbValues[i];
            const maNV = r[colMaNV] ? r[colMaNV].toString().trim() : "";
            const tenNV = r[colTenNV] ? r[colTenNV].toString().trim() : "";
            const to = colTo !== -1 && r[colTo] ? r[colTo].toString().trim() : "";

            if (maNV && tenNV) {
              employees.push({
                maNV: maNV,
                tenNV: tenNV,
                to: to
              });
            }
          }
        }
      }
    }

    if (values.length <= 1) {
      return createJsonResponse({
        status: "success",
        headers: [],
        data: [],
        employees: employees,
        config: {
          lockedMonths: config.locked_months || "",
          isAdmin: isAdmin
        }
      });
    }

    const headers = values[0].map(h => h.toString().trim());
    const colStt = headers.indexOf("STT");
    if (colStt !== -1) {
      let maxStt = 0;
      for (let i = 1; i < values.length; i++) {
        const sttVal = parseInt(values[i][colStt]);
        if (!isNaN(sttVal) && sttVal > maxStt) {
          maxStt = sttVal;
        }
      }
      let hasChange = false;
      for (let i = 1; i < values.length; i++) {
        const row = values[i];
        if (!row[colStt + 1] && !row[colStt + 2] && !row[colStt + 3]) continue;
        
        const sttVal = parseInt(row[colStt]);
        if (isNaN(sttVal) || row[colStt] === "") {
          maxStt++;
          sheet.getRange(i + 1, colStt + 1).setValue(maxStt);
          values[i][colStt] = maxStt;
          hasChange = true;
        }
      }
      if (hasChange) {
        SpreadsheetApp.flush();
      }
    }

    const data = [];

    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const rowData = {};

      if (!row[2] && !row[3]) continue;

      headers.forEach((header, index) => {
        let val = row[index];
        if (val instanceof Date) {
          val = Utilities.formatDate(val, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
        }
        rowData[header] = val;
      });
      data.push(rowData);
    }

    return createJsonResponse({
      status: "success",
      headers: headers,
      data: data,
      employees: employees,
      config: {
        lockedMonths: config.locked_months || "",
        isAdmin: isAdmin
      }
    });
  } catch (error) {
    return createJsonResponse({ status: "error", message: error.toString() });
  }
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Tìm sheet dữ liệu chính (bỏ qua config và danh bạ)
    let sheet = ss.getSheets().find(s => {
      const name = s.getName().toLowerCase();
      return name !== "config" && name !== "danhba" && name !== "danh bạ" && name !== "danh ba";
    }) || ss.getSheets()[0];

    console.log("doPost received request. Contents: " + (e.postData ? e.postData.contents : "No contents"));
    
    // Tự động kiểm tra và gán số STT tự động cho các dòng bị thiếu trước khi thực hiện bất kỳ hành động nào
    const tempValues = sheet.getDataRange().getValues();
    if (tempValues.length > 1) {
      const tempHeaders = tempValues[0].map(h => h.toString().trim());
      const tempColStt = tempHeaders.indexOf("STT");
      if (tempColStt !== -1) {
        let maxStt = 0;
        for (let i = 1; i < tempValues.length; i++) {
          const sttVal = parseInt(tempValues[i][tempColStt]);
          if (!isNaN(sttVal) && sttVal > maxStt) {
            maxStt = sttVal;
          }
        }
        let hasChange = false;
        for (let i = 1; i < tempValues.length; i++) {
          const row = tempValues[i];
          if (!row[tempColStt + 1] && !row[tempColStt + 2] && !row[tempColStt + 3]) continue;
          
          const sttVal = parseInt(row[tempColStt]);
          if (isNaN(sttVal) || row[tempColStt] === "") {
            maxStt++;
            sheet.getRange(i + 1, tempColStt + 1).setValue(maxStt);
            hasChange = true;
          }
        }
        if (hasChange) {
          SpreadsheetApp.flush();
        }
      }
    }

    let payload;
    if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else {
      payload = e.parameter;
    }

    const action = payload.action || "add";
    console.log("Parsed action: " + action + ", payload: " + JSON.stringify(payload));

    // Đọc cấu hình khóa tháng & bảo mật Admin
    const config = getConfig(ss);
    const providedPasscode = payload.passcode ? payload.passcode.toString().trim() : "";
    const isAdmin = (providedPasscode === config.admin_passcode);

    // XỬ LÝ LƯU CẤU HÌNH HỆ THỐNG
    if (action === "save_config") {
      if (!isAdmin) {
        return createJsonResponse({ status: "error", message: "Mã bảo mật Admin không chính xác!" });
      }
      const newLockedMonths = payload.lockedMonths ? payload.lockedMonths.toString().trim() : "";
      const newPasscode = payload.newPasscode ? payload.newPasscode.toString().trim() : config.admin_passcode;
      saveConfig(ss, newLockedMonths, newPasscode);
      return createJsonResponse({ status: "success", message: "Đã cập nhật cấu hình bảo mật thành công!" });
    }

    // THAO TÁC XÓA BẢN GHI
    if (action === "delete") {
      const sttToDelete = parseInt(payload.stt);
      if (isNaN(sttToDelete)) {
        return createJsonResponse({ status: "error", message: "Thiếu thông tin STT cần xóa." });
      }

      const values = sheet.getDataRange().getValues();
      if (values.length <= 1) {
        return createJsonResponse({ status: "error", message: "Bảng tính không có dữ liệu để xóa." });
      }

      const headers = values[0].map(h => h.toString().trim());
      const colStt = headers.indexOf("STT");
      const colThang = headers.indexOf("Tháng");
      if (colStt === -1) {
        return createJsonResponse({ status: "error", message: "Không tìm thấy cột STT trên bảng tính." });
      }

      for (let i = 1; i < values.length; i++) {
        if (parseInt(values[i][colStt]) === sttToDelete) {
          const recordMonth = colThang !== -1 ? values[i][colThang].toString().trim() : "";
          if (recordMonth && isMonthLocked(recordMonth, config.locked_months) && !isAdmin) {
            return createJsonResponse({ status: "error", message: "Tháng " + recordMonth + " đã được chốt và khóa! Chỉ Admin mới có quyền xóa." });
          }
          sheet.deleteRow(i + 1); // Trình tự dòng là 1-indexed, headers là dòng 1, dòng i tương ứng i+1
          return createJsonResponse({ status: "success", message: "Đã xóa bản ghi thành công!" });
        }
      }
      return createJsonResponse({ status: "error", message: "Không tìm thấy bản ghi có STT = " + sttToDelete });
    }

    // THAO TÁC SỬA BẢN GHI
    if (action === "edit") {
      const sttToEdit = parseInt(payload.stt);
      if (isNaN(sttToEdit)) {
        return createJsonResponse({ status: "error", message: "Thiếu thông tin STT cần sửa." });
      }

      const values = sheet.getDataRange().getValues();
      if (values.length <= 1) {
        return createJsonResponse({ status: "error", message: "Bảng tính không có dữ liệu để chỉnh sửa." });
      }

      const headers = values[0].map(h => h.toString().trim());
      const colIndexMap = {};
      headers.forEach((h, i) => {
        colIndexMap[h] = i;
      });

      if (colIndexMap["STT"] === undefined) {
        return createJsonResponse({ status: "error", message: "Không tìm thấy cột STT trên bảng tính." });
      }

      let targetRowIndex = -1;
      for (let i = 1; i < values.length; i++) {
        if (parseInt(values[i][colIndexMap["STT"]]) === sttToEdit) {
          targetRowIndex = i + 1; // 1-indexed row index
          break;
        }
      }

      if (targetRowIndex === -1) {
        return createJsonResponse({ status: "error", message: "Không tìm thấy bản ghi có STT = " + sttToEdit });
      }

      // Kiểm tra khóa tháng (cho cả tháng cũ của bản ghi và tháng mới muốn cập nhật)
      const oldRowValues = values[targetRowIndex - 1];
      const recordMonthOld = colIndexMap["Tháng"] !== undefined ? oldRowValues[colIndexMap["Tháng"]].toString().trim() : "";
      const recordMonthNew = payload.thang ? payload.thang.toString().trim() : recordMonthOld;
      
      if (recordMonthOld && isMonthLocked(recordMonthOld, config.locked_months) && !isAdmin) {
        return createJsonResponse({ status: "error", message: "Bản ghi thuộc tháng " + recordMonthOld + " đã được chốt và khóa! Chỉ Admin mới có quyền chỉnh sửa." });
      }
      if (recordMonthNew && isMonthLocked(recordMonthNew, config.locked_months) && !isAdmin) {
        return createJsonResponse({ status: "error", message: "Tháng đích " + recordMonthNew + " đã được chốt và khóa! Chỉ Admin mới có quyền lưu bản ghi vào tháng này." });
      }

      // Tiến hành cập nhật các trường
      if (payload.thang !== undefined && colIndexMap["Tháng"] !== undefined) {
        sheet.getRange(targetRowIndex, colIndexMap["Tháng"] + 1).setValue(payload.thang);
      }
      if (payload.diem !== undefined && colIndexMap["Điểm khuyến khích"] !== undefined) {
        const score = parseFloat(payload.diem) || 0;
        sheet.getRange(targetRowIndex, colIndexMap["Điểm khuyến khích"] + 1).setValue(score);
        if (colIndexMap["Tiền thưởng"] !== undefined) {
          sheet.getRange(targetRowIndex, colIndexMap["Tiền thưởng"] + 1).setValue(score * 5000);
        }
      }
      if (payload.lyDo !== undefined && colIndexMap["Lý do"] !== undefined) {
        sheet.getRange(targetRowIndex, colIndexMap["Lý do"] + 1).setValue(payload.lyDo);
      }
      if (colIndexMap["Thời điểm"] !== undefined) {
        sheet.getRange(targetRowIndex, colIndexMap["Thời điểm"] + 1).setValue(payload.timestamp || getFormattedTimestamp());
      }

      return createJsonResponse({
        status: "success",
        message: "Cập nhật bản ghi thành công!",
        data: {
          stt: sttToEdit,
          tienThuong: (parseFloat(payload.diem) || 0) * 5000
        }
      });
    }

    // MẶC ĐỊNH: THÊM MỚI BẢN GHI (ADD)
    if (!payload.maNV || !payload.tenNV) {
      return createJsonResponse({ status: "error", message: "Thiếu thông tin Mã nhân viên hoặc Tên nhân viên." });
    }

    const targetMonth = payload.thang ? payload.thang.toString().trim() : getFormattedCurrentMonth();
    if (targetMonth && isMonthLocked(targetMonth, config.locked_months) && !isAdmin) {
      return createJsonResponse({ status: "error", message: "Tháng " + targetMonth + " đã được chốt và khóa! Chỉ Admin mới có quyền thêm mới bản ghi vào tháng này." });
    }

    const values = sheet.getDataRange().getValues();
    const headers = values[0].map(h => h.toString().trim());

    // Đảm bảo có các cột chuẩn. Nếu chưa có cột "Thời điểm", tự động tạo thêm.
    let colIndexMap = {};
    headers.forEach((h, i) => {
      colIndexMap[h] = i;
    });

    const requiredHeaders = ["STT", "Tháng", "Mã nhân viên", "Tên Nhân viên", "Tổ", "Điểm khuyến khích", "Tiền thưởng", "Lý do", "Thời điểm"];

    // Kiểm tra xem có cột nào bị thiếu không để mở rộng sheet
    let updatedHeaders = [...headers];
    let sheetHeaderModified = false;

    requiredHeaders.forEach(reqH => {
      if (colIndexMap[reqH] === undefined) {
        sheet.getRange(1, updatedHeaders.length + 1).setValue(reqH);
        colIndexMap[reqH] = updatedHeaders.length;
        updatedHeaders.push(reqH);
        sheetHeaderModified = true;
      }
    });

    // Tính toán số thứ tự (STT) kế tiếp
    let nextStt = 1;
    if (values.length > 1) {
      // Tìm STT lớn nhất ở cột đầu tiên
      let maxStt = 0;
      for (let i = 1; i < values.length; i++) {
        let sttVal = parseInt(values[i][colIndexMap["STT"]]);
        if (!isNaN(sttVal) && sttVal > maxStt) {
          maxStt = sttVal;
        }
      }
      nextStt = maxStt + 1;
    }

    // Tạo mảng dữ liệu dòng mới khớp với các tiêu đề cột
    const newRow = new Array(updatedHeaders.length).fill("");

    newRow[colIndexMap["STT"]] = nextStt;
    newRow[colIndexMap["Tháng"]] = payload.thang || getFormattedCurrentMonth();
    newRow[colIndexMap["Mã nhân viên"]] = payload.maNV;
    newRow[colIndexMap["Tên Nhân viên"]] = payload.tenNV;
    newRow[colIndexMap["Tổ"]] = payload.to || "";
    newRow[colIndexMap["Điểm khuyến khích"]] = parseFloat(payload.diem) || 0;

    // Tiền thưởng = Điểm * 5,000. Apps script sẽ ghi nhận giá trị số để Excel có thể cộng trừ nhân chia
    newRow[colIndexMap["Tiền thưởng"]] = (parseFloat(payload.diem) || 0) * 5000;
    newRow[colIndexMap["Lý do"]] = payload.lyDo || "";

    if (colIndexMap["Thời điểm"] !== undefined) {
      newRow[colIndexMap["Thời điểm"]] = payload.timestamp || getFormattedTimestamp();
    }

    // Ghi dòng mới vào cuối bảng
    sheet.appendRow(newRow);

    // Định dạng tiền tệ cho cột Tiền thưởng
    const moneyColLetter = getColumnLetter(colIndexMap["Tiền thưởng"] + 1);
    const lastRowIndex = sheet.getLastRow();
    sheet.getRange(moneyColLetter + lastRowIndex).setNumberFormat("#,##0");

    return createJsonResponse({
      status: "success",
      message: "Lưu điểm khuyến khích thành công!",
      data: {
        stt: nextStt,
        maNV: payload.maNV,
        tenNV: payload.tenNV,
        tienThuong: (parseFloat(payload.diem) || 0) * 5000
      }
    });
  } catch (error) {
    return createJsonResponse({ status: "error", message: error.toString() });
  }
}

// Xử lý OPTIONS request hỗ trợ CORS cho gọi API phức tạp nếu có
function doOptions(e) {
  return HtmlService.createHtmlOutput()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setContent('CORS OK');
}

// Hàm bổ trợ đóng gói phản hồi JSON với đầy đủ Header CORS
function createJsonResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// Lấy định dạng tháng mặc định (Ví dụ: "52026" cho tháng 5 năm 2026 giống trong dữ liệu gốc hoặc dạng "5/2026")
function getFormattedCurrentMonth() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  // Trả về định dạng giống sheet gốc của bạn (Ví dụ: 52026 cho tháng 5/2026)
  return month + "" + year;
}

// Lấy định dạng thời gian hiện tại
function getFormattedTimestamp() {
  const now = new Date();
  return Utilities.formatDate(now, Session.getScriptTimeZone() || "GMT+7", "yyyy-MM-dd HH:mm:ss");
}

// Đổi chỉ số cột (1, 2, 3...) thành chữ cái (A, B, C...)
function getColumnLetter(column) {
  let temp, letter = "";
  while (column > 0) {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}
