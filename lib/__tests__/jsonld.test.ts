import { describe, expect, it, vi } from "vitest";

vi.mock("@/data/site", () => ({
  siteConfig: {
    name: "Test Site",
    url: "https://test.com",
    description: "Test description",
    locale: "es-MX",
    location: {
      city: "Test City",
      state: "Test State",
      country: "MX",
    },
    contact: {
      phone: "+52 000 000 0000",
      email: "test@test.com",
    },
    social: {
      instagram: "https://instagram.com/test",
      facebook: "https://facebook.com/test",
      behance: "https://behance.net/test",
    },
  },
}));

import {
  aboutPageSchema,
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  organizationSchema,
  webPageSchema,
  webSiteSchema,
} from "../jsonld";

describe("jsonld", () => {
  describe("organizationSchema", () => {
    it("returns correct @context and @type", () => {
      const schema = organizationSchema();
      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("LocalBusiness");
    });

    it("includes name, logo, and description", () => {
      const schema = organizationSchema();
      expect(schema.name).toBe("Test Site");
      expect(schema.url).toBe("https://test.com");
      expect(schema.logo).toBe("https://test.com/images/logo.svg");
      expect(schema.description).toBe("Test description");
    });

    it("includes contact info", () => {
      const schema = organizationSchema();
      expect(schema.telephone).toBe("+52 000 000 0000");
      expect(schema.email).toBe("test@test.com");
    });

    it("includes sameAs social links", () => {
      const schema = organizationSchema();
      expect(schema.sameAs).toContain("https://instagram.com/test");
      expect(schema.sameAs).toContain("https://facebook.com/test");
      expect(schema.sameAs).toContain("https://behance.net/test");
    });

    it("includes address", () => {
      const schema = organizationSchema();
      expect(schema.address["@type"]).toBe("PostalAddress");
      expect(schema.address.addressLocality).toBe("Test City");
      expect(schema.address.addressCountry).toBe("MX");
    });
  });

  describe("webSiteSchema", () => {
    it("returns correct type and fields", () => {
      const schema = webSiteSchema();
      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("WebSite");
      expect(schema.name).toBe("Test Site");
      expect(schema.url).toBe("https://test.com");
      expect(schema.inLanguage).toBe("es-MX");
    });
  });

  describe("webPageSchema", () => {
    it("builds correct URL from path", () => {
      const schema = webPageSchema({
        name: "Services",
        description: "Our services",
        url: "/servicios",
      });
      expect(schema["@type"]).toBe("WebPage");
      expect(schema.url).toBe("https://test.com/servicios");
      expect(schema.name).toBe("Services");
      expect(schema.description).toBe("Our services");
    });

    it("includes isPartOf reference", () => {
      const schema = webPageSchema({
        name: "Test",
        description: "Test",
        url: "/test",
      });
      expect(schema.isPartOf["@type"]).toBe("WebSite");
      expect(schema.isPartOf.name).toBe("Test Site");
    });
  });

  describe("aboutPageSchema", () => {
    it("returns AboutPage type with correct URL", () => {
      const schema = aboutPageSchema({
        name: "About Us",
        description: "About page",
      });
      expect(schema["@type"]).toBe("AboutPage");
      expect(schema.url).toBe("https://test.com/nosotros");
      expect(schema.inLanguage).toBe("es-MX");
    });
  });

  describe("articleSchema", () => {
    it("includes author, datePublished, and publisher", () => {
      const schema = articleSchema({
        headline: "Test Article",
        description: "Article desc",
        datePublished: "2026-01-01",
        url: "/blog/test",
      });
      expect(schema["@type"]).toBe("BlogPosting");
      expect(schema.headline).toBe("Test Article");
      expect(schema.datePublished).toBe("2026-01-01");
      expect(schema.url).toBe("https://test.com/blog/test");
      expect(schema.author.name).toBe("Test Site");
      expect(schema.publisher.name).toBe("Test Site");
      expect(schema.publisher.logo.url).toBe(
        "https://test.com/images/logo.svg",
      );
    });

    it("includes image when provided", () => {
      const schema = articleSchema({
        headline: "Test",
        description: "Test",
        datePublished: "2026-01-01",
        url: "/blog/test",
        image: "/images/test.jpg",
      });
      expect(schema.image).toBe("https://test.com/images/test.jpg");
    });

    it("omits image when not provided", () => {
      const schema = articleSchema({
        headline: "Test",
        description: "Test",
        datePublished: "2026-01-01",
        url: "/blog/test",
      });
      expect(schema).not.toHaveProperty("image");
    });
  });

  describe("faqSchema", () => {
    it("generates correct Question/Answer pairs", () => {
      const items = [
        { question: "What is this?", answer: "A test." },
        { question: "Why?", answer: "Because." },
      ];
      const schema = faqSchema(items);
      expect(schema["@type"]).toBe("FAQPage");
      expect(schema.mainEntity).toHaveLength(2);
      expect(schema.mainEntity[0]["@type"]).toBe("Question");
      expect(schema.mainEntity[0].name).toBe("What is this?");
      expect(schema.mainEntity[0].acceptedAnswer["@type"]).toBe("Answer");
      expect(schema.mainEntity[0].acceptedAnswer.text).toBe("A test.");
      expect(schema.mainEntity[1].name).toBe("Why?");
    });
  });

  describe("breadcrumbSchema", () => {
    it("generates ListItem array with correct positions", () => {
      const items = [
        { name: "Home", url: "/" },
        { name: "Blog", url: "/blog" },
        { name: "Post", url: "/blog/post" },
      ];
      const schema = breadcrumbSchema(items);
      expect(schema["@type"]).toBe("BreadcrumbList");
      expect(schema.itemListElement).toHaveLength(3);
      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[0].name).toBe("Home");
      expect(schema.itemListElement[0].item).toBe("https://test.com/");
      expect(schema.itemListElement[1].position).toBe(2);
      expect(schema.itemListElement[2].position).toBe(3);
      expect(schema.itemListElement[2].item).toBe("https://test.com/blog/post");
    });
  });
});
