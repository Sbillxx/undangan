/**
 * =========================================================================
 * GOOGLE APPS SCRIPT - BACKEND UNDANGAN PERNIKAHAN HILMI & RIZKI
 * =========================================================================
 * 
 * CARA MEMASANG / MENGGUNAKAN:
 * 1. Buka Google Spreadsheet Anda (https://docs.google.com/spreadsheets).
 * 2. Buat 2 Tab / Sheet di spreadsheet tersebut:
 *    - Tab 1: Beri nama "RSVP"
 *      Header baris 1: | Timestamp | Nama | Nomor HP | Jumlah Tamu | Konfirmasi |
 *    - Tab 2: Beri nama "Ucapan"
 *      Header baris 1: | Timestamp | Nama | Kehadiran | Ucapan |
 * 3. Klik menu: Extensions (Ekstensi) > Apps Script.
 * 4. Hapus seluruh isi kode di editor Apps Script, lalu PASTE kode di bawah ini.
 * 5. Klik icon Save (Disket / Ctrl+S).
 * 6. Klik tombol "Deploy" (Terapkan) di pojok kanan atas > "New deployment" (Penerapan baru).
 * 7. Pilih tipe: "Web app" (Aplikasi web).
 * 8. Pengaturan:
 *    - Description: Undangan Hilmi & Rizki
 *    - Execute as: Me (email Anda)
 *    - Who has access: Anyone (Siapa saja)  <-- PENTING! Agar tamu bisa kirim data.
 * 9. Klik "Deploy". Jika diminta otorisasi izin akun Google, klik "Authorize access" > "Advanced" > "Go to ... (unsafe)".
 * 10. Salin URL Web App yang berakhiran "/exec", lalu pastikan URL tersebut dipasang pada variabel SCRIPT_URL di index.html.
 * =========================================================================
 */

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = (e && e.parameter && e.parameter.sheet) || "Ucapan";
    var sheet = ss.getSheetByName(sheetName) || ss.getSheets()[0];
    var rows = sheet.getDataRange().getValues();
    
    var data = [];
    // Baris pertama (index 0) adalah judul kolom/header
    // Baca dari baris terbaru ke terlama (urutan terbalik)
    for (var i = rows.length - 1; i >= 1; i--) {
      var r = rows[i];
      if (!r[0] && !r[1]) continue; // Lewati baris kosong
      
      if (sheetName === "RSVP") {
        data.push({
          timestamp: r[0],
          name: r[1],
          phone: r[2],
          guests: r[3],
          attend: r[4]
        });
      } else {
        data.push({
          timestamp: r[0],
          name: r[1],
          presence: r[2] || "Datang",
          comment: r[3]
        });
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      sheet: sheetName,
      data: data
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var contents = {};
    if (e && e.postData && e.postData.contents) {
      contents = JSON.parse(e.postData.contents);
    }
    
    var now = Utilities.formatDate(new Date(), "Asia/Jakarta", "dd MMM yyyy, HH:mm");
    
    // Cek apakah data ini untuk RSVP atau Ucapan
    var isRSVP = contents.type === "rsvp" || contents.action === "rsvp";
    
    if (isRSVP) {
      // 1. Simpan ke sheet "RSVP"
      var rsvpSheet = ss.getSheetByName("RSVP");
      if (!rsvpSheet) {
        rsvpSheet = ss.insertSheet("RSVP");
        rsvpSheet.appendRow(["Timestamp", "Nama", "Nomor HP", "Jumlah Tamu", "Konfirmasi"]);
      }
      rsvpSheet.appendRow([
        now,
        contents.name || "Tamu",
        contents.phone || "-",
        contents.guests || "1",
        contents.attend || contents.presence || "Datang"
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Konfirmasi RSVP berhasil disimpan!"
      })).setMimeType(ContentService.MimeType.JSON);
      
    } else {
      // 2. Simpan ke sheet "Ucapan"
      var wishSheet = ss.getSheetByName("Ucapan");
      if (!wishSheet) {
        wishSheet = ss.insertSheet("Ucapan");
        wishSheet.appendRow(["Timestamp", "Nama", "Kehadiran", "Ucapan"]);
      }
      wishSheet.appendRow([
        now,
        contents.name || "Tamu Undangan",
        contents.presence || "Datang",
        contents.comment || contents.message || ""
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Doa dan ucapan berhasil disimpan!"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
