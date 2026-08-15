export default function FeaturesSection() {
  return (
    <section id="features" className="w-full max-w-7xl mx-auto py-12 sm:py-16 px-3 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2 sm:space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600">
          High Performance Architecture
        </h2>
        <p className="font-serif text-2xl sm:text-4xl text-slate-900 leading-tight">
          Powered by global edge servers & custom subdomain routing
        </p>
        <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto">
          Built for ultra-fast loading, 99.99% availability, and real-time live preview updates.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Card 1: Custom Subdomain Engine */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-emerald-500/40 hover:bg-emerald-50/30 transition-all duration-300 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-5 sm:mb-6 shadow-md shadow-emerald-600/20 group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2">Custom Subdomains</h3>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
            Get your own branded address at <code className="text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded font-mono text-[11px] sm:text-xs">username.linkmakeup.com</code> with automated Cloudflare Workers routing.
          </p>
          <span className="inline-flex items-center text-xs font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
            Instant DNS Setup →
          </span>
        </div>

        {/* Card 2: Ultra-Fast Edge Latency */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-emerald-500/40 hover:bg-emerald-50/30 transition-all duration-300 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-5 sm:mb-6 shadow-md group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2">Edge-Delivered Latency</h3>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
            Served globally via serverless edge functions with automatic SSL encryption and sub-50ms response times.
          </p>
          <span className="inline-flex items-center text-xs font-semibold text-slate-900 group-hover:translate-x-1 transition-transform">
            Explore Server Speed →
          </span>
        </div>

        {/* Card 3: Real-Time Live Studio */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-emerald-500/40 hover:bg-emerald-50/30 transition-all duration-300 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-5 sm:mb-6 shadow-md shadow-emerald-600/20 group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-23" />
            </svg>
          </div>
          <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2">Live Theme Studio</h3>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
            Customize colors, fonts, links, and layout with an interactive live mobile preview and zero compile delay.
          </p>
          <span className="inline-flex items-center text-xs font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
            Customize Theme →
          </span>
        </div>

      </div>
    </section>
  );
}
