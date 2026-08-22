import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ \u2013 arche.remove: KI Hintergrund Entferner kostenlos",
  description: "H\u00e4ufige Fragen zu arche.remove: Ist es kostenlos? Werden Bilder hochgeladen? Welche Formate? Alles beantwortet.",
  alternates: { canonical: "https://arche-remove.pages.dev/faq" },
  openGraph: {
    title: "FAQ \u2013 arche.remove",
    description: "H\u00e4ufige Fragen zum kostenlosen KI Hintergrund Entferner.",
    url: "https://arche-remove.pages.dev/faq",
    type: "website",
    locale: "de_DE",
  },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Ist arche.remove wirklich kostenlos?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ja, arche.remove ist 100% kostenlos. Keine Credits, keine täglichen Limits, keine Anmeldung. Unbegrenzte Nutzung."
      }
    },
    {
      "@type": "Question",
      "name": "Werden meine Bilder hochgeladen?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nein. Alle Verarbeitung passiert lokal in deinem Browser via WebAssembly, WebGL oder WebGPU. Deine Bilder verlassen dein Gerät nicht."
      }
    },
    {
      "@type": "Question",
      "name": "Welche Bildformate werden unterstützt?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "PNG, JPG, WebP, GIF, BMP und AVIF werden automatisch erkannt und unterstützt."
      }
    },
    {
      "@type": "Question",
      "name": "Kann ich den Hintergrund transparent machen?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ja. Das Ergebnis wird als transparente PNG- oder WebP-Datei exportiert."
      }
    },
    {
      "@type": "Question",
      "name": "Brauche ich eine Internetverbindung?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nur beim ersten Aufruf – dann wird das KI-Modell einmalig geladen und im Browser zwischengespeichert."
      }
    },
    {
      "@type": "Question",
      "name": "Kann ich mehrere Bilder gleichzeitig verarbeiten?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Aktuell wird ein Bild nach dem anderen verarbeitet. Batch-Verarbeitung ist für ein künftiges Release geplant."
      }
    },
    {
      "@type": "Question",
      "name": "Was ist ISNet?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ISNet (Image Segmentation Network) ist ein neuronales Netz, das für hochpräzise Hintergrund-Trennung trainiert wurde. Es läuft lokal via WebAssembly, WebGL oder WebGPU."
      }
    },
    {
      "@type": "Question",
      "name": "Welche Browser werden unterstützt?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Alle modernen Browser: Chrome, Edge, Firefox, Safari (inkl. iOS). WebGPU wird in unterstützten Browsern automatisch verwendet, sonst fällt arche.remove auf WebGL oder WebAssembly zurück."
      }
    },
    {
      "@type": "Question",
      "name": "Kann ich arche.remove kommerziell nutzen?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ja. arche.remove ist kostenlos nutzbar, auch kommerziell. Kein Wasserzeichen, keine Credits, keine Limits."
      }
    }
  ]
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "arche.remove",
      "item": "https://arche-remove.pages.dev/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "FAQ",
      "item": "https://arche-remove.pages.dev/faq"
    }
  ]
};

const preHydrationScript = `(function(){try{var t=localStorage.getItem('theme');if(t===null){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`;
const toggleScript = `(function(){var b=document.getElementById('theme-toggle');if(!b)return;b.addEventListener('click',function(){var d=document.documentElement.classList.toggle('dark');try{localStorage.setItem('theme',d?'dark':'light');}catch(e){}b.setAttribute('aria-label',d?'In den hellen Modus wechseln':'In den dunklen Modus wechseln');});})();`;

