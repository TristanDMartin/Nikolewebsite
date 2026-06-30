import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { projects } from '../data/projects';
import { searchProjects } from '../utils/searchProjects';
import { getProjectThumbnail } from '../utils/projectMedia';
import { buildPortfolioLinkState } from '../utils/portfolioNavigation';
import '../project-search.css';

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M16 16l4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function getFirstTag(project) {
  if (!project?.tags) {
    return null;
  }
  return project.tags.split(' • ')[0].trim();
}

function ProjectSearchModal({ onClose, getPortfolioLinkProps, openPortfolioProject }) {
  const inputRef = useRef(null);
  const location = useLocation();
  const [query, setQuery] = useState('');
  const results = useMemo(
    () => searchProjects(query, projects),
    [query],
  );

  useEffect(() => {
    inputRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  const resolvePortfolioLinkProps = (slug) => {
    if (openPortfolioProject) {
      return {
        to: `/portfolio/${slug}`,
        onClick: (event) => {
          onClose();
          openPortfolioProject(slug, event);
        },
      };
    }
    if (getPortfolioLinkProps) {
      return getPortfolioLinkProps(slug);
    }
    return {
      to: `/portfolio/${slug}`,
      state: buildPortfolioLinkState(`${location.pathname}${location.search}`),
    };
  };

  return createPortal(
    <div
      className="project-search-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-search-title"
      onClick={onClose}
    >
      <div className="project-search-panel" onClick={(event) => event.stopPropagation()}>
        <p id="project-search-title" className="sr-only">
          Search projects
        </p>
        <div className="project-search-header">
          <SearchIcon />
          <input
            ref={inputRef}
            type="search"
            className="project-search-input"
            placeholder="Search projects…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            className="project-search-close"
            onClick={onClose}
            aria-label="Close search"
          >
            ×
          </button>
        </div>
        <p className="project-search-meta">
          {query.trim()
            ? `${results.length} result${results.length === 1 ? '' : 's'}`
            : `${projects.length} projects`}
        </p>
        {results.length > 0 ? (
          <ul className="project-search-results">
            {results.map((project) => {
              const thumb = getProjectThumbnail(project);
              const firstTag = getFirstTag(project);
              const linkProps = resolvePortfolioLinkProps(project.slug);
              return (
                <li key={project.slug} className="project-search-result">
                  <Link
                    {...linkProps}
                    className="project-search-result-link"
                    onClick={(event) => {
                      linkProps.onClick?.(event);
                      onClose();
                    }}
                  >
                    {thumb ? (
                      <img
                        src={thumb}
                        alt=""
                        className="project-search-result-thumb"
                        loading="lazy"
                      />
                    ) : (
                      <span
                        className="project-search-result-thumb project-search-result-thumb--empty"
                        aria-hidden="true"
                      />
                    )}
                    <div className="project-search-result-copy">
                      <p className="project-search-result-title">
                        {project.title}
                      </p>
                      {firstTag ? (
                        <p className="project-search-result-tag">{firstTag}</p>
                      ) : null}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="project-search-empty">No projects match your search.</p>
        )}
      </div>
    </div>,
    document.body,
  );
}

export default function ProjectSearchButton({
  className = '',
  getPortfolioLinkProps,
  openPortfolioProject,
  onOpen,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={['project-search-btn', className].filter(Boolean).join(' ')}
        onClick={() => {
          onOpen?.();
          setIsOpen(true);
        }}
        aria-label="Search projects"
      >
        <SearchIcon />
      </button>
      {isOpen ? (
        <ProjectSearchModal
          onClose={() => setIsOpen(false)}
          getPortfolioLinkProps={getPortfolioLinkProps}
          openPortfolioProject={openPortfolioProject}
        />
      ) : null}
    </>
  );
}
