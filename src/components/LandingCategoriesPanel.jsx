import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { getProjectsByCategory } from '../utils/portfolioCategories';

const PROJECTS_PER_PAGE = 2;

function getFirstTag(project) {
  if (!project?.tags) {
    return null;
  }
  return project.tags.split(' • ')[0].trim();
}

function getCategoryItems(category) {
  const projectItems = category.projects.map((project) => ({
    type: 'project',
    key: project.slug,
    project,
  }));
  const upcomingItems = category.upcomingLabels.map((label) => ({
    type: 'upcoming',
    key: label,
    label,
  }));
  return [...projectItems, ...upcomingItems];
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

function CategoryProjectList({ category, isOpen, page, onPageChange }) {
  const items = useMemo(() => getCategoryItems(category), [category]);
  const totalPages = Math.max(1, Math.ceil(items.length / PROJECTS_PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const pageStart = safePage * PROJECTS_PER_PAGE;
  const visibleItems = items.slice(pageStart, pageStart + PROJECTS_PER_PAGE);
  const hasPagination = items.length > PROJECTS_PER_PAGE;

  return (
    <>
      <ul className="p4-project-list">
        {visibleItems.map((item) => {
          if (item.type === 'project') {
            return (
              <li key={item.key}>
                <Link
                  to={`/portfolio/${item.project.slug}`}
                  className="p4-project-link"
                  tabIndex={isOpen ? undefined : -1}
                >
                  <span className="p4-project-name">{item.project.title}</span>
                  {getFirstTag(item.project) ? (
                    <span className="p4-project-tag">
                      {getFirstTag(item.project)}
                    </span>
                  ) : null}
                  <span className="p4-project-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            );
          }

          return (
            <li key={item.key}>
              <span className="p4-project-upcoming">
                <span className="p4-project-name">{item.label}</span>
                <span className="p4-project-tag">Case study soon</span>
              </span>
            </li>
          );
        })}
      </ul>
      {hasPagination ? (
        <div className="p4-project-pagination">
          <button
            type="button"
            className="p4-project-page-btn"
            onClick={() => onPageChange(safePage - 1)}
            disabled={safePage === 0}
            aria-label="Show previous projects"
            tabIndex={isOpen ? undefined : -1}
          >
            Previous
          </button>
          <span className="p4-project-page-indicator" aria-live="polite">
            {safePage + 1} / {totalPages}
          </span>
          <button
            type="button"
            className="p4-project-page-btn"
            onClick={() => onPageChange(safePage + 1)}
            disabled={safePage >= totalPages - 1}
            aria-label="Show next projects"
            tabIndex={isOpen ? undefined : -1}
          >
            Next
          </button>
        </div>
      ) : null}
    </>
  );
}

export default function LandingCategoriesPanel({ resetKey = 0 }) {
  const categories = useMemo(() => getProjectsByCategory(), []);
  const projectTotal = projects.length;
  const scrollRef = useRef(null);
  const [openCategory, setOpenCategory] = useState(0);
  const [categoryPages, setCategoryPages] = useState({});

  useEffect(() => {
    if (resetKey === 0) {
      return;
    }
    setOpenCategory(0);
    setCategoryPages({});
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [resetKey]);

  const toggleCategory = (index) => {
    if (openCategory === index) {
      setOpenCategory(null);
      return;
    }

    setCategoryPages((pages) => ({
      ...pages,
      [categories[index].id]: 0,
    }));
    setOpenCategory(index);
  };

  const setCategoryPage = (categoryId, page) => {
    setCategoryPages((pages) => ({
      ...pages,
      [categoryId]: Math.max(0, page),
    }));
  };

  return (
    <section id="categories" className="panel p4" aria-label="Categories">
      <div className="p4-content">
        <div className="p4-intro">
          <div>
            <h2 className="p4-headline">
              Work organized by the problems <em>solved</em>
            </h2>
          </div>
        </div>
        <div className="p4-categories-scroll" ref={scrollRef}>
          <div className="p4-categories-grid">
            {categories.map((category, index) => {
              const isOpen = openCategory === index;
              const categoryPage = categoryPages[category.id] ?? 0;

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
                    <CategoryProjectList
                      category={category}
                      isOpen={isOpen}
                      page={categoryPage}
                      onPageChange={(page) => setCategoryPage(category.id, page)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="p4-footer">
          <span className="p4-footer-label">Full archive</span>
          <p className="p4-footer-copy">
            {projectTotal} individual projects across six categories
          </p>
        </div>
      </div>
    </section>
  );
}
