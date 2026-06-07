import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import AppDocumentMeta from './components/AppDocumentMeta';
import AppInnerCursor from './components/AppInnerCursor';
import AppSiteNav from './components/AppSiteNav';
import LandingHome from './components/LandingHome';
import './portfolio-experience.css';
import PortfolioIndexPage from './components/PortfolioIndexPage';
import PortfolioNavTheme from './components/PortfolioNavTheme';
import PortfolioProjectPage from './components/PortfolioProjectPage';
import BrandMarquee from './components/BrandMarquee';
import aboutHeadshot from './assets/headshot-nikole.jpg';

const AboutPage = () => (
  <main>
    <section className="about-hero">
      <div className="portfolio-hero-content">
        <p className="portfolio-hero-eyebrow">About</p>
        <h1 className="portfolio-hero-title">Creative Director &<br />Design Strategist</h1>
        <div className="about-contact">
          <a href="mailto:nikole@nikoleglenn.com" className="about-email">
            Email me
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
          <img
            src={aboutHeadshot}
            alt="Nikole Glenn, Creative Director and Design Strategist"
            className="about-image-photo"
            loading="lazy"
          />
        </div>
        <div className="about-text">
          <h2 className="about-section-title">About Nikole</h2>
          <p className="about-intro-text">
            I am a Creative Leader driven by the intersection of strategic brand
            thinking, innovative packaging architecture, and omnichannel storytelling.
          </p>
          <div className="body-stack">
            <p className="body-text">
              With a career defined by global brand launches and large-scale visual
              transformations, I specialize in bridging the gap between high-level brand
              strategy and on-shelf execution. My leadership philosophy is rooted in the
              belief that the best design solutions are born from cross-functional
              collaboration. Whether I am navigating complex manufacturing requirements for
              a global launch or directing a fast-paced digital campaign, I thrive on
              translating business challenges into compelling, human-centric design
              experiences.
            </p>
            <p className="body-text">
              My experience spans the full brand lifecycle—from conceptualizing innovative
              &quot;white space&quot; opportunities to leading global production across legacy
              brands like Colgate, Yankee Candle, and Sharpie. I am energized by the
              challenge of evolving a brand&apos;s visual identity to remain relevant to
              contemporary consumers while maintaining the rigorous quality standards
              required for global retail success.
            </p>
            <p className="body-text">
              <strong>Beyond the Studio:</strong> My creative curiosity is constant.
              You&apos;ll often find me exploring the intersection of art and sneaker culture
              through my passion project, Nikole&apos;s Soles, where I experiment with
              illustration, motion design, and digital storytelling. Outside of work, I am
              an avid traveler and student of global aesthetics—often influenced by the
              textures and narratives found in anime, sci-fi, and international cinema. At
              home, I am happily overseen by my two feline coworkers, Bigby and Bailey.
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
          <BrandMarquee className="about-brand-marquee" label="Select client brands" />
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
                There was an error sending your message. Please try again or{' '}
                <a href="mailto:nikole@nikoleglenn.com">email me</a>.
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

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  const location = useLocation();
  const isLandingHome = location.pathname === '/';
  const isPortfolioExperience =
    location.pathname === '/portfolio' ||
    location.pathname.startsWith('/portfolio/');
  useEffect(() => {
    document.body.classList.toggle(
      'portfolio-experience',
      isPortfolioExperience,
    );
    return () => {
      document.body.classList.remove('portfolio-experience');
    };
  }, [isPortfolioExperience]);

  if (isLandingHome) {
    return (
      <>
        <ScrollToTop />
        <LandingHome />
      </>
    );
  }

  return (
    <div
      className={`page${isPortfolioExperience ? ' page--portfolio-experience' : ''}`}
    >
      <ScrollToTop />
      <AppDocumentMeta />
      {isPortfolioExperience ? <AppInnerCursor /> : null}
      {isPortfolioExperience ? <PortfolioNavTheme /> : null}
      <AppSiteNav />

      <Routes>
        <Route path="/portfolio" element={<PortfolioIndexPage />} />
        <Route path="/portfolio/:slug" element={<PortfolioProjectPage />} />
        <Route path="/inquire" element={<InquirePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/resume" element={<ResumePage />} />
      </Routes>

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
      {isPortfolioExperience ? (
        <p className="portfolio-footer-copyright">
          © 2026 Nikole Glenn. All rights reserved.
        </p>
      ) : null}
    </footer>
    </div>
  );
};

export default App;

