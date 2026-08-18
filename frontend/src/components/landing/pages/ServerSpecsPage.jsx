import Header from '../Header';
import Footer from '../Footer';
import FeaturesSection from '../FeaturesSection';
import LogoTicker from '../LogoTicker';
import SeoHead from '../../ui/SeoHead';
import { useAuth } from '../../../contexts/AuthContext';
import { FiServer, FiZap, FiShield, FiGlobe, FiCpu, FiCheckCircle } from 'react-icons/fi';

export default function ServerSpecsPage() {
  const { user, profile } = useAuth();

  const seo = {
    title: 'Server Specs & Architecture | 50ms Edge Nodes & Cloudflare Workers',
    description: 'Explore LinkMakeup server specs and global edge architecture. Built with Cloudflare Workers, automatic SSL, sub-50ms latency, and high-availability subdomain routing.',
    keywords: 'linkmakeup server specs, cloudflare workers bio link, edge latency, bio link architecture',
  };

  const specsList = [
    {
      icon: <FiZap className="w-6 h-6 text-emerald-500" />,
      title: 'Sub-50ms Edge Latency',
      description: 'Served on 300+ global edge locations powered by V8 serverless isolate functions.',
    },
    {
      icon: <FiGlobe className="w-6 h-6 text-emerald-500" />,
      title: 'Automated Subdomain DNS',
      description: 'Dynamic wildcard DNS routing for username.linkmakeup.com with automatic Let’s Encrypt SSL certificates.',
    },
    {
      icon: <FiShield className="w-6 h-6 text-emerald-500" />,
      title: 'DDoS Protection & 99.99% Uptime',
      description: 'Enterprise-grade rate limiting and enterprise DDoS mitigation built-in by default.',
    },
    {
      icon: <FiCpu className="w-6 h-6 text-emerald-500" />,
      title: 'Zero Cold Starts',
      description: 'Instant response times with zero cold start delays compared to traditional Docker or VM hosting.',
    },
    {
      icon: <FiServer className="w-6 h-6 text-emerald-500" />,
      title: 'Sub-Second Database Sync',
      description: 'Ultra-fast Drizzle ORM database layer paired with distributed edge caching.',
    },
    {
      icon: <FiCheckCircle className="w-6 h-6 text-emerald-500" />,
      title: 'Dynamic OpenGraph HTML Rewriter',
      description: 'Intercepts social scrapers (WhatsApp, Twitter, iMessage, LinkedIn) to serve instant rich previews.',
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
        {/* Main Server Specs Features */}
        <FeaturesSection />

        {/* Detailed Tech Architecture Breakdown */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              TECHNICAL SPECIFICATIONS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 dark:text-white">
              Built for Scale & Enterprise Security
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specsList.map((spec, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-emerald-100/80 dark:border-zinc-800 shadow-sm hover:border-emerald-500/50 transition-colors space-y-3"
              >
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/40 w-fit">
                  {spec.icon}
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{spec.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">{spec.description}</p>
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
