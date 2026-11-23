import { useId } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import './ThemeToggle.css';

/**
 * Sun ↔ moon drawn as one SVG: a halo whose rays retract while a shadow disc
 * slides across to carve the crescent. Transform + opacity only.
 */
export default function ThemeToggle({ className = '', withLabel = false }) {
  const { theme, toggleTheme } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  const maskId = `crescent${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <button
      type="button"
      className={`theme-toggle ${className}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      data-mode={theme}
    >
      <svg viewBox="0 0 32 32" width="22" height="22" aria-hidden="true" focusable="false">
        <mask id={maskId}>
          <rect width="32" height="32" fill="#fff" />
          <circle className="theme-toggle__shade" cx="22" cy="10" r="7" fill="#000" />
        </mask>
        <circle className="theme-toggle__core" cx="16" cy="16" r="7" fill="currentColor" mask={`url(#${maskId})`} />
        <g className="theme-toggle__rays" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          {Array.from({ length: 8 }, (_, i) => (
            <line key={i} x1="16" y1="2.5" x2="16" y2="5.5" transform={`rotate(${i * 45} 16 16)`} />
          ))}
        </g>
      </svg>
      {withLabel && <span className="theme-toggle__label">{theme === 'dark' ? 'Night' : 'Day'}</span>}
    </button>
  );
}
