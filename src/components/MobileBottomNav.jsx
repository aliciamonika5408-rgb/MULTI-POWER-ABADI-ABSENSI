import React from "react";
import {
  LayoutDashboard,
  LogIn,
  LogOut as LogOutIcon,
  History,
  User,
  Users,
  ClipboardList,
  KeyRound
} from "lucide-react";

export default function MobileBottomNav({ user, currentTab, setCurrentTab }) {
  const isStudent = user?.role === "siswa";

  const studentNav = [
    { id: "dashboard", label: "Beranda", icon: LayoutDashboard },
    { id: "absen-masuk", label: "Masuk", icon: LogIn },
    { id: "absen-pulang", label: "Pulang", icon: LogOutIcon },
    { id: "riwayat", label: "Riwayat", icon: History },
    { id: "profil", label: "Profil", icon: User }
  ];

  const adminNav = [
    { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "admin-siswa", label: "Siswa", icon: Users },
    { id: "admin-absensi", label: "Absensi", icon: ClipboardList },
    { id: "admin-reset-password", label: "Reset PIN", icon: KeyRound }
  ];

  const items = isStudent ? studentNav : adminNav;

  return (
    <div
      className="mobile-bottom-nav"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#ffffff",
        borderTop: "1px solid #e2e8f0",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "0.4rem 0.5rem",
        zIndex: 50,
        boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.05)"
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "none",
              padding: "0.3rem 0.5rem",
              borderRadius: "0.5rem",
              cursor: "pointer",
              color: isActive ? "#dc2626" : "#64748b",
              transition: "all 0.15s ease",
              flex: 1
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.25rem",
                borderRadius: "0.5rem",
                backgroundColor: isActive ? "#fef2f2" : "transparent"
              }}
            >
              <Icon size={20} color={isActive ? "#dc2626" : "#64748b"} />
            </div>
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: isActive ? "800" : "600",
                marginTop: "2px",
                lineHeight: 1
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}

      <style>{`
        @media (min-width: 769px) {
          .mobile-bottom-nav {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
