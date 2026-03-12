import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import ContactForm from "@/components/contact/ContactForm";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfo from "@/components/contact/ContactInfo";
import { siteConfig } from "@/data/site";
import { localeAlternates } from "@/lib/alternates";
import { webPageSchema } from "@/lib/jsonld";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Contacto",
    description:
      "Platiquemos sobre tu próximo proyecto. Escríbenos por WhatsApp, correo o llámanos.",
    alternates: localeAlternates("contacto", locale),
  };
}

export default async function ContactoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageSchema({
              name: "Contacto · Zona Gráfica",
              description: "Escríbenos para cotizar tu proyecto de diseño.",
              url: "/contacto",
            }),
          ).replace(/</g, "\\u003c"),
        }}
      />

      <ContactHero
        label="(contacto)"
        titleLine1="Platiquemos"
        titleLine2="sobre tu proyecto"
        subtitle="Escríbenos directo o llena el formulario. Te respondemos en menos de 24 horas."
        whatsappUrl={siteConfig.contact.whatsapp}
        whatsappLabel="Escríbenos por WhatsApp"
      />

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

      <ContactInfo
        contact={siteConfig.contact}
        location={siteConfig.location}
        social={siteConfig.social}
      />
    </main>
  );
}
