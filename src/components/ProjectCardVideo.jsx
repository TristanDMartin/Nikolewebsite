import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getVideoSources } from '../utils/projectMedia';
import '../project-card-video.css';

function encodeMediaSrc(url) {
  if (!url || typeof url !== 'string') {
    return '';
  }
  return encodeURI(url);
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export default function ProjectCardVideo({
  src,
  mp4Src = null,
  sources = null,
  bottomScrim = true,
  className = '',
  layout = 'intrinsic',
}) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const videoSources = useMemo(() => {
    if (sources?.length) {
      return sources.map((item) => ({
        src: encodeMediaSrc(item.src),
        type: item.type,
      }));
    }
    return getVideoSources(src, mp4Src).map((item) => ({
      src: encodeMediaSrc(item.src),
      type: item.type,
    }));
  }, [src, mp4Src, sources]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          setIsInView(true);
          return;
        }
        setIsInView(false);
      },
      { rootMargin: '120px', threshold: 0.12 },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad || prefersReducedMotion()) {
      return;
    }
    if (isInView) {
      video.play().catch(() => {});
      return;
    }
    video.pause();
  }, [isInView, shouldLoad]);

  const useBottomScrim = layout === 'portrait' ? false : bottomScrim;
  const rootClass = [
    'pcv',
    layout === 'intrinsic' ? 'pcv--intrinsic' : '',
    layout === 'portrait' ? 'pcv--portrait' : '',
    layout === 'fill' ? 'pcv--fill' : '',
    useBottomScrim ? 'pcv--bottom-scrim' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass} ref={containerRef}>
      <video
        ref={videoRef}
        key={videoSources.map((item) => item.src).join('|')}
        className="pcv-video"
        muted
        loop
        playsInline
        preload={shouldLoad ? 'metadata' : 'none'}
        aria-hidden="true"
      >
        {shouldLoad
          ? videoSources.map((item) => (
              <source
                key={`${item.type}-${item.src}`}
                src={item.src}
                type={item.type}
              />
            ))
          : null}
      </video>
    </div>
  );
}
