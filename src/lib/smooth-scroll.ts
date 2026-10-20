import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

const LOCK_CLASSES = ['intro-lock', 'cart-is-open', 'nav-is-open'];

let instance: Lenis | null = null;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function isLocked(root: HTMLElement) {
  return LOCK_CLASSES.some((name) => root.classList.contains(name));
}

/** Inertial scrolling driven by the GSAP ticker so ScrollTrigger and Lenis share one clock. */
export function startSmoothScroll() {
  if (instance) return () => undefined;

  const root = document.documentElement;
  const lenis = new Lenis({ autoRaf: false, lerp: 0.11, wheelMultiplier: 0.9, syncTouch: false });
  instance = lenis;

  const tick = (time: number) => lenis.raf(time * 1000);
  const onScroll = () => ScrollTrigger.update();
  lenis.on('scroll', onScroll);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  const syncLock = () => (isLocked(root) ? lenis.stop() : lenis.start());
  const observer = new MutationObserver(syncLock);
  observer.observe(root, { attributes: true, attributeFilter: ['class'] });
  syncLock();

  return () => {
    observer.disconnect();
    gsap.ticker.remove(tick);
    gsap.ticker.lagSmoothing(500, 33);
    lenis.off('scroll', onScroll);
    lenis.destroy();
    if (instance === lenis) instance = null;
  };
}

type ScrollOptions = { immediate?: boolean; onComplete?: () => void };

/** Scrolls to an element through Lenis when active, otherwise through GSAP's ScrollToPlugin. */
export function scrollToTarget(target: HTMLElement, { immediate = false, onComplete }: ScrollOptions = {}) {
  if (instance) {
    instance.scrollTo(target, {
      immediate,
      force: true,
      duration: 1.25,
      easing: easeInOut,
      onComplete: () => onComplete?.(),
    });
    return;
  }
  if (immediate) {
    gsap.set(window, { scrollTo: target });
    onComplete?.();
    return;
  }
  gsap.to(window, { duration: 0.9, ease: 'power3.inOut', scrollTo: { y: target, autoKill: true }, onComplete });
}
