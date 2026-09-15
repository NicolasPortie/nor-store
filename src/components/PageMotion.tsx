import { useRef } from 'react';
import { useLocale } from '../i18n/locale';
import { gsap, prefersReducedMotion, ScrollTrigger, SplitText, useGSAP } from '../lib/gsap';
import { getLandingHash, normalizeLandingHash } from '../lib/motion';
import { onceRevert, onSplitRevert } from '../lib/split-text';

const passed = (element: Element, ratio = 0.88) => element.getBoundingClientRect().top < window.innerHeight * ratio;

export function PageMotion() {
  const { locale } = useLocale();
  const landingDone = useRef(false);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      if (reduce) return undefined;

      const splits: SplitText[] = [];

      gsap.utils.toArray<HTMLElement>('.reveal-text').forEach((element) => {
        if (passed(element)) return;

        const nestedLines = [...element.querySelectorAll<HTMLElement>(':scope > .drop-title-line')];
        if (nestedLines.length) {
          nestedLines.forEach((line) => {
            const inner = line.querySelector(':scope > span') ?? line;
            gsap.from(inner, {
              yPercent: 115,
              duration: 0.95,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: element,
                start: 'top 84%',
                once: true,
              },
            });
          });
          return;
        }

        if (element.childElementCount > 0) return;

        splits.push(
          onceRevert(
            SplitText.create(element, {
              type: 'lines',
              mask: 'lines',
              autoSplit: false,
              aria: 'none',
              onSplit(self) {
                return gsap.from(self.lines, {
                  yPercent: 115,
                  duration: 0.95,
                  stagger: 0.065,
                  ease: 'power4.out',
                  scrollTrigger: {
                    trigger: element,
                    start: 'top 84%',
                    once: true,
                  },
                });
              },
            }),
          ),
        );
      });

      const unregisterSplits = onSplitRevert(() => {
        splits.forEach((split) => split.revert());
      });

      return () => {
        unregisterSplits();
        splits.forEach((split) => split.revert());
      };
    },
    { dependencies: [locale], revertOnUpdate: true },
  );

  useGSAP(
    (_context, contextSafe) => {
      const root = document.documentElement;
      const reduce = prefersReducedMotion();
      root.classList.add('motion-ready');

      if (reduce) {
        root.classList.add('motion-reduced');
        root.classList.remove('motion-pending');
        return () => {
          root.classList.remove('motion-ready', 'motion-reduced');
        };
      }

      gsap.utils.toArray<HTMLElement>('.media-reveal').forEach((wrap) => {
        const image = wrap.querySelector('img');
        if (!image) return;
        if (passed(wrap, 0.82)) {
          gsap.set(wrap, { clipPath: 'inset(0% 0% 0% 0%)' });
          gsap.set(image, { scale: 1 });
          return;
        }
        gsap.fromTo(
          wrap,
          { clipPath: 'inset(100% 0 0 0)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.15,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: wrap,
              start: 'top 82%',
              once: true,
            },
          },
        );
        gsap.fromTo(
          image,
          { scale: 1.14 },
          {
            scale: 1,
            duration: 1.35,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: wrap,
              start: 'top 82%',
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('.reveal-fade').forEach((element) => {
        if (passed(element)) {
          gsap.set(element, { autoAlpha: 1 });
          return;
        }
        gsap.from(element, {
          autoAlpha: 0,
          duration: 0.7,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            once: true,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>('.ghost-type').forEach((element) => {
        const parent = element.parentElement;
        if (!parent) return;
        gsap.fromTo(
          element,
          { xPercent: -6 },
          {
            xPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: parent,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      });

      const portrait = document.querySelector('.look-portrait');
      if (portrait) {
        if (passed(portrait, 0.72)) {
          gsap.set('.look-hotspot', { autoAlpha: 1, scale: 1 });
        } else {
          gsap.set('.look-hotspot', { autoAlpha: 0, scale: 0.94 });
          ScrollTrigger.create({
            trigger: portrait,
            start: 'top 72%',
            once: true,
            onEnter: () => {
              gsap.to('.look-hotspot', {
                autoAlpha: 1,
                scale: 1,
                duration: 0.45,
                stagger: 0.07,
                delay: 0.28,
                ease: 'power4.out',
              });
            },
          });
        }
      }

      const symbolRows = gsap.utils.toArray<HTMLElement>('.symbol-row');
      if (symbolRows.length) {
        const symbolWrap = document.querySelector('.symbol-applications');
        if (symbolWrap && passed(symbolWrap, 0.82)) {
          gsap.set(symbolRows, { clipPath: 'inset(0 0% 0 0)' });
        } else {
          gsap.set(symbolRows, { clipPath: 'inset(0 100% 0 0)' });
          gsap.to(symbolRows, {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.7,
            stagger: 0.08,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: '.symbol-applications',
              start: 'top 82%',
              once: true,
            },
          });
        }
      }

      gsap.utils.toArray<HTMLElement>('.product-tile').forEach((tile, index) => {
        const media = tile.querySelector<HTMLElement>('.product-tile-media');
        const meta = tile.querySelector<HTMLElement>('.product-tile-meta');
        if (!media || !meta) return;

        const reveal = () => {
          gsap.to(media, {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.05,
            delay: index % 2 === 0 ? 0 : 0.08,
            ease: 'power4.out',
            overwrite: true,
          });
          gsap.to(meta, {
            autoAlpha: 1,
            duration: 0.5,
            delay: 0.18 + (index % 2 === 0 ? 0 : 0.08),
            ease: 'power4.out',
            overwrite: true,
          });
        };

        if (passed(tile)) {
          gsap.set(media, { clipPath: 'inset(0% 0% 0% 0%)' });
          gsap.set(meta, { autoAlpha: 1 });
          return;
        }

        gsap.set(media, { clipPath: 'inset(100% 0 0 0)' });
        gsap.set(meta, { autoAlpha: 0 });
        ScrollTrigger.create({
          trigger: tile,
          start: 'top 88%',
          once: true,
          onEnter: reveal,
        });
      });

      const onNavClick = contextSafe?.((event: Event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const link = target.closest('a[href^="#"]');
        if (!link || link.classList.contains('skip-link')) return;
        const href = link.getAttribute('href');
        if (!href || href.length < 2) return;
        const destination = document.querySelector<HTMLElement>(href);
        if (!destination) return;
        event.preventDefault();
        gsap.to(window, {
          duration: 0.9,
          ease: 'power3.inOut',
          scrollTo: { y: destination, autoKill: true },
          onComplete: () => {
            history.replaceState(null, '', href);
          },
        });
      });

      if (onNavClick) document.addEventListener('click', onNavClick);

      root.classList.remove('motion-pending');

      const scrollToHash = () => {
        const hash = getLandingHash();
        if (!hash) return;
        const destination = document.querySelector<HTMLElement>(hash);
        if (!destination) return;
        gsap.set(window, { scrollTo: destination });
      };

      const refresh = () => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      };
      normalizeLandingHash();
      requestAnimationFrame(() => {
        refresh();
        if (landingDone.current) return;
        landingDone.current = true;
        scrollToHash();
      });
      window.addEventListener('load', refresh);
      window.addEventListener('hashchange', scrollToHash);
      void document.fonts?.ready.then(refresh);

      return () => {
        if (onNavClick) document.removeEventListener('click', onNavClick);
        window.removeEventListener('load', refresh);
        window.removeEventListener('hashchange', scrollToHash);
        root.classList.remove('motion-ready');
      };
    },
    { dependencies: [] },
  );

  return null;
}
