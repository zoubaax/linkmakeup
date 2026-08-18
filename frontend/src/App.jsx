import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import ProfileDetailsPage from './components/ProfileDetailsPage';
import AnalyticsPage from './components/AnalyticsPage';
import OnboardingPage from './components/OnboardingPage';
import PublicProfile from './components/PublicProfile';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminOverview from './components/admin/AdminOverview';
import AdminAnalyticsPage from './components/admin/AdminAnalyticsPage';
import AdminUsersPage from './components/admin/AdminUsersPage';
import AdminProfilesPage from './components/admin/AdminProfilesPage';
import AdminLinksPage from './components/admin/AdminLinksPage';
import AdminActivityPage from './components/admin/AdminActivityPage';
import SuspendedAccountPage from './components/SuspendedAccountPage';

// SEO Strategy Pages
import EngineersLanding from './components/landing/strategy/EngineersLanding';
import LinkedinCreatorsLanding from './components/landing/strategy/LinkedinCreatorsLanding';
import FoundersLanding from './components/landing/strategy/FoundersLanding';
import NfcCardsLanding from './components/landing/strategy/NfcCardsLanding';
import MoroccoNfcLanding from './components/landing/strategy/MoroccoNfcLanding';
import DigitalBusinessCardLanding from './components/landing/strategy/DigitalBusinessCardLanding';

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

          {/* Core Pillar & Feature Hub Pages */}
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/link-in-bio" element={<LinkInBioLanding />} />
          <Route path="/bio-link" element={<LinkInBioLanding />} />
          <Route path="/features/link-in-bio" element={<LinkInBioLanding />} />
          <Route path="/linktree-alternative" element={<LinkInBioLanding />} />
          <Route path="/why-us" element={<WhyUsPage />} />
          <Route path="/why" element={<WhyUsPage />} />
          <Route path="/server-specs" element={<ServerSpecsPage />} />
          <Route path="/specs" element={<ServerSpecsPage />} />

          {/* Feature Money Pages */}
          <Route path="/features/digital-business-card" element={<DigitalBusinessCardLanding />} />
          <Route path="/digital-business-card" element={<DigitalBusinessCardLanding />} />
          <Route path="/features/nfc" element={<NfcCardsLanding />} />

          {/* Strategy & Moroccan Geo-Targeted Landing Pages */}
          <Route path="/fr/carte-de-visite-digitale-maroc" element={<MoroccoNfcLanding />} />
          <Route path="/fr/carte-nfc-maroc" element={<MoroccoNfcLanding />} />
          <Route path="/solutions/freelancers-maroc" element={<MoroccoNfcLanding />} />
          <Route path="/maroc" element={<MoroccoNfcLanding />} />

          <Route path="/for/engineers" element={<EngineersLanding />} />
          <Route path="/for/linkedin-creators" element={<LinkedinCreatorsLanding />} />
          <Route path="/for/founders" element={<FoundersLanding />} />
          <Route path="/for/nfc-business-cards" element={<NfcCardsLanding />} />
          <Route path="/for/nfc-cards" element={<NfcCardsLanding />} />

          <Route
            path="/account-suspended"
            element={
              <ProtectedRoute requiresSuspended>
                <SuspendedAccountPage />
              </ProtectedRoute>
            }
          />

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
            path="/dashboard/analytics"
            element={
              <ProtectedRoute requiresProfile>
                <AnalyticsPage />
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

          <Route
            path="/admin"
            element={(
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            )}
          >
            <Route index element={<AdminOverview />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="profiles" element={<AdminProfilesPage />} />
            <Route path="links" element={<AdminLinksPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="activity" element={<AdminActivityPage />} />
          </Route>

          <Route path="/:username" element={<PublicProfile />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

