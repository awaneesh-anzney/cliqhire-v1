import Link from "next/link";
import { Twitter, Linkedin, Github, Mail, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-slate-50/50">
      <div className="w-full p-4">
        
        {/* 🔹 Main Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-6">
          
          {/* Logo + Description (Takes up more space on large screens) */}
          <div className="md:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                ATS<span className="text-blue-600">.</span>
              </h2>
            </Link>
            <p className="text-base text-slate-500 leading-relaxed max-w-sm">
              The world's leading smart hiring platform. We help ambitious teams 
              streamline their recruitment and build the future, faster.
            </p>
            <div className="flex gap-4">
              <SocialLink icon={<Twitter size={18} />} href="#" />
              <SocialLink icon={<Linkedin size={18} />} href="#" />
              <SocialLink icon={<Github size={18} />} href="#" />
            </div>
          </div>

          {/* Links Sections (3 Columns) */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <FooterGroup title="Product" links={["Features", "Pricing", "Integrations", "Updates"]} />
            <FooterGroup title="Company" links={["About", "Careers", "Blog", "Contact"]} />
            <FooterGroup title="Legal" links={["Privacy", "Terms", "Security", "Cookies"]} />
          </div>
        </div>

        {/* 🔹 Bottom Section: Meta Info */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <p>© {new Date().getFullYear()} ATS Inc.</p>
            <div className="hidden sm:flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors">
              <Globe size={14} />
              <span>English (US)</span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <p className="text-sm text-slate-400 italic">
              "Building the teams of tomorrow."
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* --- Reusable Components for Clean Code --- */

function FooterGroup({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link}>
            <Link 
              href="#" 
              className="text-sm text-slate-500 hover:text-blue-600 transition-all duration-200"
            >
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <Link 
      href={href} 
      className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-600 hover:shadow-sm transition-all"
    >
      {icon}
    </Link>
  );
}