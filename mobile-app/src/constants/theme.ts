/**
 * Global color & font system for CampusExpense
 * Theme: Sky Blue & White
 * Style: Clean – iOS – Fintech
 */

import { Platform } from "react-native";

/* ===== Brand Colors ===== */
const primarySky = "#4DABF7";      // Xanh da trời chủ đạo
const primarySkyDark = "#1C7ED6";  // Xanh đậm (active, press)
const primarySkyLight = "#A5D8FF"; // Xanh nhạt (highlight)

/* ===== Light Mode ===== */
export const Colors = {
  light: {
    /* Background */
    background: "#FFFFFF",
    surface: "#FFFFFF",
    card: "#FFFFFF",

    /* Primary */
    primary: primarySky,
    primaryDark: primarySkyDark,
    primaryLight: primarySkyLight,

    /* Text */
    textMain: "#1F2937",
    textSub: "#6B7280",
    placeholder: "#9CA3AF",

    /* Input & Border */
    inputBg: "#F1F5F9",
    border: "#E5E7EB",
    divider: "#E5E7EB",

    /* Icons */
    icon: "#6B7280",

    /* Tabs */
    tabIconDefault: "#9CA3AF",
    tabIconSelected: primarySky,

    /* Status */
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
  },

  /* ===== Dark Mode (dịu – không gắt) ===== */
  dark: {
    background: "#0F172A",
    surface: "#020617",
    card: "#020617",

    primary: "#60A5FA",
    primaryDark: "#3B82F6",
    primaryLight: "#93C5FD",

    textMain: "#E5E7EB",
    textSub: "#9CA3AF",
    placeholder: "#6B7280",

    inputBg: "#020617",
    border: "#1E293B",
    divider: "#1E293B",

    icon: "#9CA3AF",

    tabIconDefault: "#64748B",
    tabIconSelected: "#60A5FA",

    success: "#4ADE80",
    warning: "#FBBF24",
    error: "#F87171",
  },
};

/* ===== Fonts System ===== */
export const Fonts = Platform.select({
  ios: {
    sans: "System",
    serif: "Times New Roman",
    rounded: "SF Pro Rounded",
    mono: "SF Mono",
  },
  android: {
    sans: "Roboto",
    serif: "serif",
    rounded: "sans-serif",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
});
