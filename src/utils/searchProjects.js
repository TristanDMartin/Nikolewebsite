function normalizeText(value) {
  return (value || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function getProjectSearchText(project) {
  return normalizeText(
    [
      project.title,
      project.tags,
      project.slug.replace(/-/g, ' '),
      project.description,
      project.credits,
    ].join(' '),
  );
}

export function searchProjects(query, projectList) {
  const normalizedQuery = normalizeText(query);
  const sorted = [...projectList].sort((a, b) =>
    a.title.localeCompare(b.title),
  );
  if (!normalizedQuery) {
    return sorted;
  }
  const terms = normalizedQuery.split(' ').filter(Boolean);
  return sorted.filter((project) => {
    const haystack = getProjectSearchText(project);
    return terms.every((term) => haystack.includes(term));
  });
}
