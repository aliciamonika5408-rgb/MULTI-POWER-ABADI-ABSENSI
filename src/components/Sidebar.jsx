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
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 40
          }}
          className="mobile-backdrop"
        />
      )}

      {/* Sidebar Navigation Panel */}
      <aside
        className={`sidebar-panel ${isOpen ? "sidebar-open" : ""}`}
        style={{
          width: "260px",
          backgroundColor: "#ffffff",
          borderRight: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100dvh", /* Dynamic Viewport Height for Mobile Samsung & iPhone */
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 45,
          transition: "transform 0.3s ease",
          boxShadow: isOpen ? "4px 0 25px rgba(0,0,0,0.15)" : "none",
          overflow: "hidden"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          {/* Brand Header */}
          <div
            style={{
              height: "4rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 1.25rem",
              borderBottom: "1px solid #e2e8f0",
              flexShrink: 0
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
              <div
                style={{
                  width: "2.25rem",
                  height: "2.25rem",
                  backgroundColor: "#dc2626",
                  borderRadius: "0.65rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  boxShadow: "0 4px 10px rgba(220, 38, 38, 0.3)"
                }}
              >
                <ClipboardCheck size={20} />
              </div>
              <div>
                <h1 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#dc2626", lineHeight: 1.2 }}>
                  Absensi Magang
                </h1>
                <span style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: "700", letterSpacing: "0.5px" }}>
                  PORTAL {user?.role?.toUpperCase()}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: "#f1f5f9",
                border: "none",
                color: "#64748b",
                cursor: "pointer",
                padding: "0.35rem",
                borderRadius: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              className="mobile-close-btn"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links (Scrollable if screen height is very short) */}
          <nav
            style={{
              padding: "0.85rem 0.75rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.3rem",
              flex: 1,
              overflowY: "auto"
            }}
          >
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
                    gap: "0.75rem",
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "0.65rem",
                    border: "none",
                    backgroundColor: isActive ? "#dc2626" : "transparent",
                    color: isActive ? "#ffffff" : "#475569",
                    fontSize: "0.9rem",
                    fontWeight: isActive ? "700" : "600",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    boxShadow: isActive ? "0 4px 12px rgba(220, 38, 38, 0.25)" : "none"
                  }}
                >
                  <Icon size={18} color={isActive ? "#ffffff" : "#64748b"} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout Footer (Always Pinned at Bottom without scrolling) */}
        <div style={{ padding: "0.85rem 0.75rem", borderTop: "1px solid #e2e8f0", flexShrink: 0, backgroundColor: "#ffffff" }}>
          <button
            onClick={() => {
              if (onClose) onClose();
              onLogout();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              width: "100%",
              padding: "0.65rem 0.85rem",
              borderRadius: "0.65rem",
              border: "1px solid #fee2e2",
              backgroundColor: "#fef2f2",
              color: "#ef4444",
              fontSize: "0.9rem",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
          >
            <LogOutIcon size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
