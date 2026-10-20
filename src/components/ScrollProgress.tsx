import { useRef } from 'react';
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap';

/** Hairline reading-progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const barRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const bar = barRef.current;
      if (!bar || prefersReducedMotion()) return undefined;
      gsap.to(bar, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.2 },
      });
      return undefined;
    },
    { scope: barRef, dependencies: [] },
  );

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span ref={barRef} />
    </div>
  );
}
