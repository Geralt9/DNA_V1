import Img from './Img.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import './ThemedArt.css';

/**
 * A light/dark pair of Page_art images stacked in one frame.
 * The inactive image sits at opacity 0, so the swap is a true crossfade:
 * - with View Transitions, the browser snapshot does the blend;
 * - without it, the opacity transition below does.
 * Only the visible image is exposed to assistive tech.
 */
export default function ThemedArt({ pair, alt, sizes, priority = false, className = '', position, children }) {
  const { theme } = useTheme();
  const style = position ? { '--art-position': position } : undefined;
  return (
    <div className={`themed-art ${className}`} style={style}>
      {['light', 'dark'].map((variant) => {
        const active = variant === theme;
        return (
          <Img
            key={variant}
            name={`${pair}-${variant}`}
            alt={active ? alt[variant] : ''}
            aria-hidden={active ? undefined : true}
            sizes={sizes}
            priority={priority && active}
            data-variant={variant}
            className="themed-art__img"
          />
        );
      })}
      {children}
    </div>
  );
}
