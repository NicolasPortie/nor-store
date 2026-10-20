import { useEffect, useRef, useState, type RefObject } from 'react';
import { prefersReducedMotion } from '../lib/gsap';

function webglAvailable() {
  try {
    const probe = document.createElement('canvas');
    return Boolean(probe.getContext('webgl2') ?? probe.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * Decorative 3D mark. Three.js loads on demand when the section nears the viewport, so it
 * never weighs on the initial bundle; without WebGL the static ghost "Ø" stays in place.
 */
export function SymbolStage({ sectionRef }: { sectionRef: RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section || !webglAvailable()) return undefined;

    let disposed = false;
    let dispose: (() => void) | undefined;

    const load = () => {
      void import('../lib/symbol-scene').then(({ createSymbolScene }) => {
        if (disposed) return;
        const scene = createSymbolScene({ canvas, section, animated: !prefersReducedMotion() });
        dispose = scene.dispose;
        setReady(true);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        load();
      },
      { rootMargin: '900px 0px' },
    );
    observer.observe(section);

    return () => {
      disposed = true;
      observer.disconnect();
      dispose?.();
      setReady(false);
    };
  }, [sectionRef]);

  return <canvas ref={canvasRef} className={`symbol-stage${ready ? ' is-ready' : ''}`} aria-hidden="true" />;
}
