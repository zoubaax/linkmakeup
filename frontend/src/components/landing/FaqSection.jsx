import { useState } from 'react';
import { FiChevronDown, FiHelpCircle } from 'react-icons/fi';

const FAQS = [
  {
    question: 'Is Link Make Up really 100% free to use?',
    answer: 'Yes! The Free Plan gives you an unlimited bio link page, custom subdomain (username.linkmakeup.com), dynamic QR code generator, and edge-fast performance with zero monthly fees or hidden costs.'
  },
  {
    question: 'How does the physical NFC Smart Card work?',
    answer: 'Our custom matte black NFC cards enable tap-to-share in 2 seconds on any modern iPhone or Android. No app installation is required. When tapped, your digital profile or vCard contact card opens instantly on the recipient’s phone.'
  },
  {
    question: 'Are there any monthly subscription fees for the NFC Card?',
    answer: 'No subscriptions! The NFC Smart Card Bundle is a one-time payment of 200 DH ($29 USD). It includes your physical custom card, lifetime Pro profile access, and free express delivery across Morocco.'
  },
  {
    question: 'Can I edit my profile links after ordering a physical NFC card?',
    answer: 'Yes! Your physical card is linked directly to your digital profile. You can update your links, social media channels, contact details, and bio anytime from your dashboard, and your card instantly reflects the updates.'
  },
  {
    question: 'How fast is express delivery in Morocco?',
    answer: 'We process and ship orders directly to your door anywhere in Morocco via express courier, typically arriving within 24 to 48 hours.'
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <FiHelpCircle className="w-4 h-4" />
          <span>Got Questions?</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          Everything you need to know about our digital identity platform, custom subdomains, and NFC smart cards.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-2xl bg-white dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800 shadow-xs overflow-hidden transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between font-semibold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 text-sm sm:text-base transition-colors"
              >
                <span className="pr-4">{faq.question}</span>
                <FiChevronDown
                  className={`w-5 h-5 text-emerald-500 transition-transform duration-300 shrink-0 ${
                    isOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-5 text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-100 dark:border-zinc-800/80 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
