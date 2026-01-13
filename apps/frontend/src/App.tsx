import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import NotFound from './components/common/NotFound/NotFound';
import { LoadingIndicator } from '@markfoster314/marduk';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const AuthPage = lazy(() => import('./pages/AuthPage/AuthPage'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const VideoPage = lazy(() => import('./pages/VideoPage/VideoPage'));
const PlaylistPage = lazy(() => import('./pages/PlaylistPage/PlaylistPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage/ProfilePage'));
const UploadPage = lazy(() => import('./pages/UploadPage/UploadPage'));

// Component to handle redirect for authenticated users on /auth
function AuthPageWrapper() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AuthPage />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPageWrapper />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/video/:code"
          element={
            <ProtectedRoute>
              <VideoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/playlist/:code"
          element={
            <ProtectedRoute>
              <PlaylistPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:code"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <Suspense
            fallback={<LoadingIndicator darkMode={true} fullscreen={true} />}
          >
            <AppRoutes />
          </Suspense>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
