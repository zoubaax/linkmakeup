import ScrollReveal from '../ui/ScrollReveal';

export default function QuoteSection() {
  return (
    <section className="w-full max-w-7xl mx-auto py-16 sm:py-24 px-4 sm:px-8 text-center">
      
      {/* Eyebrow Label */}
      <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block mb-6">
        The LinkMakeup Difference
      </span>

      {/* GSAP ScrollReveal Text (Slower, Silky-Smooth Extended Reveal) */}
      <ScrollReveal
        baseOpacity={0.10}
        enableBlur={true}
        baseRotation={1.5}
        blurStrength={5}
        wordAnimationEnd="bottom 30%"
        rotationEnd="bottom 35%"
        containerClassName="text-slate-900 my-2"
        textClassName="font-serif text-slate-900 font-normal leading-[1.28] text-xl sm:text-3xl md:text-4xl lg:text-[42px] tracking-tight max-w-7xl mx-auto"
      >
        A static bio link is just a list of buttons. LinkMakeup is a living engine — anticipating your style, routing your custom subdomain, and syncing your presence in real-time.
      </ScrollReveal>

    </section>
  );
}
