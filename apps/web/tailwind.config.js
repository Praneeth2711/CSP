/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Government + Startup Hybrid Premium Palette
        gov: {
          green: {
            50: "#f0fdf4",
            100: "#dcfce7",
            600: "#16a34a",
            700: "#15803d",
            800: "#166534"
          },
          blue: {
            50: "#eff6ff",
            100: "#dbeafe",
            600: "#2563eb",
            700: "#1d4ed8",
            800: "#1e40af"
          },
          orange: {
            50: "#fff7ed",
            100: "#ffedd5",
            500: "#f97316",
            600: "#ea580c",
            700: "#c2410c"
          }
        }
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(148, 163, 184, 0.08), 0 2px 8px -1px rgba(148, 163, 184, 0.04)",
        premium: "0 10px 30px -5px rgba(22, 163, 74, 0.05), 0 4px 12px -2px rgba(37, 99, 235, 0.03)"
      }
    }
  },
  plugins: []
};
