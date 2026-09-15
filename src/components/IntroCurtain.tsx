import { useState } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { shouldPlayIntro } from '../lib/motion';

export function IntroCurtain() {
  const skip = !shouldPlayIntro();
  const [done, setDone] = useState(skip);

  useGSAP(() => {
    if (skip) return undefined;

    const root = document.documentElement;
    const curtain = document.querySelector<HTMLElement>('.intro-curtain');
    const mark = document.querySelector<HTMLElement>('.intro-curtain span');
    if (!curtain || !mark) return undefined;

    root.classList.add('intro-lock');
    window.scrollTo(0, 0);

    const timeline = gsap.timeline({
      onComplete: () => {
        root.classList.remove('intro-lock');
        setDone(true);
      },
    });

    timeline.fromTo(mark, { yPercent: 110 }, { yPercent: 0, duration: 0.85, ease: 'power4.out' }, 0.08);
    timeline.to(curtain, { yPercent: -100, duration: 0.95, ease: 'power4.inOut' }, 0.68);

    return () => {
      timeline.kill();
      root.classList.remove('intro-lock');
    };
  });

  if (skip) return null;

  return (
    <div className={`intro-curtain${done ? ' is-done' : ''}`} aria-hidden="true">
      <p className="intro-mark">
        <span>NØR</span>
      </p>
    </div>
  );
}
