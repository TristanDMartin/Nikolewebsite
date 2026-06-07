import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import '../app-inner-cursor.css';

export default function AppInnerCursor() {
  const { pathname } = useLocation();
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const ringRef = useRef({ x: 0, y: 0 });

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
    const ringPos = ringRef.current;
    const animateRing = () => {
      if (isCancelled) {
        return;
      }
      ringPos.x += (mouseRef.current.x - ringPos.x) * 0.12;
      ringPos.y += (mouseRef.current.y - ringPos.y) * 0.12;
      if (cursorRingRef.current) {
        cursorRingRef.current.style.left = `${ringPos.x}px`;
        cursorRingRef.current.style.top = `${ringPos.y}px`;
      }
      requestAnimationFrame(animateRing);
    };
    const id = requestAnimationFrame(animateRing);
    return () => {
      isCancelled = true;
      cancelAnimationFrame(id);
    };
  }, []);

  useEffect(() => {
    const selector =
      '.page--portfolio-experience a, .page--portfolio-experience button, .page--portfolio-experience .portfolio-case-gallery-card, .page--portfolio-experience input, .page--portfolio-experience textarea, .page--portfolio-experience select';
    const expandables = document.querySelectorAll(selector);
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
  }, [pathname]);

  return (
    <>
      <div
        className="app-inner-cursor-dot"
        ref={cursorDotRef}
        aria-hidden="true"
      />
      <div
        className="app-inner-cursor-ring"
        ref={cursorRingRef}
        aria-hidden="true"
      />
    </>
  );
}
