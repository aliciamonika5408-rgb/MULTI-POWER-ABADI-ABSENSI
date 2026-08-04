import React, { useState } from "react";
import { Bell, Menu, LogOut } from "lucide-react";

export default function Header({ user, currentTab, onLogout, toggleSidebar }) {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: "Sistem Absensi Aktif", text: "Jangan lupa melakukan Absen Pulang tepat waktu.", time: "Baru saja", unread: true },
    { id: 2, title: "Status Absensi Hari Ini", text: "Silakan cek status absensi di Dashboard Anda.", time: "1 jam lalu", unread: false }
  ];

  return (
    <header
      className="app-header"
      style={{
        height: "4.25rem",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        padding: "0 1.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 30,
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.02)"
      }}
    >
      {/* Left Menu Toggle & Mobile Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", minWidth: 0 }}>
        <button
          onClick={toggleSidebar}
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            color: "#475569",
            cursor: "pointer",
            padding: "0.5rem",
            borderRadius: "0.6rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}
          className="mobile-toggle-btn"
          aria-label="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#0f172a", lineHeight: 1.2 }}>
            {user?.role === "admin" ? "Halo, Admin!" : `Halo, ${user?.nama || "Siswa"}`}
          </h2>
          <p className="desktop-subtitle" style={{ fontSize: "0.75rem", color: "#64748b" }}>
            {user?.role === "admin" ? "Admin Administrator" : user?.sekolah || "Siswa Magang"}
          </p>
        </div>
      </div>

      {/* Right User Actions & Notifications */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
        {/* Notification Bell Icon */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              position: "relative",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              color: "#475569",
              padding: "0.55rem",
              borderRadius: "0.65rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s"
            }}
          >
            <Bell size={18} />
            <span
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                width: "7px",
                height: "7px",
                backgroundColor: "#dc2626",
                borderRadius: "50%",
                boxShadow: "0 0 0 2px white"
              }}
            />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              className="notification-dropdown"
              style={{
                position: "absolute",
                top: "3rem",
                right: 0,
                width: "290px",
                backgroundColor: "#ffffff",
                borderRadius: "1rem",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                border: "1px solid #e2e8f0",
                padding: "0.85rem",
                zIndex: 50,
                animation: "fadeIn 0.2s ease"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", paddingBottom: "0.5rem", borderBottom: "1px solid #f1f5f9" }}>
                <span style={{ fontWeight: "700", fontSize: "0.85rem", color: "#0f172a" }}>Notifikasi</span>
                <span style={{ fontSize: "0.75rem", color: "#dc2626", fontWeight: "600" }}>Tandai Dibaca</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {notifications.map(n => (
                  <div
                    key={n.id}
                    style={{
                      padding: "0.6rem",
                      borderRadius: "0.5rem",
                      backgroundColor: n.unread ? "#fef2f2" : "#ffffff",
                      borderLeft: n.unread ? "3px solid #dc2626" : "1px solid #f1f5f9"
                    }}
                  >
                    <span style={{ fontWeight: "700", fontSize: "0.8rem", color: "#0f172a", display: "block" }}>{n.title}</span>
                    <span style={{ fontSize: "0.75rem", color: "#64748b", display: "block", marginTop: "2px" }}>{n.text}</span>
                    <span style={{ fontSize: "0.7rem", color: "#dc2626", fontWeight: "600", marginTop: "4px", display: "block" }}>{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Small Profile Avatar */}
        <img
          src={user?.fotoProfil || "/default-avatar.svg"}
          alt={user?.nama}
          style={{
            width: "2.25rem",
            height: "2.25rem",
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #fecaca"
          }}
        />

        {/* Header Logout Button */}
        <button
          onClick={onLogout}
          title="Keluar / Logout"
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            padding: "0.5rem 0.65rem",
            borderRadius: "0.65rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            fontSize: "0.8rem",
            fontWeight: "700",
            transition: "all 0.2s"
          }}
        >
          <LogOut size={16} />
          <span className="desktop-user-name">Keluar</span>
        </button>
      </div>
    </header>
  );
}
