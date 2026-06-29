import React from 'react';
import ProjectCardVideo from './ProjectCardVideo';
import '../phone-mockup-video.css';

const DEFAULT_FRAME =
  '/assets/mockups/iPhone 17 Pro - Cosmic Orange - Portrait.png';

function encodeMediaSrc(url) {
  if (!url || typeof url !== 'string') {
    return '';
  }
  return encodeURI(url);
}

export default function PhoneMockupVideo({
  src,
  mp4Src = null,
  sources = null,
  frameSrc = DEFAULT_FRAME,
  maxHeight = 'min(72vh, 760px)',
}) {
  const mockupStyle = {
    '--phone-mockup-max-height': maxHeight,
  };

  return (
    <div className="phone-mockup" style={mockupStyle}>
      <div className="phone-mockup__screen">
        <ProjectCardVideo
          src={src}
          mp4Src={mp4Src}
          sources={sources}
          bottomScrim={false}
          layout="fill"
        />
      </div>
      <img
        className="phone-mockup__frame"
        src={encodeMediaSrc(frameSrc)}
        alt=""
        aria-hidden="true"
        draggable="false"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
