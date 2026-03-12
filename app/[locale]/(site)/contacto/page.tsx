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
    title: locale === "en" ? "Contact" : "Contacto",
    description:
      locale === "en"
        ? "Let's talk about your next project. Message us on WhatsApp, email or call us."
        : "Platiquemos sobre tu próximo proyecto. Escríbenos por WhatsApp, correo o llámanos.",
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
              name: `${locale === "en" ? "Contact" : "Contacto"} · Zona Gráfica`,
              description:
                locale === "en"
                  ? "Get in touch to quote your design project."
                  : "Escríbenos para cotizar tu proyecto de diseño.",
              url: "/contacto",
              locale: locale as "es" | "en",
            }),
          ).replace(/</g, "\\u003c"),
        }}
      />

      <ContactHero
        label={locale === "en" ? "(contact)" : "(contacto)"}
        titleLine1={locale === "en" ? "Let's talk" : "Platiquemos"}
        titleLine2={
          locale === "en" ? "about your project" : "sobre tu proyecto"
        }
        subtitle={
          locale === "en"
            ? "Write us directly or fill out the form. We respond within 24 hours."
            : "Escríbenos directo o llena el formulario. Te respondemos en menos de 24 horas."
        }
        whatsappUrl={siteConfig.contact.whatsapp}
        whatsappLabel={
          locale === "en" ? "Message us on WhatsApp" : "Escríbenos por WhatsApp"
        }
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
