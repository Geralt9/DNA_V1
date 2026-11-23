import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { UserCircle } from '@phosphor-icons/react';
import Logo from './Logo.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import MobileMenu from './MobileMenu.jsx';
import { nav, site } from '../data/site.js';
import { useAuth } from '../context/AuthContext.jsx';
import './Header.css';

/**
 * Fixed header. At the top of the page it sits flush on the page colour;
 * once scrolled it gains a veil + hairline, slides away while scrolling down
 * and returns on the first scroll up. Transform only.
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const { pathname } = useLocation();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        const delta = y - lastY.current;
        if (Math.abs(delta) > 6) setHidden(delta > 0 && y > 320);
        lastY.current = y;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // A new page always starts with the header shown and the menu closed.
  useEffect(() => {
    setHidden(false);
    setMenuOpen(false);
  }, [pathname]);

  const accountLabel = isAuthenticated ? `Account: ${user.fullName.split(' ')[0]}` : 'Account';

  return (
    <>
      <header
        className="site-header"
        data-scrolled={scrolled || undefined}
        data-hidden={(hidden && !menuOpen) || undefined}
      >
        <div className="site-header__inner">
          <Logo />

          <nav className="site-nav" aria-label="Main">
            <ul role="list">
              {nav.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.end} className="site-nav__link">
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <p className="site-header__tagline" aria-hidden="true">
            Screen printers · Kitchener, Ontario
          </p>

          <div className="site-header__tools">
            <ThemeToggle />
            <NavLink to="/account" className="icon-btn site-header__account" aria-label={accountLabel} title={accountLabel}>
              <UserCircle size={24} weight="light" aria-hidden="true" />
              {isAuthenticated && <span className="site-header__dot" aria-hidden="true" />}
            </NavLink>
            <button
              type="button"
              className="menu-btn"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className="menu-btn__bars" aria-hidden="true">
                <span />
                <span />
              </span>
              <span className="menu-btn__label">{menuOpen ? 'Close' : 'Menu'}</span>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
