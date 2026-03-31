import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import About from "@/components/landing/About";
import Contact from "@/components/landing/Contact";
import Hero from "@/components/landing/Hero"; // Hero aap khud bana sakte hain ya sirf h1 rakh sakte hain

export default function Page() {
  return (
    <div>
      {/* <section className="h-[70vh] flex items-center justify-center text-center bg-white">
        <div>
          <h1 className="text-6xl font-extrabold mb-4">Hire Smarter, <span className="text-blue-600">Faster.</span></h1>
          <p className="text-xl text-slate-500">The next-gen Applicant Tracking System.</p>
        </div>
      </section> */}
      <Hero/>

      <Features />
      <About />
      <Pricing />
      <Contact />
    </div>
  );
}