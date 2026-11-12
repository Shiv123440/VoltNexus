import React, { useState, useEffect } from 'react';
import {
  BatteryCharging,
  Layers,
  Sliders,
  Box,
  Scale,
  Download,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'landing', label: 'Overview', icon: Layers, keyHint: '1' },
  { id: 'workbench', label: 'Interactive Workbench', icon: Sliders, keyHint: '2' },
  { id: 'cadTwin', label: '3D CAD Twin', icon: Box, keyHint: '3' },
  { id: 'compare', label: 'Design Trade-Offs', icon: Scale, keyHint: '4' }
];

const SIDEBAR_STORAGE_KEY = 'vn_sidebar_collapsed';

export default function Sidebar({
  activeTab,
  onSelectTab,
  onOpenReport,
  failCount = 0
}) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (saved !== null) return saved === 'true';
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed));
    }
  }, [collapsed]);

  const handleNavigate = (tabId) => {
    onSelectTab(tabId);
    setMobileOpen(false);
  };

  const activeItem = NAV_ITEMS.find((item) => item.id === activeTab) || NAV_ITEMS[0];

  const renderSidebarBody = (isCollapsed, isMobileDrawer = false) => (
    <div className="flex flex-col h-full bg-[#2B2D31] text-[#D9DADC] select-none">
      {/* 1. Brand Section */}
      <div
        className={`flex items-center ${
          isCollapsed ? 'justify-center px-2 py-4' : 'justify-between px-4 py-4'
        } border-b border-white/10 shrink-0`}
      >
        <button
          type="button"
          onClick={() => handleNavigate('landing')}
          className={`flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none ${
            isCollapsed ? 'justify-center' : 'min-w-0'
          }`}
          title="VoltNexus — Battery Digital Twin Studio"
        >
          <div className="relative w-9 h-9 rounded-xl bg-[#FFC93C] flex items-center justify-center text-[#2B2D31] shadow-xs shrink-0 group-hover:brightness-105 transition-all">
            <BatteryCharging className="w-5 h-5" strokeWidth={2.2} />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-bold tracking-tight text-white truncate">
                  VoltNexus
                </span>
                <span className="text-[10px] font-mono font-semibold text-[#2B2D31] bg-[#FFC93C] px-1.5 py-0.5 rounded-md leading-none">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-[#D9DADC]/70 font-medium truncate mt-0.5">
                Battery Digital Twin Studio
              </p>
            </div>
          )}
        </button>

        {isMobileDrawer ? (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-[#D9DADC]/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close navigation menu"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          !isCollapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="p-1.5 rounded-lg text-[#D9DADC]/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )
        )}
      </div>

      {/* Expand Trigger Row when Collapsed on Desktop/Tablet */}
      {!isMobileDrawer && isCollapsed && (
        <div className="px-2 pt-3 pb-1 flex justify-center shrink-0">
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="w-10 h-9 rounded-lg flex items-center justify-center text-[#D9DADC]/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Main Navigation Group */}
      <nav
        aria-label="Primary Workspace Navigation"
        className="flex-1 overflow-y-auto px-2.5 py-4 space-y-1"
      >
        {!isCollapsed && (
          <div className="px-2.5 pb-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#D9DADC]/50">
            Workspace
          </div>
        )}

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigate(item.id)}
              title={isCollapsed ? `${item.label} (Key ${item.keyHint})` : undefined}
              aria-current={isActive ? 'page' : undefined}
              className={`relative w-full flex items-center ${
                isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2.5'
              } rounded-xl text-[13px] transition-all duration-150 cursor-pointer group ${
                isActive
                  ? 'bg-white/10 text-white font-semibold ring-1 ring-white/15'
                  : 'text-[#D9DADC]/80 font-medium hover:bg-white/5 hover:text-white'
              }`}
            >
              {/* Left Accent Indicator */}
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#FFC93C]"
                />
              )}

              <span className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5 min-w-0'}`}>
                <Icon
                  className={`w-[17px] h-[17px] shrink-0 transition-colors ${
                    isActive
                      ? 'text-[#FFC93C]'
                      : 'text-[#D9DADC]/70 group-hover:text-white'
                  }`}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </span>

              {!isCollapsed && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded border transition-colors ${
                    isActive
                      ? 'bg-[#FFC93C] text-[#2B2D31] border-[#FFC93C] font-bold'
                      : 'bg-white/5 text-[#D9DADC]/60 border-transparent group-hover:text-white'
                  }`}
                >
                  {item.keyHint}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* 3. Bottom Utility Section */}
      <div className="shrink-0 border-t border-white/10 p-3 space-y-2.5">
        {/* Live MBSE Compliance Status */}
        <div
          title={
            failCount === 0
              ? 'System Status: All 13 MBSE Rules Pass'
              : `System Status: ${failCount} Rule Conflicts Detected`
          }
          className={`flex items-center ${
            isCollapsed ? 'justify-center p-2' : 'justify-between px-3 py-2'
          } rounded-xl border text-[11px] font-mono font-semibold ${
            failCount === 0
              ? 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300'
              : 'bg-rose-500/15 border-rose-400/30 text-rose-300'
          }`}
        >
          <span className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                failCount === 0 ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400 animate-pulse'
              }`}
            />
            {!isCollapsed && (
              <span>
                {failCount === 0
                  ? 'ALL 13 PASS'
                  : `${failCount} CONFLICT${failCount === 1 ? '' : 'S'}`}
              </span>
            )}
          </span>
          {!isCollapsed && (
            <span className="text-[10px] opacity-75">LIVE</span>
          )}
        </div>

        {/* Export Verification Report CTA */}
        <button
          type="button"
          onClick={() => {
            setMobileOpen(false);
            onOpenReport();
          }}
          title={isCollapsed ? 'Export Verification Report' : undefined}
          className={`w-full flex items-center justify-center gap-2 ${
            isCollapsed ? 'p-2.5' : 'px-3 py-2.5'
          } rounded-xl bg-[#FFC93C] hover:brightness-105 text-[#2B2D31] text-xs font-bold shadow-xs transition-all active:scale-[0.99] cursor-pointer`}
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          {!isCollapsed && <span>Export Report</span>}
        </button>

        {/* Version Footnote */}
        {!isCollapsed ? (
          <div className="pt-1 px-1 flex items-center justify-between text-[10px] font-mono text-[#D9DADC]/50">
            <span>MBSE Studio v2.0</span>
            <span>1-RC ECM</span>
          </div>
        ) : (
          <div className="text-center text-[9px] font-mono text-[#D9DADC]/50">
            v2.0
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Compact Drawer Bar (< md only) */}
      <div className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-2.5 bg-[#2B2D31] text-[#D9DADC] border-b border-white/10 no-print">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-1 rounded-lg text-[#D9DADC] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Open navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#FFC93C] flex items-center justify-center text-[#2B2D31] shrink-0">
              <BatteryCharging className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white leading-tight truncate">
                VoltNexus
              </div>
              <div className="text-[10px] font-mono text-[#FFC93C] truncate">
                {activeItem.label}
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenReport}
          className="px-2.5 py-1.5 rounded-lg bg-[#FFC93C] text-[#2B2D31] text-[11px] font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Download className="w-3 h-3" />
          <span>Report</span>
        </button>
      </div>

      {/* Mobile Slide-Out Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex no-print">
          <div
            className="fixed inset-0 bg-[#2B2D31]/60 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside
            aria-label="Mobile Navigation Sidebar"
            className="relative w-[260px] max-w-[82vw] h-full border-r border-white/10 shadow-xl z-10"
          >
            {renderSidebarBody(false, true)}
          </aside>
        </div>
      )}

      {/* Desktop & Tablet Persistent Left Vertical Sidebar */}
      <aside
        aria-label="Primary Sidebar"
        className={`hidden md:flex flex-col shrink-0 h-screen sticky top-0 border-r border-white/10 transition-[width] duration-200 ease-out no-print z-20 ${
          collapsed ? 'w-[72px]' : 'w-[256px]'
        }`}
      >
        {renderSidebarBody(collapsed, false)}
      </aside>
    </>
  );
}
