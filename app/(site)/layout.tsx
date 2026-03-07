import CustomCursor from "@/components/effects/CustomCursor";
import PageTransition from "@/components/effects/PageTransition";
import RouteProgress from "@/components/effects/RouteProgress";
import ScrollColorTransition from "@/components/effects/ScrollColorTransition";
import ScrollProgress from "@/components/effects/ScrollProgress";
import SmoothScroll from "@/components/effects/SmoothScroll";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <CustomCursor />
      <PageTransition />
      <RouteProgress />
      <ScrollProgress />
      <ScrollColorTransition />
      <Navbar />
      <SmoothScroll>{children}</SmoothScroll>
      <Footer />
    </>
  );
}
