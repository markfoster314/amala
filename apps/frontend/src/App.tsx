import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import NotFound from './components/common/NotFound/NotFound';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const AuthPage = lazy(() => import('./pages/AuthPage/AuthPage'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const VideoPage = lazy(() => import('./pages/VideoPage/VideoPage'));

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/video/:code" element={<VideoPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
