import { FiLinkedin, FiMail, FiCalendar, FiSmartphone, FiTrendingUp, FiAward } from 'react-icons/fi';
import StrategyPageLayout from './StrategyPageLayout';
import mobileImg from '../../../assets/mobile .png';

export default function LinkedinCreatorsLanding() {
  const seo = {
    title: 'Bio Link & NFC Card for LinkedIn Creators | Link Make Up',
    description: 'Turn your LinkedIn impressions into booked calls, newsletter subscribers, and lead conversions with Link Make Up.',
    keywords: 'linkedin bio link, linkedin custom link button, link in bio for creators, linkedin top voice bio link',
  };

  const features = [
    {
      icon: <FiLinkedin className="w-5 h-5" />,
      title: 'LinkedIn Custom Link Optimized',
      description: 'Designed specifically to fit your LinkedIn profile headline button for maximum click-through rates.',
    },
    {
      icon: <FiMail className="w-5 h-5" />,
      title: 'Newsletter & Lead Capture',
      description: 'Capture email subscribers directly on your bio link page with one-click form integration.',
    },
    {
      icon: <FiCalendar className="w-5 h-5" />,
      title: 'Booked Calls & Consultations',
      description: 'Embed Calendly, SavvyCal, or Topmate directly on your page to convert profile visitors into paying clients.',
    },
    {
      icon: <FiSmartphone className="w-5 h-5" />,
      title: 'NFC Card for Events & Summits',
      description: 'Tap your physical matte black NFC card at industry summits to connect on LinkedIn instantly.',
    },
    {
      icon: <FiTrendingUp className="w-5 h-5" />,
      title: 'Conversion Analytics',
      description: 'See which LinkedIn posts drive the most clicks and track profile traffic sources in real-time.',
    },
    {
      icon: <FiAward className="w-5 h-5" />,
      title: 'Custom Branding & Subdomain',
      description: 'Host on your own username.linkmakeup.com subdomain with clean, professional light and dark themes.',
    },
  ];

  const faqs = [
    {
      question: 'How do I add my Link Make Up bio link to my LinkedIn profile?',
      answer: 'Go to your LinkedIn profile, click edit intro, and paste your Link Make Up URL into the "Custom Link" field to show a clean clickable button right under your headline.',
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
