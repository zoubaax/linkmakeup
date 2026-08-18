import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAuthenticatedHomePath, loginPathWithReturnTo } from '../utils/authRedirect';
import { SkeletonCard } from './ui/Skeleton';

export default function AdminRoute({ children }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-app flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4">
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (!user) {
    const returnPath = `${location.pathname}${location.search}`;
    return <Navigate to={loginPathWithReturnTo(returnPath)} replace />;
  }

  if (!user.isAdmin) {
    return <Navigate to={getAuthenticatedHomePath(profile)} replace />;
  }

  return children;
}
