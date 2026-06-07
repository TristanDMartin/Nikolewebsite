import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import aboutHeadshot from '../assets/headshot-nikole.jpg';
import { projects } from '../data/projects';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
} from '../config/site';
import DocumentMeta from './DocumentMeta';
import BrandMarquee from './BrandMarquee';
import LandingCategoriesPanel from './LandingCategoriesPanel';
import InstagramFeed from './InstagramFeed';
import ProjectCardVideo from './ProjectCardVideo';
import '../landing.css';

const PANEL_COUNT = 7;
const WORK_PAGE_SIZE = 5;
const ABOUT_SCROLL_UNITS = 1.8;
const LANDING_MOBILE_BREAKPOINT = 960;

function isLandingMobileViewport() {
  return window.innerWidth <= LANDING_MOBILE_BREAKPOINT;
}

function getMobileActivePanelIndex(trackEl) {
  if (!trackEl) {
    return 0;
  }
  const panels = trackEl.querySelectorAll(':scope > .panel');
  if (panels.length === 0) {
    return 0;
  }
  let panelIdx = 0;
  let bestOverlap = -1;
  panels.forEach((panel, i) => {
    const rect = panel.getBoundingClientRect();
    const overlap =
      Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    if (overlap > bestOverlap) {
      bestOverlap = overlap;
      panelIdx = i;
    }
  });
  return panelIdx;
}

