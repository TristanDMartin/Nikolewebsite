import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useParams } from 'react-router-dom';
import { projects } from '../data/projects';
import ProjectCardVideo from './ProjectCardVideo';

import {
  getProjectThumbnail,
  getGalleryItems,
  getGalleryStripItems,
  getAllGalleryItems,
} from '../utils/projectMedia';

function getProjectImage(proj) {
  return getProjectThumbnail(proj);
}

function GalleryImageCard({ item, index, title, onSelect, variant = 'default' }) {
  const alt = item.alt || `${title} — ${index + 1}`;
  return (
    <button
      type="button"
      className={[
        'portfolio-case-gallery-card',
        item.transparentBg ? 'portfolio-case-gallery-card--transparent' : '',
        variant === 'strip' ? 'portfolio-case-gallery-card--strip' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onSelect}
    >
      <img
        className="portfolio-case-gallery-img"
        src={item.src}
        alt={alt}
        width={item.width}
        height={item.height}
        loading={index === 0 ? 'eager' : 'lazy'}
        decoding="async"
        sizes="(min-width: 1400px) 1400px, 100vw"
      />
    </button>
  );
}

function getGalleryLayoutClass(galleryDisplay) {
  if (galleryDisplay === 'native') {
    return 'portfolio-case-gallery--native';
  }
  return '';
}

function GalleryLightbox({
  items,
  selectedIndex,
  title,
  onClose,
  onSelectIndex,
}) {
  const item = items[selectedIndex];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key === 'ArrowLeft' && selectedIndex > 0) {
        onSelectIndex(selectedIndex - 1);
        return;
      }
      if (event.key === 'ArrowRight' && selectedIndex < items.length - 1) {
        onSelectIndex(selectedIndex + 1);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [items.length, onClose, onSelectIndex, selectedIndex]);

  if (!item) {
    return null;
  }

  return createPortal(
    <div
      className="gallery-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} image preview`}
    >
      <button
        type="button"
        className="gallery-lightbox-backdrop"
        aria-label="Close preview"
        onClick={onClose}
      />
      <button
        type="button"
        className="lightbox-close"
        aria-label="Close preview"
        onClick={onClose}
      >
        ×
      </button>
      {selectedIndex > 0 ? (
        <button
          type="button"
          className="lightbox-nav lightbox-prev"
          aria-label="Previous image"
          onClick={() => onSelectIndex(selectedIndex - 1)}
        >
          ←
        </button>
      ) : null}
      <div className="lightbox-image">
        <img
          src={item.src}
          alt={item.alt || `${title} - Image ${selectedIndex + 1}`}
          width={item.width}
          height={item.height}
          decoding="async"
        />
      </div>
      {selectedIndex < items.length - 1 ? (
        <button
          type="button"
          className="lightbox-nav lightbox-next"
          aria-label="Next image"
          onClick={() => onSelectIndex(selectedIndex + 1)}
        >
          →
        </button>
      ) : null}
      <div className="lightbox-counter" aria-live="polite">
        {selectedIndex + 1} / {items.length}
      </div>
    </div>,
    document.body,
  );
}

