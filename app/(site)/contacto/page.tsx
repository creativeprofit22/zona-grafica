import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfo from "@/components/contact/ContactInfo";
import { webPageSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Platiquemos sobre tu próximo proyecto. Escríbenos por WhatsApp, correo o llámanos.",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageSchema({
              name: "Contacto — Zona Gráfica",
              description: "Escríbenos para cotizar tu proyecto de diseño.",
              url: "/contacto",
            }),
          ).replace(/</g, "\\u003c"),
        }}
      />

      <ContactHero />

      <section
        className="page-padding"
        style={{ paddingTop: 0, paddingBottom: 0 }}
      >
        <div
          style={{
            maxWidth: "var(--max-width)",
            margin: "0 auto",
          }}
        >
          <ContactForm />
        </div>
      </section>

      <ContactInfo />
    </main>
  );
}
