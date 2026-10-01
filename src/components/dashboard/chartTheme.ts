import { useTheme } from "../../context/ThemeContext";

/** Recharts takes colours as props, so mirror the CSS tokens here. */
const palettes = {
  light: {
    grid: "#e5e8ee",
    axis: "#64748b",
    spend: "#059669",
    over: "#dc2626",
    budget: "#334155",
    cursor: "rgba(15, 23, 42, 0.04)",
    surface: "#ffffff",
    // Emerald shades, strongest first
    series: ["#065f46", "#047857", "#059669", "#10b981", "#34d399", "#6ee7b7"],
    other: "#cbd5e1",
  },
  dark: {
    grid: "#232834",
    axis: "#8d96a8",
    spend: "#10b981",
    over: "#f26464",
    budget: "#cbd5e1",
    cursor: "rgba(255, 255, 255, 0.04)",
    surface: "#12151c",
    // Emerald shades, brightest (strongest on a dark surface) first
    series: ["#a7f3d0", "#6ee7b7", "#34d399", "#10b981", "#059669", "#047857"],
    other: "#475569",
  },
};

export const useChartTheme = () => palettes[useTheme().theme];

/** Picks `count` shades spread evenly across the series, strongest first. */
export const pickShades = (series: string[], count: number) =>
  Array.from({ length: count }, (_, i) =>
    series[count === 1 ? 0 : Math.round((i * (series.length - 1)) / (count - 1))],
  );
