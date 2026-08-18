import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAuthenticatedHomePath, loginPathWithReturnTo } from '../utils/authRedirect';
import { SkeletonCard } from './ui/Skeleton';

export default function ProtectedRoute({ children, requiresProfile, requiresNoProfile, requiresSuspended }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-app flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4">
          <div className="flex flex-col items-center gap-3 mb-6">
            <svg className="animate-spin h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm font-medium text-fg-muted">Loading your session...</span>
          </div>
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (!user) {
    const returnPath = `${location.pathname}${location.search}`;
    return <Navigate to={loginPathWithReturnTo(returnPath)} replace />;
  }

  if (requiresSuspended) {
    if (!profile?.isSuspended) {
      return <Navigate to={getAuthenticatedHomePath(profile)} replace />;
    }
    return children;
  }

  if (profile?.isSuspended) {
    return <Navigate to="/account-suspended" replace />;
  }

  if (requiresNoProfile && profile) {
    return <Navigate to={getAuthenticatedHomePath(profile)} replace />;
  }

  if (requiresProfile && !profile) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}
