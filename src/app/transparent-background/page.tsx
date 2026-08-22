import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transparenter Hintergrund kostenlos – arche.remove",
  description: "Mache Bildhintergründe transparent mit arche.remove. KI-gestützt, 100% im Browser, kostenlos. Export als transparente PNG oder WebP.",
  alternates: { canonical: "https://arche-remove.pages.dev/transparent-background" },
  openGraph: {
    title: "Transparenter Hintergrund kostenlos – arche.remove",
    description: "Bild transparent machen. 100% im Browser, kostenlos.",
    url: "https://arche-remove.pages.dev/transparent-background",
    type: "website",
    locale: "de_DE",
  },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "arche.remove", item: "https://arche-remove.pages.dev/" },
    { "@type": "ListItem", position: 2, name: "Transparenter Hintergrund", item: "https://arche-remove.pages.dev/transparent-background" },
  ],
};

export default function TransparentBackground() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="min-h-[100svh] bg-background text-foreground">
        <nav className="text-sm text-muted-foreground px-4 sm:px-6 pt-4 max-w-3xl mx-auto">
          <a href="https://arche-remove.pages.dev/" className="hover:text-foreground">arche.remove</a>
          <span className="mx-1">/</span>
          <span className="text-foreground">Transparenter Hintergrund</span>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
              Bild Hintergrund <span className="text-amber-accent">transparent</span> machen
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Mache den Hintergrund jedes Bildes transparent – kostenlos mit KI.
              Export als transparente PNG- oder WebP-Datei.
            </p>
            <a href="https://arche-remove.pages.dev/" className="inline-flex items-center gap-2 mt-6 h-12 px-6 rounded-2xl bg-amber-accent text-white font-semibold hover:opacity-90 transition-opacity">
              Hintergrund transparent machen →
            </a>
          </div>
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Wann brauchst du transparente Hintergründe?</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Logos und Grafiken für Webdesign</li>
              <li>Produktfotos für Online-Shops</li>
              <li>Profilebilder und Avatare</li>
              <li>Präsentationen und Dokumente</li>
              <li>Social Media Posts mit freigestellten Motiven</li>
            </ul>
          </section>
          <div className="pt-8 text-center">
            <a href="https://arche-remove.pages.dev/" className="inline-flex items-center gap-2 h-12 px-8 rounded-2xl bg-amber-accent text-white font-semibold hover:opacity-90 transition-opacity">
              Jetzt transparent machen →
            </a>
          </div>
          <div className="flex flex-wrap gap-3 text-sm pb-8">
            <a href="https://arche-remove.pages.dev/background-remover" className="text-amber-accent hover:underline">Hintergrund Entferner</a>
            <span className="text-muted-foreground">·</span>
            <a href="https://arche-remove.pages.dev/remove-background-from-png" className="text-amber-accent hover:underline">PNG Hintergrund entfernen</a>
            <span className="text-muted-foreground">·</span>
            <a href="https://arche-remove.pages.dev/remove-background-from-jpg" className="text-amber-accent hover:underline">JPG Hintergrund entfernen</a>
          </div>
        </main>
      </div>
    </>
  );
}
