export default function Contact() {
  return (
    <section id="contact" className="py-24 px-4 md:px-10 mb-20">
      <div className="w-full max-w-[1800px] mx-auto bg-blue-600 rounded-[4rem] p-12 md:p-24 overflow-hidden relative shadow-[0_50px_100px_-20px_rgba(37,99,235,0.4)]">
        
        {/* Background Visuals */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 -skew-x-12 translate-x-20" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center text-white">
          <div>
            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">Ready to build <br /> your dream team?</h2>
            <p className="text-xl text-blue-100 mb-12 max-w-md font-medium">Join 2,000+ companies already using ATS to transform their recruitment.</p>
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">✉</div>
                  <span className="text-xl font-bold">hello@ats.com</span>
               </div>
            </div>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl">
             <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-900">Name</label>
                      <input type="text" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-slate-900 focus:ring-2 focus:ring-blue-600" placeholder="John Wick" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-900">Email</label>
                      <input type="email" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-slate-900 focus:ring-2 focus:ring-blue-600" placeholder="john@example.com" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-900">Message</label>
                   <textarea rows={4} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-slate-900 focus:ring-2 focus:ring-blue-600" placeholder="How can we help?"></textarea>
                </div>
                <button className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">Send Message</button>
             </form>
          </div>
        </div>
      </div>
    </section>
  );
}