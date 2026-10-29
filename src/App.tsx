import { lazy, Suspense } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import RouteEffects from './components/navigation/RouteEffects';
import ErrorBoundary from './components/ui/ErrorBoundary';

const CV = lazy(() => import('./pages/CV'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Lab = lazy(() => import('./pages/Lab'));
const Computer = lazy(() => import('./pages/Computer'));
const Garage = lazy(() => import('./pages/Garage'));
const Contact = lazy(() => import('./pages/Contact'));
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
                <Route path="/lab" element={<Lab />} />
                <Route path="/lab/computer" element={<Computer />} />
                <Route path="/lab/garage" element={<Garage />} />
                <Route path="/contact" element={<Contact />} />
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
