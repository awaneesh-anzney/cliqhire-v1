import { Zap, Users, BarChart3, ShieldCheck, MousePointer2, Sparkles } from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white px-4 md:px-10">
      <div className="w-full max-w-[1800px] mx-auto">
        <div className="mb-16">
          <h2 className="text-blue-600 font-bold text-sm uppercase tracking-[0.2em] mb-4">Capabilities</h2>
          <h3 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight">
            Stop digging through resumes. <br /> Start <span className="text-slate-400">hiring.</span>
          </h3>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
          
          {/* Big Feature 1 */}
          <div className="md:col-span-8 bg-slate-50 rounded-[2.5rem] p-12 border border-slate-100 group hover:border-blue-200 transition-all overflow-hidden relative">
            <div className="max-w-md relative z-10">
               <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-blue-200">
                  <Sparkles size={28} />
               </div>
               <h4 className="text-3xl font-bold mb-4">AI-Powered Candidate Scoring</h4>
               <p className="text-slate-500 text-lg leading-relaxed">Our neural network analyzes resumes against your job description to find the perfect fit in seconds, not weeks.</p>
            </div>
            {/* Visual element */}
            <div className="absolute right-0 bottom-0 w-1/2 h-full bg-blue-100/20 translate-x-10 translate-y-10 rounded-tl-[3rem] border-l border-t border-blue-100 hidden md:block" />
          </div>

          {/* Small Feature 1 */}
          <div className="md:col-span-4 bg-slate-900 rounded-[2.5rem] p-12 text-white flex flex-col justify-between">
            <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-8">
               <Users size={28} className="text-blue-400" />
            </div>
            <div>
               <h4 className="text-2xl font-bold mb-2">Team Sync</h4>
               <p className="text-slate-400">Collaborative hiring for modern teams.</p>
            </div>
          </div>

          {/* Small Feature 2 */}
          <div className="md:col-span-4 bg-blue-600 rounded-[2.5rem] p-12 text-white">
             <BarChart3 size={40} className="mb-8" />
             <h4 className="text-2xl font-bold mb-2">Advanced Analytics</h4>
             <p className="text-blue-100">Deep insights into your hiring funnel velocity.</p>
          </div>

          {/* Big Feature 2 */}
          <div className="md:col-span-8 bg-slate-50 rounded-[2.5rem] p-12 border border-slate-100 flex flex-col md:flex-row items-center gap-12">
             <div className="flex-1">
                <h4 className="text-3xl font-bold mb-4">One-Click Integrations</h4>
                <p className="text-slate-500 text-lg">Connect with Slack, LinkedIn, and Zoom instantly. No code required.</p>
             </div>
             <div className="flex-1 grid grid-cols-2 gap-4">
                {['Slack', 'Zoom', 'Notion', 'Gmail'].map(app => (
                   <div key={app} className="p-4 bg-white rounded-xl border border-slate-200 text-center font-bold text-slate-400 text-sm">{app}</div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}