import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import ProfileDetailsPage from './components/ProfileDetailsPage';
import OnboardingPage from './components/OnboardingPage';
import PublicProfile from './components/PublicProfile';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminOverview from './components/admin/AdminOverview';
import AdminUsersPage from './components/admin/AdminUsersPage';
import AdminProfilesPage from './components/admin/AdminProfilesPage';
import AdminLinksPage from './components/admin/AdminLinksPage';
import AdminActivityPage from './components/admin/AdminActivityPage';
import SuspendedAccountPage from './components/SuspendedAccountPage';

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
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="profiles" element={<AdminProfilesPage />} />
            <Route path="links" element={<AdminLinksPage />} />
            <Route path="activity" element={<AdminActivityPage />} />
          </Route>

          <Route path="/:username" element={<PublicProfile />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}
