import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const REDUCED = '(prefers-reduced-motion: reduce)';

/**
 * Scroll-triggered entrances for everything marked `data-reveal` inside `scopeRef`.
 *   data-reveal="up"     fade + rise
 *   data-reveal="lines"  each `.mask-line > span` slides up out of its mask, staggered
 *   data-reveal="image"  frame rises while the image inside settles from a slight zoom
 * Only transform and opacity are animated. Reduced motion → everything shows at rest.
 * `data-reveal-delay` (seconds) offsets one element.
 */
export function useReveal(scopeRef, deps = []) {
  useLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Elements bound by a nested useReveal (e.g. a section whose data loads
      // later) are skipped here, so nothing is ever animated twice.
      const items = gsap.utils.toArray('[data-reveal]', scope).filter((el) => !el._revealBound);
      items.forEach((el) => {
        el._revealBound = true;
        const kind = el.dataset.reveal;
        const delay = parseFloat(el.dataset.revealDelay || '0');
        const trigger = { trigger: el, start: 'top 88%', once: true };

        if (kind === 'lines') {
          const lines = el.querySelectorAll('.mask-line > span');
          gsap.set(el, { opacity: 1 });
          gsap.fromTo(
            lines,
            { yPercent: 108 },
            { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09, delay, scrollTrigger: trigger },
          );
        } else if (kind === 'image') {
          const img = el.querySelector('img');
          const tl = gsap.timeline({ delay, scrollTrigger: trigger });
          tl.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out' });
          // clearProps hands the image back to CSS so hover transforms still work.
          if (img) tl.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.6, ease: 'expo.out', clearProps: 'transform' }, 0);
        } else {
          gsap.fromTo(
            el,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', delay, scrollTrigger: trigger },
          );
        }
      });
      return () => items.forEach((el) => delete el._revealBound);
    });

    mm.add(REDUCED, () => {
      gsap.set(gsap.utils.toArray('[data-reveal]', scope), { opacity: 1, clearProps: 'transform' });
    });

    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export { gsap, ScrollTrigger };
