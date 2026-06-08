import React, { useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
} from 'framer-motion';
import heroHeadshotImage from '../assets/hero-headshot-book.png';
import '../hero-image-scroll.css';

const SCALE_START = 1;
const SCALE_END = 1.55;
const SCROLL_ANIMATION_END = 0.5;

function clampProgress(value) {
  return Math.max(0, Math.min(1, value));
}

export default function HeroScrollImage({
  isMobile = false,
  desktopScrollRef = null,
  scrollTargetRef = null,
}) {
  const progressMotion = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: scrollTargetRef,
    offset: ['start start', 'end start'],
  });

  useEffect(() => {
    if (isMobile || !desktopScrollRef) {
      return undefined;
    }
    let rafId = 0;
    const tick = () => {
      const vw = window.innerWidth;
      const threshold = vw * SCROLL_ANIMATION_END;
      progressMotion.set(clampProgress(desktopScrollRef.current / threshold));
      rafId = window.requestAnimationFrame(tick);
    };
    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [isMobile, desktopScrollRef, progressMotion]);

  const progress = isMobile ? scrollYProgress : progressMotion;

  const scale = useTransform(
    progress,
    [0, SCROLL_ANIMATION_END, 1],
    [SCALE_START, SCALE_END, SCALE_END],
  );

  return (
    <motion.div
      className="hero-scroll-image-frame"
      style={{ scale }}
    >
      <img
        src={heroHeadshotImage}
        alt="Nikole Glenn holding How To Slay"
        className="hero-scroll-image"
        loading="eager"
        decoding="async"
        draggable={false}
      />
    </motion.div>
  );
}
