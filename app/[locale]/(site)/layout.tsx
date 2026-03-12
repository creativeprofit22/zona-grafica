import { setRequestLocale } from "next-intl/server";
import CustomCursor from "@/components/effects/CustomCursor";
import PageTransition from "@/components/effects/PageTransition";
import RouteProgress from "@/components/effects/RouteProgress";

import ScrollProgress from "@/components/effects/ScrollProgress";
import SmoothScroll from "@/components/effects/SmoothScroll";
import FloatingCTA from "@/components/layout/FloatingCTA";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default async function SiteLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <CustomCursor />
      <PageTransition />
      <RouteProgress />
      <ScrollProgress />

      <Navbar />
      <SmoothScroll>{children}</SmoothScroll>
      <Footer />
      <FloatingCTA />
    </>
  );
}
