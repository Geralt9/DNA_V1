import { Link } from 'react-router-dom';
import './Logo.css';

/**
 * The DNA winged-fist emblem, drawn as a CSS mask so it takes the theme's
 * text colour (ink on vellum, vellum on ink) without separate files.
 */
export function Emblem({ className = '' }) {
  return <span className={`emblem ${className}`} aria-hidden="true" />;
}

export default function Logo({ onClick }) {
  return (
    <Link to="/" className="logo" onClick={onClick} aria-label="DNA Screen Printing, home">
      <Emblem />
      <span className="logo__word" aria-hidden="true">
        DNA
      </span>
    </Link>
  );
}
