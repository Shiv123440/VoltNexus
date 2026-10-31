import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useSystemBoot
 * Coordinates the cinematic opening activation sequence on initial load.
 * Stage 0: Initial state (only background active, UI hidden)
 * Stage 1: Navbar expansion, logo & status reveal (~600ms)
 * Stage 2: Hero headline, description & 3D Battery module rise (~1000ms)
 * Stage 3: Primary CTA button, frozen specs & full interactive state (~1400ms)
 */
export function useSystemBoot(bootDelay = 500) {
  const [bootStage, setBootStage] = useState(0);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setBootStage(3);
      return;
    }

    const t1 = setTimeout(() => setBootStage(1), bootDelay);
    const t2 = setTimeout(() => setBootStage(2), bootDelay + 400);
    const t3 = setTimeout(() => setBootStage(3), bootDelay + 850);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [bootDelay]);

  return bootStage;
}

/**
 * useMouseParallax
 * High-performance, lerp-damped cursor parallax hook for desktop browsers.
 * Automatically disabled on mobile/touch devices.
 */
export function useMouseParallax(strength = 1) {
  const [coords, setCoords] = useState({ x: 0, y: 0, rawX: 0, rawY: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(null);
  const isTouchRef = useRef(false);

  useEffect(() => {
    // Detect touch / coarse pointer
    isTouchRef.current = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (isTouchRef.current) return;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      // Normalized between -1 and 1
      const normX = ((e.clientX / innerWidth) - 0.5) * 2;
      const normY = ((e.clientY / innerHeight) - 0.5) * 2;
      targetRef.current = { x: normX * strength, y: normY * strength };
    };

    const handleMouseLeave = () => {
      targetRef.current = { x: 0, y: 0 };
    };

    // Smooth lerp loop
    const updateMotion = () => {
      const lerpFactor = 0.08;
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * lerpFactor;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * lerpFactor;

      setCoords({
        x: Math.round(currentRef.current.x * 1000) / 1000,
        y: Math.round(currentRef.current.y * 1000) / 1000,
        rawX: targetRef.current.x,
        rawY: targetRef.current.y,
      });

      frameRef.current = requestAnimationFrame(updateMotion);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    frameRef.current = requestAnimationFrame(updateMotion);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [strength]);

  return coords;
}

/**
 * useScrollReveal
 * Triggers entrance animation when element scrolls into viewport threshold.
 */
export function useScrollReveal(threshold = 0.15, rootMargin = '0px 0px -50px 0px') {
  const [isRevealed, setIsRevealed] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, isRevealed];
}

/**
 * useScrollThreshold
 * High-performance, hysteresis-damped scroll hook for responsive navbar transitions.
 * Prevents rapid flickering around the scroll boundary with requestAnimationFrame throttling.
 *
 * @param {number} threshold - Scroll Y position (in px) to activate scrolled state (default: 55)
 * @param {number} hysteresis - Deadband offset (in px) required to reverse back to top (default: 20)
 * @returns {boolean} isScrolled
 */
export function useScrollThreshold(threshold = 55, hysteresis = 20) {
  const isQueryScrolled = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('scrolled') === '1';
  const [isScrolled, setIsScrolled] = useState(isQueryScrolled);

  useEffect(() => {
    if (isQueryScrolled) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY || document.documentElement.scrollTop;
          setIsScrolled((prev) => {
            if (!prev && currentY > threshold) return true;
            if (prev && currentY < threshold - hysteresis) return false;
            return prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, hysteresis, isQueryScrolled]);

  return isScrolled;
}
