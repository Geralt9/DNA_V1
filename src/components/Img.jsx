import manifest from '../data/imageManifest.json';

/**
 * Responsive <img> from the generated manifest: srcset + intrinsic width/height
 * (no layout shift), lazy by default, sharp on hi-DPI via the `sizes` hint.
 */
export function imageData(name) {
  const entry = manifest[name];
  if (!entry) {
    if (import.meta.env.DEV) console.warn(`[Img] unknown image "${name}"`);
    return null;
  }
  return withBase(entry);
}

// Manifest paths are root-absolute ("/images/..."); prefix them with Vite's base
// so they still resolve when the site is served from a subpath (GitHub Pages).
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const prefix = (p) => (p.startsWith('/') ? BASE + p : p);

function withBase(entry) {
  if (!BASE) return entry;
  return {
    ...entry,
    src: prefix(entry.src),
    srcSet: entry.srcSet?.replace(/(^|,\s*)(\/\S+)/g, (_, sep, url) => sep + prefix(url)),
  };
}

/** TODO(backend): if the API returns `imageUrl`, prefer it over the local manifest key. */
export function resolveImage(product, field = 'image') {
  if (product?.[`${field}Url`]) return { src: product[`${field}Url`], width: 1000, height: 1339 };
  return imageData(product?.[field]);
}

export default function Img({ name, data, alt, sizes = '100vw', priority = false, className, ...rest }) {
  const entry = data || imageData(name);
  if (!entry) return null;
  return (
    <img
      src={entry.src}
      srcSet={entry.srcSet}
      sizes={entry.srcSet ? sizes : undefined}
      width={entry.width}
      height={entry.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
      className={className}
      {...rest}
    />
  );
}
