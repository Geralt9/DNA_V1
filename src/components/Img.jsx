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
  return entry;
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
