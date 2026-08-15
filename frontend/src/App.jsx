import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import DiscussionsPage from './components/DiscussionsPage';
import NewDiscussionPage, { ReplyDiscussionPage } from './components/DiscussionActions';
import OnboardingPage from './components/OnboardingPage';
import PublicProfile from './components/PublicProfile';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage initialMode="signin" />} />
        <Route path="/signup" element={<AuthPage initialMode="signup" />} />
        <Route path="/discussions" element={<DiscussionsPage />} />
        <Route
          path="/discussions/new"
          element={
            <ProtectedRoute>
              <NewDiscussionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/discussions/:id/reply"
          element={
            <ProtectedRoute>
              <ReplyDiscussionPage />
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

        <Route path="/:username" element={<PublicProfile />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
