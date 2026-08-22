import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PNG Hintergrund entfernen kostenlos – arche.remove",
  description: "Entferne den Hintergrund von PNG Bildern kostenlos mit arche.remove. 100% im Browser, keine Anmeldung, unbegrenzt. PNG transparent machen in Sekunden.",
  alternates: { canonical: "https://arche-remove.pages.dev/remove-background-from-png" },
  openGraph: {
    title: "PNG Hintergrund entfernen kostenlos – arche.remove",
    description: "PNG transparent machen. 100% im Browser, kostenlos.",
    url: "https://arche-remove.pages.dev/remove-background-from-png",
    type: "website",
    locale: "de_DE",
  },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "arche.remove", item: "https://arche-remove.pages.dev/" },
    { "@type": "ListItem", position: 2, name: "PNG Hintergrund entfernen", item: "https://arche-remove.pages.dev/remove-background-from-png" },
  ],
};

export default function RemoveBackgroundFromPng() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="min-h-[100svh] bg-background text-foreground">
        <nav className="text-sm text-muted-foreground px-4 sm:px-6 pt-4 max-w-3xl mx-auto">
          <a href="https://arche-remove.pages.dev/" className="hover:text-foreground">arche.remove</a>
          <span className="mx-1">/</span>
          <span className="text-foreground">PNG Hintergrund entfernen</span>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
              PNG Hintergrund entfernen <span className="text-amber-accent">kostenlos</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Entferne den Hintergrund von PNG Bildern automatisch mit KI.
              Das Ergebnis ist eine transparente PNG-Datei – kostenlos, ohne Anmeldung.
            </p>
            <a href="https://arche-remove.pages.dev/" className="inline-flex items-center gap-2 mt-6 h-12 px-6 rounded-2xl bg-amber-accent text-white font-semibold hover:opacity-90 transition-opacity">
              PNG Hintergrund entfernen →
            </a>
          </div>
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">So entfernst du den PNG Hintergrund</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Lade dein PNG Bild hoch auf <a href="https://arche-remove.pages.dev/" className="text-amber-accent hover:underline">arche.remove</a></li>
              <li>Die KI entfernt automatisch den Hintergrund</li>
              <li>Vergleiche Original und Ergebnis mit dem Schieberegler</li>
              <li>Lade als transparente PNG oder WebP herunter</li>
            </ol>
          </section>
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Warum arche.remove für PNG?</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Originalauflösung wird erhalten</li>
              <li>Transparenter Hintergrund als PNG Export</li>
              <li>100% lokal – Bilder verlassen dein Gerät nicht</li>
              <li>Kein Wasserzeichen</li>
            </ul>
          </section>
          <div className="pt-8 text-center">
            <a href="https://arche-remove.pages.dev/" className="inline-flex items-center gap-2 h-12 px-8 rounded-2xl bg-amber-accent text-white font-semibold hover:opacity-90 transition-opacity">
              PNG transparent machen →
            </a>
          </div>
          <div className="flex flex-wrap gap-3 text-sm pb-8">
            <a href="https://arche-remove.pages.dev/background-remover" className="text-amber-accent hover:underline">Hintergrund Entferner</a>
            <span className="text-muted-foreground">·</span>
            <a href="https://arche-remove.pages.dev/remove-background-from-jpg" className="text-amber-accent hover:underline">JPG Hintergrund entfernen</a>
            <span className="text-muted-foreground">·</span>
            <a href="https://arche-remove.pages.dev/transparent-background" className="text-amber-accent hover:underline">Transparenter Hintergrund</a>
          </div>
        </main>
      </div>
    </>
  );
}
