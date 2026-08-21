"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

/**
 * Wraps the app with next-themes so the `.dark` class is applied to <html>
 * when the user picks the dark theme. The default is light, no system
 * fallback — we want an explicit, predictable theme, not a guessing game.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
