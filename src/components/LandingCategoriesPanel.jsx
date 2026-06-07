import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { getProjectsByCategory } from '../utils/portfolioCategories';

function getFirstTag(project) {
  if (!project?.tags) {
    return null;
  }
  return project.tags.split(' • ')[0].trim();
}

function CategoryChevron({ isOpen }) {
  return (
    <svg
      className={`p4-category-chevron${isOpen ? ' is-open' : ''}`}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function LandingCategoriesPanel() {
  const categories = useMemo(() => getProjectsByCategory(), []);
  const projectTotal = projects.length;
  const [openCategory, setOpenCategory] = useState(0);

  const toggleCategory = (index) => {
    setOpenCategory((current) => (current === index ? null : index));
  };

  return (
    <section className="panel p4" aria-label="Categories">
      <div className="p4-content">
        <div className="p4-intro">
          <div>
            <div className="panel-label">03 / Categories</div>
            <h2 className="p4-headline">
              Work organized by the problems <em>solved</em>
            </h2>
          </div>
          <p className="p4-intro-copy">
            Grouped by the type of challenge—not chronology—so hiring managers
            can scan strategic packaging, launches, retail, and content leadership.
            {projectTotal} individual projects roll up into these six narratives.
          </p>
        </div>
        <div className="p4-categories-scroll">
          <div className="p4-categories-grid">
            {categories.map((category, index) => {
              const isOpen = openCategory === index;

              return (
                <div
                  key={category.id}
                  className={`p4-category-col${isOpen ? ' is-open' : ''}`}
                >
                  <button
                    type="button"
                    className="p4-category-header"
                    onClick={() => toggleCategory(index)}
                    aria-expanded={isOpen}
                    aria-controls={`p4-category-content-${category.id}`}
                  >
                    <span className="p4-category-num">{category.order}</span>
                    <span className="p4-category-header-row">
                      <span className="p4-category-title">{category.label}</span>
                      <CategoryChevron isOpen={isOpen} />
                    </span>
                  </button>
                  <div
                    id={`p4-category-content-${category.id}`}
                    className={`p4-category-content${isOpen ? ' is-open' : ' is-collapsed'}`}
                    aria-hidden={!isOpen}
                  >
                    <p className="p4-category-narrative">{category.narrative}</p>
                    <p className="p4-category-includes-label">Included projects</p>
                    <ul className="p4-project-list">
                      {category.projects.map((project) => (
                        <li key={project.slug}>
                          <Link
                            to={`/portfolio/${project.slug}`}
                            className="p4-project-link"
                            tabIndex={isOpen ? undefined : -1}
                          >
                            <span className="p4-project-name">
                              {project.title}
                            </span>
                            {getFirstTag(project) ? (
                              <span className="p4-project-tag">
                                {getFirstTag(project)}
                              </span>
                            ) : null}
                            <span className="p4-project-arrow" aria-hidden="true">
                              →
                            </span>
                          </Link>
                        </li>
                      ))}
                      {category.upcomingLabels.map((label) => (
                        <li key={label}>
                          <span className="p4-project-upcoming">
                            <span className="p4-project-name">{label}</span>
                            <span className="p4-project-tag">Case study soon</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="p4-footer">
          <span className="p4-footer-label">Full archive</span>
          <Link to="/portfolio" className="p4-portfolio-link">
            View all {projectTotal} projects
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