export default function FAQ() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script dangerouslySetInnerHTML={{ __html: preHydrationScript }} />
      <div className="min-h-[100svh] bg-background text-foreground">
        <nav className="text-sm text-muted-foreground px-4 sm:px-6 pt-4 max-w-3xl mx-auto flex items-center gap-2">
          <a href="https://arche-remove.pages.dev/" className="hover:text-foreground">arche.remove</a>
          <span className="mx-1">/</span>
          <span className="text-foreground">FAQ</span>
          <button id="theme-toggle" aria-label="In den dunklen Modus wechseln" type="button" className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-inset ring-border bg-surface text-foreground hover:bg-surface-elevated transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hidden dark:block"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="block dark:hidden"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></button>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance">
              FAQ –  <span className="text-amber-accent">arche.remove</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Auf dieser Seite beantworten wir die häufigsten Fragen zu arche.remove – dem kostenlosen KI Hintergrund Entferner, der 100% im Browser läuft. Kein Upload, keine Anmeldung, unbegrenzte Nutzung.
            </p>
            <a href="https://arche-remove.pages.dev/" className="inline-flex items-center gap-2 mt-6 h-12 px-6 rounded-2xl bg-amber-accent text-white font-semibold hover:opacity-90 transition-opacity">
              Jetzt Bild hochladen →
            </a>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Was ist arche.remove?</h2>
            <p className="text-muted-foreground leading-relaxed">
              arche.remove ist ein kostenloser KI Hintergrund Entferner, der vollständig im Browser läuft. Das KI-Modell (ISNet) wird über WebAssembly, WebGL oder WebGPU lokal auf deiner Hardware ausgeführt. Deine Bilder verlassen zu keinem Zeitpunkt dein Gerät. Es gibt keine Anmeldung, keine Credits, keine täglichen Limits und kein Wasserzeichen auf dem Ergebnis.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Im Gegensatz zu remove.bg, das im Free-Plan stark limitiert ist (Wasserzeichen, 0,25-Megapixel-Auflösungs-Cap, Bilder-Upload zum Server), bietet arche.remove alle Features komplett kostenlos an. Du kannst unbegrenzt viele Bilder in Originalauflösung freistellen und als transparente PNG oder WebP exportieren.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Vergleich: arche.remove vs. remove.bg Free</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead><tr className="border-b border-border"><th className="text-left py-3 px-4 font-semibold">Feature</th><th className="text-center py-3 px-4 font-semibold text-amber-accent">arche.remove</th><th className="text-center py-3 px-4 font-semibold text-muted-foreground">remove.bg Free</th></tr></thead>
                <tbody className="divide-y divide-border"><tr><td className="py-3 px-4">Kostenlos</td><td className="text-center py-3 px-4 text-success">Unbegrenzt</td><td className="text-center py-3 px-4 text-destructive">Limitiert</td></tr><tr><td className="py-3 px-4">Upload nötig</td><td className="text-center py-3 px-4 text-foreground">Nein – lokal</td><td className="text-center py-3 px-4 text-muted-foreground">Ja – Server</td></tr><tr><td className="py-3 px-4">Auflösung</td><td className="text-center py-3 px-4 text-foreground">Original</td><td className="text-center py-3 px-4 text-muted-foreground">0,25 MP</td></tr><tr><td className="py-3 px-4">Wasserzeichen</td><td className="text-center py-3 px-4 text-success">Keins</td><td className="text-center py-3 px-4 text-muted-foreground">Ja</td></tr><tr><td className="py-3 px-4">Formate</td><td className="text-center py-3 px-4 text-foreground">PNG, JPG, WebP, GIF, BMP, AVIF</td><td className="text-center py-3 px-4 text-muted-foreground">PNG, JPG</td></tr><tr><td className="py-3 px-4">Datenschutz</td><td className="text-center py-3 px-4 text-success">100% client-side</td><td className="text-center py-3 px-4 text-destructive">Server-basiert</td></tr><tr><td className="py-3 px-4">Preis</td><td className="text-center py-3 px-4 text-success">Kostenlos</td><td className="text-center py-3 px-4 text-muted-foreground">Free / Pro $24.99/mo</td></tr></tbody>
              </table>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">So nutzt du arche.remove</h2>
            <p className="text-muted-foreground leading-relaxed">
              Die Nutzung von arche.remove ist selbsterklärend und erfordert keine Anmeldung. Hier eine kurze Übersicht der wichtigsten Schritte.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Öffne <a href="https://arche-remove.pages.dev/" className="text-amber-accent hover:underline">arche.remove</a> im Browser</li><li>Lade dein Bild hoch (Drag & Drop oder Datei-Auswahl)</li><li>Warte auf „Preparing AI…“ – das Modell wird einmalig geladen und zwischengespeichert</li><li>Die KI entfernt automatisch den Hintergrund in Sekunden</li><li>Vergleiche Original und Ergebnis mit dem Schieberegler</li><li>Optional: ersetze den Hintergrund durch Farbe, Verlauf oder eigenes Bild</li><li>Lade als transparente PNG oder WebP herunter</li>
            </ol>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Features von arche.remove</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-xl bg-surface ring-1 ring-inset ring-border p-4">
                <h3 className="font-semibold text-sm">100% kostenlos</h3>
                <p className="text-xs text-muted-foreground mt-1">Keine Credits, keine Limits, keine Anmeldung. Unbegrenzte Nutzung.</p>
              </div><div className="rounded-xl bg-surface ring-1 ring-inset ring-border p-4">
                <h3 className="font-semibold text-sm">100% im Browser</h3>
                <p className="text-xs text-muted-foreground mt-1">Bilder verlassen dein Gerät nie. Kein Upload, kein Server.</p>
              </div><div className="rounded-xl bg-surface ring-1 ring-inset ring-border p-4">
                <h3 className="font-semibold text-sm">Originalauflösung</h3>
                <p className="text-xs text-muted-foreground mt-1">Volle Auflösung wird erhalten. Keine Kompression, keine Qualitätsverluste.</p>
              </div><div className="rounded-xl bg-surface ring-1 ring-inset ring-border p-4">
                <h3 className="font-semibold text-sm">KI-Modell ISNet</h3>
                <p className="text-xs text-muted-foreground mt-1">Neuronales Netz läuft lokal via WebAssembly, WebGL oder WebGPU.</p>
              </div><div className="rounded-xl bg-surface ring-1 ring-inset ring-border p-4">
                <h3 className="font-semibold text-sm">Before/After Slider</h3>
                <p className="text-xs text-muted-foreground mt-1">Vergleiche Original und Ergebnis mit interaktivem Schieberegler.</p>
              </div><div className="rounded-xl bg-surface ring-1 ring-inset ring-border p-4">
                <h3 className="font-semibold text-sm">Hintergrund ersetzen</h3>
                <p className="text-xs text-muted-foreground mt-1">Farbe, Verlauf oder eigenes Bild als neuen Hintergrund setzen.</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Datenschutz bei arche.remove</h2>
            <p className="text-muted-foreground leading-relaxed">
              arche.remove lädt deine Bilder niemals auf einen Server. Das KI-Modell (ISNet) läuft vollständig lokal in deinem Browser über WebAssembly, WebGL oder WebGPU. Das bedeutet: keine Server-Datenbank, kein Tracking deiner Bildinhalte, keine Daten, die missbraucht werden können. Ein wesentlicher Vorteil gegenüber remove.bg, das alle Bilder serverseitig verarbeitet und speichert.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">FAQ – Häufige Fragen</h2>
            <div className="space-y-3">
              <div><h3 className="font-semibold">Ist arche.remove wirklich kostenlos?</h3><p className="text-muted-foreground text-sm mt-1">Ja, arche.remove ist 100% kostenlos. Keine Credits, keine täglichen Limits, keine Anmeldung. Unbegrenzte Nutzung.</p></div><div><h3 className="font-semibold">Werden meine Bilder hochgeladen?</h3><p className="text-muted-foreground text-sm mt-1">Nein. Alle Verarbeitung passiert lokal in deinem Browser via WebAssembly, WebGL oder WebGPU. Deine Bilder verlassen dein Gerät nicht.</p></div><div><h3 className="font-semibold">Welche Bildformate werden unterstützt?</h3><p className="text-muted-foreground text-sm mt-1">PNG, JPG, WebP, GIF, BMP und AVIF werden automatisch erkannt und unterstützt.</p></div><div><h3 className="font-semibold">Kann ich den Hintergrund transparent machen?</h3><p className="text-muted-foreground text-sm mt-1">Ja. Das Ergebnis wird als transparente PNG- oder WebP-Datei exportiert.</p></div><div><h3 className="font-semibold">Brauche ich eine Internetverbindung?</h3><p className="text-muted-foreground text-sm mt-1">Nur beim ersten Aufruf – dann wird das KI-Modell einmalig geladen und im Browser zwischengespeichert.</p></div><div><h3 className="font-semibold">Kann ich mehrere Bilder gleichzeitig verarbeiten?</h3><p className="text-muted-foreground text-sm mt-1">Aktuell wird ein Bild nach dem anderen verarbeitet. Batch-Verarbeitung ist für ein künftiges Release geplant.</p></div><div><h3 className="font-semibold">Was ist ISNet?</h3><p className="text-muted-foreground text-sm mt-1">ISNet (Image Segmentation Network) ist ein neuronales Netz, das für hochpräzise Hintergrund-Trennung trainiert wurde. Es läuft lokal via WebAssembly, WebGL oder WebGPU.</p></div><div><h3 className="font-semibold">Welche Browser werden unterstützt?</h3><p className="text-muted-foreground text-sm mt-1">Alle modernen Browser: Chrome, Edge, Firefox, Safari (inkl. iOS). WebGPU wird in unterstützten Browsern automatisch verwendet, sonst fällt arche.remove auf WebGL oder WebAssembly zurück.</p></div><div><h3 className="font-semibold">Kann ich arche.remove kommerziell nutzen?</h3><p className="text-muted-foreground text-sm mt-1">Ja. arche.remove ist kostenlos nutzbar, auch kommerziell. Kein Wasserzeichen, keine Credits, keine Limits.</p></div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Weitere arche Tools</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <a href="https://arche-links.pages.dev/" className="block p-5 rounded-2xl bg-surface ring-1 ring-inset ring-border hover:ring-amber-accent/40 transition-all">
                <h3 className="font-semibold">arche.links</h3>
                <p className="text-sm text-muted-foreground mt-1">Kostenlose Linktree Alternative mit unbegrenzten Links.</p>
              </a><a href="https://arche-pdf.pages.dev/" className="block p-5 rounded-2xl bg-surface ring-1 ring-inset ring-border hover:ring-amber-accent/40 transition-all">
                <h3 className="font-semibold">arche.pdf</h3>
                <p className="text-sm text-muted-foreground mt-1">Kostenlose PDF Tools – Bearbeiten, Zusammenfügen, Signieren.</p>
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              Mehr Tools auf <a href="https://arche-website.pages.dev" className="text-amber-accent hover:underline">arche-website.pages.dev</a>
            </p>
          </section>

          <div className="pt-8 text-center">
            <a href="https://arche-remove.pages.dev/" className="inline-flex items-center gap-2 h-12 px-8 rounded-2xl bg-amber-accent text-white font-semibold hover:opacity-90 transition-opacity">
              Jetzt Hintergrund entfernen →
            </a>
          </div>
          <div className="flex flex-wrap gap-3 text-sm pb-8"><a href="https://arche-remove.pages.dev/background-remover" className="text-amber-accent hover:underline">Hintergrund Entferner</a> <span className="text-muted-foreground">·</span> <a href="https://arche-remove.pages.dev/remove-background-from-png" className="text-amber-accent hover:underline">PNG Hintergrund entfernen</a> <span className="text-muted-foreground">·</span> <a href="https://arche-remove.pages.dev/remove-background-from-jpg" className="text-amber-accent hover:underline">JPG Hintergrund entfernen</a> <span className="text-muted-foreground">·</span> <a href="https://arche-remove.pages.dev/transparent-background" className="text-amber-accent hover:underline">Transparenter Hintergrund</a></div>
        </main>
      </div>
      <script dangerouslySetInnerHTML={{ __html: toggleScript }} />
    </>
  );
}
