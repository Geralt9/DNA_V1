import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Phone } from '@phosphor-icons/react';
import ThemedArt from '../components/ThemedArt.jsx';
import Img, { resolveImage } from '../components/Img.jsx';
import { useProducts } from '../hooks/useProducts.js';
import { useReveal, gsap } from '../hooks/useReveal.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { site } from '../data/site.js';
import './Home.css';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
const pad = (n) => String(n).padStart(2, '0');

export default function Home() {
  useDocumentTitle(null);
  const pageRef = useRef(null);
  useReveal(pageRef);
  return (
    <div ref={pageRef}>
      <Hero />
      <FeaturedPieces />
      <BrandStory />
      <CallToAction />
    </div>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────── */
function Hero() {
  const { products, loading } = useProducts({ featured: true });
  const [index, setIndex] = useState(0);
  const heroRef = useRef(null);
  const count = products.length;
  const current = products[index];

  const go = (dir) => setIndex((i) => (i + dir + count) % count);

  // Entrance choreography: headline lines rise → the arch opens → the
  // garment lifts into its frame → halo and controls settle.
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
        tl.fromTo('.hero__title .mask-line > span', { yPercent: 110 }, { yPercent: 0, duration: 1.25, stagger: 0.1 })
          .fromTo('.hero__arch', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.4 }, 0.15)
          .fromTo('.hero__arch .themed-art__img', { scale: 1.18 }, { scale: 1, duration: 2.2 }, 0.15)
          .fromTo('.hero__halo', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 1.6 }, 0.55)
          .fromTo('.hero__fade', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1, stagger: 0.08 }, 0.45);
      },
      heroRef.current,
    );
    return () => mm.revert();
  }, []);

  // Keyboard: ← → move through the pieces when focus is in the slider.
  const onKeyDown = (e) => {
    if (!count) return;
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  };

  return (
    <section className="hero container" ref={heroRef} aria-labelledby="hero-title">
      <div className="hero__copy">
        <p className="eyebrow hero__fade">Kitchener · Since {site.founded}</p>
        <h1 id="hero-title" className="hero__title">
          <span className="mask-line">
            <span>The revolution</span>
          </span>
          <span className="mask-line">
            <span>is just a</span>
          </span>
          <span className="mask-line">
            <span className="hero__title-accent">t-shirt away.</span>
          </span>
        </h1>
        <p className="lede hero__fade">
          Band wear, fan wear and shop tees, screen printed by hand and by press for people who wear what they believe.
        </p>
        <div className="hero__actions hero__fade">
          <Link to="/designs" className="btn">
            View the designs <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link to="/about" className="link-arrow">
            Our story <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div
        className="hero__stage"
        role="group"
        aria-roledescription="carousel"
        aria-label="Featured pieces"
        onKeyDown={onKeyDown}
      >
        <ThemedArt
          pair="hero"
          className="hero__arch"
          sizes="(max-width: 760px) 92vw, 46vw"
          priority
          position="50% 22%"
          alt={{
            light: 'Painting of a winged angel rising through storm clouds toward a shaft of light',
            dark: 'Painting of a crowned skull with a halo, draped in red and gold robes',
          }}
        />
        <span className="hero__halo" aria-hidden="true" />

        <div className="hero__piece">
          {loading || !current ? (
            <div className="hero__frame hero__frame--loading" aria-hidden="true" />
          ) : (
            <Link
              to={`/designs/${current.id}`}
              className="hero__frame"
              aria-label={`${current.title} for ${current.client}: view details`}
            >
              {products.map((p, i) => (
                <Img
                  key={p.id}
                  data={resolveImage(p)}
                  alt={i === index ? p.alt : ''}
                  aria-hidden={i === index ? undefined : true}
                  sizes="(max-width: 760px) 52vw, 22vw"
                  priority={i === 0}
                  className="hero__shirt"
                  data-active={i === index || undefined}
                />
              ))}
            </Link>
          )}
        </div>

        <div className="hero__controls hero__fade">
          <p className="hero__count" aria-hidden="true">
            <span className="hero__count-now">{pad(index + 1)}</span> / {pad(Math.max(count, 1))}
          </p>
          <div className="hero__caption" aria-live="polite" key={current?.id}>
            {current && (
              <>
                <span className="visually-hidden">
                  Piece {index + 1} of {count}:{' '}
                </span>
                <span className="hero__caption-title">{current.title}</span>
                <span className="hero__caption-client">{current.client}</span>
              </>
            )}
          </div>
          <div className="hero__arrows">
            <button type="button" className="square-btn" onClick={() => go(-1)} disabled={!count} aria-label="Previous piece">
              <ArrowLeft size={16} aria-hidden="true" />
            </button>
            <button type="button" className="square-btn" onClick={() => go(1)} disabled={!count} aria-label="Next piece">
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        <p className="hero__side" aria-hidden="true">
          Est. MCMXCIV — 18 Charles St. W
        </p>
      </div>
    </section>
  );
}

