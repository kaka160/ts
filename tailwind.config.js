/** @type {import('tailwindcss').Config} */
module.exports = {
  // Quan trọng: Tailwind v3 dùng 'content' thay vì 'purge'
  content: [
    "./src/**/*.{js,jsx,ts,tsx,vue}",
    "./index.html",
    "./app.html",
  ],
  darkMode: "class", // Đổi từ selector sang class cho đơn giản
  theme: {
    extend: {
      fontFamily: {
        mono: ["Roboto Mono", "monospace"],
      },
      // Thêm các màu sắc đặc trưng cho EV App nếu muốn
      colors: {
        evBlue: "#0068FF",
        evGreen: "#22C55E",
      }
    },
  },
  plugins: [],
};