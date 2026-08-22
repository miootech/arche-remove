import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hintergrund entfernen kostenlos – arche.remove",
  description: "Entferne Bildhintergründe automatisch in Sekunden direkt im Browser. 100% kostenlos, unbegrenzt, ohne Upload. KI Hintergrund Entferner.",
  alternates: { canonical: "https://arche-remove.pages.dev/background-remover" },
  openGraph: {
    title: "Hintergrund entfernen kostenlos – arche.remove",
    description: "Kostenloser KI Hintergrund Entferner. 100% im Browser, ohne Upload.",
    url: "https://arche-remove.pages.dev/background-remover",
    type: "website",
    locale: "de_DE",
  },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Ist arche.remove wirklich kostenlos?", acceptedAnswer: { "@type": "Answer", text: "Ja, arche.remove ist 100% kostenlos. Keine Credits, keine täglichen Limits, keine Anmeldung." } },
    { "@type": "Question", name: "Werden meine Bilder hochgeladen?", acceptedAnswer: { "@type": "Answer", text: "Nein. Alle Verarbeitung passiert lokal in deinem Browser. Deine Bilder verlassen dein Gerät nicht." } },
    { "@type": "Question", name: "Welche Bildformate werden unterstützt?", acceptedAnswer: { "@type": "Answer", text: "PNG, JPG, WebP, GIF, BMP und AVIF werden automatisch erkannt und unterstützt." } },
    { "@type": "Question", name: "Kann ich den Hintergrund transparent machen?", acceptedAnswer: { "@type": "Answer", text: "Ja. Das Ergebnis wird als transparente PNG- oder WebP-Datei exportiert." } },
    { "@type": "Question", name: "Brauche ich eine Internetverbindung?", acceptedAnswer: { "@type": "Answer", text: "Nur beim ersten Aufruf – dann wird das KI-Modell einmalig geladen und im Browser zwischengespeichert." } },
  ],
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "arche.remove", item: "https://arche-remove.pages.dev/" },
    { "@type": "ListItem", position: 2, name: "Hintergrund Entferner", item: "https://arche-remove.pages.dev/background-remover" },
  ],
};

export default function BackgroundRemover() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="min-h-[100svh] bg-background text-foreground">
        <nav className="text-sm text-muted-foreground px-4 sm:px-6 pt-4 max-w-3xl mx-auto">
          <a href="https://arche-remove.pages.dev/" className="hover:text-foreground">arche.remove</a>
          <span className="mx-1">/</span>
          <span className="text-foreground">Hintergrund Entferner</span>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance">
              Hintergrund entfernen <span className="text-amber-accent">kostenlos</span> – arche.remove
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              arche.remove ist ein kostenloser KI Hintergrund Entferner, der
              vollständig in deinem Browser läuft. Kein Upload, keine Anmeldung,
              unbegrenzte Nutzung. Das KI-Modell läuft lokal über WebAssembly,
              WebGL oder WebGPU.
            </p>
            <a href="https://arche-remove.pages.dev/" className="inline-flex items-center gap-2 mt-6 h-12 px-6 rounded-2xl bg-amber-accent text-white font-semibold hover:opacity-90 transition-opacity">
              Jetzt Hintergrund entfernen →
            </a>
          </div>
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Wie funktioniert arche.remove?</h2>
            <p className="text-muted-foreground leading-relaxed">
              arche.remove nutzt ein neuronales Netz (ISNet), das über WebAssembly,
              WebGL oder WebGPU direkt auf deiner Hardware läuft. Beim ersten Aufruf
              wird das Modell einmalig geladen und im Browser zwischengespeichert.
              Danach werden alle Bildverarbeitungen lokal durchgeführt. Deine Bilder
              verlassen zu keinem Zeitpunkt dein Gerät.
            </p>
          </section>
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Vorteile von arche.remove</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>100% kostenlos – keine Credits, keine Limits</li>
              <li>Privatsphäre: Bilder verlassen dein Gerät nicht</li>
              <li>Unbegrenzte Nutzung – kein Tageslimit</li>
              <li>Keine Anmeldung erforderlich</li>
              <li>Kein Wasserzeichen im Ergebnis</li>
              <li>Originalauflösung wird erhalten</li>
              <li>Export als PNG oder WebP</li>
              <li>Before/After Vergleich mit Schieberegler</li>
              <li>Hintergrund ersetzen (Farbe, Verlauf, Bild)</li>
            </ul>
          </section>
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Unterstützte Formate</h2>
            <p className="text-muted-foreground">PNG · JPG · WebP · GIF · BMP · AVIF</p>
          </section>
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
            <div className="space-y-3">
              <div><h3 className="font-semibold">Ist arche.remove wirklich kostenlos?</h3><p className="text-muted-foreground text-sm mt-1">Ja, 100% kostenlos. Keine Limits.</p></div>
              <div><h3 className="font-semibold">Werden meine Bilder hochgeladen?</h3><p className="text-muted-foreground text-sm mt-1">Nein. Alles passiert lokal in deinem Browser.</p></div>
              <div><h3 className="font-semibold">Welche Formate?</h3><p className="text-muted-foreground text-sm mt-1">PNG, JPG, WebP, GIF, BMP, AVIF.</p></div>
              <div><h3 className="font-semibold">Brauche ich Internet?</h3><p className="text-muted-foreground text-sm mt-1">Nur beim ersten Aufruf. Danach cached.</p></div>
            </div>
          </section>
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Weitere arche Tools</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <a href="https://arche-pdf.pages.dev/" className="block p-5 rounded-2xl bg-surface ring-1 ring-inset ring-border hover:ring-amber-accent/40 transition-all">
                <h3 className="font-semibold">arche.pdf</h3><p className="text-sm text-muted-foreground mt-1">Kostenlose PDF Tools.</p>
              </a>
              <a href="https://arche-links.pages.dev/" className="block p-5 rounded-2xl bg-surface ring-1 ring-inset ring-border hover:ring-amber-accent/40 transition-all">
                <h3 className="font-semibold">arche.links</h3><p className="text-sm text-muted-foreground mt-1">Kostenlose Linktree Alternative.</p>
              </a>
            </div>
          </section>
          <div className="pt-8 text-center">
            <a href="https://arche-remove.pages.dev/" className="inline-flex items-center gap-2 h-12 px-8 rounded-2xl bg-amber-accent text-white font-semibold hover:opacity-90 transition-opacity">
              Jetzt Bild hochladen →
            </a>
          </div>
        </main>
      </div>
    </>
  );
}
