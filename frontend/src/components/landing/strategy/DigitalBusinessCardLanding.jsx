import React from 'react';
import { FiCreditCard, FiGlobe, FiShare2, FiZap, FiLock, FiTrendingUp } from 'react-icons/fi';
import StrategyPageLayout, { ScrollAndClickNfc3DFlip } from './StrategyPageLayout';
import SEOHead from '../../common/SEOHead';

export default function DigitalBusinessCardLanding() {
  const seo = {
    title: 'Digital Business Card Builder & Personal Subdomain | Link Make Up',
    description: 'Build your modern digital business card, personal subdomain, and contact card with Link Make Up. Easily share your contact info, portfolio, and social links instantly.',
    keywords: 'digital business card, online business card builder, electronic business card, virtual contact card, personal subdomain, link in bio platform, Link Make Up',
    canonicalUrl: 'https://www.linkmakeup.com/features/digital-business-card',
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Digital Business Card Builder — Link Make Up',
    'description': 'Create an interactive digital business card with custom subdomain, vCard contact download, and real-time updates.',
    'publisher': {
      '@type': 'Organization',
      'name': 'Link Make Up',
      'url': 'https://www.linkmakeup.com'
    }
  };

  const features = [
    {
      icon: <FiCreditCard className="w-5 h-5 text-emerald-500" />,
      title: 'Interactive Digital Contact Card',
      description: 'Replace paper cards with an interactive digital card featuring one-tap vCard contact save directly to smartphone address books.',
    },
    {
      icon: <FiGlobe className="w-5 h-5 text-emerald-500" />,
      title: 'Personal Subdomain Included',
      description: 'Get your own clean personal web address (username.linkmakeup.com) to share anywhere on social media, email signatures, or resume CVs.',
    },
    {
      icon: <FiShare2 className="w-5 h-5 text-emerald-500" />,
      title: 'Instant QR & NFC Integration',
      description: 'Generate dynamic QR codes or connect physical NFC cards so anyone can access your digital identity in a single second.',
    },
    {
      icon: <FiZap className="w-5 h-5 text-emerald-500" />,
      title: 'Sub-50ms Edge Performance',
      description: 'Built on Cloudflare global edge network for blazing fast load speeds worldwide, including Morocco, Europe, and America.',
    },
    {
      icon: <FiLock className="w-5 h-5 text-emerald-500" />,
      title: 'Privacy & Visibility Control',
      description: 'You control what is public. Choose which links, phone numbers, or email addresses to display on your public digital card.',
    },
    {
      icon: <FiTrendingUp className="w-5 h-5 text-emerald-500" />,
      title: 'Real-Time Click & Visit Analytics',
      description: 'Understand who views your profile and which links generate the highest engagement with built-in privacy-first analytics.',
    },
  ];

  const faqs = [
    {
      question: 'What is a digital business card?',
      answer: 'A digital business card is a dynamic, shareable online profile containing your contact details, website links, social channels, and portfolio. People can save your contact details directly to their phone with one tap.',
    },
    {
      question: 'How is Link Make Up different from standard link in bio tools?',
      answer: 'Link Make Up gives you a full digital identity platform: custom subdomains, interactive vCards, custom themes, portfolio showcases, and physical NFC card integration.',
    },
    {
      question: 'Can I add my digital card to Apple Wallet or Google Wallet?',
      answer: 'Yes! Link Make Up generates smart pass QR codes and vCards that can be saved directly to mobile wallets.',
    },
  ];

  return (
    <>
      <SEOHead
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        canonicalUrl={seo.canonicalUrl}
        jsonLd={jsonLd}
      />
      <StrategyPageLayout
        seo={seo}
        heroBadge="⚡ The Complete Digital Identity Platform"
        heroTitle="Create Your Professional Digital Business Card"
        heroSubtitle="Share your contact info, personal subdomain, portfolio, and social links instantly on any device with Link Make Up."
        features={features}
        faqs={faqs}
        demoWidget={
          <ScrollAndClickNfc3DFlip
            customMaxW="max-w-[200px] min-[380px]:max-w-[230px] sm:max-w-[260px] lg:max-w-[285px]"
          />
        }
      />
    </>
  );
}
