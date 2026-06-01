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

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheets()[0];
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
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
          if (lowerH.includes("họ và tên") || lowerH.includes("ho va ten") || lowerH.includes("họ tên") || lowerH.includes("ho ten") || lowerH.includes("tên nhân viên") || lowerH.includes("ten nhan vien") || lowerH.includes("tên nhân viên") || lowerH.includes("tên")) {
            colTenNV = i;
          }
          if (lowerH.includes("bộ phận") || lowerH.includes("bo phan") || lowerH.includes("tổ") || lowerH.includes("to") || lowerH.includes("phòng") || lowerH.includes("phong") || lowerH.includes("bộ phận")) {
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
      return createJsonResponse({ status: "success", headers: [], data: [], employees: employees });
    }
    
    const headers = values[0].map(h => h.toString().trim());
    const data = [];
    
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const rowData = {};
      
      // Bỏ qua dòng trống
      if (!row[2] && !row[3]) continue; 
      
      headers.forEach((header, index) => {
        let val = row[index];
        // Xử lý định dạng ngày tháng
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
      employees: employees
    });
  } catch (error) {
    return createJsonResponse({ status: "error", message: error.toString() });
  }
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    let payload;
    
    if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else {
      payload = e.parameter;
    }
    
    const action = payload.action || "add";
    
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
      if (colStt === -1) {
        return createJsonResponse({ status: "error", message: "Không tìm thấy cột STT trên bảng tính." });
      }
      
      for (let i = 1; i < values.length; i++) {
        if (parseInt(values[i][colStt]) === sttToDelete) {
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
