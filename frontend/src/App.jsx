import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import OnboardingPage from './components/OnboardingPage';
import PublicProfile from './components/PublicProfile';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<AuthPage />} />
        <Route path="/:username" element={<PublicProfile />} />

        {/* Protected: Only when authenticated but no profile yet */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute requiresNoProfile>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />

        {/* Protected: Only when authenticated + has profile */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiresProfile>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
