import Header from '../Header';
import Footer from '../Footer';
import PresetsSection from '../PresetsSection';
import LogoTicker from '../LogoTicker';
import SeoHead from '../../ui/SeoHead';
import { useAuth } from '../../../contexts/AuthContext';
import { FiSliders, FiSun, FiLayers, FiCheck } from 'react-icons/fi';

export default function ThemeStudioPage() {
  const { user, profile } = useAuth();

  const seo = {
    title: 'Theme Studio | Customize Real-Time Presets & CSS Tokens',
    description: 'Explore the LinkMakeup Theme Studio. Customize colors, fonts, buttons, glassmorphism card backgrounds, and dark/light mode presets in real-time.',
    keywords: 'linkmakeup theme studio, bio link customizer, presets, dark mode link in bio',
  };

  const themeCapabilities = [
    {
      icon: <FiSliders className="w-5 h-5 text-emerald-500" />,
      title: 'Curated Theme Presets',
      description: 'Choose from Emerald Luxe, Glassmorphism, Cyber Neon, and Clean White, or craft custom color palettes.',
    },
    {
      icon: <FiSun className="w-5 h-5 text-emerald-500" />,
      title: 'Dark & Light Mode Ready',
      description: 'Full CSS custom token support with seamless automatic system dark mode detection.',
    },
    {
      icon: <FiLayers className="w-5 h-5 text-emerald-500" />,
      title: 'Live Studio Preview',
      description: 'See every design change in a real-time interactive mobile preview canvas as you type.',
    },
    {
      icon: <FiCheck className="w-5 h-5 text-emerald-500" />,
      title: 'Zero Latency Render',
      description: 'Changes sync immediately to your live custom subdomain without rebuilding or redeploying.',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--lm-app)] text-[var(--lm-fg)] font-sans p-4 sm:p-8 flex flex-col justify-between selection:bg-emerald-600 selection:text-white transition-colors duration-300 antialiased">
      <SeoHead
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
      />

      <Header user={user} profile={profile} />

      <main className="flex-1 space-y-16">
        {/* Presets Interactive Customizer */}
        <PresetsSection />

        {/* Theme Capabilities Grid */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              STUDIO CAPABILITIES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 dark:text-white">
              Full Control Over Your Digital Brand
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {themeCapabilities.map((cap, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-emerald-100/80 dark:border-zinc-800 shadow-sm space-y-3"
              >
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/40 w-fit">
                  {cap.icon}
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{cap.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{cap.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Marquee Ticker */}
        <LogoTicker />
      </main>

      <Footer />
    </div>
  );
}
