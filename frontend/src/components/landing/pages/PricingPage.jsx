import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import LogoTicker from '../LogoTicker';
import SeoHead from '../../ui/SeoHead';
import ReactBitsPricingCards from '../../ui/ReactBitsPricingCards';
import { useAuth } from '../../../contexts/AuthContext';

export default function PricingPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const seo = {
    title: 'Pricing & Plans | Free Digital Identity & NFC Smart Cards | Link Make Up',
    description: 'Transparent pricing for software engineers, creators, and entrepreneurs in Morocco and worldwide. Free digital profile, custom subdomains & smart NFC cards.',
    keywords: 'Link Make Up pricing, free link in bio, carte nfc maroc prix, nfc business card price, custom subdomain pricing',
  };

  const pricingSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Link Make Up Smart NFC Card & Digital Identity',
    description: 'Physical matte black NFC business card with lifetime bio link profile and custom subdomain.',
    brand: {
      '@type': 'Brand',
      name: 'Link Make Up',
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
        name: 'NFC Smart Card Bundle (Morocco)',
        price: '290',
        priceCurrency: 'MAD',
        availability: 'https://schema.org/InStock',
        areaServed: 'Morocco'
      },
      {
        '@type': 'Offer',
        name: 'NFC Smart Card Bundle (International)',
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

        {/* React Bits Card Design with NFC Card Images & Currency Switcher */}
        <ReactBitsPricingCards
          onSelectPlan={(planType) => {
            if (planType === 'nfc') {
              navigate('/signup?type=nfc');
            } else {
              navigate('/signup');
            }
          }}
        />

        <LogoTicker />
      </main>

      <Footer />
    </div>
  );
}

