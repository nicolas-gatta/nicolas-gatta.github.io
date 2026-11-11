import { lazy, Suspense } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import RouteEffects from './components/navigation/RouteEffects';
import ErrorBoundary from './components/ui/ErrorBoundary';

const CV = lazy(() => import('./pages/CV'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const Garage = lazy(() => import('./pages/Garage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const SecretSystem = lazy(() => import('./features/easterEggs/SecretSystem'));

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <HashRouter>
        <RouteEffects />
        <Layout>
          <ErrorBoundary>
            <Suspense
              fallback={
                <div className="page-shell route-loading" role="status">
                  Opening this space
                  <span className="loading-line" />
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cv" element={<CV />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/garage" element={<Garage />} />
                <Route path="/lab/garage" element={<Navigate to="/garage" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </Layout>
        <Suspense fallback={null}>
          <SecretSystem />
        </Suspense>
      </HashRouter>
    </MotionConfig>
  );
}
