import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import LogoTicker from '../LogoTicker';
import SeoHead from '../../ui/SeoHead';
import { useAuth } from '../../../contexts/AuthContext';
import { FiCheck, FiZap, FiCreditCard } from 'react-icons/fi';

export default function PricingPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const seo = {
    title: 'Pricing & Plans | Free Bio Link & NFC Smart Card Bundles | LinkMakeup',
    description: 'Simple, transparent pricing for software engineers, LinkedIn creators, and tech founders. Free bio link page with custom subdomains & custom physical NFC cards.',
    keywords: 'linkmakeup pricing, free link in bio, nfc business card price, custom subdomain pricing',
  };

  const plans = [
    {
      name: 'Free Forever',
      price: '$0',
      period: 'forever',
      description: 'Everything you need to showcase your developer profile, GitHub, and bio links.',
      features: [
        'Custom Subdomain (username.linkmakeup.com)',
        'Unlimited Bio Links & Social Buttons',
        'Built-in QR Code Generator',
        'Standard Edge Latency (< 50ms)',
        'Dark & Light Mode Themes',
      ],
      ctaText: 'Join LinkMakeup For Free',
      ctaAction: () => navigate('/signup'),
      popular: false,
    },
    {
      name: 'NFC Smart Card Bundle',
      price: '$29',
      period: 'one-time payment',
      description: 'Physical matte black NFC smart card shipped directly to your door + Lifetime Pro profile.',
      features: [
        'Custom Printed Matte Black NFC Card',
        'Tap to Share in 2 Seconds (iPhone & Android)',
        'Lifetime Live Bio Link Dashboard',
        'Advanced Click & Tap Analytics',
        'Priority Door-to-Door Shipping (Morocco & Global)',
        'Zero Monthly Subscription Fees',
      ],
      ctaText: 'Order Your NFC Card →',
      ctaAction: () => navigate('/signup?type=nfc'),
      popular: true,
    },
  ];

  const pricingSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'LinkMakeup Smart NFC Card & Bio Link',
    description: 'Physical matte black NFC business card with lifetime bio link profile and custom subdomain.',
    brand: {
      '@type': 'Brand',
      name: 'LinkMakeup',
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Free Forever Bio Link',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'NFC Smart Card Bundle',
        price: '29',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[var(--lm-app)] text-[var(--lm-fg)] font-sans p-2.5 sm:p-6 lg:p-8 flex flex-col justify-between selection:bg-emerald-600 selection:text-white transition-colors duration-300 antialiased">
      <SeoHead
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        structuredData={pricingSchema}
      />

      <Header user={user} profile={profile} />

      <main className="flex-1 space-y-12 py-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 px-4">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            TRANSPARENT PRICING
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-slate-900 dark:text-white leading-tight">
            One link for everything you build. Zero hidden fees.
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Get started for free or upgrade to a custom matte black NFC card with lifetime access.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="w-full max-w-5xl mx-auto grid md:grid-cols-2 gap-8 px-4">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-[32px] p-8 flex flex-col justify-between transition-all duration-300 ${
                plan.popular
                  ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-zinc-900 text-white border-2 border-emerald-500 shadow-2xl shadow-emerald-500/10'
                  : 'bg-white/80 dark:bg-zinc-900/80 border border-emerald-100/80 dark:border-zinc-800 text-slate-900 dark:text-white shadow-lg'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md">
                  Most Popular for Networking
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className={`text-xs mt-1 leading-relaxed ${plan.popular ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-bold font-serif">{plan.price}</span>
                  <span className={`text-xs ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                    / {plan.period}
                  </span>
                </div>

                <ul className="space-y-3 pt-2">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-3 text-xs sm:text-sm">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.popular ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'}`}>
                        <FiCheck className="w-3.5 h-3.5" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <button
                  type="button"
                  onClick={plan.ctaAction}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer ${
                    plan.popular
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                      : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90'
                  }`}
                >
                  {plan.ctaText}
                </button>
              </div>
            </div>
          ))}
        </div>

        <LogoTicker />
      </main>

      <Footer />
    </div>
  );
}