export default function PortfolioProjectPage() {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);
  const [selectedImage, setSelectedImage] = useState(null);
  const currentIndex = projects.findIndex((item) => item.slug === slug);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject =
    currentIndex >= 0 && currentIndex < projects.length - 1
      ? projects[currentIndex + 1]
      : null;
  const creditItems =
    project?.credits
      ?.split('·')
      .map((item) => item.trim())
      .filter(Boolean) || [];
  const relatedProjects = useMemo(() => {
    if (!project?.tags) {
      return [];
    }
    return projects
      .filter((p) => p.slug !== slug && p.tags)
      .filter((p) => {
        const projectTags = project.tags.split(' • ') || [];
        const pTags = p.tags.split(' • ') || [];
        return projectTags.some((tag) => pTags.includes(tag));
      })
      .slice(0, 3);
  }, [project, slug]);

  const galleryItems = useMemo(
    () => (project ? getGalleryItems(project) : []),
    [project],
  );
  const galleryStripItems = useMemo(
    () => (project ? getGalleryStripItems(project) : []),
    [project],
  );
  const allGalleryItems = useMemo(
    () => (project ? getAllGalleryItems(project) : []),
    [project],
  );
  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
  }, []);
  const selectLightboxIndex = useCallback((index) => {
    setSelectedImage(index);
  }, []);

  if (!project) {
    return (
      <main className="portfolio-case">
        <section className="portfolio-hero portfolio-case-hero">
          <div className="portfolio-hero-content">
            <h1 className="portfolio-hero-title">Project not found</h1>
            <Link className="site-cta-btn site-cta-btn--on-dark" to="/?panel=2">
              Back to portfolio
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const hasGallery =
    galleryItems.length > 0 || galleryStripItems.length > 0;
  const hasGalleryVideos = Boolean(
    project.galleryVideos && project.galleryVideos.length > 0,
  );
  return (
    <main className="portfolio-case">
      <section className="portfolio-hero portfolio-case-hero">
        <div className="portfolio-hero-content">
          <h1 className="portfolio-hero-title">{project.title}</h1>
          {project.tags ? (
            <p className="portfolio-hero-meta">
              {project.tags.split(' • ').join(' · ')}
            </p>
          ) : null}
        </div>
      </section>

      <section className="portfolio-grid-section portfolio-case-section" aria-label="Overview">
        <div className="portfolio-grid-container">
          <div className="portfolio-grid-header">
            <p className="site-panel-label">Project overview</p>
          </div>
          <div className="portfolio-case-story">
            <p className="portfolio-case-lede">{project.description}</p>
            {creditItems.length > 0 ? (
              <div className="portfolio-case-credits">
                <p className="site-panel-label">Credits</p>
                <ul className="portfolio-case-credits-list">
                  {creditItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {hasGalleryVideos ? (
        <section
          className="portfolio-grid-section portfolio-case-section portfolio-case-videos"
          aria-label="Project videos"
        >
          <div className="portfolio-grid-container">
            <div className="portfolio-case-video-gallery">
              {project.galleryVideos.map((item, index) => (
                <div
                  key={item.src}
                  className="portfolio-case-video-card"
                >
                  <ProjectCardVideo
                    src={item.src}
                    mp4Src={item.mp4}
                    bottomScrim={false}
                  />
                  {item.label ? (
                    <p className="portfolio-case-video-label">
                      {String(index + 1).padStart(2, '0')} · {item.label}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {hasGallery ? (
        <section
          className="portfolio-grid-section portfolio-case-section portfolio-case-assets"
          aria-label="Project gallery"
        >
          <div className="portfolio-grid-container">
            <div
              className={[
                'portfolio-case-gallery',
                getGalleryLayoutClass(project.galleryDisplay),
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {galleryItems.map((item, index) => (
                <GalleryImageCard
                  key={item.src}
                  item={item}
                  index={index}
                  title={project.title}
                  onSelect={() => setSelectedImage(index)}
                />
              ))}
              {galleryStripItems.length > 0 ? (
                <div className="portfolio-case-gallery-strip">
                  {galleryStripItems.map((item, stripIndex) => {
                    const index = galleryItems.length + stripIndex;
                    return (
                      <GalleryImageCard
                        key={item.src}
                        item={item}
                        index={index}
                        title={project.title}
                        variant="strip"
                        onSelect={() => setSelectedImage(index)}
                      />
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {relatedProjects.length > 0 ? (
        <section
          className="portfolio-grid-section portfolio-case-section"
          aria-label="Related work"
        >
          <div className="portfolio-grid-container">
            <div className="portfolio-grid-header">
              <p className="site-panel-label">Related work</p>
            </div>
            <div className="portfolio-masonry-grid portfolio-case-related-grid">
              {relatedProjects.map((relatedProject) => {
                const img = getProjectImage(relatedProject);
                return (
                  <article key={relatedProject.slug} className="portfolio-item">
                    <Link
                      className="portfolio-item-link"
                      to={`/portfolio/${relatedProject.slug}`}
                    >
                      <div className="portfolio-item-image-wrapper">
                        <div
                          className="portfolio-item-image"
                          style={
                            img
                              ? { backgroundImage: `url(${img})` }
                              : undefined
                          }
                        />
                        <div className="portfolio-item-overlay">
                          <div className="portfolio-item-content">
                            <h2 className="portfolio-item-title">
                              {relatedProject.title}
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
      ) : null}

      <section className="portfolio-grid-section portfolio-case-nav-section" aria-label="Navigation">
        <div className="portfolio-grid-container">
          <div className="portfolio-grid-header">
            <p className="site-panel-label">Next steps</p>
          </div>
          <div className="portfolio-case-nav">
            <Link className="site-cta-btn" to="/?panel=2">
              All projects
            </Link>
            {prevProject ? (
              <Link
                className="site-cta-btn"
                to={`/portfolio/${prevProject.slug}`}
              >
                ← Previous
              </Link>
            ) : (
              <span className="site-cta-btn site-cta-btn--disabled">
                ← Previous
              </span>
            )}
            {nextProject ? (
              <Link
                className="site-cta-btn"
                to={`/portfolio/${nextProject.slug}`}
              >
                Next →
              </Link>
            ) : (
              <span className="site-cta-btn site-cta-btn--disabled">
                Next →
              </span>
            )}
          </div>
        </div>
      </section>

      {selectedImage !== null && allGalleryItems.length > 0 ? (
        <GalleryLightbox
          items={allGalleryItems}
          selectedIndex={selectedImage}
          title={project.title}
          onClose={closeLightbox}
          onSelectIndex={selectLightboxIndex}
        />
      ) : null}
    </main>
  );
}
