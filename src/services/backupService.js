import { getUsers, getAttendanceRecords, COMPANY_INFO } from "./db";

/**
 * Membuat String SQL Dump Lengkap (Schema + Semua Data Users & Absensi)
 */
export const generateSQLDump = (customUsers = null, customRecords = null) => {
  const users = customUsers || getUsers() || [];
  const attendance = customRecords || getAttendanceRecords() || [];
  const company = COMPANY_INFO || {
    name: "PT. MULTI POWER ABADI",
    address: "Jl. Gn. Anyar Tambak IV No.50, Surabaya",
    coordinates: { lat: -7.344001, lng: 112.804846, maxRadiusMeters: 200 },
    contact: { waPembimbing: "6288996838093" }
  };

  const nowStr = new Date().toISOString();

  let sql = `-- =========================================================\n`;
  sql += `-- DATABASE BACKUP: Multi Power Abadi Absensi Magang\n`;
  sql += `-- Tanggal Dibuat: ${nowStr}\n`;
  sql += `-- Total Users   : ${users.length} Akun\n`;
  sql += `-- Total Absensi : ${attendance.length} Baris Data\n`;
  sql += `-- =========================================================\n\n`;

  // 1. Tabel Perusahaan
  sql += `-- 1. Tabel Perusahaan\n`;
  sql += `CREATE TABLE IF NOT EXISTS perusahaan (\n`;
  sql += `  id SERIAL PRIMARY KEY,\n`;
  sql += `  nama_perusahaan VARCHAR(150) NOT NULL,\n`;
  sql += `  alamat TEXT NOT NULL,\n`;
  sql += `  latitude NUMERIC(10,8) NOT NULL,\n`;
  sql += `  longitude NUMERIC(11,8) NOT NULL,\n`;
  sql += `  radius_max_meters INT NOT NULL DEFAULT 200,\n`;
  sql += `  no_wa_pembimbing VARCHAR(20) NOT NULL\n`;
  sql += `);\n\n`;

  const lat = company.coordinates?.lat || -7.344001;
  const lng = company.coordinates?.lng || 112.804846;
  const radius = company.coordinates?.maxRadiusMeters || 200;
  const wa = company.contact?.waPembimbing || "6288996838093";
  const compName = (company.name || "PT. MULTI POWER ABADI").replace(/'/g, "''");
  const compAddr = (company.address || "").replace(/'/g, "''");

  sql += `INSERT INTO perusahaan (id, nama_perusahaan, alamat, latitude, longitude, radius_max_meters, no_wa_pembimbing)\n`;
  sql += `VALUES (1, '${compName}', '${compAddr}', ${lat}, ${lng}, ${radius}, '${wa}')\n`;
  sql += `ON CONFLICT (id) DO UPDATE SET\n`;
  sql += `  nama_perusahaan = EXCLUDED.nama_perusahaan,\n`;
  sql += `  alamat = EXCLUDED.alamat,\n`;
  sql += `  latitude = EXCLUDED.latitude,\n`;
  sql += `  longitude = EXCLUDED.longitude,\n`;
  sql += `  radius_max_meters = EXCLUDED.radius_max_meters,\n`;
  sql += `  no_wa_pembimbing = EXCLUDED.no_wa_pembimbing;\n\n`;

  // 2. Tabel Users
  sql += `-- 2. Tabel Users (Admin & Siswa Magang)\n`;
  sql += `CREATE TABLE IF NOT EXISTS users (\n`;
  sql += `  id VARCHAR(50) PRIMARY KEY,\n`;
  sql += `  nama VARCHAR(150) NOT NULL,\n`;
  sql += `  pin VARCHAR(10) UNIQUE NOT NULL,\n`;
  sql += `  role VARCHAR(20) NOT NULL DEFAULT 'siswa',\n`;
  sql += `  sekolah VARCHAR(150),\n`;
  sql += `  tempat_magang VARCHAR(150) DEFAULT 'PT. MULTI POWER ABADI',\n`;
  sql += `  no_hp VARCHAR(20),\n`;
  sql += `  foto_profil VARCHAR(255) DEFAULT '/default-avatar.png',\n`;
  sql += `  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n`;
  sql += `);\n\n`;

  if (users.length > 0) {
    sql += `-- Insert Data Users\n`;
    sql += `INSERT INTO users (id, nama, pin, role, sekolah, tempat_magang, no_hp, foto_profil) VALUES\n`;
    const userValues = users.map(u => {
      const uId = (u.id || "").replace(/'/g, "''");
      const uNama = (u.nama || "").replace(/'/g, "''");
      const uPin = (u.pin || "").replace(/'/g, "''");
      const uRole = (u.role || "siswa").replace(/'/g, "''");
      const uSekolah = (u.sekolah || "").replace(/'/g, "''");
      const uMagang = (u.tempatMagang || "PT. MULTI POWER ABADI").replace(/'/g, "''");
      const uHp = (u.noHp || "").replace(/'/g, "''");
      const uFoto = (u.fotoProfil || "/default-avatar.png").replace(/'/g, "''");
      return `('${uId}', '${uNama}', '${uPin}', '${uRole}', '${uSekolah}', '${uMagang}', '${uHp}', '${uFoto}')`;
    });
    sql += userValues.join(",\n") + "\nON CONFLICT (id) DO UPDATE SET\n";
    sql += `  nama = EXCLUDED.nama, pin = EXCLUDED.pin, role = EXCLUDED.role, sekolah = EXCLUDED.sekolah, tempat_magang = EXCLUDED.tempat_magang, no_hp = EXCLUDED.no_hp, foto_profil = EXCLUDED.foto_profil;\n\n`;
  }

  // 3. Tabel Absensi
  sql += `-- 3. Tabel Absensi\n`;
  sql += `CREATE TABLE IF NOT EXISTS absensi (\n`;
  sql += `  id VARCHAR(50) PRIMARY KEY,\n`;
  sql += `  student_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,\n`;
  sql += `  nama_siswa VARCHAR(150) NOT NULL,\n`;
  sql += `  tanggal DATE NOT NULL,\n`;
  sql += `  jam_masuk VARCHAR(20) DEFAULT '-',\n`;
  sql += `  keterangan_masuk TEXT DEFAULT '-',\n`;
  sql += `  jam_pulang VARCHAR(20) DEFAULT '-',\n`;
  sql += `  keterangan_pulang TEXT DEFAULT '-',\n`;
  sql += `  status VARCHAR(20) NOT NULL DEFAULT 'Hadir',\n`;
  sql += `  latitude NUMERIC(10,8),\n`;
  sql += `  longitude NUMERIC(11,8),\n`;
  sql += `  jarak_meters INT DEFAULT 0,\n`;
  sql += `  status_lokasi VARCHAR(100) DEFAULT 'Di Area Magang',\n`;
  sql += `  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n`;
  sql += `);\n\n`;

  if (attendance.length > 0) {
    sql += `-- Insert Data Absensi\n`;
    sql += `INSERT INTO absensi (id, student_id, nama_siswa, tanggal, jam_masuk, keterangan_masuk, jam_pulang, keterangan_pulang, status, latitude, longitude, jarak_meters, status_lokasi) VALUES\n`;
    const attValues = attendance.map(a => {
      const aId = (a.id || "").replace(/'/g, "''");
      const sId = (a.studentId || "").replace(/'/g, "''");
      const aNama = (a.namaSiswa || "").replace(/'/g, "''");
      const aTgl = a.tanggal || "2026-01-01";
      const aJamM = (a.jamMasuk || "-").replace(/'/g, "''");
      const aKetM = (a.ketMasuk || a.keterangan || "-").replace(/'/g, "''");
      const aJamP = (a.jamPulang || "-").replace(/'/g, "''");
      const aKetP = (a.ketPulang || a.keteranganPulang || "-").replace(/'/g, "''");
      const aStatus = (a.status || "Hadir").replace(/'/g, "''");
      const aLat = a.lat !== null && a.lat !== undefined ? a.lat : "NULL";
      const aLng = a.lng !== null && a.lng !== undefined ? a.lng : "NULL";
      const aJarak = a.jarakMeters ?? 0;
      const aLocStatus = (a.statusLokasi || "Di Area Magang").replace(/'/g, "''");

      return `('${aId}', '${sId}', '${aNama}', '${aTgl}', '${aJamM}', '${aKetM}', '${aJamP}', '${aKetP}', '${aStatus}', ${aLat}, ${aLng}, ${aJarak}, '${aLocStatus}')`;
    });
    sql += attValues.join(",\n") + "\nON CONFLICT (id) DO UPDATE SET\n";
    sql += `  jam_masuk = EXCLUDED.jam_masuk, keterangan_masuk = EXCLUDED.keterangan_masuk, jam_pulang = EXCLUDED.jam_pulang, keterangan_pulang = EXCLUDED.keterangan_pulang, status = EXCLUDED.status, latitude = EXCLUDED.latitude, longitude = EXCLUDED.longitude, jarak_meters = EXCLUDED.jarak_meters, status_lokasi = EXCLUDED.status_lokasi;\n\n`;
  }

  // 4. Hak Akses Row Level Security (RLS)
  sql += `-- 4. Hak Akses Row Level Security (RLS)\n`;
  sql += `ALTER TABLE users ENABLE ROW LEVEL SECURITY;\n`;
  sql += `ALTER TABLE absensi ENABLE ROW LEVEL SECURITY;\n`;
  sql += `ALTER TABLE perusahaan ENABLE ROW LEVEL SECURITY;\n\n`;
  sql += `DROP POLICY IF EXISTS "Allow public all on users" ON users;\n`;
  sql += `CREATE POLICY "Allow public all on users" ON users FOR ALL USING (true) WITH CHECK (true);\n\n`;
  sql += `DROP POLICY IF EXISTS "Allow public all on absensi" ON absensi;\n`;
  sql += `CREATE POLICY "Allow public all on absensi" ON absensi FOR ALL USING (true) WITH CHECK (true);\n\n`;
  sql += `DROP POLICY IF EXISTS "Allow public all on perusahaan" ON perusahaan;\n`;
  sql += `CREATE POLICY "Allow public all on perusahaan" ON perusahaan FOR ALL USING (true) WITH CHECK (true);\n`;

  return sql;
};

/**
 * Unduh File .SQL langsung ke komputer
 */
export const downloadSQLBackup = () => {
  const sql = generateSQLDump();
  const blob = new Blob([sql], { type: "text/sql;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `backup_db_absen_magang_${dateStr}.sql`;
  a.click();
  URL.revokeObjectURL(url);
};

export const DEFAULT_DISCORD_WEBHOOK_URL =
  import.meta.env?.VITE_DISCORD_WEBHOOK_URL ||
  "https://discord.com/api/webhooks/1544258389444657196/0izuw-4rftmFy2EpQ4Yv8TJaVzSf85yLsg8R_fD59NAX382B1vcBLg6-Y1B7iwvbTc4X";

/**
 * Kirim File .SQL Backup ke Discord Webhook
 */
export const sendBackupToDiscord = async (customWebhookUrl = null, isScheduled = false) => {
  const webhookUrl = customWebhookUrl || localStorage.getItem("discord_backup_webhook_url") || DEFAULT_DISCORD_WEBHOOK_URL;
  if (!webhookUrl || !webhookUrl.startsWith("https://discord.com/api/webhooks/")) {
    throw new Error("URL Discord Webhook tidak valid!");
  }

  const users = getUsers() || [];
  const attendance = getAttendanceRecords() || [];
  const sqlContent = generateSQLDump(users, attendance);
  const dateStr = new Date().toISOString().slice(0, 10);
  const timeStr = new Date().toLocaleTimeString("id-ID");

  const formData = new FormData();
  const blob = new Blob([sqlContent], { type: "text/plain" });
  formData.append("files[0]", blob, `backup_db_absensi_${dateStr}.sql`);

  const payload = {
    username: "Multi Power Abadi • Sentinel",
    avatar_url: "https://cdn-icons-png.flaticon.com/512/906/906343.png",
    embeds: [
      {
        author: {
          name: "PT. MULTI POWER ABADI — Database Sentinel",
          icon_url: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        },
        title: isScheduled
          ? "🟢 Cadangan Database Mingguan (Otomatis) Sukses"
          : "📦 Cadangan Database Manual (Admin) Sukses",
        description: isScheduled
          ? "Sistem telah mencadangkan seluruh data siswa & riwayat presensi secara berkala. Berkas `.sql` terlampir di bawah untuk arsip mandiri."
          : "Admin telah mengekspor cadangan basis data. Berkas `.sql` terlampir di bawah dan siap di-restore kapan pun ke Supabase / PostgreSQL.",
        color: isScheduled ? 1096065 : 14428454, // Emerald Green jika Terjadwal, Ruby Merah jika Manual
        fields: [
          {
            name: "⚡ Status",
            value: isScheduled ? "```diff\n+ AUTO RUN (7 HARI)\n```" : "```fix\nMANUAL EXPORT (ADMIN)\n```",
            inline: true
          },
          {
            name: "⏱️ Tipe Cadangan",
            value: isScheduled ? "```fix\nJadwal Rutin Sistem\n```" : "```fix\nEkspor Mandiri\n```",
            inline: true
          },
          {
            name: "📅 Waktu Eksekusi",
            value: `\`\`\`yaml\n${dateStr} • ${timeStr} WIB\n\`\`\``,
            inline: false
          },
          {
            name: "👥 Siswa Terdaftar",
            value: `**\`${users.length}\`** Akun Siswa`,
            inline: true
          },
          {
            name: "📋 Catatan Presensi",
            value: `**\`${attendance.length}\`** Data Absen`,
            inline: true
          },
          {
            name: "💾 Berkas SQL",
            value: `\`backup_db_absensi_${dateStr}.sql\``,
            inline: true
          }
        ],
        footer: {
          text: "Multi Power Abadi Sentinel • Backup Engine v2.1",
          icon_url: "https://cdn-icons-png.flaticon.com/512/1006/1006771.png"
        },
        timestamp: new Date().toISOString()
      }
    ]
  };

  formData.append("payload_json", JSON.stringify(payload));

  const response = await fetch(webhookUrl, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal mengirim ke Discord (${response.status}): ${errorText}`);
  }

  return true;
};

// Lock Mutex di memori untuk mencegah duplicate network calls
let isBackupInProgress = false;

/**
 * Pengecekan Jadwal Otomatis 7 Hari Sekali (Weekly Auto-Backup)
 * Dilengkapi Anti-Duplikasi (Mutex Lock + Session Guard)
 */
export const checkAndTriggerWeeklyBackup = async () => {
  if (isBackupInProgress) return false;

  // Cek guard per-sesi tab browser (hanya cek 1x per sesi)
  if (typeof window !== "undefined" && window.sessionStorage) {
    if (sessionStorage.getItem("auto_backup_checked_this_session")) {
      return false;
    }
    sessionStorage.setItem("auto_backup_checked_this_session", "true");
  }

  try {
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const lastBackup = localStorage.getItem("last_weekly_backup_timestamp");
    const now = Date.now();

    // Jika belum pernah diset sama sekali, inisialisasi timestamp sekarang agar tidak spam saat pertama buka
    if (!lastBackup) {
      localStorage.setItem("last_weekly_backup_timestamp", now.toString());
      return false;
    }

    // Jika sudah lewat >= 7 hari
    if ((now - Number(lastBackup)) >= SEVEN_DAYS_MS) {
      isBackupInProgress = true;
      // Optimistic lock: Segera perbarui timestamp sebelum request jalan agar tidak ter-trigger ganda
      localStorage.setItem("last_weekly_backup_timestamp", now.toString());

      console.log("⏰ Menjalankan auto-backup database 7 harian ke Discord...");
      await sendBackupToDiscord(null, true);
      isBackupInProgress = false;
      return true;
    }
    return false;
  } catch (e) {
    console.warn("Auto weekly backup notice:", e);
    isBackupInProgress = false;
    return false;
  }
};


