import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';
import { nav, site } from '../data/site.js';
import './MobileMenu.css';

/**
 * Full-height menu for small screens. While open: page behind is inert and
 * scroll-locked, focus moves into the menu, Escape closes, and focus returns
 * to the menu button afterwards.
 */
export default function MobileMenu({ open, onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    const main = document.getElementById('main');
    const footer = document.querySelector('.site-footer');
    const trigger = document.querySelector('.menu-btn');
    if (!open) return;

    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    main?.setAttribute('inert', '');
    footer?.setAttribute('inert', '');
    const first = panelRef.current?.querySelector('a, button');
    first?.focus({ preventScroll: true });

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab') return;
      // Keep Tab inside: menu links + the header's close button.
      const nodes = [...panelRef.current.querySelectorAll('a, button'), trigger].filter(Boolean);
      const i = nodes.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) {
        e.preventDefault();
        nodes[nodes.length - 1].focus();
      } else if (!e.shiftKey && i === nodes.length - 1) {
        e.preventDefault();
        nodes[0].focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = prevOverflow;
      main?.removeAttribute('inert');
      footer?.removeAttribute('inert');
      document.removeEventListener('keydown', onKey);
      trigger?.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      className="mobile-menu"
      data-open={open || undefined}
      aria-hidden={!open}
      inert={!open}
      ref={panelRef}
    >
      <nav aria-label="Main, mobile" className="mobile-menu__nav">
        <ol role="list">
          {nav.map((item, i) => (
            <li key={item.to} style={{ '--i': i }}>
              <NavLink to={item.to} end={item.end} className="mobile-menu__link" onClick={onClose}>
                <span className="mobile-menu__num" aria-hidden="true">
                  {item.numeral}
                </span>
                <span className="mobile-menu__label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ol>
      </nav>
      <div className="mobile-menu__foot" style={{ '--i': nav.length }}>
        <ThemeToggle withLabel />
        <p className="mobile-menu__meta">
          {site.address[0]}, {site.address[1]}
          <br />
          <a href={site.phoneHref}>{site.phone}</a>
        </p>
      </div>
    </div>
  );
}
