import ScrollReveal from '../ui/ScrollReveal';

export default function QuoteSection() {
  return (
    <section className="w-full max-w-7xl mx-auto py-6 sm:py-16 px-4 sm:px-8 text-center">
      
      {/* Eyebrow Label */}
      <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-emerald-600 block mb-3 sm:mb-5">
        The LinkMakeup Difference
      </span>

      {/* GSAP ScrollReveal Balanced Text Structure */}
      <ScrollReveal
        baseOpacity={0.12}
        enableBlur={true}
        baseRotation={1.5}
        blurStrength={4}
        wordAnimationEnd="bottom 30%"
        rotationEnd="bottom 35%"
        containerClassName="text-slate-900 dark:text-white my-2"
        textClassName="font-serif text-slate-900 dark:text-white font-normal leading-[1.5] sm:leading-[1.28] text-[19px] sm:text-3xl md:text-4xl lg:text-[42px] tracking-normal sm:tracking-tight max-w-6xl sm:max-w-7xl mx-auto text-center [text-wrap:balance]"
      >
        A static bio link is just a list of buttons. LinkMakeup is a living engine — anticipating your style, routing your custom subdomain, and syncing your presence in real-time.
      </ScrollReveal>

    </section>
  );
}
