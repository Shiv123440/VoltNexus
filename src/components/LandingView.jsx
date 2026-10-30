import React from 'react';
import { 
  Cpu, 
  Flame, 
  ShieldAlert, 
  Layers, 
  ArrowRight, 
  FileText,
  Activity,
  Sparkles
} from 'lucide-react';
import BatteryModule3D from './ui/BatteryModule3D';
import { useScrollReveal } from './ui/useCinematicMotion';

export default function LandingView({ 
  onNavigateToWorkbench, 
  bootStage = 3, 
  mouseCoords = { x: 0, y: 0 } 
}) {
  // Scroll reveal triggers for Section 2 (Problem) and Section 3 (Research)
  const [problemSectionRef, isProblemRevealed] = useScrollReveal(0.12);
  const [researchSectionRef, isResearchRevealed] = useScrollReveal(0.12);

  // Staged entrance flags
  const stage1 = bootStage >= 1;
  const stage2 = bootStage >= 2;
  const stage3 = bootStage >= 3;

  return (
    <div className="space-y-16 pb-20">
      {/* ======================================================== */}
      {/* 1. CINEMATIC HERO SECTION & 3D BATTERY MODULE REVEAL     */}
      {/* ======================================================== */}
      <section className="relative rounded-3xl glass-panel-hero p-6 sm:p-8 md:p-12 overflow-hidden">
        {/* Ambient Top Glow Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-orange-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />

        {/* 2-Column Responsive Layout: Left Hero Text + Right 3D Battery Module */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Hero Typography & 3D Action CTA (Cols 1-7) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Subtitle Pill */}
            <div 
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-950/60 border border-orange-500/35 text-orange-400 text-xs font-mono tracking-wide shadow-sm transition-all duration-700 ${
                stage1 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-400" />
              </span>
              <span>TATA ELXSI TELIPORT S4 — CASE STUDY 2 (IDV)</span>
            </div>

            {/* Step 2: Branding & Main Headline */}
            <div className="space-y-3">
              <div 
                className={`transition-all duration-700 delay-100 ${
                  stage2 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-6 pointer-events-none'
                }`}
              >
                <img 
                  src="/voltnexus_logo_transparent.png" 
                  alt="VoltNexus" 
                  className="h-12 sm:h-15 w-auto object-contain filter drop-shadow-[0_4px_12px_rgba(244,119,33,0.3)]" 
                />
              </div>

              <h1 
                className={`text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-100 leading-[1.15] transition-all duration-800 delay-200 ${
                  stage2 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-6 pointer-events-none'
                }`}
              >
                Reusable Digital MBSE Platform for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-amber-100 drop-shadow-sm">
                  Battery Energy Systems
                </span>
              </h1>
            </div>

            {/* Step 3: Description Paragraph */}
            <p 
              className={`text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl transition-all duration-800 delay-300 ${
                stage2 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-6 pointer-events-none'
              }`}
            >
              Virtually configure, test, and cross-validate battery module designs across electrical, thermal, 
              protection, sensing, and control boundaries. Eliminates late-stage physical prototyping failures by detecting 
              hidden cross-subsystem interface conflicts in sub-second runtimes.
            </p>

            {/* Step 4: 3D Push-Button CTA & Frozen Specs Badge */}
            <div 
              className={`flex flex-wrap items-center gap-4 pt-2 transition-all duration-700 delay-400 ${
                stage3 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-6 pointer-events-none'
              }`}
            >
              <div className="voltnexus-3d-button">
                <button
                  type="button"
                  onClick={onNavigateToWorkbench}
                  className="voltnexus-primary-cta"
                  aria-label="Open Interactive Workbench"
                >
                  <span>Open Interactive Workbench</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <div className="text-xs text-slate-300 font-mono px-3.5 py-2.5 rounded-xl glass-card-subtle flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Frozen Scope: 46.8V Nom, 1.57 kWh (13S8P NMC) • 35°C Ambient</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Battery Module Digital Twin Reveal (Cols 8-12) */}
          <div className="lg:col-span-5 flex justify-center">
            <BatteryModule3D 
              bootStage={bootStage} 
              mouseCoords={mouseCoords} 
            />
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. THE ENGINEERING PROBLEM: "NOMINAL SIZING" TRAP         */}
      {/* ======================================================== */}
      <section 
        ref={problemSectionRef} 
        className="space-y-6 relative"
      >
        {/* Section Header */}
        <div 
          className={`flex flex-wrap items-center justify-between gap-3 transition-all duration-700 ${
            isProblemRevealed 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
              The Engineering Problem: The "Nominal Sizing" Trap
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Why traditional nominal battery calculators miss critical real-world failure modes
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-950/40 border border-amber-500/35 px-3.5 py-1.5 rounded-full shadow-sm">
            Problem Understanding (15%)
          </span>
        </div>

        {/* 4 Multi-Disciplinary Failure Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Cell-to-Cell Variation */}
          <div 
            className={`p-6 rounded-2xl glass-card-standard space-y-3 relative overflow-hidden group hover:border-amber-500/40 card-lift-3d transition-all duration-700 delay-100 ${
              isProblemRevealed 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-6'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shadow-sm">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-200">1. Cell-to-Cell Variation</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Manufacturing tolerances make every cell physically unique. While nominal tools assume identical cells, real cells exhibit:
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside font-mono">
              <li>Capacity spread: σQ = 1.5% [A]</li>
              <li>DCIR resistance spread: σR = 3.0% [A]</li>
              <li>Weakest-cell series bottleneck terminates usable pack capacity prematurely (Zhou et al., 2017)</li>
            </ul>
          </div>

          {/* Card 2: Non-Uniform Thermal Gradients */}
          <div 
            className={`p-6 rounded-2xl glass-card-standard space-y-3 relative overflow-hidden group hover:border-rose-500/40 card-lift-3d transition-all duration-700 delay-200 ${
              isProblemRevealed 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-6'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400 shadow-sm">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-200">2. Non-Uniform Thermal Gradients</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Coolant temperature warms as it sweeps from inlet to outlet, creating spatial temperature gradients across the module:
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside font-mono">
              <li>Localized core hot spots exceed safe ceilings during 70A cruise discharge</li>
              <li>Imposed 10–40°C thermal gradients accelerate capacity loss trajectory by 25% ± 4% (Cloos & Wetzel, 2025)</li>
            </ul>
          </div>

          {/* Card 3: Interacting Physical Constraints */}
          <div 
            className={`p-6 rounded-2xl glass-card-standard space-y-3 relative overflow-hidden group hover:border-teal-500/40 card-lift-3d transition-all duration-700 delay-300 ${
              isProblemRevealed 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-6'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-400 shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-200">3. Interacting Physical Constraints</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Electrical, thermal, and protection limits are tightly coupled in real battery packs:
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside font-mono">
              <li>A 30% cell ΔR produces 60% peak current divergence across parallel branches (Bruen & Marco, 2016)</li>
              <li>Fuse melting I²t must stay safely below busbar adiabatic withstand k²S² (IEC 60364-5-54)</li>
            </ul>
          </div>

          {/* Card 4: Costly Prototyping Loops */}
          <div 
            className={`p-6 rounded-2xl glass-card-standard space-y-3 relative overflow-hidden group hover:border-orange-500/40 card-lift-3d transition-all duration-700 delay-400 ${
              isProblemRevealed 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-6'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-orange-400 shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-200">4. Costly Prototyping Loops</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Siloed engineering tools (CAD vs. CFD vs. SPICE vs. BMS firmware) hide integration conflicts until physical testing:
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside font-mono">
              <li>3 to 6 months of physical prototyping rework and $120k+ capex per vehicle program</li>
              <li>Up to 22% usable energy locked out by thermal derating & weakest-cell disconnect</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. 5 PEER-REVIEWED LITERATURE FOUNDATIONS                */}
      {/* ======================================================== */}
      <section 
        ref={researchSectionRef} 
        className="p-6 sm:p-8 rounded-3xl glass-card-dense space-y-6 relative overflow-hidden"
      >
        {/* Subtle Laser Accent Scanning Across Header */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-laser-scan opacity-70" />

        <div 
          className={`flex items-center justify-between gap-4 transition-all duration-700 ${
            isResearchRevealed 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="flex items-center gap-2 text-orange-400 text-xs font-mono font-bold tracking-wider">
            <FileText className="w-4 h-4" />
            <span>5 VERIFIED PEER-REVIEWED SCIENTIFIC FOUNDATIONS</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            Directly Encoded Into VoltNexus Simulation Engine
          </span>
        </div>

        {/* 6 Research & Computational Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Paper 1: Cloos & Wetzel */}
          <div 
            className={`p-4.5 rounded-2xl glass-card-subtle space-y-2 card-lift-3d transition-all duration-700 delay-100 ${
              isResearchRevealed 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="text-xs font-bold text-slate-200">Cloos & Wetzel (2025) [Energy Tech]</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Imposed 10–40°C thermal gradients accelerated capacity fade trajectory by 25% ± 4% in 20Ah pouch cells.
            </p>
            <div className="text-[10px] text-orange-400 font-mono">DOI: 10.1002/ente.202402409</div>
          </div>

          {/* Paper 2: Bruen & Marco */}
          <div 
            className={`p-4.5 rounded-2xl glass-card-subtle space-y-2 card-lift-3d transition-all duration-700 delay-200 ${
              isResearchRevealed 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="text-xs font-bold text-slate-200">Bruen & Marco (2016) [J. Power Sources]</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A 30% difference in cell impedance produces up to 60% peak current divergence across parallel cells.
            </p>
            <div className="text-[10px] text-orange-400 font-mono">DOI: 10.1016/j.jpowsour.2016.01.001</div>
          </div>

          {/* Paper 3: Zhou et al. */}
          <div 
            className={`p-4.5 rounded-2xl glass-card-subtle space-y-2 card-lift-3d transition-all duration-700 delay-300 ${
              isResearchRevealed 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="text-xs font-bold text-slate-200">Zhou et al. (2017) [J. Power Sources]</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              96S pack capacity is dictated by weakest cell reaching cutoff, not average cell capacity.
            </p>
            <div className="text-[10px] text-orange-400 font-mono">DOI: 10.1016/j.jpowsour.2017.08.033</div>
          </div>

          {/* Paper 4: Pan et al. */}
          <div 
            className={`p-4.5 rounded-2xl glass-card-subtle space-y-2 card-lift-3d transition-all duration-700 delay-400 ${
              isResearchRevealed 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="text-xs font-bold text-slate-200">Pan et al. (2020) [J. Power Sources]</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-node electro-thermal model achieves &lt;2K error while slashing computational cost by 90% vs FEM.
            </p>
            <div className="text-[10px] text-orange-400 font-mono">DOI: 10.1016/j.jpowsour.2020.228070</div>
          </div>

          {/* Paper 5: Chang et al. */}
          <div 
            className={`p-4.5 rounded-2xl glass-card-subtle space-y-2 card-lift-3d transition-all duration-700 delay-500 ${
              isResearchRevealed 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="text-xs font-bold text-slate-200">Chang et al. (2023) [Applied Energy]</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analytical mapping of cell parameter variation to pack-level statistics verified by Monte Carlo.
            </p>
            <div className="text-[10px] text-orange-400 font-mono">DOI: 10.1016/j.apenergy.2022.120275</div>
          </div>

          {/* Core Engine Card */}
          <div 
            className={`p-4.5 rounded-2xl glass-card-subtle border-orange-500/35 hover:border-orange-500/60 flex flex-col justify-center items-start space-y-2 card-lift-3d transition-all duration-700 delay-600 ${
              isResearchRevealed 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>VoltNexus Computational Core</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              5-Point Unscented Transform (UT) reproduces Monte Carlo thermal statistics in &lt;40ms (12.5x speedup).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
