import React from "react";
import { AlertTriangle, Trash2, X, CheckCircle, Info } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  title = "Konfirmasi Hapus",
  message = "Apakah Anda yakin ingin melanjutkan tindakan ini?",
  confirmText = "Ya, Hapus",
  cancelText = "Batal",
  type = "danger", // "danger" | "warning" | "info"
  onConfirm,
  onCancel
}) {
  if (!isOpen) return null;

  const isDanger = type === "danger";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(6px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        animation: "fadeIn 0.2s ease-out"
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "1.25rem",
          maxWidth: "420px",
          width: "100%",
          padding: "1.75rem",
          boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
          border: "1px solid #e2e8f0",
          textAlign: "center",
          position: "relative"
        }}
        className="animate-fade-in"
      >
        {/* Close Button */}
        <button
          onClick={onCancel}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "#f1f5f9",
            border: "none",
            color: "#64748b",
            cursor: "pointer",
            width: "2rem",
            height: "2rem",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <X size={16} />
        </button>

        {/* Icon Badge */}
        <div
          style={{
            width: "4rem",
            height: "4rem",
            backgroundColor: isDanger ? "#fef2f2" : "#fffbeb",
            borderRadius: "50%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: isDanger ? "#dc2626" : "#f59e0b",
            marginBottom: "1.25rem",
            boxShadow: isDanger ? "0 8px 20px rgba(220, 38, 38, 0.15)" : "0 8px 20px rgba(245, 158, 11, 0.15)"
          }}
        >
          {isDanger ? <Trash2 size={32} /> : <AlertTriangle size={32} />}
        </div>

        <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#0f172a", marginBottom: "0.5rem" }}>
          {title}
        </h3>

        <p style={{ fontSize: "0.9rem", color: "#475569", lineHeight: 1.5, marginBottom: "1.75rem" }}>
          {message}
        </p>

        {/* Action Buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "0.75rem",
              borderRadius: "0.75rem",
              border: "1px solid #cbd5e1",
              backgroundColor: "#ffffff",
              color: "#475569",
              fontSize: "0.9rem",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            style={{
              padding: "0.75rem",
              borderRadius: "0.75rem",
              border: "none",
              backgroundColor: isDanger ? "#dc2626" : "#f59e0b",
              color: "#ffffff",
              fontSize: "0.9rem",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: isDanger ? "0 4px 12px rgba(220, 38, 38, 0.3)" : "0 4px 12px rgba(245, 158, 11, 0.3)",
              transition: "all 0.15s ease"
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
