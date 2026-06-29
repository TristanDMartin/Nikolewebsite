export function getGallerySrc(item) {
  if (!item) {
    return null;
  }
  return typeof item === 'string' ? item : item.src;
}

function toCssUrl(imageUrl) {
  return `url("${encodeURI(imageUrl)}")`;
}

export function normalizeGalleryItem(item) {
  if (typeof item === 'string') {
    return { src: item };
  }
  return item;
}

export function getGalleryItems(project) {
  return (project?.gallery || []).map(normalizeGalleryItem);
}

export function getGalleryStripItems(project) {
  return (project?.galleryStrip || []).map(normalizeGalleryItem);
}

export function getAllGalleryItems(project) {
  return [...getGalleryItems(project), ...getGalleryStripItems(project)];
}

export function getProjectThumbnail(project) {
  return project?.image || getGallerySrc(project?.gallery?.[0]) || null;
}

export function hasCardVideo(project) {
  return Boolean(project?.cardVideo);
}

export function getCardVideoMp4(project) {
  return project?.cardVideoMp4 || null;
}

export function getCardVideoPoster(project) {
  if (project?.cardVideoPoster) {
    return project.cardVideoPoster;
  }
  if (project?.cardVideoPoster === null || project?.cardVideoAutoplay) {
    return null;
  }
  if (project?.cardVideo && shouldPlayCardVideoOnHover(project)) {
    return getProjectThumbnail(project) || null;
  }
  if (project?.cardVideo) {
    return null;
  }
  return getProjectThumbnail(project) || null;
}

export function shouldPlayCardVideoOnHover(project) {
  return hasCardVideo(project) && !project?.cardVideoAutoplay;
}

export function getVideoSources(primarySrc, mp4Src) {
  if (!primarySrc) {
    return [];
  }
  const sources = [];
  const mp4 = mp4Src || null;
  if (mp4) {
    sources.push({ src: mp4, type: 'video/mp4' });
  }
  const lower = primarySrc.toLowerCase();
  if (lower.endsWith('.mov')) {
    sources.push({ src: primarySrc, type: 'video/quicktime' });
  } else if (!mp4 || mp4 !== primarySrc) {
    sources.push({ src: primarySrc, type: 'video/mp4' });
  }
  return sources;
}

export function getCardVideoSources(project) {
  return getVideoSources(project?.cardVideo, getCardVideoMp4(project));
}

export function getGalleryVideoSources(item) {
  if (!item?.src) {
    return [];
  }
  return getVideoSources(item.src, item.mp4);
}

export function getFeaturedProjects(projectList) {
  return projectList
    .filter((project) => project.isFeatured)
    .sort(
      (a, b) =>
        (a.featuredRank ?? Number.MAX_SAFE_INTEGER) -
        (b.featuredRank ?? Number.MAX_SAFE_INTEGER),
    );
}

export function getCardVideoLayout(project) {
  return project?.cardVideoLayout || 'intrinsic';
}

export function getCardImageFit(project) {
  return project?.cardImageFit === 'contain' ? 'contain' : 'cover';
}

export function isCardImageIntrinsic(project) {
  return getCardImageFit(project) === 'contain' && !hasCardVideo(project);
}

export function getCardImageBackgroundStyle(imageUrl, fit) {
  if (!imageUrl) {
    return undefined;
  }
  if (fit === 'contain') {
    return {
      backgroundImage: toCssUrl(imageUrl),
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: 'var(--surface-hero, #ffffff)',
    };
  }
  return {
    backgroundImage: toCssUrl(imageUrl),
  };
}

export function getWorkGridImageStyle(imageUrl, fit) {
  if (!imageUrl) {
    return undefined;
  }
  if (fit === 'contain') {
    return getCardImageBackgroundStyle(imageUrl, 'contain');
  }
  return {
    backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.5)), ${toCssUrl(imageUrl)}`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
}