function findScrollableOverflowY(el) {
  let node = el;
  while (node && node !== document.body) {
    const { overflowY } = window.getComputedStyle(node);
    if (
      (overflowY === 'auto' || overflowY === 'scroll') &&
      node.scrollHeight > node.clientHeight + 1
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

function canConsumeVerticalScroll(el, deltaY) {
  if (!el || deltaY === 0) {
    return false;
  }
  const maxScroll = el.scrollHeight - el.clientHeight;
  if (maxScroll <= 0) {
    return false;
  }
  if (deltaY > 0) {
    return el.scrollTop < maxScroll - 1;
  }
  return el.scrollTop > 0;
}

function getPanelOffsets() {
  if (window.innerWidth <= LANDING_MOBILE_BREAKPOINT) {
    return Array.from({ length: PANEL_COUNT }, (_, i) => i);
  }
  return [
    0,
    1,
    1 + ABOUT_SCROLL_UNITS,
    2 + ABOUT_SCROLL_UNITS,
    3 + ABOUT_SCROLL_UNITS,
    4 + ABOUT_SCROLL_UNITS,
    5 + ABOUT_SCROLL_UNITS,
  ];
}

function getTrackMaxScrollPx(trackEl) {
  if (!trackEl) {
    return 0;
  }
  const panels = trackEl.querySelectorAll(':scope > .panel');
  let total = 0;
  for (let i = 0; i < panels.length; i++) {
    total += panels[i].offsetWidth;
  }
  const vw = window.innerWidth;
  return Math.max(0, total - vw);
}

function getScrollXForPanelIndex(trackEl, panelIndex) {
  if (!trackEl || panelIndex <= 0) {
    return 0;
  }
  const panels = trackEl.querySelectorAll(':scope > .panel');
  let sum = 0;
  for (let i = 0; i < panelIndex && i < panels.length; i++) {
    sum += panels[i].offsetWidth;
  }
  return sum;
}

function getViewportPanelIndex(x, trackEl) {
  if (!trackEl) {
    return null;
  }
  const panels = trackEl.querySelectorAll(':scope > .panel');
  if (panels.length === 0) {
    return null;
  }
  const vw = window.innerWidth;
  const center = x + vw / 2;
  for (let i = 0; i < panels.length; i++) {
    const el = panels[i];
    const left = el.offsetLeft;
    const right = left + el.offsetWidth;
    if (center >= left && center < right) {
      return i;
    }
  }
  return panels.length - 1;
}

const SHAPE_CLASSES = [
  'shape-tall-bottle',
  'shape-ritual-box',
  'shape-crystal',
  'shape-sleeve',
  'shape-canister',
];

const WC_GRADIENTS = ['wc-1', 'wc-2', 'wc-3', 'wc-4', 'wc-5'];

function getProjectImage(project) {
  return project.image || (project.gallery && project.gallery[0]) || null;
}

function getFirstTag(project) {
  if (!project.tags) {
    return 'Creative';
  }
  return project.tags.split(' • ')[0].trim();
}

function buildOrderedWorkProjects() {
  const featured = [...projects]
    .filter((p) => p.isFeatured)
    .sort((a, b) => (a.featuredRank || 0) - (b.featuredRank || 0));
  const rest = projects.filter((p) => !featured.includes(p));
  return [...featured, ...rest];
}

function buildShowcaseProjects() {
  const featured = [...projects]
    .filter((p) => p.isFeatured)
    .sort((a, b) => (a.featuredRank || 0) - (b.featuredRank || 0));
  const rest = projects.filter((p) => !featured.includes(p));
  return [...featured, ...rest].slice(0, 14);
}

const ABOUT_BODY_COL1 =
  'Creative director and design strategist based in New York, partnering with marketing and agency teams to translate strategy into packaging,';
const ABOUT_BODY_COL2 =
  'campaigns, and omni-channel launches for brands including Colgate, Yankee Candle, Sharpie, and Graco.';

const ABOUT_ME_LEFT = [
  'I am a Creative Leader driven by the intersection of strategic brand thinking, innovative packaging architecture, and omnichannel storytelling.',
  'With a career defined by global brand launches and large-scale visual transformations, I specialize in bridging the gap between high-level brand strategy and on-shelf execution. My leadership philosophy is rooted in the belief that the best design solutions are born from cross-functional collaboration. Whether I am navigating complex manufacturing requirements for a global launch or directing a fast-paced digital campaign, I thrive on translating business challenges into compelling, human-centric design experiences.',
];

const ABOUT_ME_RIGHT = [
  'My experience spans the full brand lifecycle—from conceptualizing innovative "white space" opportunities to leading global production across legacy brands like Colgate, Yankee Candle, and Sharpie. I am energized by the challenge of evolving a brand\'s visual identity to remain relevant to contemporary consumers while maintaining the rigorous quality standards required for global retail success.',
  'Beyond the Studio: My creative curiosity is constant. You\'ll often find me exploring the intersection of art and sneaker culture through my passion project, Nikole\'s Soles, where I experiment with illustration, motion design, and digital storytelling. Outside of work, I am an avid traveler and student of global aesthetics—often influenced by the textures and narratives found in anime, sci-fi, and international cinema. At home, I am happily overseen by my two feline coworkers, Bigby and Bailey.',
];

function splitOutcomes(project) {
  if (!project) {
    return [];
  }
  const fromCredits =
    project.credits
      ?.split('·')
      .map((s) => s.trim())
      .filter(Boolean) || [];
  if (fromCredits.length >= 3) {
    return fromCredits.slice(0, 4);
  }
  const sentences = project.description
    ? project.description.split('. ').map((s) => s.trim()).filter(Boolean)
    : [];
  const merged = [...fromCredits, ...sentences];
  return merged.slice(0, 4);
}

export default function LandingHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const landingPageRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);
  const scrollHintRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const dotRefs = useRef([]);
  const targetXRef = useRef(0);
  const currentXRef = useRef(0);
  const rafRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const ringRef = useRef({ x: 0, y: 0 });
  const touchStartRef = useRef({ x: 0, y: 0, target: 0, axis: null });

  const featuredProject = useMemo(
    () => projects.find((p) => p.isFeatured && p.featuredRank === 1),
    [],
  );
  const aboutMeHeroImage = aboutHeadshot;
  const orderedWorkProjects = useMemo(() => buildOrderedWorkProjects(), []);
  const workPageCount = Math.max(
    1,
    Math.ceil(orderedWorkProjects.length / WORK_PAGE_SIZE),
  );
  const [workPageIndex, setWorkPageIndex] = useState(0);
  const [isInstagramOpen, setIsInstagramOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(() =>
    typeof window !== 'undefined' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const splashTimerRef = useRef(null);

  const dismissSplash = useCallback(() => {
    if (splashTimerRef.current != null) {
      window.clearTimeout(splashTimerRef.current);
      splashTimerRef.current = null;
    }
    setShowSplash(false);
  }, []);
  const visibleWorkProjects = useMemo(() => {
    const start = workPageIndex * WORK_PAGE_SIZE;
    return orderedWorkProjects.slice(start, start + WORK_PAGE_SIZE);
  }, [orderedWorkProjects, workPageIndex]);
  const showcaseProjects = useMemo(() => buildShowcaseProjects(), []);
  const outcomes = useMemo(
    () => splitOutcomes(featuredProject),
    [featuredProject],
  );
  const projectTotal = projects.length;

  const advanceWorkPage = useCallback(() => {
    setWorkPageIndex((i) => (i + 1) % workPageCount);
  }, [workPageCount]);

  const getMaxScroll = useCallback(() => {
    if (isLandingMobileViewport()) {
      return 0;
    }
    return getTrackMaxScrollPx(trackRef.current);
  }, []);

  const goToPanel = useCallback((index) => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    if (isLandingMobileViewport()) {
      const panels = track.querySelectorAll(':scope > .panel');
      const panel = panels[index];
      if (panel) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }
    const max = getTrackMaxScrollPx(track);
    const raw = getScrollXForPanelIndex(track, index);
    targetXRef.current = Math.max(0, Math.min(raw, max));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const raw = params.get('panel');
    if (raw === null) {
      return undefined;
    }
    const idx = Number.parseInt(raw, 10);
    if (!Number.isFinite(idx) || idx < 0 || idx >= PANEL_COUNT) {
      return undefined;
    }
    dismissSplash();
    let rafOuter = 0;
    let rafInner = 0;
    rafOuter = window.requestAnimationFrame(() => {
      rafInner = window.requestAnimationFrame(() => {
        goToPanel(idx);
        navigate('/', { replace: true });
      });
    });
    return () => {
      window.cancelAnimationFrame(rafOuter);
      window.cancelAnimationFrame(rafInner);
    };
  }, [
    location.search,
    goToPanel,
    dismissSplash,
    navigate,
  ]);

  const applyPanelChrome = useCallback((panelIdx, hideScrollHint) => {
    dotRefs.current.forEach((d, i) => {
      if (d) {
        d.classList.toggle('active', i === panelIdx);
      }
    });
    if (scrollHintRef.current) {
      if (hideScrollHint) {
        scrollHintRef.current.style.opacity = '0';
        scrollHintRef.current.style.pointerEvents = 'none';
      } else {
        scrollHintRef.current.style.opacity = '1';
        scrollHintRef.current.style.pointerEvents = '';
      }
    }
    const darkPanels = [2, 4, 6];
    const navLinks = document.querySelectorAll(
      '.landing-page .nav-links a, .landing-page .nav-links button, .landing-page .nav-logo',
    );
    const color = darkPanels.includes(panelIdx)
      ? 'var(--cream)'
      : 'var(--ink)';
    navLinks.forEach((el) => {
      el.style.color = color;
    });
    dotRefs.current.forEach((d) => {
      if (!d) {
        return;
      }
      if (d.classList.contains('active')) {
        d.style.background = 'var(--rust)';
      } else {
        d.style.background = darkPanels.includes(panelIdx)
          ? 'rgba(245,240,232,0.25)'
          : 'rgba(26,23,20,0.18)';
      }
    });
    if (scrollHintRef.current) {
      scrollHintRef.current.style.color = darkPanels.includes(panelIdx)
        ? 'rgba(245,240,232,0.35)'
        : 'rgba(26,23,20,0.35)';
    }
    landingPageRef.current?.classList.toggle(
      'landing-cursor-light',
      panelIdx === 6,
    );
  }, []);

  const resetMobilePanelEffects = useCallback(() => {
    const track = trackRef.current;
    const aboutEl = track?.querySelector('.panel.p2');
    if (aboutEl) {
      aboutEl.style.setProperty('--p2-copy-shift', '0px');
      aboutEl.style.setProperty('--p2-copy-opacity', '1');
      aboutEl.style.setProperty('--p2-copy-blur', '0px');
      aboutEl.classList.remove('p2-copy-hidden');
    }
    const pamEl = track?.querySelector('.panel.pam');
    if (pamEl) {
      pamEl.style.setProperty('--pam-photo-scale', '1');
    }
  }, []);

  const updateMobileUi = useCallback(() => {
    if (!isLandingMobileViewport()) {
      return;
    }
    const track = trackRef.current;
    const panelIdx = getMobileActivePanelIndex(track);
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const pct =
      scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
    if (progressRef.current) {
      progressRef.current.style.width = `${pct}%`;
    }
    applyPanelChrome(panelIdx, window.scrollY > 64);
    resetMobilePanelEffects();
  }, [applyPanelChrome, resetMobilePanelEffects]);

  const updateUi = useCallback((x) => {
    if (isLandingMobileViewport()) {
      return;
    }
    const vw = window.innerWidth;
    const max = getMaxScroll();
    const pct = max > 0 ? (x / max) * 100 : 0;
    if (progressRef.current) {
      progressRef.current.style.width = `${pct}%`;
    }
    const offsets = getPanelOffsets();
    const scrollUnit = x / vw;
    const fromDom = getViewportPanelIndex(x, trackRef.current);
    const panelIdx =
      fromDom != null
        ? fromDom
        : offsets.reduce((active, offset, i) => {
            return offset <= scrollUnit + 0.2 ? i : active;
          }, 0);
    applyPanelChrome(panelIdx, x > 50);
    const aboutEl = trackRef.current?.querySelector('.panel.p2');
    if (aboutEl) {
      const aboutStart = aboutEl.offsetLeft;
      const aboutMax = Math.max(0, aboutEl.offsetWidth - vw);
      const aboutLocal = Math.max(0, Math.min(x - aboutStart, aboutMax));
      const aboutProgress = aboutMax > 0 ? aboutLocal / aboutMax : 0;
      const copyFade = 1 - Math.max(0, Math.min(1, (aboutProgress - 0.22) / 0.12));
      aboutEl.style.setProperty('--p2-copy-shift', `${aboutLocal.toFixed(2)}px`);
      aboutEl.style.setProperty('--p2-copy-opacity', copyFade.toFixed(4));
      aboutEl.style.setProperty('--p2-copy-blur', `${((1 - copyFade) * 14).toFixed(2)}px`);
      aboutEl.classList.toggle('p2-copy-hidden', copyFade <= 0.02);
    }
    const pamEl = trackRef.current?.querySelector('.panel.pam');
    if (pamEl) {
      const pamStart = pamEl.offsetLeft;
      const pw = pamEl.offsetWidth;
      const vis = Math.min(x + vw, pamStart + pw) - Math.max(x, pamStart);
      const denom = Math.min(pw, vw * 1.2);
      const progress = denom > 0 ? Math.max(0, Math.min(1, vis / denom)) : 0;
      const scale = 0.5 + progress * 0.5;
      pamEl.style.setProperty('--pam-photo-scale', scale.toFixed(4));
    }
  }, [getMaxScroll, applyPanelChrome]);

  const setScrollImmediate = useCallback(
    (x) => {
      const max = getMaxScroll();
      const clamped = Math.max(0, Math.min(x, max));
      targetXRef.current = clamped;
      currentXRef.current = clamped;
      if (trackRef.current) {
        if (isLandingMobileViewport()) {
          trackRef.current.style.transform = 'none';
        } else {
          trackRef.current.style.transform = `translateX(${-clamped}px)`;
        }
      }
      if (isLandingMobileViewport()) {
        updateMobileUi();
      } else {
        updateUi(clamped);
      }
    },
    [getMaxScroll, updateUi, updateMobileUi],
  );

  useEffect(() => {
    document.documentElement.classList.add('landing-active');
    document.body.classList.add('landing-active');
    return () => {
      document.documentElement.classList.remove('landing-active');
      document.body.classList.remove('landing-active');
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(
      `(max-width: ${LANDING_MOBILE_BREAKPOINT}px)`,
    );
    const syncLayoutMode = () => {
      const isMobile = mq.matches;
      landingPageRef.current?.classList.toggle('landing-mobile', isMobile);
      if (isMobile) {
        targetXRef.current = 0;
        currentXRef.current = 0;
        if (trackRef.current) {
          trackRef.current.style.transform = 'none';
        }
        updateMobileUi();
      } else if (trackRef.current) {
        setScrollImmediate(currentXRef.current);
      }
    };
    syncLayoutMode();
    mq.addEventListener('change', syncLayoutMode);
    return () => mq.removeEventListener('change', syncLayoutMode);
  }, [updateMobileUi, setScrollImmediate]);

  useEffect(() => {
    const onScroll = () => updateMobileUi();
    window.addEventListener('scroll', onScroll, { passive: true });
    updateMobileUi();
    return () => window.removeEventListener('scroll', onScroll);
  }, [updateMobileUi]);

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${e.clientX}px`;
        cursorDotRef.current.style.top = `${e.clientY}px`;
      }
    };
    document.addEventListener('mousemove', onMove);
    return () => document.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const ringX = ringRef.current;
    const animateRing = () => {
      if (isCancelled) {
        return;
      }
      ringX.x += (mouseRef.current.x - ringX.x) * 0.12;
      ringX.y += (mouseRef.current.y - ringX.y) * 0.12;
      if (cursorRingRef.current) {
        cursorRingRef.current.style.left = `${ringX.x}px`;
        cursorRingRef.current.style.top = `${ringX.y}px`;
      }
      requestAnimationFrame(animateRing);
    };
    const ringRaf = requestAnimationFrame(animateRing);
    return () => {
      isCancelled = true;
      cancelAnimationFrame(ringRaf);
    };
  }, []);

  useEffect(() => {
    const expandables = document.querySelectorAll(
      '.landing-page a, .landing-page button, .landing-page .wc, .landing-page .landing-dot',
    );
    const onEnter = () => cursorRingRef.current?.classList.add('expand');
    const onLeave = () => cursorRingRef.current?.classList.remove('expand');
    expandables.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });
    return () => {
      expandables.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  useEffect(() => {
    if (!isInstagramOpen) {
      return undefined;
    }
    const overlayEls = document.querySelectorAll(
      '.pam-ig-overlay button, .pam-ig-overlay a',
    );
    const onEnter = () => cursorRingRef.current?.classList.add('expand');
    const onLeave = () => cursorRingRef.current?.classList.remove('expand');
    overlayEls.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });
    return () => {
      overlayEls.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, [isInstagramOpen]);

  useEffect(() => {
    if (!isInstagramOpen) {
      return undefined;
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setIsInstagramOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isInstagramOpen]);

  useEffect(() => {
    const onWheel = (e) => {
      if (showSplash || isInstagramOpen) {
        return;
      }
      const max = getMaxScroll();
      if (max <= 0) {
        return;
      }
      const scrollable = findScrollableOverflowY(e.target);
      if (
        scrollable &&
        Math.abs(e.deltaY) >= Math.abs(e.deltaX) &&
        canConsumeVerticalScroll(scrollable, e.deltaY)
      ) {
        return;
      }
      e.preventDefault();
      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      targetXRef.current = Math.max(
        0,
        Math.min(targetXRef.current + delta * 1.2, max),
      );
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [getMaxScroll, showSplash, isInstagramOpen]);

  useEffect(() => {
    const onStart = (e) => {
      touchStartRef.current.x = e.touches[0].clientX;
      touchStartRef.current.y = e.touches[0].clientY;
      touchStartRef.current.target = targetXRef.current;
      touchStartRef.current.axis = null;
    };
    const onMove = (e) => {
      const touch = e.touches[0];
      const dx = touchStartRef.current.x - touch.clientX;
      const dy = touchStartRef.current.y - touch.clientY;
      if (!touchStartRef.current.axis) {
        if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) {
          if (findScrollableOverflowY(e.target)) {
            touchStartRef.current.axis = 'vertical';
          }
        }
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
          touchStartRef.current.axis = 'horizontal';
        }
      }
      if (touchStartRef.current.axis === 'vertical') {
        return;
      }
      const max = getMaxScroll();
      if (max <= 0) {
        return;
      }
      e.preventDefault();
      targetXRef.current = Math.max(
        0,
        Math.min(touchStartRef.current.target + dx * 1.4, max),
      );
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: false });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
    };
  }, [getMaxScroll]);

  useEffect(() => {
    const onKey = (e) => {
      const vw = window.innerWidth;
      const max = getMaxScroll();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        targetXRef.current = Math.min(targetXRef.current + vw, max);
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        targetXRef.current = Math.max(targetXRef.current - vw, 0);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [getMaxScroll]);

  useEffect(() => {
    const onResize = () => {
      const max = getMaxScroll();
      targetXRef.current = Math.min(targetXRef.current, max);
      currentXRef.current = Math.min(currentXRef.current, max);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [getMaxScroll]);

  useEffect(() => {
    const ease = 0.1;
    let isCancelled = false;
    const tick = () => {
      if (isCancelled) {
        return;
      }
      const target = targetXRef.current;
      let current = currentXRef.current;
      current += (target - current) * ease;
      if (Math.abs(target - current) < 0.08) {
        current = target;
      }
      if (trackRef.current) {
        if (isLandingMobileViewport()) {
          trackRef.current.style.transform = 'none';
        } else {
          trackRef.current.style.transform = `translateX(${-current}px)`;
        }
      }
      currentXRef.current = current;
      if (!isLandingMobileViewport()) {
        updateUi(current);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      isCancelled = true;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updateUi]);

  useEffect(() => {
    setScrollImmediate(0);
  }, [setScrollImmediate]);

  useEffect(() => {
    if (!showSplash) {
      return undefined;
    }
    splashTimerRef.current = window.setTimeout(() => {
      splashTimerRef.current = null;
      setShowSplash(false);
    }, 2900);
    return () => {
      if (splashTimerRef.current != null) {
        window.clearTimeout(splashTimerRef.current);
        splashTimerRef.current = null;
      }
    };
  }, [showSplash]);

  useEffect(() => {
    if (!showSplash) {
      return undefined;
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        dismissSplash();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showSplash, dismissSplash]);

  const caseImage = featuredProject
    ? getProjectImage(featuredProject)
    : null;
  const caseVideo = featuredProject?.cardVideo || null;

  return (
    <div className="landing-page" ref={landingPageRef}>
      <DocumentMeta
        title={`${SITE_NAME} — Creative Director & Design Strategist`}
        description={DEFAULT_DESCRIPTION}
        canonicalUrl={`${SITE_URL}/`}
        ogImageUrl={DEFAULT_OG_IMAGE}
      />
      {showSplash ? (
        <button
          type="button"
          className="landing-splash"
          aria-label="Continue to site"
          onClick={dismissSplash}
        >
          <span className="landing-splash-name-block">
            <span className="landing-splash-name">Nikole Glenn</span>
            <span className="landing-splash-name-veil" aria-hidden="true" />
          </span>
        </button>
      ) : null}
      <div className="cursor-dot" ref={cursorDotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={cursorRingRef} aria-hidden="true" />

      <nav className="landing-site-nav" aria-label="Primary">
        <button
          type="button"
          className="nav-logo"
          onClick={() => goToPanel(0)}
        >
          Nikole Glenn
        </button>
        <ul className="nav-links">
          <li>
            <button type="button" onClick={() => goToPanel(0)}>
              Home
            </button>
          </li>
          <li>
            <button type="button" onClick={() => goToPanel(1)}>
              Work
            </button>
          </li>
          <li>
            <button type="button" onClick={() => goToPanel(3)}>
              Categories
            </button>
          </li>
          <li>
            <button type="button" onClick={() => goToPanel(5)}>
              About Me
            </button>
          </li>
          <li>
            <button type="button" onClick={() => goToPanel(6)}>
              Contact
            </button>
          </li>
        </ul>
      </nav>

      <div className="progress-line" ref={progressRef} aria-hidden="true" />

      <div className="panel-dots" role="tablist" aria-label="Sections">
        {Array.from({ length: PANEL_COUNT }, (_, i) => (
          <button
            key={i}
            type="button"
            className={`landing-dot${i === 0 ? ' active' : ''}`}
            ref={(el) => {
              dotRefs.current[i] = el;
            }}
            aria-label={`Go to section ${i + 1}`}
            data-panel={i}
            onClick={() => goToPanel(i)}
          />
        ))}
      </div>

      <div className="scroll-hint" ref={scrollHintRef}>
        <span className="scroll-hint-label scroll-hint-label--desktop">
          Scroll to explore
        </span>
        <span className="scroll-hint-label scroll-hint-label--mobile">
          Scroll down
        </span>
        <svg width="32" height="12" viewBox="0 0 32 12" fill="none" aria-hidden="true">
          <path
            d="M0 6h28M23 1l8 5-8 5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      <div className="track-wrapper">
        <div className="track" ref={trackRef} id="track">
          <section className="panel p1" aria-label="Introduction">
            <div className="p1-grid-lines" aria-hidden="true" />
            <div className="p1-bg-word" aria-hidden="true">
              DESIGN
            </div>
            <div className="p1-content">
              <div className="p1-eyebrow">
                Creative Director &amp; Design Strategist — Portfolio 2026
              </div>
              <h1 className="p1-name">
                Nikole
                <br />
                Glenn<span className="italic">.</span>
              </h1>
              <p className="p1-tagline">
                I turn brand strategy into packaging, campaigns, and retail
                experiences people notice from structural storytelling to
                products being shelf-ready for global brands.
              </p>
              <button
                type="button"
                className="p1-cta-btn"
                onClick={() => goToPanel(2)}
              >
                View selected work
                <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden="true">
                  <path
                    d="M0 5h16M12 1l5 4-5 4"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                </svg>
              </button>
            </div>
            <div className="p1-year" aria-hidden="true">
              NG — 2026
            </div>
          </section>

          <section className="panel p2" aria-label="About and selected work">
            <div className="p2-flow">
              <div className="p2-canvas">
                <div className="p2-editorial-block">
                  <div className="panel-label">01 / About</div>
                  <h2 className="p2-headline">
                    Design that lives
                    <br />
                    <em>on shelf &amp; screen</em>
                  </h2>
                  <div className="p2-body-columns">
                    <p className="p2-body-col">{ABOUT_BODY_COL1}</p>
                    <p className="p2-body-col">{ABOUT_BODY_COL2}</p>
                  </div>
                  <div className="p2-stats">
                    <div className="stat">
                      <div className="stat-num">15+</div>
                      <div className="stat-label">
                        Years
                        <br />
                        leading creative
                      </div>
                    </div>
                    <div className="stat">
                      <div className="stat-num">{projectTotal}+</div>
                      <div className="stat-label">
                        Portfolio
                        <br />
                        case studies
                      </div>
                    </div>
                    <div className="stat">
                      <div className="stat-num">NYC</div>
                      <div className="stat-label">
                        Based in
                        <br />
                        New York
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p2-showcase-wrap">
                  <div
                    className="p2-showcase-scroll"
                    role="list"
                    aria-label="Featured project previews"
                  >
                    {showcaseProjects.slice(0, 3).map((project, index) => {
                      const img = getProjectImage(project);
                      const showCardVideo = Boolean(project.cardVideo);
                      return (
                        <Link
                          key={project.slug}
                          to={`/portfolio/${project.slug}`}
                          className={`p2-card p2-card-${index + 1}`}
                          role="listitem"
                        >
                          <div
                            className="p2-card-img"
                            style={
                              img && !showCardVideo
                                ? {
                                    '--p2-image': `url(${img})`,
                                  }
                                : undefined
                            }
                          >
                            {showCardVideo ? (
                              <ProjectCardVideo
                                src={project.cardVideo}
                                layout="fill"
                              />
                            ) : null}
                          </div>
                          <span className="p2-card-label">
                            {getFirstTag(project)}
                          </span>
                          <span className="p2-card-title">{project.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="panel p3" aria-label="Selected work">
            <div className="p3-content">
              <div className="p3-header">
                <div>
                  <div className="panel-label">02 / Selected Work</div>
                  <h2 className="p3-headline">
                    Recent
                    <br />
                    <em>projects</em>
                  </h2>
                </div>
                <div className="p3-meta-row">
                  <span className="p3-meta">
                    <span className="p3-meta-core">
                      {WORK_PAGE_SIZE} highlights · {projectTotal} total
                    </span>
                    {orderedWorkProjects.length > WORK_PAGE_SIZE ? (
                      <>
                        <span className="p3-meta-sep" aria-hidden="true">
                          ·
                        </span>
                        <span className="p3-meta-more">More Projects</span>
                      </>
                    ) : null}
                  </span>
                  {orderedWorkProjects.length > WORK_PAGE_SIZE ? (
                    <button
                      type="button"
                      className="p3-next-set"
                      onClick={advanceWorkPage}
                      aria-label="Show next set of projects"
                    >
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 20 20"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M5 8l5 5 5-5"
                          stroke="currentColor"
                          strokeWidth="1.45"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="work-grid">
                {visibleWorkProjects.map((project, index) => {
                  const img = getProjectImage(project);
                  const showWorkVideo = Boolean(project.cardVideo);
                  const style =
                    img && !showWorkVideo
                      ? {
                          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.5)), url(${img})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }
                      : undefined;
                  const visualIndex = workPageIndex * WORK_PAGE_SIZE + index;
                  return (
                    <Link
                      key={project.slug}
                      to={`/portfolio/${project.slug}`}
                      className="wc"
                    >
                      <div
                        className={`wc-inner ${WC_GRADIENTS[visualIndex % WC_GRADIENTS.length]}`}
                        style={style}
                      >
                        {showWorkVideo ? (
                          <ProjectCardVideo
                            src={project.cardVideo}
                            layout="fill"
                          />
                        ) : null}
                        <div className="wc-overlay" />
                        <div
                          className={`wc-shape ${SHAPE_CLASSES[visualIndex % SHAPE_CLASSES.length]}`}
                        />
                        <div className="wc-cat">{getFirstTag(project)}</div>
                        <div className="wc-title">{project.title}</div>
                        <div className="wc-year">View case study →</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          <LandingCategoriesPanel />

          <section className="panel p5" aria-label="Featured case study">
            <div className="p5-content">
              <div className="p5-left">
                <div className="p5-label">04 / Case Study</div>
                <h2 className="p5-headline">
                  {featuredProject ? (
                    <>
                      Featured launch
                      <br />
                      <em>{featuredProject.title}</em>
                    </>
                  ) : (
                    <>
                      Featured
                      <br />
                      <em>project</em>
                    </>
                  )}
                </h2>
                <p className="p5-body">
                  {featuredProject
                    ? featuredProject.description
                    : 'Explore the portfolio for packaging, campaigns, and retail systems.'}
                </p>
                <div className="p5-outcomes">
                  {(outcomes.length > 0
                    ? outcomes
                    : [
                        'Art direction across packaging and campaign touchpoints',
                        'Collaboration with insights, marketing, and agency partners',
                        'Launch-ready assets for retail and digital',
                      ]
                  ).map((line, outcomeIndex) => (
                    <div key={`${line}-${outcomeIndex}`} className="outcome">
                      {line}
                    </div>
                  ))}
                </div>
                {featuredProject && (
                  <Link
                    to={`/portfolio/${featuredProject.slug}`}
                    className="p1-cta-btn"
                    style={{ width: 'fit-content' }}
                  >
                    Open full project
                  </Link>
                )}
              </div>
              <div
                className="p5-right"
                style={
                  caseImage && !caseVideo
                    ? {
                        backgroundImage: `linear-gradient(120deg, rgba(0,0,0,0.35), rgba(74,103,65,0.55)), url(${caseImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }
                    : undefined
                }
              >
                {caseVideo ? (
                  <ProjectCardVideo src={caseVideo} layout="fill" />
                ) : null}
                <div className="p5-bg-circles" aria-hidden="true">
                  <div
                    className="bg-circle"
                    style={{
                      width: '500px',
                      height: '500px',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%,-50%)',
                    }}
                  />
                  <div
                    className="bg-circle"
                    style={{
                      width: '300px',
                      height: '300px',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%,-50%)',
                    }}
                  />
                </div>
                {!caseImage && !caseVideo && (
                  <div className="case-mock" aria-hidden="true">
                    <div className="mock-bottle">
                      <div className="mock-cap" />
                      <div className="mock-label">
                        <div className="mock-label-line1" />
                        <div className="mock-label-line2" />
                        <div className="mock-label-line3" />
                        <div
                          className="mock-label-line2"
                          style={{ width: '32px', marginTop: '4px' }}
                        />
                      </div>
                    </div>
                    <div className="mock-box">
                      <div className="mock-box-line1" />
                      <div className="mock-box-line2" />
                    </div>
                    <div className="mock-tube" />
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="panel pam" aria-label="About me">
            <div className="pam-grid-lines" aria-hidden="true" />
            <div className="pam-inner">
              <div className="pam-main">
                <div className="panel-label">05 / About Me</div>
                <h2 className="pam-headline">
                  The craft
                  <br />
                  is in the <em>collaboration</em>
                </h2>
                <div className="pam-columns">
                  <div className="pam-column">
                    {ABOUT_ME_LEFT.map((paragraph, index) => (
                      <p key={index} className="pam-para">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  <div className="pam-column">
                    {ABOUT_ME_RIGHT.map((paragraph, index) => (
                      <p key={index} className="pam-para">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
                <BrandMarquee className="pam-brand-marquee" label="Client brands" />
                <div className="pam-footer">
                  <a
                    href="/resume.pdf"
                    className="pam-cta"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Resume
                  </a>
                  <button
                    type="button"
                    className="pam-cta pam-cta-next"
                    onClick={() => setIsInstagramOpen(true)}
                    aria-label="Open Instagram feed"
                  >
                    <svg
                      className="pam-cta-down-icon"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 5v14M6 13l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="pam-visual">
                <div className="pam-photo-shell">
                  {aboutMeHeroImage ? (
                    <img
                      src={aboutMeHeroImage}
                      alt="Nikole Glenn, creative director"
                      className="pam-photo"
                      loading="lazy"
                    />
                  ) : (
                    <div className="pam-photo-placeholder" aria-hidden="true" />
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="panel p6" aria-label="Contact">
            <div className="p6-bg-circle-1" aria-hidden="true" />
            <div className="p6-bg-circle-2" aria-hidden="true" />
            <div className="p6-bg-word" aria-hidden="true">
              OPEN
            </div>
            <div className="p6-content">
              <div className="p6-label">06 / Let&apos;s work together</div>
              <h2 className="p6-headline">
                Ready to
                <br />
                <em>Think outside of the box?</em>
              </h2>
              <p className="p6-tagline">
                If you&apos;re building something ambitious and need the right
                creative direction behind it, let&apos;s connect.
              </p>
              <a href="mailto:nikole@nikoleglenn.com" className="p6-email">
                Email me
              </a>
              <Link to="/inquire" className="p6-inquire">
                Project inquiry form
              </Link>
              <div className="p6-social">
                <a
                  href="https://www.instagram.com/nikoles_soles/"
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  Instagram
                </a>
                <Link to="/portfolio" className="social-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                    <path d="M12 19l-7-7 7-7M19 12H5" />
                  </svg>
                  Full portfolio
                </Link>
                <button
                  type="button"
                  className="social-link"
                  onClick={() => goToPanel(5)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M6 20v-1a6 6 0 0112 0v1" />
                  </svg>
                  About
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {isInstagramOpen ? (
        <div
          className="pam-ig-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pam-ig-title"
          onClick={() => setIsInstagramOpen(false)}
        >
          <div
            className="pam-ig-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="pam-ig-close"
              onClick={() => setIsInstagramOpen(false)}
              aria-label="Close Instagram feed"
            >
              ×
            </button>
            <h2 id="pam-ig-title" className="pam-ig-title">
              See the Latest on IG
            </h2>
            <InstagramFeed />
            <a
              href="https://www.instagram.com/nikoles_soles/"
              className="pam-ig-follow"
              target="_blank"
              rel="noopener noreferrer"
            >
              Follow @nikoles_soles →
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
