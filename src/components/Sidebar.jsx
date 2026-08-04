import React from "react";
import {
  LayoutDashboard,
  LogIn,
  LogOut as LogOutIcon,
  History,
  MessageSquare,
  User,
  Users,
  ClipboardList,
  KeyRound,
  ClipboardCheck,
  X
} from "lucide-react";

export default function Sidebar({ user, currentTab, setCurrentTab, onLogout, isOpen, onClose }) {
  const isStudent = user?.role === "siswa";

  const studentNavItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "absen-masuk", label: "Absen Masuk", icon: LogIn },
    { id: "absen-pulang", label: "Absen Pulang", icon: LogOutIcon },
    { id: "riwayat", label: "Riwayat Absensi", icon: History },
    { id: "izin", label: "Izin", icon: MessageSquare },
    { id: "profil", label: "User", icon: User }
  ];

  const adminNavItems = [
    { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "admin-siswa", label: "Data Siswa", icon: Users },
    { id: "admin-absensi", label: "Data Absensi", icon: ClipboardList },
    { id: "admin-reset-password", label: "Reset Password", icon: KeyRound }
  ];

  const navItems = isStudent ? studentNavItems : adminNavItems;

  return (
    <>
      {/* Mobile Backdrop Overlay (higher z-index than bottom nav) */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 60
          }}
          className="mobile-backdrop"
        />
      )}

      {/* Sidebar Navigation Panel (z-index 65 so it slides OVER bottom nav) */}
      <aside
        className={`sidebar-panel ${isOpen ? "sidebar-open" : ""}`}
        style={{
          width: "270px",
          backgroundColor: "#ffffff",
          borderRight: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 65,
          transition: "transform 0.3s ease",
          overflowY: "auto"
        }}
      >
        <div>
          {/* Brand Header */}
          <div
            style={{
              height: "4.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 1.5rem",
              borderBottom: "1px solid #e2e8f0",
              position: "sticky",
              top: 0,
              backgroundColor: "#ffffff",
              zIndex: 10
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  backgroundColor: "#dc2626",
                  borderRadius: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  boxShadow: "0 4px 10px rgba(220, 38, 38, 0.3)"
                }}
              >
                <ClipboardCheck size={22} />
              </div>
              <div>
                <h1 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#dc2626", lineHeight: 1.2 }}>
                  Absensi Magang
                </h1>
                <span style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: "600", letterSpacing: "0.5px" }}>
                  PORTAL {user?.role?.toUpperCase()}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: "#f1f5f9",
                border: "none",
                color: "#475569",
                cursor: "pointer",
                padding: "0.4rem",
                borderRadius: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              className="mobile-close-btn"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav style={{ padding: "1.25rem 0.85rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    if (onClose) onClose();
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.85rem",
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.75rem",
                    border: "none",
                    backgroundColor: isActive ? "#dc2626" : "transparent",
                    color: isActive ? "#ffffff" : "#475569",
                    fontSize: "0.95rem",
                    fontWeight: isActive ? "700" : "600",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    boxShadow: isActive ? "0 4px 12px rgba(220, 38, 38, 0.25)" : "none"
                  }}
                >
                  <Icon size={20} color={isActive ? "#ffffff" : "#64748b"} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout Footer (always visible with padding & clear red styling) */}
        <div style={{ padding: "1.25rem 0.85rem 2rem 0.85rem", borderTop: "1px solid #e2e8f0", backgroundColor: "#ffffff" }}>
          <button
            onClick={() => {
              if (onClose) onClose();
              onLogout();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.85rem",
              width: "100%",
              padding: "0.85rem 1rem",
              borderRadius: "0.75rem",
              border: "1.5px solid #fecaca",
              backgroundColor: "#fef2f2",
              color: "#dc2626",
              fontSize: "0.95rem",
              fontWeight: "800",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(220, 38, 38, 0.15)",
              transition: "all 0.15s ease"
            }}
          >
            <LogOutIcon size={20} />
            Keluar (Logout)
          </button>
        </div>
      </aside>
    </>
  );
}
