import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Phone } from '@phosphor-icons/react';
import Img, { resolveImage } from './Img.jsx';
import { CATEGORIES, GARMENTS } from '../mocks/products.js';
import { site } from '../data/site.js';
import './ProductDetail.css';

const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));
const GARMENT_LABEL = Object.fromEntries(GARMENTS.map((g) => [g.id, g.label]));

/**
 * The detail view shared by the modal and the standalone page.
 * `linkState` keeps prev/next inside the modal when opened from the gallery.
 */
export default function ProductDetail({ product, siblings = [], headingLevel = 'h1', titleId, linkState, replace = false }) {
  const [view, setView] = useState('main');
  const Heading = headingLevel;
  const i = siblings.findIndex((p) => p.id === product.id);
  const prev = i > 0 ? siblings[i - 1] : siblings[siblings.length - 1];
  const next = i >= 0 && i < siblings.length - 1 ? siblings[i + 1] : siblings[0];
  const hasDetail = Boolean(product.detailImage);
  const showing = view === 'detail' && hasDetail ? 'detail' : 'main';

  return (
    <article className="pd">
      <div className="pd__media">
        <div className="pd__frame">
          {showing === 'main' ? (
            <Img
              key="main"
              data={resolveImage(product)}
              alt={product.alt}
              sizes="(max-width: 860px) 92vw, 46vw"
              priority
              className="pd__img"
            />
          ) : (
            <Img
              key="detail"
              data={resolveImage(product, 'detailImage')}
              alt={product.detailAlt}
              sizes="(max-width: 860px) 92vw, 46vw"
              className="pd__img pd__img--detail"
            />
          )}
        </div>
        {hasDetail && (
          <div className="pd__views" role="group" aria-label="Choose a view">
            {[
              ['main', 'Full shirt'],
              ['detail', 'Print close-up'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                className="pd__view"
                aria-pressed={showing === key}
                onClick={() => setView(key)}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pd__info">
        <p className="eyebrow">
          {CATEGORY_LABEL[product.category]} · {GARMENT_LABEL[product.garment]} garment
        </p>
        <Heading id={titleId} className="pd__title">
          {product.title}
        </Heading>
        <p className="pd__client">for {product.client}</p>
        <div className="rule" aria-hidden="true">
          <span />
        </div>
        <p className="pd__desc">{product.description}</p>

        <dl className="pd__specs">
          <div>
            <dt>Client</dt>
            <dd>{product.client}</dd>
          </div>
          <div>
            <dt>Category</dt>
            <dd>{CATEGORY_LABEL[product.category]}</dd>
          </div>
          <div>
            <dt>Garment</dt>
            <dd>{GARMENT_LABEL[product.garment]}</dd>
          </div>
          {product.year && (
            <div>
              <dt>Printed</dt>
              <dd>{product.year}</dd>
            </div>
          )}
        </dl>

        <div className="pd__actions">
          <Link to="/account" className="btn">
            Start a print run <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <a href={site.phoneHref} className="link-arrow">
            <Phone size={14} aria-hidden="true" /> {site.phone}
          </a>
        </div>

        {siblings.length > 1 && (
          <nav className="pd__pager" aria-label="More designs">
            <Link to={`/designs/${prev.id}`} state={linkState} replace={replace} className="pd__pager-link">
              <ArrowLeft size={16} aria-hidden="true" />
              <span>
                <span className="pd__pager-label">Previous</span>
                <span className="pd__pager-title">{prev.title}</span>
              </span>
            </Link>
            <Link
              to={`/designs/${next.id}`}
              state={linkState}
              replace={replace}
              className="pd__pager-link pd__pager-link--next"
            >
              <span>
                <span className="pd__pager-label">Next</span>
                <span className="pd__pager-title">{next.title}</span>
              </span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </nav>
        )}
      </div>
    </article>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="pd" aria-hidden="true">
      <div className="pd__media">
        <div className="pd__frame piece--skeleton">
          <div className="piece__frame" style={{ borderRadius: 0, height: '100%' }} />
        </div>
      </div>
      <div className="pd__info">
        <div className="skeleton-line" style={{ width: '40%' }} />
        <div className="skeleton-line" style={{ width: '80%', height: '3rem' }} />
        <div className="skeleton-line" style={{ width: '90%' }} />
        <div className="skeleton-line" style={{ width: '70%' }} />
      </div>
    </div>
  );
}
