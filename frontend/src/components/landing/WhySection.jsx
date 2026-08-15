import ScrollStack, { ScrollStackItem } from '../ui/ScrollStack';

const features = [
  {
    number: '01',
    title: 'Always context-aware',
    subtitle: 'SUBDOMAIN ENGINE',
    detail: 'LinkMakeup remembers your preferences, custom subdomains, and link priorities so your page is uniquely yours.',
    type: 'context',
  },
  {
    number: '02',
    title: 'Takes real action',
    subtitle: 'REAL-TIME STUDIO',
    detail: 'Move from an idea to a polished page without repeating setup work. Updates sync instantly across global edge nodes.',
    type: 'action',
  },
  {
    number: '03',
    title: 'Connects everything',
    subtitle: 'INTEGRATIONS',
    detail: 'Keep the links, content, and social platforms that power your online presence in one clean place.',
    type: 'connect',
  },
  {
    number: '04',
    title: 'Gets better over time',
    subtitle: 'EDGE SPEED',
    detail: 'The more you use it, the faster you publish. Served on global edge nodes with sub-50ms loading speed.',
    type: 'growth',
  },
];

function FeaturePreview({ type }) {
  if (type === 'context') {
    return (
      <div className="w-full p-4 rounded-2xl bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md border border-emerald-100/60 dark:border-zinc-700/50 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-emerald-600/90 text-white flex items-center justify-center text-xs font-semibold shadow-xs">
            LM
          </span>
          <div>
            <div className="text-xs font-semibold text-slate-800 dark:text-white">john.linkmakeup.com</div>
            <div className="text-[10px] text-emerald-600 font-medium">Subdomain Active • SSL Ready</div>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100/40 dark:border-emerald-800/30 text-[11px] text-slate-600 flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400">Active Theme:</span>
          <span className="font-medium text-emerald-700 dark:text-emerald-400">Emerald Luxe</span>
        </div>
      </div>
    );
  }

  if (type === 'action') {
    return (
      <div className="w-full p-4 rounded-2xl bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md border border-emerald-100/60 dark:border-zinc-700/50 shadow-xs space-y-2.5 text-left">
        <div className="flex items-center justify-between text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>LIVE STUDIO PIPELINE</span>
          </span>
          <span className="text-slate-400 font-mono text-[9px]">LIVE</span>
        </div>
        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600">✓</span>
            <span>Custom Subdomain DNS Routing</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-600">✓</span>
            <span>Real-time Live Studio Render</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-600">✓</span>
            <span>Instant Edge State Sync</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'connect') {
    return (
      <div className="w-full p-4 rounded-2xl bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md border border-emerald-100/60 dark:border-zinc-700/50 shadow-xs space-y-3 text-center">
        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
          OFFICIAL INTEGRATIONS
        </span>
        <div className="flex items-center justify-center gap-3">
          {/* Instagram */}
          <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xs transition-transform hover:scale-110">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </span>

          {/* LinkedIn */}
          <span className="w-8 h-8 rounded-xl bg-[#0A66C2] text-white flex items-center justify-center shadow-xs transition-transform hover:scale-110">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </span>

          {/* Google */}
          <span className="w-8 h-8 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center transition-transform hover:scale-110">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
          </span>

          {/* GitHub */}
          <span className="w-8 h-8 rounded-xl bg-[#24292F] text-white flex items-center justify-center shadow-xs transition-transform hover:scale-110">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 rounded-2xl bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md border border-emerald-100/60 dark:border-zinc-700/50 shadow-xs space-y-2 text-left">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">EDGE LATENCY</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-mono">24ms (99.99%)</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-700 rounded-full overflow-hidden">
        <div className="h-full w-11/12 bg-emerald-600/90 rounded-full" />
      </div>
    </div>
  );
}

export default function WhySection() {
  return (
    <section id="why" className="w-full max-w-7xl mx-auto py-16 px-4 sm:px-6">
      
      {/* Intro Header */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-end mb-12">
        <div className="md:col-span-7 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Why LinkMakeup
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-slate-900 dark:text-white leading-[1.08]">
            A real partner,<br />not a chatbot in disguise
          </h2>
        </div>
        <p className="md:col-span-5 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed md:pb-1">
          Most AI tools answer questions. LinkMakeup takes initiative — anticipating needs, executing tasks, and growing smarter with every interaction.
        </p>
      </div>

      {/* Soft Glassy Stacking Cards */}
      <ScrollStack
        useWindowScroll={true}
        itemDistance={36}
        itemScale={0.03}
        itemStackDistance={18}
        stackPosition="15%"
        scaleEndPosition="5%"
        baseScale={0.92}
      >
        {features.map((feature) => (
          <ScrollStackItem
            key={feature.number}
            itemClassName="bg-gradient-to-b from-white/95 via-emerald-50/30 to-white/90 dark:from-zinc-800/95 dark:via-emerald-950/20 dark:to-zinc-800/90 border-white/90 dark:border-zinc-700/60 shadow-xl shadow-emerald-950/3 hover:border-emerald-200/80 dark:hover:border-emerald-700/50 transition-all duration-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center h-full">
              
              {/* Left Column: Number, Title & Subtitle */}
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl sm:text-5xl font-extralight font-serif text-emerald-600/30">
                    {feature.number}.
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider text-emerald-700 uppercase bg-emerald-50/80 px-3 py-1 rounded-full border border-emerald-100/60">
                    {feature.subtitle}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-semibold text-slate-800 dark:text-white tracking-tight">
                  {feature.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                  {feature.detail}
                </p>
              </div>

              {/* Right Column: Soft Glassy Preview Widget */}
              <div className="md:col-span-5">
                <FeaturePreview type={feature.type} />
              </div>

            </div>
          </ScrollStackItem>
        ))}
      </ScrollStack>

    </section>
  );
}
