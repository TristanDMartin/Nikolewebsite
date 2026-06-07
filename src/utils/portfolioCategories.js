import { projects } from '../data/projects';
import { portfolioCategories } from '../config/portfolioCategories';

export function getProjectsByCategory() {
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  return portfolioCategories.map((category, index) => ({
    ...category,
    order: String(index + 1).padStart(2, '0'),
    projects: category.slugs
      .map((slug) => bySlug.get(slug))
      .filter(Boolean),
    upcomingLabels: category.upcomingLabels || [],
  }));
}

export function getPortfolioCategoryCount() {
  return portfolioCategories.length;
}
