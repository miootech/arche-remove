"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Compact two-icon theme toggle.
 * - Sun icon shown when in dark mode (click → go to light).
 * - Moon icon shown when in light mode (click → go to dark).
 * - Avoids hydration mismatch by rendering nothing until mounted.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // setState in effect is the standard pattern for "mounted" flags — we
  // need to know we're on the client before reading the resolved theme to
  // avoid hydration mismatch (next-themes resolves the theme post-mount).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Placeholder with the same dimensions to avoid layout shift on hydration.
    return (
      <div
        className="h-9 w-9 rounded-full ring-1 ring-inset ring-border bg-surface"
        aria-hidden="true"
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-full",
        "bg-surface ring-1 ring-inset ring-border text-foreground",
        "hover:bg-surface-elevated transition-colors",
        "focus-amber",
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}
