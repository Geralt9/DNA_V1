/**
 * Image pipeline: reads the untouched source art in ../usable_assets and writes
 * optimised, responsive WebP files to /public/images plus a manifest that the
 * app imports (src/data/imageManifest.json). Run with `npm run images`.
 *
 * The generated output is committed, so `npm install && npm run dev` works
 * without running this script. usable_assets is never written to.
 */
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(here, '../../usable_assets');
const OUT = path.resolve(here, '../public/images');
const MANIFEST = path.resolve(here, '../src/data/imageManifest.json');

const manifest = {};

async function emit(key, input, widths, { quality = 80, transform, lossless = false } = {}) {
  const base = transform ? transform(sharp(input)) : sharp(input);
  const buf = await base.toBuffer();
  const meta = await sharp(buf).metadata();
  const files = [];
  for (const w of widths) {
    const width = Math.min(w, meta.width);
    const name = `${key}-${width}.webp`;
    await sharp(buf)
      .resize({ width, withoutEnlargement: true })
      .webp(lossless ? { lossless: true } : { quality, effort: 5, smartSubsample: true })
      .toFile(path.join(OUT, name));
    files.push({ src: `/images/${name}`, w: width });
  }
  manifest[key] = {
    width: meta.width,
    height: meta.height,
    src: files[files.length - 1].src,
    srcSet: [...new Map(files.map((f) => [f.w, f])).values()].map((f) => `${f.src} ${f.w}w`).join(', '),
  };
  console.log('✓', key, `${meta.width}x${meta.height}`);
}

const art = (f) => path.join(SRC, 'Page_art', f);
const asset = (f) => path.join(SRC, 'assets', f);

await fs.mkdir(OUT, { recursive: true });
await fs.mkdir(path.dirname(MANIFEST), { recursive: true });

/* ── Theme art pairs (light ↔ dark) ─────────────────────────────── */
await emit('hero-light', art('Light_theme1.jpg'), [480, 736]);
await emit('hero-dark', art('Dark_theme2.jpg'), [480, 736]);
await emit('story-light', art('Light_theme4.jpg'), [640, 1100, 1600]);
await emit('story-dark', art('Dark_theme.png'), [640, 1100, 1588]);
await emit('about-light', art('Light_theme2.jpg'), [640, 1100, 1600]);
await emit('about-dark', art('website_art2.jpg'), [640, 1100, 1493]);
await emit('account-light', art('Sign_up_light_theme.jpg'), [480, 736]);
await emit('account-dark', art('Sign_up_dark_theme.jpg'), [480, 736, 1200]);

// Light-only pieces: their dark counterparts are derived from the same art so
// the crossfade still has two real images to blend between.
await emit('designs-light', art('Light_theme.jpg'), [800, 1400, 2000]);
await emit('designs-dark', art('Light_theme.jpg'), [800, 1400, 2000], {
  transform: (s) => s.modulate({ brightness: 0.42, saturation: 0.55 }).linear(1.25, -14),
});
await emit('cta-light', art('Light_theme3.jpg'), [800, 1400, 2000]);
// Negate + 180° hue rotation keeps the vermilion line-work red while turning
// the cream paper to near-black: the same woodcut, printed on night.
await emit('cta-dark', art('Light_theme3.jpg'), [800, 1400, 2000], {
  transform: (s) => s.negate({ alpha: false }).modulate({ hue: 180, saturation: 0.9 }).linear(1.08, -6),
});

/* ── Footer tree: luminance → alpha so CSS can colour it per theme ── */
{
  const src = path.join(SRC, 'Inspiration', 'Side_page_art.jpg');
  const { width, height } = await sharp(src).metadata();
  const W = width * 2;
  const H = height * 2;
  const alpha = await sharp(src)
    .resize(W, H, { kernel: 'lanczos3' })
    .greyscale()
    .negate()
    .linear(1.35, -18) // drop paper noise, strengthen ink
    .toColourspace('b-w')
    .raw()
    .toBuffer();
  await sharp({ create: { width: W, height: H, channels: 3, background: '#ffffff' } })
    .joinChannel(alpha, { raw: { width: W, height: H, channels: 1 } })
    .webp({ quality: 88, alphaQuality: 92 })
    .toFile(path.join(OUT, 'tree-mask.webp'));
  manifest['tree-mask'] = { width: W, height: H, src: '/images/tree-mask.webp' };
  console.log('✓ tree-mask');
}

/* ── Brand mark (alpha PNG → WebP, used as a CSS mask) ───────────────
   Cropped above the "DNA" lettering (rows 345+) so the winged-fist star
   stands alone next to the typeset wordmark. */
const cropMark = (s) => s.extract({ left: 0, top: 0, width: 418, height: 344 });
await emit('logo-mark', asset('dna-logo-dark-BMKtG1qI.png'), [418], { lossless: true, transform: cropMark });
await cropMark(sharp(asset('dna-logo-dark-BMKtG1qI.png')))
  .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(path.resolve(here, '../public/favicon.png'));

/* ── Products (the brand's own work) ─────────────────────────────── */
const products = {
  'hello-amora-rabbit': 'img-0101-CnQ7-YAf.jpg',
  'heavy-to-reapers': 'img-0102-CXCxXDzW.jpg',
  'a-rebel-few': 'img-0104-B1YgMiXt.jpg',
  'maylene-serpent': 'img-0106-Cn8fv_mh.jpg',
  'maylene-wolf': 'img-0107-ccqvj9mW.jpg',
  'hello-amora-clown': 'img-0108-C0Hp1eQ2.jpg',
  'moms-robot': 'img-0109-CGNopmVu.jpg',
  'moms-pinup': 'img-0110-DcpyIVL3.jpg',
  'colt-true-north': 'img-0113-BtgIr4Z-.jpg',
};
for (const [key, file] of Object.entries(products)) {
  await emit(`p-${key}`, asset(file), [400, 700, 1000], { quality: 82 });
}
// The one alternate crop that adds information: a close-up of the Rebel Few print.
await emit('p-a-rebel-few-detail', asset('img-0104-CVps-4B7.jpg'), [740], { quality: 84 });

await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
console.log(`\nWrote ${Object.keys(manifest).length} entries → ${path.relative(process.cwd(), MANIFEST)}`);
