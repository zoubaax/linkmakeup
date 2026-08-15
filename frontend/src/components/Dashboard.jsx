import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { env, getPublicUserUrl } from '../config/env';
import ApiService from '../services/api';
import ProfileEditor from './ProfileEditor';
import LinkManager from './LinkManager';
import LiveMobilePreview from './LiveMobilePreview';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, setProfile, logout } = useAuth();

  const [links, setLinks] = useState([]);
  const [copied, setCopied] = useState(false);

  const publicUrl = getPublicUserUrl(profile?.username);

  useEffect(() => {
    ApiService.getUserLinks()
      .then((res) => { if (res.success) setLinks(res.data || []); })
      .catch((err) => console.error('Failed to load links:', err));
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-cream font-sans text-charcoal">

      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-warm-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl font-bold text-charcoal">
              Link<em className="text-terra not-italic">Makeup</em>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-cream-dark border border-warm-border text-xs text-stone font-medium">
              Dashboard
            </span>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden sm:flex items-center gap-2 text-sm text-stone">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {user?.email}
            </div>
            <button
              onClick={async () => { await logout(); navigate('/', { replace: true }); }}
              className="px-3.5 py-1.5 rounded-lg border border-warm-border bg-white text-charcoal-soft text-sm font-medium hover:bg-cream-dark transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Live URL Banner */}
      <div className="bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-amber-warm uppercase tracking-widest mb-1">
              ✦ Your live page
            </div>
            <a href={publicUrl} target="_blank" rel="noreferrer"
              className="font-mono text-lg font-bold text-white underline underline-offset-2 decoration-white/30 hover:decoration-white/70 transition-all">
              {publicUrl}
            </a>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCopyLink}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${copied ? 'bg-emerald-500' : 'bg-terra hover:bg-terra-dark'}`}>
              {copied ? '✓ Copied!' : '⎘ Copy Link'}
            </button>
            <a href={publicUrl} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all">
              Visit ↗
            </a>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
          
          {/* Left: Editor Panels */}
          <div className="flex flex-col gap-6">
            <ProfileEditor
              profile={profile}
              onProfileUpdated={(updated) => setProfile({ ...profile, ...updated })}
            />
            <LinkManager
              links={links}
              onLinksUpdated={(updated) => setLinks(updated)}
            />
          </div>

          {/* Right: Sticky Phone Preview */}
          <div className="hidden lg:block sticky top-24">
            <div className="text-center mb-4">
              <span className="px-3 py-1 rounded-full bg-cream-dark border border-warm-border text-xs text-stone font-medium">
                📱 Live Preview
              </span>
            </div>
            <LiveMobilePreview profile={profile} links={links} />
          </div>
        </div>
      </main>
    </div>
  );
}
