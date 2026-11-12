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
    <div className="flex flex-col h-full bg-[#F1F5F9] text-slate-900 select-none">
      {/* 1. Brand Section */}
      <div
        className={`flex items-center ${
          isCollapsed ? 'justify-center px-2 py-4' : 'justify-between px-4 py-4'
        } border-b border-slate-200/80 shrink-0`}
      >
        <button
          type="button"
          onClick={() => handleNavigate('landing')}
          className={`flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none ${
            isCollapsed ? 'justify-center' : 'min-w-0'
          }`}
          title="VoltNexus — Battery Digital Twin Studio"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white shadow-xs shrink-0 group-hover:brightness-105 transition-all">
            <BatteryCharging className="w-5 h-5" strokeWidth={2.2} />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-bold tracking-tight text-slate-900 truncate">
                  VoltNexus
                </span>
                <span className="text-[10px] font-mono font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 px-1.5 py-0.5 rounded-md leading-none">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                Battery Digital Twin Studio
              </p>
            </div>
          )}
        </button>

        {isMobileDrawer ? (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-colors cursor-pointer"
            aria-label="Close navigation menu"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          !isCollapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer shrink-0"
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
            className="w-10 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-colors cursor-pointer"
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
          <div className="px-2.5 pb-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
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
                  ? 'bg-white text-blue-700 font-semibold shadow-[0_1px_2px_rgba(15,23,42,0.05)] ring-1 ring-slate-200/90'
                  : 'text-slate-600 font-medium hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              {/* Left Accent Indicator */}
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-blue-600"
                />
              )}

              <span className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5 min-w-0'}`}>
                <Icon
                  className={`w-[17px] h-[17px] shrink-0 transition-colors ${
                    isActive
                      ? 'text-blue-600'
                      : 'text-slate-500 group-hover:text-slate-800'
                  }`}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </span>

              {!isCollapsed && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded border transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border-blue-200/80'
                      : 'bg-slate-200/50 text-slate-400 border-transparent group-hover:text-slate-600'
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
      <div className="shrink-0 border-t border-slate-200/80 p-3 space-y-2.5">
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
              ? 'bg-emerald-50/90 border-emerald-200 text-emerald-700'
              : 'bg-rose-50/90 border-rose-200 text-rose-700'
          }`}
        >
          <span className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                failCount === 0 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500 animate-pulse'
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
          } rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.99] cursor-pointer`}
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          {!isCollapsed && <span>Export Report</span>}
        </button>

        {/* Version Footnote */}
        {!isCollapsed ? (
          <div className="pt-1 px-1 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>MBSE Studio v2.0</span>
            <span>1-RC ECM</span>
          </div>
        ) : (
          <div className="text-center text-[9px] font-mono text-slate-400">
            v2.0
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Compact Drawer Bar (< md only) */}
      <div className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-2.5 bg-white/95 backdrop-blur-md border-b border-slate-200 no-print">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Open navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white shrink-0">
              <BatteryCharging className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 leading-tight truncate">
                VoltNexus
              </div>
              <div className="text-[10px] font-mono text-blue-600 truncate">
                {activeItem.label}
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenReport}
          className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Download className="w-3 h-3" />
          <span>Report</span>
        </button>
      </div>

      {/* Mobile Slide-Out Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex no-print">
          <div
            className="fixed inset-0 bg-slate-900/35 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside
            aria-label="Mobile Navigation Sidebar"
            className="relative w-[260px] max-w-[82vw] h-full border-r border-slate-200 shadow-xl z-10"
          >
            {renderSidebarBody(false, true)}
          </aside>
        </div>
      )}

      {/* Desktop & Tablet Persistent Left Vertical Sidebar */}
      <aside
        aria-label="Primary Sidebar"
        className={`hidden md:flex flex-col shrink-0 h-screen sticky top-0 border-r border-slate-200/80 transition-[width] duration-200 ease-out no-print z-20 ${
          collapsed ? 'w-[72px]' : 'w-[256px]'
        }`}
      >
        {renderSidebarBody(collapsed, false)}
      </aside>
    </>
  );
}
