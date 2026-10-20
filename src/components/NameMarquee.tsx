import { useRef } from 'react';
import { useCopy } from '../i18n/locale';
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '../lib/gsap';

export function NameMarquee() {
  const t = useCopy();
  const trackRef = useRef<HTMLDivElement>(null);
  const loop = [...t.marqueeNames, ...t.marqueeNames];

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track || prefersReducedMotion()) return undefined;

      // GSAP takes over from the CSS fallback so the drift can react to scroll velocity.
      track.classList.add('is-driven');
      const drift = gsap.to(track, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });
      const boost = gsap.quickTo(drift, 'timeScale', { duration: 0.6, ease: 'power3.out' });

      const trigger = ScrollTrigger.create({
        trigger: track,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const velocity = gsap.utils.clamp(-4000, 4000, self.getVelocity());
          boost(1 + velocity / 650);
        },
        onLeave: () => boost(1),
        onLeaveBack: () => boost(1),
      });

      return () => {
        trigger.kill();
        drift.kill();
        track.classList.remove('is-driven');
      };
    },
    { scope: trackRef, dependencies: [] },
  );

  return (
    <div className="name-marquee" aria-hidden="true">
      <div ref={trackRef} className="name-marquee-track">
        {loop.map((name, index) => (
          <span key={`${name}-${index}`}>{name}</span>
        ))}
      </div>
    </div>
  );
}
