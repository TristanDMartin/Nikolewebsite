import React, { useEffect } from 'react';

const InstagramFeed = () => {
  const INSTAGRAM_USERNAME = 'nikoles_soles';

  useEffect(() => {
    // Option: LightWidget (Free Instagram feed widget)
    // Visit: https://lightwidget.com/ - completely free, no credit card needed
    // Uncomment below and add your LightWidget ID if you want to use it
    
    // const script = document.createElement('script');
    // script.src = 'https://cdn.lightwidget.com/widgets/lightwidget.js';
    // document.body.appendChild(script);
    // return () => {
    //   const existingScript = document.querySelector('script[src*="lightwidget"]');
    //   if (existingScript) document.body.removeChild(existingScript);
    // };
  }, []);

  // Since most services now charge, here are your FREE options:
  // 1. LightWidget (lightwidget.com) - Completely free
  // 2. Keep current solution (simple, clean, 100% free)
  // 3. Instagram Basic Display API (free but needs backend/server setup)

  return (
    <div className="instagram-widget-wrapper">
      {/* Current solution: Clean grid that links to Instagram profile */}
      {/* This is 100% free and looks great! */}
      <div className="instagram-grid">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <a
            key={item}
            href={`https://www.instagram.com/${INSTAGRAM_USERNAME}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-item"
          >
            <div className="instagram-image-placeholder">
              <span className="instagram-icon">📷</span>
            </div>
          </a>
        ))}
      </div>
      
      {/* Optional: Add LightWidget embed here if you want live feed */}
      {/* 
      <div 
        className="lightwidget-widget"
        style={{ width: '100%', border: 0, overflow: 'hidden' }}
        data-id="YOUR_LIGHTWIDGET_ID"
        data-username={INSTAGRAM_USERNAME}
        data-item="6"
      />
      */}
    </div>
  );
};

export default InstagramFeed;
