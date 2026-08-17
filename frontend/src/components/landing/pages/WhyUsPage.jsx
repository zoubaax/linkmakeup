import Header from '../Header';
import Footer from '../Footer';
import WhySection from '../WhySection';
import LogoTicker from '../LogoTicker';
import SeoHead from '../../ui/SeoHead';
import { useAuth } from '../../../contexts/AuthContext';

export default function WhyUsPage() {
  const { user, profile } = useAuth();

  const seo = {
    title: 'Why LinkMakeup | The Subdomain Engine & Edge-Fast Bio Link Platform',
    description: 'Discover why creators, software engineers, and founders choose LinkMakeup over generic bio link tools. Sub-50ms edge latency, custom subdomains, and real-time studio updates.',
    keywords: 'why linkmakeup, linktree alternative, custom subdomain link in bio, fast bio link platform',
  };

  return (
    <div className="min-h-screen bg-[var(--lm-app)] text-[var(--lm-fg)] font-sans p-4 sm:p-8 flex flex-col justify-between selection:bg-emerald-600 selection:text-white transition-colors duration-300 antialiased">
      <SeoHead
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
      />

      <Header user={user} profile={profile} />

      <main className="flex-1 space-y-12">
        {/* Why Us Section */}
        <WhySection />

        {/* Platform Ecosystem Marquee */}
        <LogoTicker />
      </main>

      <Footer />
    </div>
  );
}
