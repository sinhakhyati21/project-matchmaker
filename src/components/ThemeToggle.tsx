"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light") {
      setIsDark(false);
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  function toggleTheme() {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  }

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        background: "transparent",
        border: "1px solid var(--border)",
        color: "var(--text-muted)",
        width: 34,
        height: 34,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: 16,
        transition: "all 0.2s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#6366f1";
        e.currentTarget.style.color = "#818cf8";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.color = "var(--text-muted)";
      }}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}