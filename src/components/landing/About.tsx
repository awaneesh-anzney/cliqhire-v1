export default function About() {
  return (
    <section id="about" className="py-32 bg-white px-4 md:px-10">
      <div className="w-full max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div className="space-y-10">
           <h2 className="text-6xl md:text-8xl font-black leading-[0.9] text-slate-900">
             Building the <span className="text-blue-600">future</span> of work.
           </h2>
           <p className="text-2xl text-slate-500 leading-relaxed max-w-xl font-medium">
             We believe that the best talent shouldn't be hard to find. Our mission is to bridge the gap between world-class companies and extraordinary people.
           </p>
           <div className="flex gap-12">
              <div>
                 <div className="text-5xl font-black text-slate-900">500M+</div>
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">Data Points Analyzed</p>
              </div>
              <div>
                 <div className="text-5xl font-black text-slate-900">99.9%</div>
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">Uptime Reliability</p>
              </div>
           </div>
        </div>
        <div className="relative group">
           <div className="aspect-square bg-slate-100 rounded-[4rem] overflow-hidden rotate-3 group-hover:rotate-0 transition-transform duration-700">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent" />
              {/* Add an actual team image here */}
              <div className="w-full h-full flex items-center justify-center text-slate-300 font-black text-4xl italic">ATS_TEAM_SPACE</div>
           </div>
           {/* Decorative Card */}
           <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-50 hidden md:block">
              <p className="text-sm font-bold text-slate-400 mb-2 uppercase">Headquarters</p>
              <p className="text-xl font-black text-slate-900 italic">San Francisco, CA</p>
           </div>
        </div>
      </div>
    </section>
  );
}