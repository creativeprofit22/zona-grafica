import type { NavLink, SiteConfig } from "@/types/content";

export const siteConfig: SiteConfig = {
  name: "Zona Gráfica",
  tagline: "Diseño con raíz — desde San Miguel de Allende, desde 1993",
  description:
    "Despacho de diseño con más de 30 años creando identidades, carteles, libros y marcas desde San Miguel de Allende. Branding, editorial, web, fotografía, ilustración y cartelería para cultura, turismo y empresa.",
  url: "https://zonagrafica.com.mx",
  locale: "es-MX",
  location: {
    city: "San Miguel de Allende",
    state: "Guanajuato",
    country: "MX",
  },
  contact: {
    phone: "+52 415 114 0311",
    email: "jesus@zonagrafica.com.mx",
    whatsapp: "https://wa.me/524151140311",
  },
  social: {
    instagram: "https://instagram.com/zonagrafica",
    facebook: "https://facebook.com/zonagraficaSMA",
    behance: "https://behance.net/zonagrafica",
  },
};

export const navigation: NavLink[] = [
  { number: "01", label: "Inicio", href: "/" },
  { number: "02", label: "Portafolio", href: "/portafolio" },
  { number: "03", label: "Servicios", href: "/servicios" },
  { number: "04", label: "Nosotros", href: "/nosotros" },
  { number: "05", label: "Blog", href: "/blog" },
  { number: "06", label: "Contacto", href: "/contacto" },
];
