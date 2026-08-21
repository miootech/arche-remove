import type { Config } from "tailwindcss";

/**
 * arche.remove — Tailwind v4 configuration.
 *
 * In Tailwind v4 the bulk of the configuration lives in `src/app/globals.css`
 * via the `@theme` directive. This JS file is kept minimal — only the
 * `darkMode: "class"` strategy is declared here so next-themes can flip the
 * `.dark` class on <html>.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
