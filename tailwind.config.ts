import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        court: {
          bg: "#14181C",       
          panel: "#1C2127",    
          line: "#2A3038",   
        },
        chalk: {
          DEFAULT: "#F2F3F0", 
          dim: "#8B93A1",     
        },
        signal: {
          orange: "#FF6B35",   
          blue: "#2E7DFF",    
          green: "#2BA84A",  
          red: "#E5484D",    
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
