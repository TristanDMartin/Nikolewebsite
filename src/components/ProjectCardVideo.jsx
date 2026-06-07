import React, { useMemo } from 'react';
import '../project-card-video.css';

function encodeMediaSrc(url) {
  if (!url || typeof url !== 'string') {
    return '';
  }
  return encodeURI(url);
}

export default function ProjectCardVideo({
  src,
  bottomScrim = true,
  className = '',
  layout = 'intrinsic',
}) {
  const safeSrc = useMemo(() => encodeMediaSrc(src), [src]);
  const rootClass = [
    'pcv',
    layout === 'intrinsic' ? 'pcv--intrinsic' : '',
    bottomScrim ? 'pcv--bottom-scrim' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass}>
      <video
        key={safeSrc}
        className="pcv-video"
        src={safeSrc}
        muted
        loop
        playsInline
        autoPlay
        aria-hidden="true"
      />
    </div>
  );
}
