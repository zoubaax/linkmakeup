import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';
import { FiInstagram, FiGlobe } from 'react-icons/fi';
import { FaLinkedinIn, FaGithub, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="w-full mt-12 bg-slate-950 border-t border-emerald-950/80 text-slate-400 text-sm antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 lg:py-16">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand & Socials (Col Span 2) */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="inline-block transition-transform hover:scale-105">
              <Logo className="h-10 sm:h-12" forceDark={true} />
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The ultimate 100% free bio link tool and tap-to-share NFC smart business card platform built for software engineers, LinkedIn creators, and tech founders.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/linkmake.up"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-emerald-900/60 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 flex items-center justify-center transition-all hover:scale-110 shadow-sm"
              >
                <FiInstagram className="w-4 h-4" />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-emerald-900/60 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 flex items-center justify-center transition-all hover:scale-110 shadow-sm"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-emerald-900/60 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 flex items-center justify-center transition-all hover:scale-110 shadow-sm"
              >
                <FaGithub className="w-4 h-4" />
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-emerald-900/60 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 flex items-center justify-center transition-all hover:scale-110 shadow-sm"
              >
                <FaTwitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Solutions Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Solutions
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/for/engineers" className="hover:text-emerald-400 transition-colors">For Software Engineers</Link></li>
              <li><Link to="/for/linkedin-creators" className="hover:text-emerald-400 transition-colors">For LinkedIn Creators</Link></li>
              <li><Link to="/for/founders" className="hover:text-emerald-400 transition-colors">For Startup Founders</Link></li>
              <li><Link to="/for/nfc-business-cards" className="hover:text-emerald-400 transition-colors">Smart NFC Business Cards</Link></li>
            </ul>
          </div>

          {/* Platform Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/link-in-bio" className="hover:text-emerald-400 transition-colors">Link in Bio Tool</Link></li>
              <li><Link to="/pricing" className="hover:text-emerald-400 transition-colors">Pricing & NFC Bundles</Link></li>
              <li><Link to="/why-us" className="hover:text-emerald-400 transition-colors">Why LinkMakeup</Link></li>
              <li><Link to="/server-specs" className="hover:text-emerald-400 transition-colors">Server & Edge Specs</Link></li>
              <li><Link to="/signup" className="hover:text-emerald-400 transition-colors">Join Free</Link></li>
              <li><Link to="/login" className="hover:text-emerald-400 transition-colors">Sign In</Link></li>
            </ul>
          </div>

          {/* Morocco & Express Shipping Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Express Shipping
            </h4>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-950/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <FiGlobe className="w-4 h-4" />
                <span>Morocco Express</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Matte black NFC cards shipped directly to your door across Morocco.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} LinkMakeup. All rights reserved.
          </div>
          <div>
            <a href="https://www.instagram.com/linkmake.up" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors font-medium">
              @linkmake.up
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
