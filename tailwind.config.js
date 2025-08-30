import { platformSelect } from "nativewind/theme";
/** @type {import('tailwindcss').Config} */

module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        default: "#3f3f46",
        primary: "#db2777",
        secondary: "#7828c8",
        success: "#17c964",
        warning: "#f5a524",
        danger: {
          DEFAULT: "#f31260",
          600: "#db2777",
          700: "#be123c",
        },
        theme1: {
          primary: "#db2777",
          secondary: "#7828c8",
          success: "#17c964",
          warning: "#f5a524",
          danger: {
            DEFAULT: "#f31260",
            600: "#db2777",
            700: "#be123c",
          },
          default: "#3f3f46",
        },
        theme2: {
          primary: "#008ded",
          secondary: "#7828c8",
          success: "#17c964",
          warning: "#f5a524",
          danger: {
            DEFAULT: "#f31260",
            600: "#db2777",
            700: "#be123c",
          },
          default: "#3f3f46",
        },
      },
      borderRadius:{
        sm:"12px",
        md:"16px",
        lg:"20px",
        xl: "24px",
        "2xl": "28px",
        full:"9999px",
      },
      fontSize:{
        xs:"12px",
        sm:"14px",
        base:"16px",
        lg:"18px",
        xl:"22px"
      },
      fontFamily: {
        sans: ["Khmer-OS-Siemreap", "sans-serif"],
        kregular: ["Khmer-OS-Siemreap", "sans-serif"],
        mthin: ["Montserrat-Thin", "sans-serif"],
        mlight: ["Montserrat-Light", "sans-serif"],
        mregular: ["Montserrat-Regular", "sans-serif"],
        mmedium: ["Montserrat-Medium", "sans-serif"],
        msemibold: ["Montserrat-SemiBold", "sans-serif"],
        mbold: ["Montserrat-Bold", "sans-serif"],
        mblack: ["Montserrat-Black", "sans-serif"],
        piximisa: ["Piximisa", "sans-serif"],
        system: platformSelect({
          ios: "Khmer-OS-Siemreap",
          android: "Khmer-OS-Siemreap",
          default: "Khmer-OS-Siemreap",
        }),
    },
    },
  },
  plugins: [],
}