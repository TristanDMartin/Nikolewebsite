import React from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import ProjectCardVideo from './ProjectCardVideo';

import {
  getProjectThumbnail,
  hasCardVideo,
  getCardVideoLayout,
  getCardVideoMp4,
  isCardImageIntrinsic,
  getCardImageBackgroundStyle,
} from '../utils/projectMedia';

function getProjectImage(project) {
  return getProjectThumbnail(project);
}

export default function PortfolioIndexPage() {
  return (
    <main className="portfolio-index">
      <section className="portfolio-hero">
        <div className="portfolio-hero-content">
          <p className="site-panel-label portfolio-hero-eyebrow">
            02 / Work
          </p>
          <h1 className="portfolio-hero-title">
            Selected <em>projects</em>
          </h1>
          <p className="portfolio-hero-meta">
            <strong>{projects.length}</strong> case studies · scroll to browse
          </p>
        </div>
      </section>

      <section className="portfolio-grid-section">
        <div className="portfolio-grid-container">
          <div className="portfolio-grid-header">
            <p className="site-panel-label">All projects</p>
          </div>
          <div className="portfolio-masonry-grid">
            {projects.map((project, index) => {
              const isLarge = index % 5 === 0;
              const isMedium = index % 5 === 3;
              const img = getProjectImage(project);
              const showGridVideo = hasCardVideo(project);
              const isImageIntrinsic = isCardImageIntrinsic(project);
              return (
                <article
                  key={project.slug}
                  className={[
                    'portfolio-item',
                    isLarge ? 'portfolio-item-large' : '',
                    isMedium ? 'portfolio-item-medium' : '',
                    showGridVideo ? 'portfolio-item--video-intrinsic' : '',
                    isImageIntrinsic ? 'portfolio-item--image-intrinsic' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <Link
                    className="portfolio-item-link"
                    to={`/portfolio/${project.slug}`}
                  >
                    <div className="portfolio-item-image-wrapper">
                      {showGridVideo ? (
                        <ProjectCardVideo
                          src={project.cardVideo}
                          mp4Src={getCardVideoMp4(project)}
                          layout={getCardVideoLayout(project)}
                        />
                      ) : isImageIntrinsic ? (
                        <img
                          src={img}
                          alt=""
                          className="portfolio-item-image portfolio-item-image--intrinsic"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="portfolio-item-image"
                          style={getCardImageBackgroundStyle(img, 'cover')}
                        />
                      )}
                      <div className="portfolio-item-overlay">
                        <div className="portfolio-item-content">
                          <h2 className="portfolio-item-title">
                            {project.title}
                          </h2>
                          <span className="portfolio-item-cta">
                            View case study →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
