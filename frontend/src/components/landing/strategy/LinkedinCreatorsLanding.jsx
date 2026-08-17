import { FiEdit3, FiPhoneCall, FiCreditCard, FiAward, FiZap, FiTrendingUp } from 'react-icons/fi';
import StrategyPageLayout from './StrategyPageLayout';
import mobileImg from '../../../assets/mobile .png';

export default function LinkedinCreatorsLanding() {
  const seo = {
    title: 'Bio Link & NFC Card for LinkedIn Creators | LinkMakeup',
    description: 'The ultimate link-in-bio and NFC smart business card for LinkedIn content creators, coaches, and thought leaders. Convert readers into subscribers, clients, and 1-on-1 bookings.',
    keywords: 'link in bio for linkedin creators, linkedin featured link tree, nfc business card for creators, digital business card linkedin',
  };

  const features = [
    {
      icon: <FiEdit3 className="w-5 h-5" />,
      title: 'Featured Posts & Newsletter Capture',
      description: 'Embed your top viral LinkedIn posts, Substack newsletters, or Beehiiv signup forms right at the top of your profile.',
    },
    {
      icon: <FiPhoneCall className="w-5 h-5" />,
      title: '1-on-1 Consulting & Coaching Calls',
      description: 'Seamlessly link Calendly, Topmate, or custom payment links to monetize your audience with advisory calls.',
    },
    {
      icon: <FiCreditCard className="w-5 h-5" />,
      title: 'Tap-to-Connect NFC Networking Card',
      description: 'Attend events, mastermind dinners, and conferences. Tap your matte black NFC card to instantly connect on LinkedIn.',
    },
    {
      icon: <FiAward className="w-5 h-5" />,
      title: 'Social Proof & Case Studies',
      description: 'Highlight client testimonials, stats (e.g. 50k+ Followers), and featured press logos.',
    },
    {
      icon: <FiZap className="w-5 h-5" />,
      title: 'High-Converting Minimal Aesthetics',
      description: 'Clean, distraction-free modern layouts designed to maximize CTA conversion rates.',
    },
    {
      icon: <FiTrendingUp className="w-5 h-5" />,
      title: 'Real-Time Engagement Analytics',
      description: 'Discover which LinkedIn posts bring the most high-value leads and link clicks.',
    },
  ];

  const faqs = [
    {
      question: 'How do I add my LinkMakeup bio link to my LinkedIn profile?',
      answer: 'Go to your LinkedIn profile, click edit intro, and paste your LinkMakeup URL into the "Custom Link" field to show a clean clickable button right under your headline.',
    },
    {
      question: 'Can I capture email newsletter subscribers directly?',
      answer: 'Yes! You can embed email capture forms or direct buttons to your Substack, ConvertKit, or Beehiiv newsletter.',
    },
    {
      question: 'How does the NFC card help with in-person LinkedIn networking?',
      answer: 'Instead of typing out names or scanning QR codes, simply hold your NFC card near any smartphone to instantly open your LinkedIn profile or bio link.',
    },
  ];

  // Compact Mobile Device Mockup Frame
  const linkedinDemoWidget = (
    <div className="relative mx-auto w-full max-w-[210px] min-[380px]:max-w-[230px] sm:max-w-[250px] lg:max-w-[265px] transition-transform duration-300 hover:scale-[1.03] py-2">
      <div className="absolute -inset-2 bg-gradient-to-tr from-blue-500/25 via-indigo-500/15 to-violet-500/25 rounded-[38px] blur-xl opacity-70" />
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
      heroTitle="The Bio Link & NFC Hub for LinkedIn Creators"
      heroSubtitle="Turn your LinkedIn impressions into newsletter subscribers, consulting clients, and high-value networking connections."
      features={features}
      faqs={faqs}
      demoWidget={linkedinDemoWidget}
    />
  );
}
