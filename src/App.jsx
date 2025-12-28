import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useParams, useLocation } from 'react-router-dom';
import { projects } from './data/projects';
import InstagramFeed from './components/InstagramFeed';

const HomePage = () => {
  const featuredProject = projects.find(
    (p) => p.isFeatured && p.featuredRank === 1
  );
  const secondaryProjects = projects
    .filter((p) => p.isFeatured && p.featuredRank > 1)
    .sort((a, b) => a.featuredRank - b.featuredRank);

  const getProjectImage = (project) => {
    return project.image || (project.gallery && project.gallery[0]) || null;
  };

  return (
    <main className="homepage">
      <section className="home-hero">
        <div className="page-container">
          <div className="hero-content">
            <div className="hero-description">
              <div className="hero-description-inner">
                <h1 className="hero-headline hero-headline-vertical">
                  Packaging Extraordinaire
                </h1>
                <div className="hero-description-text">
                  <p className="hero-description-title">
                    Creative Director &<br />Design Strategist
                  </p>
                  <p>
                    Transforming brand strategy into compelling experiences and
                    design solutions.
                  </p>
                  <p>
                    Specializing in art direction, packaging development, and creative campaigns for global brands.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="services-ribbon-container">
        <div className="services-ribbon">
          <div className="services-ribbon-track">
            <span>Art Direction</span>
            <span>Brand Strategy</span>
            <span>Packaging Design</span>
            <span>Campaign Development</span>
            <span>Art Direction</span>
            <span>Brand Strategy</span>
            <span>Packaging Design</span>
            <span>Campaign Development</span>
            <span>Art Direction</span>
            <span>Brand Strategy</span>
            <span>Packaging Design</span>
            <span>Campaign Development</span>
            <span>Art Direction</span>
            <span>Brand Strategy</span>
            <span>Packaging Design</span>
            <span>Campaign Development</span>
          </div>
        </div>
      </section>

      {featuredProject && (
        <section className="featured-project">
          <div className="featured-project-wrapper">
            <div className="featured-project-label">the newness</div>
            <div className="featured-project-content">
              <div className="featured-project-info">
                <p className="featured-project-client">
                  {featuredProject.tags?.split(' • ')[0] || 'Featured Project'}
                </p>
                <h2 className="featured-project-title">
                  {featuredProject.title}
                </h2>
                <p className="featured-project-summary">
                  {featuredProject.description}
                </p>
                <div className="featured-project-divider" />
                <Link
                  className="button-link featured-cta"
                  to={`/portfolio/${featuredProject.slug}`}
                >
                  SEE PROJECT
                </Link>
              </div>
              <div className="featured-project-media">
                <Link to={`/portfolio/${featuredProject.slug}`}>
                  <div
                    className="featured-project-image"
                    style={
                      getProjectImage(featuredProject)
                        ? {
                            backgroundImage: `url(${getProjectImage(featuredProject)})`,
                          }
                        : undefined
                    }
                  />
                </Link>
                {featuredProject.credits && (
                  <p className="featured-project-attribution">
                    {featuredProject.credits}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {secondaryProjects.length > 0 && (
        <section className="more-projects">
          <div className="page-container">
            <p className="section-eyebrow">My Work</p>
            <div className="more-projects-grid">
              {secondaryProjects.map((project) => (
                <article
                  key={project.slug}
                  className="more-project-card"
                >
                  <Link
                    className="more-project-link"
                    to={`/portfolio/${project.slug}`}
                  >
                    <div
                      className="more-project-image"
                      style={
                        getProjectImage(project)
                          ? { backgroundImage: `url(${getProjectImage(project)})` }
                          : undefined
                      }
                    />
                    <div className="more-project-content">
                      <h3 className="more-project-title">
                        {project.title}
                      </h3>
                      <p className="more-project-description">
                        {project.description?.substring(0, 120)}
                        {project.description?.length > 120 ? '...' : ''}
                      </p>
                      <span className="more-project-cta">
                        Learn More →
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

const PortfolioIndexPage = () => {
  const getProjectImage = (project) => {
    return project.image || (project.gallery && project.gallery[0]) || null;
  };

  return (
    <main className="portfolio-index">
      <section className="portfolio-hero">
        <div className="portfolio-hero-content">
          <p className="portfolio-hero-eyebrow">Work</p>
          <h1 className="portfolio-hero-title">Portfolio</h1>
          <p className="portfolio-hero-description">
            A curated collection of creative projects, campaigns, and design work
          </p>
        </div>
      </section>

      <section className="portfolio-grid-section">
        <div className="portfolio-grid-container">
          <div className="portfolio-masonry-grid">
            {projects.map((project, index) => {
              const isLarge = index % 5 === 0;
              const isMedium = index % 5 === 3;
              return (
                <article
                  key={project.slug}
                  className={`portfolio-item ${isLarge ? 'portfolio-item-large' : ''} ${isMedium ? 'portfolio-item-medium' : ''}`}
                >
                  <Link
                    className="portfolio-item-link"
                    to={`/portfolio/${project.slug}`}
                  >
                    <div className="portfolio-item-image-wrapper">
                      <div
                        className="portfolio-item-image"
                        style={
                          getProjectImage(project)
                            ? {
                                backgroundImage: `url(${getProjectImage(project)})`,
                              }
                            : undefined
                        }
                      />
                      <div className="portfolio-item-overlay">
                        <div className="portfolio-item-content">
                          <h2 className="portfolio-item-title">
                            {project.title}
                          </h2>
                          {project.tags && (
                            <p className="portfolio-item-meta">
                              {project.tags.split(' • ').slice(0, 2).join(' • ')}
                            </p>
                          )}
                          <span className="portfolio-item-cta">View Project →</span>
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
};

const AboutPage = () => (
  <main>
    <section className="about-hero">
      <div className="portfolio-hero-content">
        <p className="portfolio-hero-eyebrow">About</p>
        <h1 className="portfolio-hero-title">Creative Director &<br />Design Strategist</h1>
        <div className="about-contact">
          <a href="mailto:nikole@nikoleglenn.com" className="about-email">
            nikole@nikoleglenn.com
          </a>
          <a
            className="about-contact-link"
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Contact
          </a>
        </div>
      </div>
    </section>
    <section className="about">
      <div className="about-content">
        <div className="about-image">
          <div className="about-image-placeholder">
            {/* Image will go here */}
          </div>
        </div>
        <div className="about-text">
          <h2 className="about-section-title">About Nikole</h2>
          <p className="about-intro-text">
            Nikole Glenn is a Creative Director & Design Strategist based in New York.
          </p>
          <div className="body-stack">
            <p className="body-text">
              As a dedicated design professional with extensive experience, Nikole's career
              spans brand strategy, packaging development, and creative campaigns. She's a
              big picture creative who crafts unifying concepts, elevates multi-platform
              visuals and oversees designers, art directors and freelance crew members.
              Nikole has been both a full-time in-house creative and a consulting creative
              director. In addition to her stellar creative direction skills, she works as
              a partner with marketing departments, driving business results forward. Her
              creative vision has shaped and defined several successful brands.
            </p>
            <p className="body-text">
              In her career, Nikole has partnered with Brand Marketing, Insights, and
              Agency teams to translate brand strategy into compelling experiences and
              design solutions for a global audience. Throughout any project, she finds
              equal joy in the design process as she does in the outcome. Nikole has worked
              with international brands such as Colgate, Yankee Candle, Sharpie, and Graco.
            </p>
            <p className="body-text">
              Beyond her professional life, Nikole has a deep passion for travel, exploring
              new places, and savoring diverse cuisines. At home, she shares her space with
              her feline companions, Bigby and Bailey. During her leisure time, she expresses
              her creativity by drawing for her shoe blog @nikoles_soles. She also enjoys
              Japanese anime, Korean dramas, video games, and a wide array of sci-fi shows.
            </p>
          </div>
          <div className="about-resume-button">
            <a
              className="button-link"
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Resume
            </a>
          </div>
          <div className="about-clients">
            <h3 className="clients-title">Select Clients</h3>
            <div className="clients-grid">
              <span className="client-badge">Colgate</span>
              <span className="client-badge">Yankee Candle</span>
              <span className="client-badge">Sharpie</span>
              <span className="client-badge">Graco</span>
              <span className="client-badge">Bumble and bumble</span>
              <span className="client-badge">Prismacolor</span>
              <span className="client-badge">Paper Mate</span>
              <span className="client-badge">Baby Jogger</span>
              <span className="client-badge">Sharpie Limited Edition</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
);

const ResumePage = () => (
  <main>
    <section className="page-container">
      <div className="section-header">
        <p className="eyebrow">resume</p>
        <h2>Resume &amp; Connect</h2>
      </div>
      <div className="resume-row">
        <a
          className="button-link"
          href="/resume.pdf"
          target="_blank"
          rel="noreferrer"
        >
          Open Resume PDF
        </a>
      </div>
    </section>
  </main>
);

const InquirePage = () => {
  
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('https://formspree.io/f/xvzordgg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company: formData.company,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          _subject: `Inquiry from ${formData.company}`,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          company: '',
          name: '',
          email: '',
          phone: '',
          message: '',
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <section className="about">
        <div className="inquire-content">
          <div className="section-header">
            <p className="eyebrow">contact</p>
            <h1>Inquire</h1>
            <p className="inquire-description">
              Interested in working together? Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>

          <form className="inquire-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="company">Company Name *</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">Your Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Project Details *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                required
              />
            </div>

            {submitStatus === 'success' && (
              <div className="form-message form-message-success">
                Thank you! Your inquiry has been sent. We'll get back to you soon.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="form-message form-message-error">
                There was an error sending your message. Please try again or email directly at nikole@nikoleglenn.com
              </div>
            )}

            <button
              type="submit"
              className="button-link form-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Inquiry'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

const PortfolioPage = () => {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);
  const [heroIndex, setHeroIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
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

  const relatedProjects = projects
    .filter((p) => p.slug !== slug && p.tags && project?.tags)
    .filter((p) => {
      const projectTags = project?.tags.split(' • ') || [];
      const pTags = p.tags.split(' • ') || [];
      return projectTags.some((tag) => pTags.includes(tag));
    })
    .slice(0, 3);

  useEffect(() => {
    if (!project || !project.gallery || project.gallery.length < 2) {
      return undefined;
    }
    const id = window.setInterval(() => {
      setHeroIndex((value) => (value + 1) % project.gallery.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [project]);

  useEffect(() => {
    setHeroIndex(0);
    setSelectedImage(null);
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const heroImage =
    project && project.gallery && project.gallery.length > 0
      ? project.gallery[heroIndex]
      : project?.image;

  const getProjectImage = (proj) => {
    return proj.image || (proj.gallery && proj.gallery[0]) || null;
  };

  if (!project) {
    return (
      <main>
        <section className="page-container">
          <div className="section-header">
            <p className="eyebrow">portfolio</p>
            <h2>Project not found</h2>
          </div>
          <Link className="button-link" to="/">
            Back to portfolio
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="portfolio-detail">
      <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />

      <section className="detail-hero-full">
        <div
          className="detail-hero-image"
          style={
            heroImage
              ? { backgroundImage: `url(${heroImage})` }
              : undefined
          }
        >
          <div className="detail-hero-overlay" />
          <div className="detail-hero-content-overlay">
            <div className="detail-hero-text">
              <p className="detail-hero-eyebrow">Featured Project</p>
              <h1 className="detail-hero-title">{project.title}</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="detail-content">
        <div className="detail-header">
          <div className="detail-meta">
            <p className="detail-eyebrow">Project Overview</p>
            <h1 className="detail-title">{project.title}</h1>
            {project.tags && (
              <div className="detail-tags">
                {project.tags.split(' • ').map((tag, index) => (
                  <span key={index} className="detail-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {creditItems.length > 0 && (
              <div className="detail-credits-inline">
                <h3 className="credits-title-small">Credits</h3>
                <ul className="project-credits-list-inline">
                  {creditItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="detail-description-section">
            <p className="detail-description">{project.description}</p>
            <div className="detail-stats">
              <div className="stat-item">
                <span className="stat-number">{project.gallery?.length || 0}</span>
                <span className="stat-label">Images</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{project.tags?.split(' • ').length || 0}</span>
                <span className="stat-label">Services</span>
              </div>
            </div>
          </div>
        </div>

        {project.gallery && project.gallery.length > 0 && (
          <section className="gallery-section">
            <div className="gallery-header">
              <h2 className="gallery-title">Project Gallery</h2>
              <p className="gallery-subtitle">
                {project.gallery.length} {project.gallery.length === 1 ? 'image' : 'images'}
              </p>
            </div>
            <div className="gallery-grid-masonry">
              {project.gallery.map((src, index) => (
                <div
                  className={`gallery-item-masonry ${index % 4 === 0 ? 'gallery-item-large' : index % 4 === 2 ? 'gallery-item-tall' : ''}`}
                  key={src}
                  onClick={() => setSelectedImage(index)}
                >
                  <div
                    className="gallery-image"
                    style={{ backgroundImage: `url(${src})` }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${project.title} - Image ${index + 1}`}
                  />
                  <div className="gallery-item-overlay">
                    <span className="gallery-view-icon">👁</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {selectedImage !== null && project.gallery && (
          <div
            className="gallery-lightbox"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="lightbox-close"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              ×
            </button>
            {selectedImage > 0 && (
              <button
                className="lightbox-nav lightbox-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(selectedImage - 1);
                }}
              >
                ←
              </button>
            )}
            <div
              className="lightbox-image"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={project.gallery[selectedImage]}
                alt={`${project.title} - Image ${selectedImage + 1}`}
              />
            </div>
            {selectedImage < project.gallery.length - 1 && (
              <button
                className="lightbox-nav lightbox-next"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(selectedImage + 1);
                }}
              >
                →
              </button>
            )}
            <div className="lightbox-counter">
              {selectedImage + 1} / {project.gallery.length}
            </div>
          </div>
        )}

        {relatedProjects.length > 0 && (
          <section className="related-projects-section">
            <h2 className="related-title">Related Projects</h2>
            <div className="related-projects-grid">
              {relatedProjects.map((relatedProject) => (
                <Link
                  key={relatedProject.slug}
                  to={`/portfolio/${relatedProject.slug}`}
                  className="related-project-card"
                >
                  <div
                    className="related-project-image"
                    style={
                      getProjectImage(relatedProject)
                        ? {
                            backgroundImage: `url(${getProjectImage(relatedProject)})`,
                          }
                        : undefined
                    }
                  />
                  <div className="related-project-info">
                    <h3 className="related-project-title">
                      {relatedProject.title}
                    </h3>
                    {relatedProject.tags && (
                      <p className="related-project-tags">
                        {relatedProject.tags.split(' • ').slice(0, 2).join(' • ')}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="detail-navigation">
          <Link className="detail-back-link" to="/portfolio">
            ← Back to portfolio
          </Link>
          <div className="detail-nav">
            {prevProject ? (
              <Link
                className="detail-nav-link"
                to={`/portfolio/${prevProject.slug}`}
                aria-label={`Previous project: ${prevProject.title}`}
              >
                ← Previous
              </Link>
            ) : (
              <span className="detail-nav-link detail-nav-link-disabled">
                ← Previous
              </span>
            )}
            <span className="detail-nav-divider">/</span>
            {nextProject ? (
              <Link
                className="detail-nav-link"
                to={`/portfolio/${nextProject.slug}`}
                aria-label={`Next project: ${nextProject.title}`}
              >
                Next →
              </Link>
            ) : (
              <span className="detail-nav-link detail-nav-link-disabled">
                Next →
              </span>
            )}
          </div>
        </section>
      </section>
    </main>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  const location = useLocation();
  const showInstagram = location.pathname !== '/inquire';

  return (
    <div className="page">
      <ScrollToTop />
      <header className="site-header">
        <Link to="/" className="site-brand">
          <div className="brand-name">
            <span className="brand-first">NIKOLE</span>
            <span className="brand-last">GLENN</span>
          </div>
        </Link>
        <nav className="site-nav" aria-label="Primary">
          <ul className="nav-list">
            <li>
              <Link to="/portfolio">projects</Link>
            </li>
            <li>
              <Link to="/inquire">Inquire</Link>
            </li>
            <li>
              <Link to="/about">about me</Link>
            </li>
          </ul>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/portfolio" element={<PortfolioIndexPage />} />
        <Route path="/portfolio/:slug" element={<PortfolioPage />} />
        <Route path="/inquire" element={<InquirePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/resume" element={<ResumePage />} />
      </Routes>

      {showInstagram && (
        <section className="instagram-section">
          <div className="instagram-container">
            <h2 className="instagram-title">See the Latest on IG</h2>
            <InstagramFeed />
            <a
              href="https://www.instagram.com/nikoles_soles/"
              target="_blank"
              rel="noopener noreferrer"
              className="instagram-link"
            >
              Follow @nikoles_soles →
            </a>
          </div>
        </section>
      )}

    <footer className="site-footer">
      <a
        className="connect-label"
        href="/resume.pdf"
        target="_blank"
        rel="noreferrer"
      >
        Let's Connect
      </a>
      <div className="connect-line" />
    </footer>
    </div>
  );
};

export default App;

