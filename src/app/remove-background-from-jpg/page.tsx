import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JPG Hintergrund entfernen kostenlos – arche.remove",
  description: "Entferne den Hintergrund von JPG Bildern kostenlos mit arche.remove. 100% im Browser, keine Anmeldung, unbegrenzt. JPG freistellen in Sekunden.",
  alternates: { canonical: "https://arche-remove.pages.dev/remove-background-from-jpg" },
  openGraph: {
    title: "JPG Hintergrund entfernen kostenlos – arche.remove",
    description: "JPG freistellen. 100% im Browser, kostenlos.",
    url: "https://arche-remove.pages.dev/remove-background-from-jpg",
    type: "website",
    locale: "de_DE",
  },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "arche.remove", item: "https://arche-remove.pages.dev/" },
    { "@type": "ListItem", position: 2, name: "JPG Hintergrund entfernen", item: "https://arche-remove.pages.dev/remove-background-from-jpg" },
  ],
};

export default function RemoveBackgroundFromJpg() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="min-h-[100svh] bg-background text-foreground">
        <nav className="text-sm text-muted-foreground px-4 sm:px-6 pt-4 max-w-3xl mx-auto">
          <a href="https://arche-remove.pages.dev/" className="hover:text-foreground">arche.remove</a>
          <span className="mx-1">/</span>
          <span className="text-foreground">JPG Hintergrund entfernen</span>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
              JPG Hintergrund entfernen <span className="text-amber-accent">kostenlos</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Entferne den Hintergrund von JPG Bildern automatisch mit KI.
              Das Ergebnis wird als transparente PNG exportiert – kostenlos.
            </p>
            <a href="https://arche-remove.pages.dev/" className="inline-flex items-center gap-2 mt-6 h-12 px-6 rounded-2xl bg-amber-accent text-white font-semibold hover:opacity-90 transition-opacity">
              JPG Hintergrund entfernen →
            </a>
          </div>
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">JPG freistellen in 3 Schritten</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Lade dein JPG hoch auf <a href="https://arche-remove.pages.dev/" className="text-amber-accent hover:underline">arche.remove</a></li>
              <li>Die KI entfernt den Hintergrund automatisch</li>
              <li>Lade als transparente PNG herunter</li>
            </ol>
            <p className="text-sm text-muted-foreground">Hinweis: JPG unterstützt keine Transparenz. Das Ergebnis wird daher als PNG exportiert.</p>
          </section>
          <div className="pt-8 text-center">
            <a href="https://arche-remove.pages.dev/" className="inline-flex items-center gap-2 h-12 px-8 rounded-2xl bg-amber-accent text-white font-semibold hover:opacity-90 transition-opacity">
              JPG freistellen →
            </a>
          </div>
          <div className="flex flex-wrap gap-3 text-sm pb-8">
            <a href="https://arche-remove.pages.dev/background-remover" className="text-amber-accent hover:underline">Hintergrund Entferner</a>
            <span className="text-muted-foreground">·</span>
            <a href="https://arche-remove.pages.dev/remove-background-from-png" className="text-amber-accent hover:underline">PNG Hintergrund entfernen</a>
            <span className="text-muted-foreground">·</span>
            <a href="https://arche-remove.pages.dev/transparent-background" className="text-amber-accent hover:underline">Transparenter Hintergrund</a>
          </div>
        </main>
      </div>
    </>
  );
}
