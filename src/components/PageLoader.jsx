import './PageLoader.css';

/** Route-level fallback: a quiet gilt hairline that draws across, nothing more. */
export default function PageLoader({ label = 'Loading page' }) {
  return (
    <div className="page-loader" role="status">
      <span className="page-loader__line" aria-hidden="true" />
      <span className="visually-hidden">{label}</span>
    </div>
  );
}

/** Inline spinner for buttons: a ring with a travelling gilt arc. */
export function Spinner({ size = 16 }) {
  return (
    <svg className="spinner" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <path d="M12 2.5a9.5 9.5 0 0 1 9.5 9.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
