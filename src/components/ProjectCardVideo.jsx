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

function prefersHoverPlay() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );
}

export default function ProjectCardVideo({
  src,
  mp4Src = null,
  sources = null,
  bottomScrim = true,
  className = '',
  layout = 'intrinsic',
  maxHeight = null,
  poster = null,
  playOnHover = false,
  loadMargin = null,
  forceLoad = false,
}) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const useHoverPlay = playOnHover && prefersHoverPlay();
  const [isActivated, setIsActivated] = useState(!useHoverPlay);
  const [hasStarted, setHasStarted] = useState(false);
  const isVisible = forceLoad || isInView;
  const shouldLoad = isVisible && isActivated;
  const intersectionMargin =
    loadMargin ?? (useHoverPlay ? '80px' : '20% 0px');

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
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: intersectionMargin, threshold: 0.01 },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [intersectionMargin]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad || prefersReducedMotion()) {
      return;
    }
    video.play().catch(() => {});
    setHasStarted(true);
  }, [shouldLoad]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) {
      return;
    }
    if (isVisible && isActivated) {
      video.play().catch(() => {});
      return;
    }
    video.pause();
  }, [isVisible, isActivated, shouldLoad]);

  const handleActivate = () => {
    if (useHoverPlay) {
      setIsActivated(true);
    }
  };

  const handleDeactivate = () => {
    if (useHoverPlay) {
      setIsActivated(false);
      setHasStarted(false);
    }
  };

  const useBottomScrim = layout === 'portrait' ? false : bottomScrim;
  const rootClass = [
    'pcv',
    layout === 'intrinsic' ? 'pcv--intrinsic' : '',
    layout === 'portrait' ? 'pcv--portrait' : '',
    layout === 'fill' ? 'pcv--fill' : '',
    useBottomScrim ? 'pcv--bottom-scrim' : '',
    useHoverPlay ? 'pcv--hover-play' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const videoStyle = maxHeight
    ? layout === 'portrait'
      ? { '--pcv-portrait-height': maxHeight, '--pcv-max-height': maxHeight }
      : { '--pcv-max-height': maxHeight }
    : undefined;

  const showPoster = poster && (!shouldLoad || !hasStarted);

  return (
    <div
      className={rootClass}
      ref={containerRef}
      style={videoStyle}
      onMouseEnter={useHoverPlay ? handleActivate : undefined}
      onMouseLeave={useHoverPlay ? handleDeactivate : undefined}
      onFocusCapture={useHoverPlay ? handleActivate : undefined}
      onBlurCapture={useHoverPlay ? handleDeactivate : undefined}
    >
      {showPoster ? (
        <img
          src={encodeMediaSrc(poster)}
          alt=""
          className="pcv-poster"
          aria-hidden="true"
          loading="lazy"
          decoding="async"
        />
      ) : null}
      {shouldLoad ? (
        <video
          ref={videoRef}
          key={videoSources.map((item) => item.src).join('|')}
          className="pcv-video"
          muted
          loop
          playsInline
          preload="auto"
          poster={poster ? encodeMediaSrc(poster) : undefined}
          aria-hidden="true"
        >
          {videoSources.map((item) => (
            <source
              key={`${item.type}-${item.src}`}
              src={item.src}
              type={item.type}
            />
          ))}
        </video>
      ) : null}
    </div>
  );
}
