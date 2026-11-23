import { Link } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export default function NotFound() {
  useDocumentTitle('Page not found');
  return (
    <div className="page container" style={{ minHeight: '70svh', display: 'grid', alignContent: 'center', gap: 'var(--space-m)' }}>
      <p className="eyebrow">Error 404</p>
      <h1 style={{ fontSize: 'var(--step-5)' }}>Lost in the nave.</h1>
      <p className="lede">That page isn’t here. It may have moved, or the link may be mistyped.</p>
      <div style={{ display: 'flex', gap: 'var(--space-l)', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn">
          Back home <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link to="/designs" className="link-arrow">
          See the designs
        </Link>
      </div>
    </div>
  );
}
