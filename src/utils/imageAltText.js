export function generateAltText(imagePath, projectTitle, context = '') {
  if (!imagePath) return 'Portfolio image';
  const filename = imagePath.split('/').pop();
  const cleanFilename = filename
    .replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')
    .replace(/thumbnail_?/gi, '')
    .replace(/[_-]/g, ' ')
    .replace(/\d+_/g, '')
    .trim();
  if (projectTitle) {
    if (context) {
      return `${projectTitle} - ${context}`;
    }
    if (cleanFilename && cleanFilename.length > 3) {
      return `${projectTitle} - ${cleanFilename}`;
    }
    return `${projectTitle} portfolio project`;
  }
  if (cleanFilename && cleanFilename.length > 3) {
    return cleanFilename;
  }
  return 'Portfolio work by Nikole Glenn';
}

export function getProjectAltTexts(project) {
  if (!project) return {};
  const altTexts = {
    thumbnail: generateAltText(project.image, project.title, 'thumbnail'),
    cardVideo: project.cardVideo
      ? `${project.title} video preview`
      : undefined,
  };
  if (project.gallery && Array.isArray(project.gallery)) {
    altTexts.gallery = project.gallery.map((item, index) => {
      if (typeof item === 'string') {
        return generateAltText(item, project.title, `image ${index + 1}`);
      }
      if (item?.alt) {
        return item.alt;
      }
      if (item?.src) {
        return generateAltText(item.src, project.title, `image ${index + 1}`);
      }
      return generateAltText('', project.title, `image ${index + 1}`);
    });
  }
  return altTexts;
}

export function getBrandAltText(brandName) {
  return `${brandName} logo - Client brand`;
}

export function getPortfolioImageAlt(imageName, category = '') {
  const cleanName = imageName
    .replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')
    .replace(/[_-]/g, ' ')
    .trim();
  if (category) {
    return `${category} - ${cleanName}`;
  }
  return cleanName || 'Portfolio image';
}
