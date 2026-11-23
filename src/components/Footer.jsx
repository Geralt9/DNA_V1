import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowUpRight } from '@phosphor-icons/react';
import { gsap, ScrollTrigger } from '../hooks/useReveal.js';
import { Emblem } from './Logo.jsx';
import { nav, site } from '../data/site.js';
import './Footer.css';

/**
 * The DNA tree (Inspiration/Side_page_art) grows out of the footer.
 * It's a luminance mask filled with the theme's tree colour, so it has no
 * paper and no edges. A second gradient mask dissolves the roots into the
 * page. As the footer scrolls in, the tree rises from below at a slower rate
 * than the page (parallax) and the halo behind its crown opens.
 */
export default function Footer() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
      });
      tl.fromTo('.footer-tree__art', { yPercent: 38, opacity: 0.15 }, { yPercent: 0, opacity: 1, ease: 'none' }, 0)
        .fromTo('.footer-tree__halo', { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, ease: 'none' }, 0.25)
        .fromTo('.footer-statement', { y: 60 }, { y: 0, ease: 'none' }, 0);
    }, root);
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    return () => {
      window.removeEventListener('load', refresh);
      mm.revert();
    };
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" ref={rootRef}>
      <div className="footer-tree" aria-hidden="true">
        <span className="footer-tree__halo" />
        <div className="footer-tree__art" />
      </div>

      <div className="footer-grid container">
        <div className="footer-statement">
          <Emblem className="footer-emblem" />
          <p className="footer-statement__text">
            Wear what <em>you believe.</em>
          </p>
          <p className="footer-statement__since">Screen printers · Kitchener · Since {site.founded}</p>
        </div>

        <div className="footer-cols">
          <section aria-labelledby="f-visit">
            <h2 id="f-visit" className="footer-h">Visit</h2>
            <address>
              {site.address.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
            <a className="footer-link" href={site.mapsUrl} target="_blank" rel="noreferrer">
              Open in Maps <ArrowUpRight size={14} aria-hidden="true" />
              <span className="visually-hidden">(opens in a new tab)</span>
            </a>
          </section>

          <section aria-labelledby="f-talk">
            <h2 id="f-talk" className="footer-h">Talk to us</h2>
            <a className="footer-link" href={site.phoneHref}>
              {site.phone}
            </a>
            <a className="footer-link" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <p className="footer-muted">{site.hours}</p>
          </section>

          <nav aria-labelledby="f-explore">
            <h2 id="f-explore" className="footer-h">Explore</h2>
            <ul role="list">
              {nav.map((item) => (
                <li key={item.to}>
                  <Link className="footer-link" to={item.to}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section aria-labelledby="f-follow">
            <h2 id="f-follow" className="footer-h">Follow</h2>
            <ul role="list">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a className="footer-link" href={s.href} target="_blank" rel="noreferrer">
                    {s.label} <ArrowUpRight size={14} aria-hidden="true" />
                    <span className="visually-hidden">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className="footer-base container">
        <p>
          © {site.founded}–{year} {site.name}
        </p>
        <a href="#top" className="footer-top">
          Back to top <ArrowUp size={14} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
