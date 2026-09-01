import React, { useState, useEffect } from "react";
import { Search, Calendar, Users, Printer, FileSpreadsheet } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import { getAttendanceRecords, getStudents } from "../services/db";
import Toast from "../components/Toast";

export default function AdminDataAbsensi() {
  const [absensiList, setAbsensiList] = useState([]);
  const [siswaList, setSiswaList] = useState([]);
  const [toast, setToast] = useState({ message: "", type: "success" });
  
  // State untuk Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSiswa, setSelectedSiswa] = useState("semua");
  const [selectedDate, setSelectedDate] = useState("");

  const loadData = () => {
    const dataAbsensi = getAttendanceRecords() || [];
    const dataSiswa = getStudents() || [];
    setAbsensiList(dataAbsensi);
    setSiswaList(dataSiswa);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("attendance_updated", handleUpdate);
    window.addEventListener("users_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("attendance_updated", handleUpdate);
      window.removeEventListener("users_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);


  // Logika Filter Data Absensi
  const filteredAbsensi = absensiList.filter((item) => {
    // 1. Filter Pencarian Nama / Keterangan
    const matchQuery =
      (item.namaSiswa && item.namaSiswa.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.ketMasuk && item.ketMasuk.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.ketPulang && item.ketPulang.toLowerCase().includes(searchQuery.toLowerCase()));

    // 2. Filter Pilih Siswa
    const matchSiswa = selectedSiswa === "semua" || item.studentId === Number(selectedSiswa) || item.studentId === selectedSiswa;

    // 3. Filter Tanggal
    const matchDate = !selectedDate || item.tanggal === selectedDate;

    return matchQuery && matchSiswa && matchDate;
  });

  // FUNGSI 1: Cetak & Export PDF
  const handleExportPDF = () => {
    if (filteredAbsensi.length === 0) {
      setToast({ message: "Tidak ada data absensi untuk diekspor!", type: "error" });
      return;
    }

    // Initialize jsPDF (Format A4 Portrait)
    const doc = new jsPDF("p", "mm", "a4");

    // Header / Kop Dokumen
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42); // Warna Dark Slate
    doc.text("LAPORAN ABSENSI SISWA MAGANG", 14, 18);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Warna Grey
    doc.text("PT. MULTI POWER ABADI", 14, 24);
    doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString("id-ID")}`, 14, 29);

    // Garis Pemisah
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 33, 196, 33);

    // Menyiapkan Data Tabel untuk PDF
    const tableData = filteredAbsensi.map((item, index) => [
      index + 1,
      item.tanggal || "-",
      item.namaSiswa || "-",
      item.jamMasuk || "-",
      item.ketMasuk || item.keterangan || "-",
      item.jamPulang || "-",
      item.ketPulang || item.keteranganPulang || "-",
      item.status || "Hadir"
    ]);

    // Membuat Tabel PDF dengan AutoTable
    const tableOptions = {
      startY: 37,
      head: [
        [
          "No",
          "Tanggal",
          "Nama Siswa",
          "Jam Masuk",
          "Ket. Masuk",
          "Jam Pulang",
          "Ket. Pulang",
          "Status"
        ]
      ],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [220, 38, 38], // Warna Merah (#dc2626) sesuai tema aplikasi
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [51, 65, 85]
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252] // Warna belang tipis (#f8fafc)
      }
    };

    if (typeof autoTable === "function") {
      autoTable(doc, tableOptions);
    } else if (typeof doc.autoTable === "function") {
      doc.autoTable(tableOptions);
    }

    // Simpan File PDF
    doc.save(`Laporan_Absensi_Magang_${new Date().toISOString().slice(0, 10)}.pdf`);
    setToast({ message: "Berhasil mengunduh Laporan PDF!", type: "success" });
  };

  // FUNGSI 2: Ekspor Data ke Excel (.xlsx) Sangat Rapi, Bergaris & Berwarna Profesional
  const handleExportExcel = async () => {
    if (filteredAbsensi.length === 0) {
      setToast({ message: "Tidak ada data absensi untuk diekspor!", type: "error" });
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "PT. MULTI POWER ABADI";
      workbook.created = new Date();

      const worksheet = workbook.addWorksheet("Data Absensi", {
        views: [{ showGridLines: true }]
      });

      // 1. Atur Lebar Kolom
      worksheet.columns = [
        { key: "no", width: 7 },
        { key: "tanggal", width: 15 },
        { key: "namaSiswa", width: 34 },
        { key: "jamMasuk", width: 14 },
        { key: "ketMasuk", width: 34 },
        { key: "jamPulang", width: 14 },
        { key: "ketPulang", width: 34 },
        { key: "status", width: 14 },
        { key: "statusLokasi", width: 22 }
      ];

      // 2. Banner Judul Dokumen (Merged Row 1)
      worksheet.mergeCells("A1:I1");
      const titleCell = worksheet.getCell("A1");
      titleCell.value = "LAPORAN PRESENSI SISWA MAGANG";
      titleCell.font = { name: "Arial", size: 14, bold: true, color: { argb: "FFFFFFFF" } };
      titleCell.alignment = { vertical: "middle", horizontal: "center" };
      titleCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFDC2626" } // Warna Merah Korporat (#dc2626)
      };
      worksheet.getRow(1).height = 32;

      // 3. Sub-Judul Perusahaan (Merged Row 2)
      worksheet.mergeCells("A2:I2");
      const companyCell = worksheet.getCell("A2");
      companyCell.value = "PT. MULTI POWER ABADI";
      companyCell.font = { name: "Arial", size: 11, bold: true, color: { argb: "FF1E293B" } };
      companyCell.alignment = { vertical: "middle", horizontal: "center" };
      companyCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF1F5F9" }
      };
      worksheet.getRow(2).height = 20;

      // 4. Metadata Tanggal Cetak & Total Data (Merged Row 3)
      worksheet.mergeCells("A3:I3");
      const metaCell = worksheet.getCell("A3");
      metaCell.value = `Tanggal Ekspor: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}  |  Total Data: ${filteredAbsensi.length} Catatan Presensi`;
      metaCell.font = { name: "Arial", size: 9, italic: true, color: { argb: "FF64748B" } };
      metaCell.alignment = { vertical: "middle", horizontal: "center" };
      worksheet.getRow(3).height = 18;

      // Spacing kosong baris 4
      worksheet.getRow(4).height = 8;

      // 5. Header Tabel (Baris 5)
      const headerRow = worksheet.getRow(5);
      headerRow.values = [
        "No",
        "Tanggal",
        "Nama Siswa",
        "Jam Masuk",
        "Keterangan Masuk",
        "Jam Pulang",
        "Keterangan Pulang",
        "Status",
        "Lokasi Presensi"
      ];
      headerRow.height = 26;

      headerRow.eachCell((cell) => {
        cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF0F172A" } // Dark Slate Navy (#0f172a)
        };
        cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
        cell.border = {
          top: { style: "medium", color: { argb: "FF0F172A" } },
          left: { style: "thin", color: { argb: "FF475569" } },
          bottom: { style: "medium", color: { argb: "FF0F172A" } },
          right: { style: "thin", color: { argb: "FF475569" } }
        };
      });

      // Format Border Garis untuk Setiap Sel Data
      const dataBorder = {
        top: { style: "thin", color: { argb: "FFCBD5E1" } },
        left: { style: "thin", color: { argb: "FFCBD5E1" } },
        bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
        right: { style: "thin", color: { argb: "FFCBD5E1" } }
      };

      // 6. Loop Isi Baris Data
      filteredAbsensi.forEach((item, index) => {
        const row = worksheet.addRow([
          index + 1,
          item.tanggal || "-",
          item.namaSiswa || "-",
          item.jamMasuk || "-",
          item.ketMasuk || item.keterangan || "-",
          item.jamPulang || "-",
          item.ketPulang || item.keteranganPulang || "-",
          item.status || "Hadir",
          item.statusLokasi || "Di Area Magang"
        ]);

        row.height = 22;
        const isEven = index % 2 === 0;

        row.eachCell((cell, colNumber) => {
          cell.font = { name: "Arial", size: 9.5, color: { argb: "FF1E293B" } };
          cell.border = dataBorder;

          // Zebra striping latar belang-belang agar rapi dibaca
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: isEven ? "FFF8FAFC" : "FFFFFFFF" }
          };

          // Alignment sel
          if (colNumber === 1 || colNumber === 2 || colNumber === 4 || colNumber === 6 || colNumber === 8 || colNumber === 9) {
            cell.alignment = { vertical: "middle", horizontal: "center" };
          } else {
            cell.alignment = { vertical: "middle", horizontal: "left" };
          }

          // Warna Jam Masuk (Hijau) & Jam Pulang (Merah)
          if (colNumber === 4 && item.jamMasuk && item.jamMasuk !== "-") {
            cell.font = { name: "Arial", size: 9.5, bold: true, color: { argb: "FF16A34A" } };
          }
          if (colNumber === 6 && item.jamPulang && item.jamPulang !== "-") {
            cell.font = { name: "Arial", size: 9.5, bold: true, color: { argb: "FFDC2626" } };
          }

          // Warna Status (Hadir = Hijau, Izin = Kuning/Orange)
          if (colNumber === 8) {
            cell.font = {
              name: "Arial",
              size: 9.5,
              bold: true,
              color: item.status === "Izin" ? { argb: "FFD97706" } : { argb: "FF16A34A" }
            };
          }
        });
      });

      // 7. Simpan dan Unduh File Excel
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Laporan_Absensi_Magang_${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);

      setToast({ message: "Berhasil mengunduh Laporan Excel (.xlsx) dengan format rapi!", type: "success" });
    } catch (err) {
      console.error("Excel Export Error:", err);
      setToast({ message: "Gagal mengekspor file Excel!", type: "error" });
    }
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
      {/* Header Halaman */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a" }}>
            Data Master Absensi
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "4px" }}>
            Seluruh histori presensi siswa magang dengan rincian keterangan absen masuk & pulang.
          </p>
        </div>

        {/* Tombol Aksi (Export PDF & Excel) */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {/* Tombol Export Excel */}
          <button
            onClick={handleExportExcel}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "#16a34a",
              color: "#ffffff",
              border: "none",
              padding: "0.6rem 1.25rem",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(22, 163, 74, 0.2)",
              transition: "all 0.2s"
            }}
          >
            <FileSpreadsheet size={18} /> Export Excel (.xlsx)
          </button>

          {/* Tombol Export PDF */}
          <button
            onClick={handleExportPDF}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "#dc2626",
              color: "#ffffff",
              border: "none",
              padding: "0.6rem 1.25rem",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(220, 38, 38, 0.2)",
              transition: "all 0.2s"
            }}
          >
            <Printer size={18} /> Export PDF
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "0.75rem",
          padding: "1rem",
          border: "1px solid #e2e8f0",
          marginBottom: "1.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem"
        }}
      >
        {/* Input Pencarian */}
        <div style={{ position: "relative" }}>
          <Search size={18} color="#94a3b8" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari siswa atau keterangan..."
            style={{
              width: "100%",
              padding: "0.55rem 0.75rem 0.55rem 2.5rem",
              borderRadius: "0.5rem",
              border: "1px solid #cbd5e1",
              fontSize: "0.875rem",
              outline: "none"
            }}
          />
        </div>

        {/* Dropdown Filter Siswa */}
        <div style={{ position: "relative" }}>
          <Users size={18} color="#94a3b8" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
          <select
            value={selectedSiswa}
            onChange={(e) => setSelectedSiswa(e.target.value)}
            style={{
              width: "100%",
              padding: "0.55rem 0.75rem 0.55rem 2.5rem",
              borderRadius: "0.5rem",
              border: "1px solid #cbd5e1",
              fontSize: "0.875rem",
              outline: "none",
              backgroundColor: "#ffffff",
              color: "#0f172a",
              fontWeight: "400",
              colorScheme: "light"
            }}
          >
            <option value="semua" style={{ color: "#0f172a", backgroundColor: "#ffffff", fontWeight: "400" }}>
              Semua Siswa Magang
            </option>
            {siswaList.map((s, i) => (
              <option key={i} value={s.id || s.nama || s.namaSiswa} style={{ color: "#0f172a", backgroundColor: "#ffffff", fontWeight: "400" }}>
                {s.nama || s.namaSiswa}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Tanggal */}
        <div style={{ position: "relative" }}>
          <Calendar size={18} color="#94a3b8" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              width: "100%",
              padding: "0.55rem 0.75rem 0.55rem 2.5rem",
              borderRadius: "0.5rem",
              border: "1px solid #cbd5e1",
              fontSize: "0.875rem",
              outline: "none",
              color: selectedDate ? "#0f172a" : "#94a3b8"
            }}
          />
        </div>
      </div>

      {/* Tabel Data Absensi */}
      <div style={{ backgroundColor: "#ffffff", borderRadius: "0.75rem", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>
                <th style={{ padding: "0.85rem 1rem", fontWeight: "700" }}>Tanggal</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: "700" }}>Nama Siswa</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: "700" }}>Jam Masuk</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: "700" }}>Keterangan Absen Masuk</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: "700" }}>Jam Pulang</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: "700" }}>Keterangan Absen Pulang</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: "700" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAbsensi.length > 0 ? (
                filteredAbsensi.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "0.85rem 1rem", color: "#334155" }}>{row.tanggal || "-"}</td>
                    <td style={{ padding: "0.85rem 1rem", fontWeight: "600", color: "#0f172a" }}>{row.namaSiswa || "-"}</td>
                    <td style={{ padding: "0.85rem 1rem", color: "#16a34a", fontWeight: "600" }}>{row.jamMasuk || "-"}</td>
                    <td style={{ padding: "0.85rem 1rem", color: "#64748b" }}>{row.ketMasuk || "-"}</td>
                    <td style={{ padding: "0.85rem 1rem", color: "#dc2626", fontWeight: "600" }}>{row.jamPulang || "-"}</td>
                    <td style={{ padding: "0.85rem 1rem", color: "#64748b" }}>{row.ketPulang || "-"}</td>
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <span
                        style={{
                          backgroundColor: row.status === "Izin" ? "#fef3c7" : "#dcfce7",
                          color: row.status === "Izin" ? "#d97706" : "#15803d",
                          padding: "0.25rem 0.6rem",
                          borderRadius: "0.375rem",
                          fontSize: "0.75rem",
                          fontWeight: "700"
                        }}
                      >
                        {row.status || "Hadir"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ padding: "3rem 1rem", textAlign: "center", color: "#94a3b8" }}>
                    Tidak ada data absensi yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}