import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from '@phosphor-icons/react';
import ProductDetail, { ProductDetailSkeleton } from '../components/ProductDetail.jsx';
import { useProduct, useProducts } from '../hooks/useProducts.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

/** Direct visits / shared links to a design render it as a full page. */
export default function ProductPage() {
  const { id } = useParams();
  const { product, loading, error, retry } = useProduct(id);
  const { products: siblings } = useProducts();
  useDocumentTitle(product?.title || (error ? 'Design not found' : 'Design'));

  return (
    <div className="page container">
      <nav aria-label="Breadcrumb" style={{ marginBottom: 'var(--space-l)' }}>
        <Link to="/designs" className="link-arrow">
          <ArrowLeft size={14} aria-hidden="true" /> All designs
        </Link>
      </nav>
      {error ? (
        <div className="inline-error" role="alert">
          <h1 style={{ fontSize: 'var(--step-3)' }}>
            {error.status === 404 ? 'That design isn’t in the collection.' : error.message}
          </h1>
          {error.status !== 404 && (
            <button type="button" className="btn btn--ghost" onClick={retry}>
              Try again
            </button>
          )}
        </div>
      ) : loading || !product ? (
        <div role="status">
          <span className="visually-hidden">Loading design</span>
          <ProductDetailSkeleton />
        </div>
      ) : (
        <ProductDetail key={product.id} product={product} siblings={siblings} />
      )}
    </div>
  );
}
