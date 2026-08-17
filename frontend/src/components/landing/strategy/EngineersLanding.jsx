import { FiCode, FiSmartphone, FiCalendar, FiMoon, FiBarChart2, FiGlobe } from 'react-icons/fi';
import StrategyPageLayout from './StrategyPageLayout';
import mobileImg from '../../../assets/mobile .png';

export default function EngineersLanding() {
  const seo = {
    title: 'Bio Link & NFC Business Card for Software Engineers | LinkMakeup',
    description: 'The #1 bio link and NFC smart card built specifically for software engineers, developers, and tech pros. Showcase your GitHub, Tech Stack, LinkedIn, and Topmate calls in one sleek profile.',
    keywords: 'link in bio for software engineers, developer portfolio bio link, nfc card developer, github linkedin bio link',
  };

  const features = [
    {
      icon: <FiCode className="w-5 h-5" />,
      title: 'GitHub & Tech Stack Showcase',
      description: 'Pin your top GitHub repositories, star counts, and tech stack tags (React, Node, Python, AWS, Rust) directly on your bio link.',
    },
    {
      icon: <FiSmartphone className="w-5 h-5" />,
      title: 'NFC Smart Card for Meetups',
      description: 'Tap your custom matte NFC card on any smartphone at tech conferences or hackathons to share your GitHub and LinkedIn in seconds.',
    },
    {
      icon: <FiCalendar className="w-5 h-5" />,
      title: 'Topmate & Calendly Booking',
      description: 'Offer 1-on-1 mentorship, code reviews, or career advice with direct Calendly or Topmate scheduling buttons.',
    },
    {
      icon: <FiMoon className="w-5 h-5" />,
      title: 'Sleek Dark Mode Aesthetics',
      description: 'Choose from terminal-style, cyberpunk, or minimal dark themes crafted specifically for software developers.',
    },
    {
      icon: <FiBarChart2 className="w-5 h-5" />,
      title: 'Link Analytics & Visitor Insights',
      description: 'Track clicks, traffic sources, and profile views with privacy-friendly real-time analytics.',
    },
    {
      icon: <FiGlobe className="w-5 h-5" />,
      title: 'Custom Subdomain & QR Code',
      description: 'Get your custom username.linkmakeup.com domain and generate instant high-res vector QR codes for your resume.',
    },
  ];

  const faqs = [
    {
      question: 'How do I link my GitHub & tech stack to my LinkMakeup profile?',
      answer: 'Simply sign up, add your GitHub username in the profile editor, and tag your core technologies. You can pin specific repos or show live star counters.',
    },
    {
      question: 'Does the NFC smart card work with all smartphones?',
      answer: 'Yes! LinkMakeup NFC cards work seamlessly with both iOS (iPhone 7 and newer) and Android devices without requiring any app installation.',
    },
    {
      question: 'Can I use a custom domain for my developer profile?',
      answer: 'Yes, you get your own custom link (e.g. linkmakeup.com/alex) or custom subdomain (alex.linkmakeup.com).',
    },
    {
      question: 'Is LinkMakeup free for software engineers?',
      answer: 'Yes! The core bio link platform is 100% free forever. You can optional order physical matte NFC smart cards anytime.',
    },
  ];

  // Compact, sleek Mobile Device Mockup Frame
  const engineerDemoWidget = (
    <div className="relative mx-auto w-full max-w-[210px] min-[380px]:max-w-[230px] sm:max-w-[250px] lg:max-w-[265px] transition-transform duration-300 hover:scale-[1.03] py-2">
      {/* Soft Glow */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-500/25 via-teal-500/15 to-violet-500/25 rounded-[38px] blur-xl opacity-70" />

      {/* Frame Chassis */}
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
      heroTitle="The Bio Link & NFC Card Built for Software Engineers"
      heroSubtitle="Showcase your GitHub repos, tech stack, LinkedIn, and mentorship booking links in one minimalist, high-converting digital card."
      features={features}
      faqs={faqs}
      demoWidget={engineerDemoWidget}
    />
  );
}
