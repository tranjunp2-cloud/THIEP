import "./landing.css";
import { Faq, FinalCta, Footer, Pricing } from "@/components/landing/Closing";
import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Intro } from "@/components/landing/Intro";
import { Manifesto } from "@/components/landing/Manifesto";
import { Marquee } from "@/components/landing/Marquee";
import { Nav } from "@/components/landing/Nav";
import { Personalize } from "@/components/landing/Personalize";
import { SmoothScroll } from "@/components/landing/SmoothScroll";
import { SiteMusic } from "@/components/site/SiteMusic";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Templates } from "@/components/landing/Templates";

export default function Home() {
  return (
    <AuthProvider>
      <SmoothScroll />
      <Intro />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Manifesto />
        <Templates />
        <HowItWorks />
        <Personalize />
        <Features />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <SiteMusic />
    </AuthProvider>
  );
}
