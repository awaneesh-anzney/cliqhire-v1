import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import About from "@/components/landing/About";
import Contact from "@/components/landing/Contact";
import Hero from "@/components/landing/Hero"; 

export default function Page() {
  return (
    <div>
      <Hero />
      <Features />
      <About />
      <Pricing />
      <Contact />
    </div>
  );
}