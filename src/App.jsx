import { lazy, Suspense, useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import PageLoader from './components/PageLoader.jsx';
import { ScrollTrigger } from './hooks/useReveal.js';
import Home from './pages/Home.jsx';

const Designs = lazy(() => import('./pages/Designs.jsx'));
const ProductPage = lazy(() => import('./pages/ProductPage.jsx'));
const ProductModal = lazy(() => import('./pages/ProductModal.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Account = lazy(() => import('./pages/Account.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

/**
 * When a design is opened from the gallery, the gallery stays mounted
 * underneath (backgroundLocation) and the design opens as a dialog.
 * Visiting /designs/:id directly renders it as a full page instead.
 */
export default function App() {
  const location = useLocation();
  const background = location.state?.backgroundLocation;
  // Track the page underneath, so opening/closing the modal never scrolls or steals focus.
  useRouteFocus((background || location).pathname);

  return (
    <div id="top">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Suspense fallback={<PageLoader />}>
          <Routes location={background || location}>
            <Route path="/" element={<Home />} />
            <Route path="/designs" element={<Designs />} />
            <Route path="/designs/:id" element={<ProductPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/account" element={<Account />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      {background && (
        <Suspense fallback={null}>
          <Routes>
            <Route path="/designs/:id" element={<ProductModal />} />
          </Routes>
        </Suspense>
      )}
    </div>
  );
}

/** On real page changes: scroll to top, move focus to <main>, recalc scroll triggers. */
function useRouteFocus(pathname) {
  const prev = useRef(pathname);
  useEffect(() => {
    // Compare paths rather than counting runs, so StrictMode's double effect is harmless.
    if (prev.current === pathname) return;
    prev.current = pathname;
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.getElementById('main')?.focus({ preventScroll: true });
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname]);
}
