import CustomCursor from "@/components/effects/CustomCursor";
import PageTransition from "@/components/effects/PageTransition";
import RouteProgress from "@/components/effects/RouteProgress";
import ScrollColorTransition from "@/components/effects/ScrollColorTransition";
import ScrollProgress from "@/components/effects/ScrollProgress";
import SmoothScroll from "@/components/effects/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