/* ── Featured pieces ──────────────────────────────────────────────── */
function FeaturedPieces() {
  const { products, loading, error, retry } = useProducts({ featured: false });
  const pieces = products.slice(0, 4);
  const sectionRef = useRef(null);
  useReveal(sectionRef, [loading]);

  return (
    <section className="featured" aria-labelledby="featured-title" ref={sectionRef}>
      <span className="featured__ghost" aria-hidden="true">
        DNA
      </span>
      <div className="container">
        <header className="section-head">
          <p className="eyebrow" data-reveal="up">
            From the press
          </p>
          <h2 id="featured-title" className="section-title" data-reveal="lines">
            <span className="mask-line">
              <span>Featured pieces</span>
            </span>
          </h2>
          <Link to="/designs" className="link-arrow section-head__link" data-reveal="up">
            All designs <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </header>

        {error ? (
          <div className="inline-error" role="alert">
            <p>{error.message}</p>
            <button type="button" className="btn btn--ghost" onClick={retry}>
              Try again
            </button>
          </div>
        ) : (
          <ol className="featured__rail" role="list" aria-busy={loading}>
            {(loading ? Array.from({ length: 4 }, () => null) : pieces).map((p, i) => (
              <li key={p?.id ?? i} className="featured__item" style={{ '--i': i }}>
                {p ? (
                  <Link to={`/designs/${p.id}`} className="piece">
                    <div className="piece__frame" data-reveal="image" data-reveal-delay={i * 0.08}>
                      <Img data={resolveImage(p)} alt={p.alt} sizes="(max-width: 760px) 70vw, 24vw" />
                    </div>
                    <div className="piece__meta">
                      <span className="numeral" aria-hidden="true">
                        {ROMAN[i]}
                      </span>
                      <span>
                        <span className="piece__title">{p.title}</span>
                        <span className="piece__client">{p.client}</span>
                      </span>
                    </div>
                  </Link>
                ) : (
                  <div className="piece piece--skeleton" aria-hidden="true">
                    <div className="piece__frame" />
                    <div className="skeleton-line" />
                  </div>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}

/* ── Brand story ──────────────────────────────────────────────────── */
const FACTS = [
  { value: '1994', label: 'Founded in Kitchener' },
  { value: '5', label: 'Presses: two automatic, three manual' },
  { value: '8', label: 'Spot colours on a single print' },
  { value: '0', label: 'Phthalates in our inks' },
];

function BrandStory() {
  return (
    <section className="story container" aria-labelledby="story-title">
      <div className="story__art" data-reveal="image">
        <ThemedArt
          pair="story"
          className="story__img"
          sizes="(max-width: 900px) 92vw, 44vw"
          position="62% 40%"
          alt={{
            light: 'Illustration of a skeleton at rest, wreathed in red roses',
            dark: 'Painting of a skull wearing a jewelled crown among dark red roses',
          }}
        />
        <span className="story__corner story__corner--tl" aria-hidden="true" />
        <span className="story__corner story__corner--br" aria-hidden="true" />
      </div>

      <div className="story__copy">
        <p className="eyebrow" data-reveal="up">
          Our name
        </p>
        <h2 id="story-title" className="section-title" data-reveal="lines">
          <span className="mask-line">
            <span>Named for the thing</span>
          </span>
          <span className="mask-line">
            <span>that unites us.</span>
          </span>
        </h2>
        <div className="prose" data-reveal="up">
          <p>
            DNA was founded in 1994, when DNA evidence was new to every conversation, compelling, and suddenly the one thing
            that connected all of us. The name stuck because the idea did.
          </p>
          <p>
            Three decades on, the shop is still fuelled by music, pop culture and every form of expression that ends up on a
            chest. Screen printing is repetition, and repetition is how a crowd becomes a crowd.
          </p>
        </div>
        <dl className="facts" data-reveal="up">
          {FACTS.map((f) => (
            <div key={f.label} className="facts__item">
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
        <Link to="/about" className="link-arrow" data-reveal="up">
          Read the whole story <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

/* ── Call to action ───────────────────────────────────────────────── */
function CallToAction() {
  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className="cta__inner container">
        <div className="cta__copy">
          <p className="eyebrow" data-reveal="up">
            Your design, our press
          </p>
          <h2 id="cta-title" className="cta__title" data-reveal="lines">
            <span className="mask-line">
              <span>Bring us</span>
            </span>
            <span className="mask-line">
              <span>your art.</span>
            </span>
          </h2>
          <p className="prose" data-reveal="up">
            Send high-resolution art (300 dpi or better, at the size you want it printed) with Pantone references where you
            have them. We do every separation in house and send you a proof before anything touches a screen.
          </p>
          <div className="cta__actions" data-reveal="up">
            <Link to="/account" className="btn">
              Create an account <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <a href={site.phoneHref} className="link-arrow">
              <Phone size={14} aria-hidden="true" /> {site.phone}
            </a>
          </div>
        </div>
        <div className="cta__art" data-reveal="image">
          <ThemedArt
            pair="cta"
            className="cta__img"
            sizes="(max-width: 900px) 80vw, 36vw"
            position="50% 30%"
            alt={{
              light: 'Vermilion woodcut of two winged angels carrying a child, rays of light behind them',
              dark: 'The same woodcut of two winged angels, printed red on black',
            }}
          />
        </div>
      </div>
    </section>
  );
}
