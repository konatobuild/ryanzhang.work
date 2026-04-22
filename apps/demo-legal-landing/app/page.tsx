import About from "@/components/sections/About";
import Attorneys from "@/components/sections/Attorneys";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import RevealScript from "@/components/RevealScript";

export default function Page() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Attorneys />
      <Contact />
      <Footer />
      <RevealScript />
    </>
  );
}
