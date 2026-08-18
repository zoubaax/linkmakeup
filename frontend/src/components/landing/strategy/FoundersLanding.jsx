import { FiPieChart, FiUsers, FiTarget, FiCreditCard, FiLock, FiDownload } from 'react-icons/fi';
import StrategyPageLayout from './StrategyPageLayout';
import mobileImg from '../../../assets/mobile .png';

export default function FoundersLanding() {
  const seo = {
    title: 'Digital Pitch Deck & NFC Card for Startup Founders | Link Make Up',
    description: 'The smart digital pitch card and NFC card for tech startup founders, indie hackers, and solopreneurs. Share pitch decks, investor calendars, and Product Hunt launches in one tap.',
    keywords: 'digital business card startup founder, nfc pitch card, link in bio for tech founders, indie hacker bio link',
  };

  const features = [
    {
      icon: <FiPieChart className="w-5 h-5" />,
      title: 'One-Tap Pitch Deck & Demo Links',
      description: 'Give investors and partners instant 1-tap access to your pitch deck, Loom demo, or live MVP application.',
    },
    {
      icon: <FiUsers className="w-5 h-5" />,
      title: 'Investor & Advisory Call Scheduling',
      description: 'Connect your Calendly or SavvyCal to let venture capital investors or mentors book meetings directly.',
    },
    {
      icon: <FiTarget className="w-5 h-5" />,
      title: 'Product Hunt & Launch Showcase',
      description: 'Highlight your latest Product Hunt badge, live metrics, or newsletter subscriber count.',
    },
    {
      icon: <FiCreditCard className="w-5 h-5" />,
      title: 'Matte Metal NFC Executive Card',
      description: 'Make a unforgettable impression at demo days, tech summits, and VC dinners with a high-end metal NFC card.',
    },
    {
      icon: <FiLock className="w-5 h-5" />,
      title: 'Password-Protected Pitch Access',
      description: 'Optionally password-protect sensitive pitch decks or private investor updates.',
    },
    {
      icon: <FiDownload className="w-5 h-5" />,
      title: 'Instant QR & vCard Download',
      description: 'Allows contacts to save your full contact details (VCF) directly into their phone contacts list with one click.',
    },
  ];

  const faqs = [
    {
      question: 'How do I share my pitch deck safely using Link Make Up?',
      answer: 'You can link DocSend, Notion, or PDF links directly on your profile. You can also add password protection or track link click metrics.',
    },
    {
      question: 'Can investors save my contact info directly to their phone contacts?',
      answer: 'Yes! Link Make Up profiles feature a "Save Contact (vCard)" button that instantly saves your email, phone, and website into the investor phone address book.',
    },
  ];

  // Compact Mobile Device Mockup Frame
  const founderDemoWidget = (
    <div className="relative mx-auto w-full max-w-[210px] min-[380px]:max-w-[230px] sm:max-w-[250px] lg:max-w-[265px] transition-transform duration-300 hover:scale-[1.03] py-2">
      <div className="absolute -inset-2 bg-gradient-to-tr from-amber-500/25 via-orange-500/15 to-rose-500/25 rounded-[38px] blur-xl opacity-70" />
      <div className="relative rounded-[36px] sm:rounded-[40px] p-2 bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.25)] border-[3px] border-slate-700/80 overflow-hidden">
        <img
          src={mobileImg}
          alt="LinkMakeup Mobile Profile Preview"
          className="w-full h-auto rounded-[28px] sm:rounded-[32px] object-cover shadow-sm"
        />
      </div>
    </div>
  );

  return (
    <StrategyPageLayout
      seo={seo}
      heroBadge={null}
      heroTitle="Digital Pitch & Networking Hub for Startup Founders"
      heroSubtitle="Empower your fundraising and partner outreach. Share pitch decks, product demos, investor calendars, and NFC contact exchange in one tap."
      features={features}
      faqs={faqs}
      demoWidget={founderDemoWidget}
    />
  );
}
