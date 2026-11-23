import { useId, useMemo, useRef } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ArrowCounterClockwise } from '@phosphor-icons/react';
import ThemedArt from '../components/ThemedArt.jsx';
import Img, { resolveImage } from '../components/Img.jsx';
import { useProducts } from '../hooks/useProducts.js';
import { useReveal } from '../hooks/useReveal.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { CATEGORIES, GARMENTS } from '../mocks/products.js';
import './Designs.css';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));
const GARMENT_LABEL = Object.fromEntries(GARMENTS.map((g) => [g.id, g.label]));

export default function Designs() {
  useDocumentTitle('Designs');
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || 'all';
  const garment = params.get('garment') || 'all';
  const location = useLocation();

  // Full list once (for counts), filtered list from the service (backend-ready).
  const { products: all } = useProducts();
  const { products, loading, error, retry } = useProducts({ category, garment });

  const counts = useMemo(() => {
    const c = { all: all.length };
    for (const p of all) c[p.category] = (c[p.category] || 0) + 1;
    return c;
  }, [all]);

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (value === 'all') next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true, preventScrollReset: true });
  };
  const reset = () => setParams({}, { replace: true, preventScrollReset: true });
  const filtered = category !== 'all' || garment !== 'all';

  const headRef = useRef(null);
  const gridRef = useRef(null);
  useReveal(headRef);
  useReveal(gridRef, [products]);

  const showSkeleton = loading && products.length === 0;

  return (
    <div className="page designs">
      <header className="designs-head container" ref={headRef}>
        <div className="designs-head__copy">
          <p className="eyebrow" data-reveal="up">
            The collection
          </p>
          <h1 className="designs-head__title" data-reveal="lines">
            <span className="mask-line">
              <span>Designs</span>
            </span>
          </h1>
          <p className="lede" data-reveal="up">
            Band wear, festival runs, shop tees and trade work, every one pulled on our presses in downtown Kitchener.
          </p>
        </div>
        <div className="designs-head__art" data-reveal="image">
          <ThemedArt
            pair="designs"
            className="designs-head__img"
            sizes="(max-width: 760px) 100vw, 58vw"
            priority
            position="50% 38%"
            alt={{
              light: 'Silver relief of a gauntleted hand gripping an engraved sword hilt',
              dark: 'The same silver relief of a hand on a sword hilt, sunk in shadow',
            }}
          />
        </div>
      </header>

      <section className="container" aria-labelledby="collection-title">
        <h2 id="collection-title" className="visually-hidden">
          Collection
        </h2>

        <div className="filters">
          <FilterGroup
            legend="Category"
            name="category"
            value={category}
            onChange={(v) => setFilter('category', v)}
            options={[{ id: 'all', label: 'All' }, ...CATEGORIES].map((o) => ({ ...o, count: counts[o.id] }))}
          />
          <FilterGroup
            legend="Garment"
            name="garment"
            value={garment}
            onChange={(v) => setFilter('garment', v)}
            options={[{ id: 'all', label: 'Any' }, ...GARMENTS]}
          />
          <p className="filters__status" role="status" aria-live="polite">
            {loading && products.length === 0
              ? 'Loading designs…'
              : `${products.length} ${products.length === 1 ? 'design' : 'designs'}${filtered ? ' match' : ''}`}
          </p>
        </div>

        {error ? (
          <div className="inline-error" role="alert">
            <p>{error.message}</p>
            <button type="button" className="btn btn--ghost" onClick={retry}>
              Try again
            </button>
          </div>
        ) : !loading && products.length === 0 ? (
          <div className="empty">
            <p className="empty__title">Nothing printed in that combination yet.</p>
            <p className="empty__text">Try another garment or category, or see the whole collection.</p>
            <button type="button" className="btn btn--ghost" onClick={reset}>
              <ArrowCounterClockwise size={16} aria-hidden="true" /> Show all designs
            </button>
          </div>
        ) : (
          <ul className="gallery" role="list" ref={gridRef} aria-busy={loading} data-stale={(loading && !showSkeleton) || undefined}>
            {(showSkeleton ? Array.from({ length: 6 }, () => null) : products).map((p, i) =>
              p ? (
                <li key={p.id} className="gallery__item">
                  <Link
                    to={`/designs/${p.id}`}
                    state={{ backgroundLocation: location }}
                    className="piece"
                  >
                    <div className="piece__frame" data-reveal="image" data-reveal-delay={(i % 3) * 0.08}>
                      <Img data={resolveImage(p)} alt={p.alt} sizes="(max-width: 480px) 92vw, (max-width: 900px) 46vw, 30vw" />
                    </div>
                    <div className="piece__meta">
                      <span className="numeral" aria-hidden="true">
                        {ROMAN[i]}
                      </span>
                      <span>
                        <span className="piece__title">{p.title}</span>
                        <span className="piece__client">
                          {p.client}
                          <span className="gallery__tags">
                            {CATEGORY_LABEL[p.category]} · {GARMENT_LABEL[p.garment]}
                          </span>
                        </span>
                      </span>
                    </div>
                  </Link>
                </li>
              ) : (
                <li key={i} className="gallery__item" aria-hidden="true">
                  <div className="piece piece--skeleton">
                    <div className="piece__frame" />
                    <div className="skeleton-line" />
                  </div>
                </li>
              ),
            )}
          </ul>
        )}
      </section>
    </div>
  );
}

/** Native radios (arrow keys, form semantics) dressed as quiet text tabs. */
function FilterGroup({ legend, name, value, onChange, options }) {
  const id = useId();
  return (
    <fieldset className="filter">
      <legend className="filter__legend">{legend}</legend>
      <div className="filter__options">
        {options.map((o) => (
          <label key={o.id} className="filter__option" htmlFor={`${id}-${o.id}`}>
            <input
              id={`${id}-${o.id}`}
              type="radio"
              name={name}
              value={o.id}
              checked={value === o.id}
              onChange={() => onChange(o.id)}
            />
            <span className="filter__text">{o.label}</span>
            {o.count !== undefined && <span className="filter__count">{o.count}</span>}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
