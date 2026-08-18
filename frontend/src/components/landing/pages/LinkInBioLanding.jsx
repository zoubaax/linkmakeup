import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import LogoTicker from '../LogoTicker';
import SeoHead from '../../ui/SeoHead';
import { useAuth } from '../../../contexts/AuthContext';
import { FiLink, FiSmartphone, FiGlobe, FiZap, FiBarChart2, FiCheck } from 'react-icons/fi';

export default function LinkInBioLanding() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const seo = {
    title: 'Link in Bio Tool: Everything You Are, in One Simple Link | Link Make Up',
    description: 'Create your free link in bio with Link Make Up. Consolidate your GitHub, LinkedIn, portfolio, and social links into one edge-fast custom subdomain.',
    keywords: 'link in bio tool, linktree alternative, bio link software engineer, free link in bio, custom subdomain link in bio',
  };

  const bioFeatures = [
    {
      icon: <FiGlobe className="w-5 h-5 text-emerald-500" />,
      title: 'Custom Subdomain Address',
      description: 'Own your identity at username.linkmakeup.com instead of long random URLs.',
    },
    {
      icon: <FiZap className="w-5 h-5 text-emerald-500" />,
      title: 'Sub-50ms Edge Latency',
      description: 'Loads 5x faster than generic bio link tools using V8 edge isolate servers.',
    },
    {
      icon: <FiSmartphone className="w-5 h-5" />,
      title: 'NFC Smart Card Enabled',
      description: 'Pair your online link in bio with a physical matte black NFC card for instant conference taps.',
    },
    {
      icon: <FiBarChart2 className="w-5 h-5 text-emerald-500" />,
      title: 'Analytics & Click Tracking',
      description: 'Track real-time profile visits, link clicks, and social conversions.',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--lm-app)] text-[var(--lm-fg)] font-sans p-2.5 sm:p-6 lg:p-8 flex flex-col justify-between selection:bg-emerald-600 selection:text-white transition-colors duration-300 antialiased">
      <SeoHead
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
      />

      <Header user={user} profile={profile} />

      <main className="flex-1 space-y-16 py-8">
        <div className="text-center max-w-4xl mx-auto space-y-5 px-4">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            THE ALL-IN-ONE LINK IN BIO TOOL
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-slate-900 dark:text-white leading-tight">
            Everything you are, in one simple link
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Join thousands of software engineers, creators, and entrepreneurs sharing their portfolio, contact info, and links with Link Make Up.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-sm hover:opacity-90 transition-all shadow-xl"
            >
              Create Your Free Link in Bio →
            </button>
            <button
              type="button"
              onClick={() => navigate('/pricing')}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-slate-200 font-bold text-sm"
            >
              View Pricing
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <section className="w-full max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bioFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-emerald-100/80 dark:border-zinc-800 shadow-sm space-y-3"
              >
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/40 w-fit">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{feat.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </section>

        <LogoTicker />
      </main>

      <Footer />
    </div>
  );
}
