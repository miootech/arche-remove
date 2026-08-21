"use client";

/**
 * Minimalist footer.
 * Text: "Made with ♥ by Arche" — Arche links to arche-projects.pages.dev.
 */
export function Footer() {
  return (
    <footer
      className={
        "mt-auto w-full border-t border-border/60 py-6 px-4 sm:px-6 " +
        "text-center text-xs text-muted-foreground/70"
      }
      style={{
        // Respect the iOS safe-area at the bottom.
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1.5rem)",
      }}
    >
      <p className="flex items-center justify-center gap-1.5 flex-wrap">
        <span>Made with</span>
        <span aria-label="love" role="img" className="text-amber-accent">
          ♥
        </span>
        <span>by</span>
        <a
          href="https://arche-website.pages.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground hover:text-amber-accent transition-colors underline-offset-4 hover:underline focus-amber"
        >
          Arche
        </a>
      </p>
    </footer>
  );
}
