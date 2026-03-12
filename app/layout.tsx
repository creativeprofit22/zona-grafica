import type { Metadata } from "next";
import localFont from "next/font/local";
import Analytics from "@/components/Analytics";
import { siteConfig } from "@/data/site";
import { organizationSchema, webSiteSchema } from "@/lib/jsonld";
import "./globals.css";

const clashDisplay = localFont({
  src: [
    {
      path: "../public/fonts/clash-display.woff2",
      style: "normal",
    },
  ],
  weight: "400 700",
  variable: "--font-heading",
  display: "swap",
});

const sourceSerif = localFont({
  src: [
    {
      path: "../public/fonts/source-serif-4.woff2",
      style: "normal",
    },
    {
      path: "../public/fonts/source-serif-4-italic.woff2",
      style: "italic",
    },
  ],
  weight: "400 700",
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} · Estudio Creativo en ${siteConfig.location.city}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    locale: siteConfig.locale,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: siteConfig.url,
  },
  other: {
    google: "notranslate",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" translate="no" suppressHydrationWarning>
      <body
        className={`${clashDisplay.variable} ${sourceSerif.variable}`}
        suppressHydrationWarning
      >
        <a className="skip-to-content" href="#main-content">
          Ir al contenido
        </a>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema()).replace(
              /</g,
              "\\u003c",
            ),
          }}
        />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteSchema()).replace(/</g, "\\u003c"),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
