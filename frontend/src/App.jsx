import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import ProfileDetailsPage from './components/ProfileDetailsPage';
import OnboardingPage from './components/OnboardingPage';
import PublicProfile from './components/PublicProfile';
import ProtectedRoute from './components/ProtectedRoute';

// SEO Strategy Pages
import EngineersLanding from './components/landing/strategy/EngineersLanding';
import LinkedinCreatorsLanding from './components/landing/strategy/LinkedinCreatorsLanding';
import FoundersLanding from './components/landing/strategy/FoundersLanding';
import NfcCardsLanding from './components/landing/strategy/NfcCardsLanding';

// Core Landing Pillar Pages
import WhyUsPage from './components/landing/pages/WhyUsPage';
import ServerSpecsPage from './components/landing/pages/ServerSpecsPage';
import PricingPage from './components/landing/pages/PricingPage';
import LinkInBioLanding from './components/landing/pages/LinkInBioLanding';

/**
 * Detect if the app is being loaded from a user subdomain
 * e.g. allo.linkmakeup.com → returns "allo"
 * Returns null for the root domain or localhost
 */
function getSubdomainUsername() {
  const hostname = window.location.hostname;
  const appDomain = import.meta.env.VITE_APP_DOMAIN || 'linkmakeup.com';

  // Skip subdomains on localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') return null;

  // Skip www and the root domain itself
  if (hostname === appDomain || hostname === `www.${appDomain}`) return null;

  // Check if it's a subdomain of appDomain
  if (hostname.endsWith(`.${appDomain}`)) {
    const sub = hostname.replace(`.${appDomain}`, '');
    // Ignore known infrastructure subdomains
    if (['api', 'www', 'app', 'mail', 'admin'].includes(sub)) return null;
    return sub;
  }

  return null;
}

export default function App() {
  const subdomainUser = getSubdomainUsername();

  return (
    <BrowserRouter>
      {subdomainUser ? (
        <PublicProfile usernameOverride={subdomainUser} />
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage initialMode="signin" />} />
          <Route path="/signup" element={<AuthPage initialMode="signup" />} />

          {/* Core Pillar Pages */}
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/link-in-bio" element={<LinkInBioLanding />} />
          <Route path="/bio-link" element={<LinkInBioLanding />} />
          <Route path="/linktree-alternative" element={<LinkInBioLanding />} />
          <Route path="/why-us" element={<WhyUsPage />} />
          <Route path="/why" element={<WhyUsPage />} />
          <Route path="/server-specs" element={<ServerSpecsPage />} />
          <Route path="/specs" element={<ServerSpecsPage />} />

          {/* Strategy SEO Pages */}
          <Route path="/for/engineers" element={<EngineersLanding />} />
          <Route path="/for/linkedin-creators" element={<LinkedinCreatorsLanding />} />
          <Route path="/for/founders" element={<FoundersLanding />} />
          <Route path="/for/nfc-business-cards" element={<NfcCardsLanding />} />
          <Route path="/for/nfc-cards" element={<NfcCardsLanding />} />

          <Route
            path="/onboarding"
            element={
              <ProtectedRoute requiresNoProfile>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiresProfile>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute requiresProfile>
                <ProfileDetailsPage />
              </ProtectedRoute>
            }
          />

          <Route path="/:username" element={<PublicProfile />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

