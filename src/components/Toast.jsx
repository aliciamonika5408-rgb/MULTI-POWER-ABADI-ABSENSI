import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ message, type = "success", onClose, duration = 3500 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === "success";
  const isError = type === "error";

  const bg = isSuccess ? "#ecfdf5" : isError ? "#fef2f2" : "#f0f9ff";
  const border = isSuccess ? "#a7f3d0" : isError ? "#fecaca" : "#bae6fd";
  const color = isSuccess ? "#047857" : isError ? "#dc2626" : "#0369a1";
  const Icon = isSuccess ? CheckCircle2 : isError ? AlertCircle : Info;

  return (
    <div
      style={{
        position: "fixed",
        top: "1.5rem",
        right: "1.5rem",
        zIndex: 110,
        backgroundColor: bg,
        border: `1.5px solid ${border}`,
        color: color,
        padding: "0.85rem 1.25rem",
        borderRadius: "1rem",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        maxWidth: "380px",
        width: "calc(100vw - 3rem)",
        animation: "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards"
      }}
    >
      <Icon size={22} style={{ flexShrink: 0 }} />
      <span style={{ fontSize: "0.875rem", fontWeight: "700", flex: 1, lineHeight: 1.4 }}>
        {message}
      </span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: color,
          cursor: "pointer",
          opacity: 0.7,
          display: "flex",
          alignItems: "center"
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
