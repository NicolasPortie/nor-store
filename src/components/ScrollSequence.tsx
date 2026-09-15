import { useEffect, useRef } from 'react';
import { useCopy, useLocale } from '../i18n/locale';
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP, viewportPin } from '../lib/gsap';

export function ScrollSequence() {
  const t = useCopy();
  const { locale } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const video = videoRef.current;
      const progress = progressRef.current;
      const progressTrack = progress?.parentElement;
      const mark = markRef.current;
      const kicker = kickerRef.current;
      const bottom = bottomRef.current;
      const title = section?.querySelector('#hero-title');
      if (!section || !video || !progress || !mark || !title) return undefined;

      const currentBeats = () => [...title.querySelectorAll<HTMLElement>('.hero-beat')];
      let beats = currentBeats();
      const reduce = prefersReducedMotion();
      let seekFrame: number | undefined;
      let requestedTime = 0;
      let lastSeekTime = -Infinity;
      let activeBeat = -1;

      const pauseVideo = () => {
        video.pause();
      };

      pauseVideo();

      const showBeat = (index: number, duration = 0.48) => {
        const nextBeats = currentBeats();
        if (nextBeats[0] !== beats[0]) {
          activeBeat = -1;
          beats = nextBeats;
        }
        if (index === activeBeat || !beats[index]) return;
        activeBeat = index;
        beats.forEach((beat, i) => {
          const offset = beat.offsetHeight + 28;
          gsap.to(beat, {
            y: i === index ? 0 : i < index ? -offset : offset,
            duration,
            ease: 'power4.out',
            overwrite: true,
          });
        });
      };

      if (reduce) {
        const snap = () => {
          if (!Number.isFinite(video.duration) || video.duration <= 0) return;
          video.currentTime = Math.max(video.duration - 0.05, 0);
        };
        video.addEventListener('loadedmetadata', snap);
        snap();
        gsap.set(beats, { yPercent: 0, autoAlpha: 1, clearProps: 'transform' });
        if (kicker && bottom) gsap.set([kicker, bottom], { autoAlpha: 1, y: 0 });
        gsap.set(progress, { scaleX: 1 });
        gsap.set(beats.slice(1), { autoAlpha: 0 });
        return () => video.removeEventListener('loadedmetadata', snap);
      }

      gsap.set(title.querySelectorAll('.hero-line > span'), { yPercent: 0, clearProps: 'transform' });
      gsap.set(beats, { y: (index) => (index === 0 ? 0 : beats[index].offsetHeight + 28) });
      if (kicker && bottom) gsap.set([kicker, bottom], { autoAlpha: 1, y: 0 });
      gsap.set(video, { scale: 1.06 });
      showBeat(0, 0.01);

      const scheduleVideoSeek = (time: number) => {
        if (!Number.isFinite(video.duration) || video.duration <= 0) return;
        requestedTime = time;
        if (seekFrame) return;
        seekFrame = requestAnimationFrame(() => {
          seekFrame = undefined;
          if (Math.abs(requestedTime - lastSeekTime) < 1 / 30) return;
          lastSeekTime = requestedTime;
          video.currentTime = requestedTime;
        });
      };

      const playhead = { time: 0 };
      const sequence = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          ...viewportPin(section, 3200, 4),
          scrub: 0.65,
          onUpdate: (self) => {
            showBeat(Math.min(beats.length - 1, self.progress < 0.3 ? 0 : self.progress < 0.62 ? 1 : 2));
          },
        },
      });

      sequence.to(
        playhead,
        {
          time: 1,
          duration: 1,
          onUpdate: () => {
            const currentDuration = Number.isFinite(video.duration) ? video.duration : 0;
            scheduleVideoSeek(Math.max(currentDuration - 0.05, 0) * playhead.time);
          },
        },
        0,
      );
      sequence.to(video, { scale: 1, duration: 1 }, 0);
      sequence.to(progress, { scaleX: 1, duration: 1 }, 0);
      sequence.fromTo(mark, { opacity: 0.08, scale: 0.9 }, { opacity: 0.38, scale: 1.06, duration: 1 }, 0);
      if (bottom) sequence.to(bottom, { autoAlpha: 0, duration: 0.16 }, 0.84);
      if (progressTrack) sequence.to(progressTrack, { autoAlpha: 0, duration: 0.16 }, 0.84);

      const refresh = () => ScrollTrigger.refresh();
      video.addEventListener('loadedmetadata', refresh);

      return () => {
        video.removeEventListener('loadedmetadata', refresh);
        if (seekFrame) cancelAnimationFrame(seekFrame);
      };
    },
    { scope: sectionRef, dependencies: [] },
  );

  useEffect(() => {
    const title = sectionRef.current?.querySelector('#hero-title');
    const section = sectionRef.current;
    if (!title || !section) return;
    const beats = [...title.querySelectorAll<HTMLElement>('.hero-beat')];
    if (!beats.length) return;
    const trigger = ScrollTrigger.getAll().find((st) => st.trigger === section);
    const progress = trigger?.progress ?? 0;
    const index = progress < 0.3 ? 0 : progress < 0.62 ? 1 : Math.min(2, beats.length - 1);
    beats.forEach((beat, i) => {
      const offset = beat.offsetHeight + 28;
      gsap.set(beat, { y: i === index ? 0 : i < index ? -offset : offset });
    });
  }, [locale]);

  return (
    <section ref={sectionRef} id="film" className="sequence-section nor-red" aria-labelledby="hero-title">
      <div className="sequence-stage">
        <div ref={markRef} className="film-ghost-mark" aria-hidden="true">
          NØR
        </div>
        <div className="sequence-scrim" aria-hidden="true" />

        <video
          ref={videoRef}
          className="sequence-video"
          src="/assets/video-scroll.mp4"
          muted
          playsInline
          preload="auto"
          poster="/assets/optimized/img3-personagem.webp"
          aria-label={t.filmAria}
        />

        <div className="sequence-copy">
          <p ref={kickerRef} className="film-kicker">
            {t.filmKicker}
          </p>
          <h1 id="hero-title" className="hero-title">
            {t.filmBeats.map((beat, index) => (
              <span className="hero-beat" key={index} aria-hidden={index > 0 || undefined}>
                <span className="hero-line">
                  <span>{beat[0]}</span>
                </span>
                <span className="hero-line">
                  <span>{beat[1]}</span>
                </span>
              </span>
            ))}
          </h1>
        </div>

        <div ref={bottomRef} className="film-bottomline">
          <span>{t.filmPlace}</span>
          <span>{t.filmYear}</span>
        </div>

        <div className="sequence-progress" aria-hidden="true">
          <span ref={progressRef} />
        </div>
      </div>
    </section>
  );
}
