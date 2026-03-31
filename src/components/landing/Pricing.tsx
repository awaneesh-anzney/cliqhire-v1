import {Sparkles} from 'lucide-react'

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-slate-50 px-4 md:px-10">
      <div className="w-full max-w-[1800px] mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-6">Scale your team.</h2>
          <p className="text-xl text-slate-500">Transparent pricing for teams of all sizes.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Plan 1 */}
          <div className="bg-white p-12 rounded-[3rem] border border-slate-200 hover:shadow-xl transition-all">
            <h3 className="text-2xl font-bold mb-2">Starter</h3>
            <p className="text-slate-500 mb-8 font-medium">Perfect for small startups.</p>
            <div className="text-6xl font-black mb-8">$0 <span className="text-xl font-normal text-slate-400">/mo</span></div>
            <ul className="space-y-4 mb-10 text-slate-600 font-medium">
               <li>✓ 3 Active Job Posts</li>
               <li>✓ Basic AI Filtering</li>
               <li>✓ Email Support</li>
            </ul>
            <button className="w-full py-5 rounded-2xl border-2 border-slate-100 font-bold hover:bg-slate-50 transition-all">Get Started</button>
          </div>

          {/* Plan 2 - Featured */}
          <div className="bg-slate-900 p-12 rounded-[3rem] text-white transform lg:-translate-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6">
               <span className="bg-blue-600 text-[10px] uppercase font-black px-3 py-1 rounded-full">Recommended</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <p className="text-slate-400 mb-8 font-medium">For high-growth companies.</p>
            <div className="text-6xl font-black mb-8 text-blue-500">$79 <span className="text-xl font-normal text-slate-500">/mo</span></div>
            <ul className="space-y-4 mb-10 font-medium">
               <li className="flex items-center gap-2 font-bold"><Sparkles size={16} className="text-blue-500"/> Unlimited Everything</li>
               <li>✓ Advanced AI Ranking</li>
               <li>✓ Team Collaboration</li>
               <li>✓ Priority Support</li>
            </ul>
            <button className="w-full py-5 bg-blue-600 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30">Go Pro</button>
          </div>

          {/* Plan 3 */}
          <div className="bg-white p-12 rounded-[3rem] border border-slate-200 hover:shadow-xl transition-all">
            <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
            <p className="text-slate-500 mb-8 font-medium">Tailored for large corporations.</p>
            <div className="text-6xl font-black mb-8">Custom</div>
            <ul className="space-y-4 mb-10 text-slate-600 font-medium">
               <li>✓ Dedicated Manager</li>
               <li>✓ Custom Workflows</li>
               <li>✓ API Access</li>
            </ul>
            <button className="w-full py-5 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all">Contact Sales</button>
          </div>
        </div>
      </div>
    </section>
  );
}