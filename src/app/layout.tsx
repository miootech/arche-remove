import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://arche-remove.pages.dev";
const SITE_NAME = "arche.remove";
const OG_IMAGE = "/og-image.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title:
    "arche.remove – Free Background Remover | No Sign-up, No Limits, No Upload",
  description:
    "Remove image backgrounds instantly in your browser. 100% free, unlimited, no quality loss, and no uploads to external servers. Remove backgrounds. Keep everything else.",
  applicationName: SITE_NAME,
  authors: [{ name: "Arche", url: "https://arche-projects.pages.dev" }],
  creator: "Arche",
  publisher: "Arche",
  keywords: [
    "free background remover",
    "remove bg alternative",
    "ai background remover",
    "image background remover browser",
    "png transparent maker",
    "arche.remove",
    "background remover no signup",
    "cut out image online",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  category: "technology",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/favicon.svg" }],
    shortcut: [{ url: "/favicon.svg" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title:
      "arche.remove – Free Background Remover | No Sign-up, No Limits, No Upload",
    description:
      "Remove image backgrounds instantly in your browser. 100% free, unlimited, no uploads to external servers. Remove backgrounds. Keep everything else.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "arche.remove — Remove backgrounds. Keep everything else.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "arche.remove – Free Background Remover | No Sign-up, No Limits, No Upload",
    description:
      "Remove image backgrounds instantly in your browser. 100% free, unlimited, no uploads to external servers.",
    images: [OG_IMAGE],
    creator: "@arche",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF7" },
    { media: "(prefers-color-scheme: dark)", color: "#111113" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#webapp`,
      name: SITE_NAME,
      alternateName: "Arche Remove",
      url: SITE_URL,
      description:
        "Remove image backgrounds instantly in your browser. 100% free, unlimited, no quality loss, and no uploads to external servers. Remove backgrounds. Keep everything else.",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any (modern web browser)",
      browserRequirements:
        "Modern browser with WebAssembly support (Chrome, Edge, Firefox, Safari)",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "PriceSpecification",
          price: "0",
          priceCurrency: "USD",
        },
      },
      featureList: [
        "Automatic background removal",
        "Transparent PNG export",
        "Transparent WebP export",
        "Before/after comparison slider",
        "Original-resolution export",
        "Fast processing mode",
        "High-quality processing mode",
        "Background replacement (color, gradient, image)",
        "100% client-side processing",
        "No account required",
        "No upload to external servers",
        "No watermark",
      ],
      author: {
        "@type": "Organization",
        name: "Arche",
        url: "https://arche-projects.pages.dev",
      },
      publisher: {
        "@type": "Organization",
        name: "Arche",
        url: "https://arche-projects.pages.dev",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: SITE_NAME,
      url: SITE_URL,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      author: {
        "@type": "Organization",
        name: "Arche",
        url: "https://arche-projects.pages.dev",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://arche-projects.pages.dev/#org",
      name: "Arche",
      url: "https://arche-projects.pages.dev",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
