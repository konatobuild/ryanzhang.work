import { Features } from "@/components/sections/Features";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { LogoWall } from "@/components/sections/LogoWall";
import { Nav } from "@/components/sections/Nav";
import { Testimonial } from "@/components/sections/Testimonial";

export default function Page() {
  return (
    <>
      <Nav />
      <Hero />
      <Features />
      <LogoWall />
      <Testimonial />
      <Footer />
    </>
  );
}
