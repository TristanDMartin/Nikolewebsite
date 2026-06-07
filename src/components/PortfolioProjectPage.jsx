import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { projects } from '../data/projects';
import ProjectCardVideo from './ProjectCardVideo';

function getProjectImage(proj) {
  return proj.image || (proj.gallery && proj.gallery[0]) || null;
}

function getGalleryGridClass(imageCount) {
  if (imageCount <= 1) {
    return 'portfolio-case-gallery--1';
  }
  if (imageCount === 2) {
    return 'portfolio-case-gallery--2';
  }
  if (imageCount === 3) {
    return 'portfolio-case-gallery--3';
  }
  if (imageCount === 4) {
    return 'portfolio-case-gallery--4';
  }
  if (imageCount === 5) {
    return 'portfolio-case-gallery--5';
  }
  return 'portfolio-case-gallery--many';
}

function getFirstTag(project) {
  if (!project?.tags) {
    return null;
  }
  return project.tags.split(' • ')[0].trim();
}

function getHeroExcerpt(description) {
  if (!description) {
    return '';
  }
  const paragraph = description.split('\n\n')[0];
  return paragraph.trim();
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

  if (!project) {
    return (
      <main className="portfolio-case">
        <section className="portfolio-hero portfolio-case-hero">
          <div className="portfolio-hero-content">
            <p className="site-panel-label">Case study</p>
            <h1 className="portfolio-hero-title">Project not found</h1>
            <Link className="site-cta-btn site-cta-btn--on-dark" to="/portfolio">
              Back to portfolio
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const hasGallery = Boolean(project.gallery && project.gallery.length > 0);
  const heroImage = getProjectImage(project);
  const heroVideo = project.cardVideo || null;
  const firstTag = getFirstTag(project);
  const heroExcerpt = getHeroExcerpt(project.description);

  return (
    <main className="portfolio-case">
      <section className="portfolio-hero portfolio-case-hero">
        <div className="portfolio-hero-content">
          <p className="site-panel-label portfolio-hero-eyebrow">
            Case study
          </p>
          <h1 className="portfolio-hero-title">{project.title}</h1>
          {project.tags ? (
            <p className="portfolio-hero-meta">
              {project.tags.split(' • ').join(' · ')}
            </p>
          ) : null}
          {heroExcerpt ? (
            <p className="portfolio-hero-description">{heroExcerpt}</p>
          ) : null}
        </div>
      </section>

      {(heroVideo || heroImage) && (
        <section className="portfolio-case-feature" aria-label="Featured visual">
          <div className="portfolio-case-feature-inner">
            {heroVideo ? (
              <div className="portfolio-case-feature-media portfolio-case-feature-media--video">
                <ProjectCardVideo src={heroVideo} />
              </div>
            ) : (
              <div
                className="portfolio-case-feature-media"
                style={{ backgroundImage: `url(${heroImage})` }}
              />
            )}
          </div>
        </section>
      )}

      <section className="portfolio-grid-section portfolio-case-section" aria-label="Overview">
        <div className="portfolio-grid-container">
          <div className="portfolio-grid-header">
            <p className="site-panel-label">Project overview</p>
            {firstTag ? (
              <p className="portfolio-grid-meta">{firstTag}</p>
            ) : null}
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

      {hasGallery ? (
        <section
          className="portfolio-grid-section portfolio-case-section portfolio-case-assets"
          aria-label="Campaign assets"
        >
          <div className="portfolio-grid-container">
            <div className="portfolio-grid-header">
              <p className="site-panel-label">Campaign assets</p>
              <p className="portfolio-grid-meta">
                {project.gallery.length}{' '}
                {project.gallery.length === 1 ? 'file' : 'files'}
              </p>
            </div>
            <div
              className={`portfolio-case-gallery ${getGalleryGridClass(project.gallery.length)}`}
            >
              {project.gallery.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  className={[
                    'portfolio-case-gallery-card',
                    index === 0 ? 'portfolio-case-gallery-card--lead' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    className="portfolio-case-gallery-img"
                    src={src}
                    alt={`${project.title} — ${index + 1}`}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                  <span className="portfolio-case-gallery-label">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </button>
              ))}
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
              <p className="portfolio-grid-meta">More in this lane</p>
            </div>
            <div className="portfolio-masonry-grid portfolio-case-related-grid">
              {relatedProjects.map((relatedProject) => {
                const img = getProjectImage(relatedProject);
                const tag = getFirstTag(relatedProject);
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
                            {tag ? (
                              <p className="portfolio-item-meta">{tag}</p>
                            ) : null}
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
            <Link className="site-cta-btn" to="/portfolio">
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

      {selectedImage !== null && project.gallery ? (
        <div
          className="gallery-lightbox"
          onClick={() => setSelectedImage(null)}
          role="presentation"
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            ×
          </button>
          {selectedImage > 0 ? (
            <button
              type="button"
              className="lightbox-nav lightbox-prev"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(selectedImage - 1);
              }}
            >
              ←
            </button>
          ) : null}
          <div
            className="lightbox-image"
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          >
            <img
              src={project.gallery[selectedImage]}
              alt={`${project.title} - Image ${selectedImage + 1}`}
            />
          </div>
          {selectedImage < project.gallery.length - 1 ? (
            <button
              type="button"
              className="lightbox-nav lightbox-next"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(selectedImage + 1);
              }}
            >
              →
            </button>
          ) : null}
          <div className="lightbox-counter">
            {selectedImage + 1} / {project.gallery.length}
          </div>
        </div>
      ) : null}
    </main>
  );
}
