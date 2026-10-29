import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Layers, Sliders, Scale } from 'lucide-react';

const TABS = [
  { id: 'landing', label: 'Overview & Research', icon: Layers },
  { id: 'workbench', label: 'Interactive Workbench', icon: Sliders },
  { id: 'compare', label: '3-Design Trade-offs', icon: Scale },
];

/**
 * VoltNexus Liquid-Morphing Navigation Dock
 * Compliant with:
 * - Dynamic pixel-exact icon center detection
 * - SVG Gooey Filter (organic fluid bridge & surface tension)
 * - Restrained amber/orange ambient radiance & specular drop sheen
 * - Dual Interaction: Click-to-select & Drag-to-select with nearest-tab magnetic snap
 * - Fluid velocity-based horizontal stretch & vertical squash
 * - Full responsive resize observer & reduced-motion support
 */
export default function LiquidNavbar({ activeTab, onChange }) {
  const containerRef = useRef(null);
  const tabRefs = useRef({});
  const iconRefs = useRef({});
  const [tabGeometry, setTabGeometry] = useState([]);

  // Physics & Animation state
  const animRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    vx: 0,
    originX: 0,
    isAnimating: false,
    isDragging: false,
    hasDragged: false,
    dragStartX: 0,
    beadStartX: 0,
    lastPointerX: 0,
    lastTime: 0,
    stretch: 1,
    stretchY: 1,
    bridgeOpacity: 0,
    bridgeLeft: 0,
    bridgeWidth: 0,
  });

  const [, setRenderTrigger] = useState(0);
  const [hoveredTabId, setHoveredTabId] = useState(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);
    const handler = (e) => setIsReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Compute exact pixel geometry of tabs and icons
  const measureTabs = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    
    const geom = TABS.map((tab) => {
      const tabEl = tabRefs.current[tab.id];
      const iconEl = iconRefs.current[tab.id];
      if (!tabEl) return { id: tab.id, left: 0, width: 0, height: 0, iconCenterX: 0, iconCenterY: 0 };
      
      const tabRect = tabEl.getBoundingClientRect();
      let iconCenterX = tabRect.left - containerRect.left + 22;
      let iconCenterY = tabRect.top - containerRect.top + tabRect.height / 2;

      if (iconEl) {
        const iconRect = iconEl.getBoundingClientRect();
        iconCenterX = iconRect.left - containerRect.left + iconRect.width / 2;
        iconCenterY = iconRect.top - containerRect.top + iconRect.height / 2;
      }

      return {
        id: tab.id,
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
        height: tabRect.height,
        iconCenterX,
        iconCenterY,
      };
    });

    setTabGeometry(geom);

    const activeGeom = geom.find((g) => g.id === activeTab);
    if (activeGeom && !animRef.current.isAnimating && !animRef.current.isDragging) {
      animRef.current.x = activeGeom.iconCenterX;
      animRef.current.y = activeGeom.iconCenterY;
      animRef.current.targetX = activeGeom.iconCenterX;
      animRef.current.targetY = activeGeom.iconCenterY;
      animRef.current.originX = activeGeom.iconCenterX;
      setRenderTrigger((v) => v + 1);
    }
  }, [activeTab]);

  useEffect(() => {
    measureTabs();
    const ro = new ResizeObserver(() => measureTabs());
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', measureTabs);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measureTabs);
    };
  }, [measureTabs]);

  // Spring Physics Animation Loop
  const startSpringLoop = useCallback(() => {
    if (animRef.current.isAnimating) return;
    animRef.current.isAnimating = true;

    const tick = () => {
      const s = animRef.current;
      if (!s.isAnimating) return;

      if (!s.isDragging) {
        const k = 0.17; // Spring stiffness
        const damping = 0.72; // Smooth settling damping
        const diffX = s.targetX - s.x;
        s.vx = (s.vx + diffX * k) * damping;
        s.x += s.vx;

        // Fluid horizontal elongation
        const speed = Math.abs(s.vx);
        const maxStretch = 1.45;
        const stretchFactor = 1 + Math.min(speed * 0.042, maxStretch - 1);
        s.stretch = stretchFactor;
        s.stretchY = 1 / Math.sqrt(stretchFactor);

        // Fluid liquid bridge between origin and current position
        const originDist = Math.abs(s.x - s.originX);
        if (originDist > 3 && originDist < 96) {
          s.bridgeOpacity = Math.max(0, 1 - originDist / 96);
          s.bridgeLeft = Math.min(s.x, s.originX);
          s.bridgeWidth = originDist;
        } else {
          s.bridgeOpacity = 0;
        }

        // Settling threshold check
        if (Math.abs(diffX) < 0.2 && speed < 0.2) {
          s.x = s.targetX;
          s.vx = 0;
          s.stretch = 1;
          s.stretchY = 1;
          s.bridgeOpacity = 0;
          s.isAnimating = false;
          setRenderTrigger((v) => v + 1);
          return;
        }
      }

      setRenderTrigger((v) => v + 1);
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, []);

  // Sync when activeTab changes
  useEffect(() => {
    if (tabGeometry.length === 0) return;
    const target = tabGeometry.find((g) => g.id === activeTab);
    if (!target) return;

    if (isReducedMotion) {
      animRef.current.x = target.iconCenterX;
      animRef.current.y = target.iconCenterY;
      animRef.current.targetX = target.iconCenterX;
      animRef.current.targetY = target.iconCenterY;
      animRef.current.originX = target.iconCenterX;
      setRenderTrigger((v) => v + 1);
      return;
    }

    if (Math.abs(animRef.current.targetX - target.iconCenterX) > 1) {
      animRef.current.originX = animRef.current.x;
      animRef.current.targetX = target.iconCenterX;
      animRef.current.targetY = target.iconCenterY;
      startSpringLoop();
    }
  }, [activeTab, tabGeometry, isReducedMotion, startSpringLoop]);

  // Click handler
  const handleTabSelect = (tabId) => {
    if (animRef.current.hasDragged) return;
    const target = tabGeometry.find((g) => g.id === tabId);
    if (!target) return;

    animRef.current.originX = animRef.current.x;
    animRef.current.targetX = target.iconCenterX;
    animRef.current.targetY = target.iconCenterY;
    if (tabId !== activeTab) {
      onChange(tabId);
    }
    startSpringLoop();
  };

  // Drag-to-select Pointer Handlers
  const handlePointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const s = animRef.current;
    s.isDragging = true;
    s.hasDragged = false;
    s.dragStartX = e.clientX;
    s.beadStartX = s.x;
    s.lastPointerX = e.clientX;
    s.lastTime = performance.now();
    s.originX = s.x;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignored
    }

    startSpringLoop();
  };

  const handlePointerMove = (e) => {
    const s = animRef.current;
    if (!s.isDragging) return;

    const deltaX = e.clientX - s.dragStartX;
    if (Math.abs(deltaX) > 4) {
      s.hasDragged = true;
    }

    const now = performance.now();
    const dt = Math.max(1, now - s.lastTime);
    const v = (e.clientX - s.lastPointerX) / dt;
    s.lastPointerX = e.clientX;
    s.lastTime = now;

    if (tabGeometry.length > 0) {
      const minX = tabGeometry[0].iconCenterX - 6;
      const maxX = tabGeometry[tabGeometry.length - 1].iconCenterX + 6;
      const newX = Math.max(minX, Math.min(maxX, s.beadStartX + deltaX));
      s.x = newX;

      // Elastic deformation proportional to velocity
      const stretch = 1 + Math.min(Math.abs(v) * 0.11, 0.52);
      s.stretch = stretch;
      s.stretchY = 1 / Math.sqrt(stretch);

      // Liquid bridge follows drag pull
      const dragDist = Math.abs(newX - s.originX);
      if (dragDist > 4 && dragDist < 100) {
        s.bridgeOpacity = Math.max(0, 1 - dragDist / 100);
        s.bridgeLeft = Math.min(newX, s.originX);
        s.bridgeWidth = dragDist;
      } else {
        s.bridgeOpacity = 0;
      }

      // Proximity detection for preview
      let closest = tabGeometry[0];
      let minDist = Infinity;
      tabGeometry.forEach((g) => {
        const d = Math.abs(g.iconCenterX - newX);
        if (d < minDist) {
          minDist = d;
          closest = g;
        }
      });
      if (closest && closest.id !== hoveredTabId) {
        setHoveredTabId(closest.id);
      }
    }
  };

  const handlePointerUp = (e) => {
    const s = animRef.current;
    if (!s.isDragging) return;

    s.isDragging = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }

    if (s.hasDragged && tabGeometry.length > 0) {
      // Snap to nearest tab
      let closest = tabGeometry[0];
      let minDist = Infinity;
      tabGeometry.forEach((g) => {
        const d = Math.abs(g.iconCenterX - s.x);
        if (d < minDist) {
          minDist = d;
          closest = g;
        }
      });

      s.targetX = closest.iconCenterX;
      s.targetY = closest.iconCenterY;
      setHoveredTabId(null);
      if (closest.id !== activeTab) {
        onChange(closest.id);
      }
    }

    // Reset drag flag after short delay so button click won't re-trigger
    setTimeout(() => {
      s.hasDragged = false;
    }, 50);

    startSpringLoop();
  };

  const currentX = animRef.current.x;
  const currentY = animRef.current.y || 20;
  const currentStretch = animRef.current.stretch;
  const currentStretchY = animRef.current.stretchY;
  const bridgeOpacity = animRef.current.bridgeOpacity;
  const bridgeLeft = animRef.current.bridgeLeft;
  const bridgeWidth = animRef.current.bridgeWidth;
  const isMoving = animRef.current.isAnimating || animRef.current.isDragging;

  return (
    <div className="relative select-none">
      {/* SVG Gooey Filter Specification */}
      <svg className="absolute w-0 h-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="liquid-bead-goo" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5.2" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 19 -8.5"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Main Navigation Dock Bar */}
      <nav
        ref={containerRef}
        role="tablist"
        aria-label="VoltNexus Main Subsystems"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative flex items-center gap-1.5 p-1 rounded-xl bg-[#14191f] border border-[#232c37] shadow-inner shadow-black/50 touch-none overflow-hidden cursor-grab active:cursor-grabbing"
      >
        {/* ======================================================== */}
        {/* LAYER 1: LIQUID SUBSTRATE (Morphing Gooey Channel)       */}
        {/* ======================================================== */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{ filter: isReducedMotion ? 'none' : 'url(#liquid-bead-goo)' }}
        >
          {/* Base liquid dock discs at each icon position */}
          {tabGeometry.map((geom) => {
            const isTabActive = geom.id === activeTab;
            return (
              <div
                key={`dock-${geom.id}`}
                className="absolute rounded-full transition-opacity duration-300"
                style={{
                  width: '26px',
                  height: '26px',
                  left: `${geom.iconCenterX}px`,
                  top: `${geom.iconCenterY}px`,
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: isTabActive ? '#ea580c' : 'rgba(234, 88, 12, 0.2)',
                  opacity: isTabActive ? 0.95 : 0.28,
                }}
              />
            );
          })}

          {/* Morphing Liquid Bridge between origin and bead */}
          {isMoving && bridgeOpacity > 0.05 && (
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${bridgeLeft}px`,
                top: `${currentY}px`,
                width: `${Math.max(16, bridgeWidth)}px`,
                height: '18px',
                transform: 'translateY(-50%)',
                backgroundColor: '#ea580c',
                opacity: bridgeOpacity * 0.9,
              }}
            />
          )}

          {/* Liquid Bead Body */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: '32px',
              height: '32px',
              left: `${currentX}px`,
              top: `${currentY}px`,
              transform: `translate(-50%, -50%) scale(${currentStretch}, ${currentStretchY})`,
              backgroundColor: '#ea580c',
            }}
          />
        </div>

        {/* ======================================================== */}
        {/* LAYER 2: GLOWING CHROMATIC BEAD & RADIANCE OVERLAY       */}
        {/* ======================================================== */}
        <div
          className="absolute pointer-events-none z-10 rounded-full"
          style={{
            width: '33px',
            height: '33px',
            left: `${currentX}px`,
            top: `${currentY}px`,
            transform: `translate(-50%, -50%) scale(${currentStretch}, ${currentStretchY})`,
            background: 'radial-gradient(circle at 35% 30%, #ffedd5 0%, #fb923c 28%, #ea580c 70%, #9a3412 100%)',
            boxShadow: `
              0 0 16px 2px rgba(234, 88, 12, 0.7),
              0 0 32px 5px rgba(249, 115, 22, 0.35),
              inset 0 1.5px 2px rgba(255, 255, 255, 0.65),
              inset 0 -2px 3px rgba(0, 0, 0, 0.45)
            `,
            opacity: isReducedMotion ? 0 : 0.96,
          }}
        >
          {/* Subtle Specular Highlight */}
          <div className="absolute top-1 left-2 w-2.5 h-1 rounded-full bg-white/70 blur-[0.4px] rotate-[-15deg] pointer-events-none" />
        </div>

        {/* ======================================================== */}
        {/* LAYER 3: CRISP TABS, ICONS & LABELS (High Contrast)      */}
        {/* ======================================================== */}
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isHovered = hoveredTabId === tab.id;

          return (
            <button
              key={tab.id}
              ref={(el) => (tabRefs.current[tab.id] = el)}
              role="tab"
              aria-selected={isActive}
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                handleTabSelect(tab.id);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleTabSelect(tab.id);
                }
              }}
              className={`relative z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 select-none ${
                isActive
                  ? 'text-white font-bold bg-orange-950/20 border border-orange-500/25 shadow-sm'
                  : isHovered
                  ? 'text-slate-200 bg-[#1c232c]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a2027]/70'
              }`}
            >
              {/* Icon Container with Ref for exact centering */}
              <span
                ref={(el) => (iconRefs.current[tab.id] = el)}
                className={`relative z-30 flex items-center justify-center w-4 h-4 transition-transform duration-200 ${
                  isActive ? 'text-white scale-110 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]' : 'text-slate-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </span>

              {/* Tab Label */}
              <span className="relative z-30 tracking-tight whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
