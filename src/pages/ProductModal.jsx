import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { X } from '@phosphor-icons/react';
import ProductDetail, { ProductDetailSkeleton } from '../components/ProductDetail.jsx';
import { useProduct, useProducts } from '../hooks/useProducts.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import './ProductModal.css';

const CLOSE_MS = 320;

/**
 * Product detail as a native <dialog> over the gallery. showModal() gives us
 * the focus trap, Escape and an inert page for free; we add the open/close
 * choreography and return to the gallery URL on close.
 */
export default function ProductModal() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dialogRef = useRef(null);
  const [closing, setClosing] = useState(false);
  const { product, loading, error } = useProduct(id);
  const { products: siblings } = useProducts();
  useDocumentTitle(product?.title || 'Design');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = prev;
    };
  }, []);

  const close = useCallback(() => {
    if (closing) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setClosing(true);
    const back = location.state?.backgroundLocation;
    window.setTimeout(
      () => {
        dialogRef.current?.close();
        navigate(back ? `${back.pathname}${back.search}` : '/designs', { replace: true, preventScrollReset: true });
      },
      reduce ? 0 : CLOSE_MS,
    );
  }, [closing, location.state, navigate]);

  // Escape fires `cancel`; run our animated close instead of the instant one.
  const onCancel = (e) => {
    e.preventDefault();
    close();
  };
  // Click on the backdrop (the dialog element itself, outside the panel) closes.
  const onClick = (e) => {
    if (e.target === dialogRef.current) close();
  };

  return (
    <dialog
      ref={dialogRef}
      className="pm"
      data-closing={closing || undefined}
      aria-labelledby="pm-title"
      onCancel={onCancel}
      onClick={onClick}
    >
      <div className="pm__panel">
        <button type="button" className="square-btn pm__close" onClick={close} aria-label="Close design">
          <X size={18} aria-hidden="true" />
        </button>
        {error ? (
          <div className="pm__error" role="alert">
            <h2 id="pm-title">{error.status === 404 ? 'That design isn’t in the collection.' : error.message}</h2>
            <button type="button" className="btn btn--ghost" onClick={close}>
              Back to designs
            </button>
          </div>
        ) : loading || !product ? (
          <>
            <h2 id="pm-title" className="visually-hidden">
              Loading design
            </h2>
            <ProductDetailSkeleton />
          </>
        ) : (
          <ProductDetail
            key={product.id}
            product={product}
            siblings={siblings}
            headingLevel="h2"
            titleId="pm-title"
            linkState={location.state}
            replace
          />
        )}
      </div>
    </dialog>
  );
}
