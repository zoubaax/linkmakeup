import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * ProtectedRoute:
 * - requiresProfile=true  → must be logged in AND have a profile  → /dashboard
 * - requiresNoProfile=true → must be logged in but NO profile yet  → /onboarding
 */
export default function ProtectedRoute({ children, requiresProfile, requiresNoProfile }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <svg className="animate-spin h-8 w-8 text-violet-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm font-semibold">Loading your session...</span>
        </div>
      </div>
    );
  }

  // Not logged in at all → go to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Logged in, has profile, but trying to access onboarding → send to dashboard
  if (requiresNoProfile && profile) {
    return <Navigate to="/dashboard" replace />;
  }

  // Logged in, NO profile, trying to access dashboard → send to onboarding
  if (requiresProfile && !profile) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}
