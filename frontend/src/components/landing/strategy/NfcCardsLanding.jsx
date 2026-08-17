import { FiSmartphone, FiRefreshCw, FiShield, FiSend, FiActivity, FiGlobe } from 'react-icons/fi';
import StrategyPageLayout, { ScrollAndClickNfc3DFlip } from './StrategyPageLayout';

export default function NfcCardsLanding() {
  const seo = {
    title: 'Smart NFC Business Cards for Tech Networking & Conferences | LinkMakeup',
    description: 'Upgrade your in-person tech networking with physical matte black NFC smart cards. Tap on any smartphone at conferences to instantly share your LinkedIn, GitHub, and bio link.',
    keywords: 'nfc business card tech, smart nfc card software engineer, carte nfc developpeur maroc, nfc networking card conference',
  };

  const features = [
    {
      icon: <FiSmartphone className="w-5 h-5" />,
      title: 'Instant Tap & Share',
      description: 'Zero apps required. Works with iPhone & Android natively. Just tap the physical NFC card against the back of any modern phone.',
    },
    {
      icon: <FiRefreshCw className="w-5 h-5" />,
      title: 'Update Your Links Anytime',
      description: 'Changed your job, GitHub, or Calendly link? Update your online dashboard anytime—no need to re-print new physical cards.',
    },
    {
      icon: <FiShield className="w-5 h-5" />,
      title: 'Durable Matte Finish & Water Resistant',
      description: 'Crafted with premium PVC or matte stainless steel designed to withstand daily wear in your wallet.',
    },
    {
      icon: <FiSend className="w-5 h-5" />,
      title: 'Perfect for Conferences & Hackathons',
      description: 'Stand out at tech summits, developer meetups, and investor dinners. Exchange contacts in 2 seconds flat.',
    },
    {
      icon: <FiActivity className="w-5 h-5" />,
      title: 'Tap Analytics Tracking',
      description: 'Track how many people tapped your physical card and clicked through to your GitHub, LinkedIn, or portfolio.',
    },
    {
      icon: <FiGlobe className="w-5 h-5" />,
      title: 'Fast Shipping in Morocco & Worldwide',
      description: 'Direct door-to-door delivery across Casablanca, Rabat, Marrakech, UAE, Europe, and global tech hubs.',
    },
  ];

  const faqs = [
    {
      question: 'Do recipients need an app to read my NFC card?',
      answer: 'No! Modern iPhones and Android smartphones have built-in NFC readers active by default. Tapping the card opens your profile in their web browser instantly.',
    },
    {
      question: 'Can I order NFC cards in Morocco or internationally?',
      answer: 'Yes! We ship custom-printed matte black and metal NFC cards directly across Morocco and internationally with fast delivery.',
    },
    {
      question: 'What happens if I change my LinkedIn or phone number?',
      answer: 'Your card is connected to your live LinkMakeup profile. Whenever you edit your profile online, your physical NFC card updates automatically!',
    },
  ];

  return (
    <StrategyPageLayout
      seo={seo}
      heroBadge={null}
      heroTitle="Smart NFC Business Cards for Tech Pros & Conferences"
      heroSubtitle="Stop carrying paper business cards. Share your GitHub, LinkedIn, and contact info in 1 tap at tech conferences and meetups."
      features={features}
      faqs={faqs}
      demoWidget={
        <ScrollAndClickNfc3DFlip
          customMaxW="max-w-[200px] min-[380px]:max-w-[230px] sm:max-w-[260px] lg:max-w-[285px]"
        />
      }
    />
  );
}
