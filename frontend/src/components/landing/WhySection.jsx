export default function WhySection() {
  return (
    <section className="w-full bg-[#F8F7F3] py-24 px-6 sm:px-10 lg:px-16 transition-colors">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Intro Section: Eyebrow + Heading (Left) & Paragraph (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          
          {/* Left Column: Eyebrow Label + Main Heading */}
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#f58a12] block">
              WHY LINKMAKEUP
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#1A1A1A] leading-[1.08] max-w-xl">
              A real partner,&nbsp;
              <br />
              not a chatbot in disguise
            </h2>
          </div>

          {/* Right Column: Supporting Paragraph */}
          <div className="lg:col-span-5 lg:pb-1">
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Most AI tools answer questions. LinkMakeup takes initiative — anticipating needs, executing tasks, and growing smarter with every interaction.
            </p>
          </div>

        </div>

        {/* 4 Cards Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          
          {/* Card 01: Always context-aware */}
          <div className="bg-[#ECE8DF] rounded-3xl p-7 flex flex-col justify-between h-[420px] transition-all hover:bg-[#E7E2D8]">
            <div className="flex justify-between items-start">
              <span className="text-5xl font-light text-[#C4BCB0] select-none">
                01.
              </span>
            </div>

            {/* Abstract Composition: Orange & Pale-Peach Squares */}
            <div className="relative w-32 h-32 my-auto self-end">
              <div className="w-5 h-5 bg-[#f58a12] rounded-xs absolute top-2 right-6" />
              <div className="w-4 h-4 bg-[#f7c297] rounded-xs absolute top-9 right-12" />
              <div className="w-4 h-4 bg-[#fde3cf] rounded-xs absolute top-14 right-2" />
              <div className="w-5 h-5 bg-[#f58a12] rounded-xs absolute bottom-8 right-9" />
              <div className="w-5 h-5 bg-[#f58a12] rounded-xs absolute bottom-1 right-3" />
            </div>

            {/* Bottom Title */}
            <div>
              <h3 className="font-bold text-xl text-[#1A1A1A] tracking-tight">
                Always context-aware
              </h3>
            </div>
          </div>

          {/* Card 02: Featured Active White Card - Takes real action */}
          <div className="bg-white rounded-3xl p-7 flex flex-col justify-between h-[420px] shadow-xl shadow-black/5 transition-all hover:shadow-2xl">
            {/* Top Half: Soft Abstract UI Illustration */}
            <div className="w-full h-44 rounded-2xl bg-[#F4F2EC] p-4 flex flex-col justify-center items-center relative overflow-hidden">
              <div className="w-full bg-white rounded-xl p-3.5 shadow-xs border border-slate-100/80 space-y-2 text-left">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#f58a12] uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#f58a12]" />
                  <span>LINKMAKEUP ENGINE</span>
                </div>
                <div className="space-y-1.5 text-[11px] text-slate-700 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="text-[#f58a12] text-xs">✓</span>
                    <span>Custom Subdomain Routing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#f58a12] text-xs">✓</span>
                    <span>Real-time Live Studio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#f58a12] text-xs">✓</span>
                    <span>Instant Database Sync</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Half: Title & Supporting Paragraph */}
            <div className="space-y-2 pt-4">
              <h3 className="font-bold text-2xl text-[#1A1A1A] tracking-tight">
                Takes real action
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Beyond suggestions, LinkMakeup executes — routing custom subdomains, updating themes in real-time, and managing tasks across your profile without constant hand-holding.
              </p>
            </div>
          </div>

          {/* Card 03: Connects everything */}
          <div className="bg-[#ECE8DF] rounded-3xl p-7 flex flex-col justify-between h-[420px] transition-all hover:bg-[#E7E2D8]">
            <div className="flex justify-between items-start">
              <span className="text-5xl font-light text-[#C4BCB0] select-none">
                03.
              </span>
            </div>

            {/* Abstract Composition: Orange & Pale-Peach Squares */}
            <div className="relative w-32 h-32 my-auto self-end">
              <div className="w-5 h-5 bg-[#f58a12] rounded-xs absolute top-4 left-6" />
              <div className="w-4 h-4 bg-[#f7c297] rounded-xs absolute top-10 left-16" />
              <div className="w-5 h-5 bg-[#f58a12] rounded-xs absolute top-16 left-2" />
              <div className="w-4 h-4 bg-[#fde3cf] rounded-xs absolute bottom-10 left-12" />
              <div className="w-5 h-5 bg-[#f58a12] rounded-xs absolute bottom-2 left-6" />
            </div>

            {/* Bottom Title */}
            <div>
              <h3 className="font-bold text-xl text-[#1A1A1A] tracking-tight">
                Connects everything
              </h3>
            </div>
          </div>

          {/* Card 04: Gets better over time */}
          <div className="bg-[#ECE8DF] rounded-3xl p-7 flex flex-col justify-between h-[420px] transition-all hover:bg-[#E7E2D8]">
            <div className="flex justify-between items-start">
              <span className="text-5xl font-light text-[#C4BCB0] select-none">
                04.
              </span>
            </div>

            {/* Abstract Composition: Orange & Pale-Peach Squares */}
            <div className="relative w-32 h-32 my-auto self-end">
              <div className="w-5 h-5 bg-[#f58a12] rounded-xs absolute top-2 right-4" />
              <div className="w-5 h-5 bg-[#f58a12] rounded-xs absolute top-8 right-12" />
              <div className="w-4 h-4 bg-[#f7c297] rounded-xs absolute top-14 right-2" />
              <div className="w-5 h-5 bg-[#f58a12] rounded-xs absolute bottom-8 right-8" />
              <div className="w-5 h-5 bg-[#f58a12] rounded-xs absolute bottom-2 right-14" />
            </div>

            {/* Bottom Title */}
            <div>
              <h3 className="font-bold text-xl text-[#1A1A1A] tracking-tight">
                Gets better over time
              </h3>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
