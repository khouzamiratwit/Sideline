import type { Config } from "tailwindcss";

// Design tokens for the "scoreboard" visual identity:
// - Deep charcoal court background, not the generic cream/serif AI look
// - Condensed display face for scores/headers (scoreboard digit feel)
// - Accent colors read as "live broadcast" rather than generic brand blue
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        court: {
          bg: "#14181C",       // near-black charcoal, like a dim arena
          panel: "#1C2127",     // card/panel surface
          line: "#2A3038",      // hairline dividers
        },
        chalk: {
          DEFAULT: "#F2F3F0",  // primary text, off-white
          dim: "#8B93A1",       // secondary/meta text
        },
        signal: {
          orange: "#FF6B35",   // primary accent - live/energy
          blue: "#2E7DFF",     // links, secondary accent
          green: "#2BA84A",    // positive score/live indicator
          red: "#E5484D",      // negative vote / down
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        card: "6px",
      },
    },
  },
  plugins: [],
};
export default config;
