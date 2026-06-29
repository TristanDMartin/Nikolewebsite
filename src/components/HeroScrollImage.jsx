import React, { useEffect, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
} from 'framer-motion';
import heroHeadshotImage from '../assets/hero-headshot-book.png';
import '../hero-image-scroll.css';

const IMAGE_ASPECT = 1024 / 682;
const SCROLL_ANIMATION_END = 0.5;

function clampProgress(value) {
  return Math.max(0, Math.min(1, value));
}

function getHeroImageMetrics(isMobileLayout) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const startTop = isMobileLayout ? 88 : 112;
  const startRight = isMobileLayout ? 20 : 40;

  const baseWidth = isMobileLayout
    ? Math.min(vw * 0.38, 280)
    : Math.min(vw * 0.3, 440);
  const baseHeight = baseWidth * IMAGE_ASPECT;

  const scaleForFullHeight = vh / baseHeight;
  const scaleForFullWidth = vw / baseWidth;
  const fillScale = Math.min(scaleForFullHeight, scaleForFullWidth);

  return {
    baseWidth,
    fillScale: Math.max(1.08, fillScale),
    startTop,
    startRight,
  };
}

export default function HeroScrollImage({
  isMobile = false,
  desktopScrollRef = null,
  scrollTargetRef = null,
}) {
  const progressMotion = useMotionValue(0);
  const metricsRef = useRef(getHeroImageMetrics(isMobile));

  const { scrollYProgress } = useScroll({
    target: scrollTargetRef,
    offset: ['start start', 'end start'],
  });

  useEffect(() => {
    const syncMetrics = () => {
      metricsRef.current = getHeroImageMetrics(isMobile);
    };
    syncMetrics();
    window.addEventListener('resize', syncMetrics);
    window.addEventListener('orientationchange', syncMetrics);
    return () => {
      window.removeEventListener('resize', syncMetrics);
      window.removeEventListener('orientationchange', syncMetrics);
    };
  }, [isMobile]);

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

  const scale = useTransform(progress, (value) => {
    const t = clampProgress(value / SCROLL_ANIMATION_END);
    const { fillScale } = metricsRef.current;
    return 1 + t * (fillScale - 1);
  });

  const top = useTransform(progress, (value) => {
    const t = clampProgress(value / SCROLL_ANIMATION_END);
    const { startTop } = metricsRef.current;
    return `${startTop * (1 - t)}px`;
  });

  const right = useTransform(progress, (value) => {
    const t = clampProgress(value / SCROLL_ANIMATION_END);
    const { startRight } = metricsRef.current;
    return `${startRight * (1 - t)}px`;
  });

  return (
    <motion.div
      className="hero-scroll-image-frame"
      style={{ scale, top, right }}
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
