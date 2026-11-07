# VoltNexus Design System & Art Direction (Awwwards Grade)

## Concept Card
```
Idea:        A mission-critical battery engineering digital twin that bridges aerospace instrumentation and high-precision electro-thermal physics.
Metaphor:    The high-vacuum scientific test cell: a dark obsidian chamber where physical multi-physics phenomena (ion kinetics, thermal dissipation, current crowding) are observed through multi-tier optical glass panels.
Signature:   Tiered dark graphite frosted glass with an active CAD circuit substrate and instantaneous (<100ms) multi-physics feedback.
Emotion:     Surgical precision, scientific credibility, and executive computational elegance.
Motion verb: "Resonate like a precision instrument" — smooth, damped mechanical response, subtle idle energy breathing, specular edge illumination on hover.
Screenshot:  The 16S10P interactive workbench with real-time gradient telemetry, 3D module viewport, and live 13-rule compliance checker on dark obsidian glass.
```

## Art Direction System

### 1. Palette Tokens (Dark Precision Glass)
- `--ground`: `#070A12` (deep obsidian space)
- `--panel-ground`: `rgba(11, 16, 27, 0.70)` (55–75% transparency dark graphite)
- `--card-ground`: `rgba(15, 23, 42, 0.62)` (interactive component glass)
- `--well-ground`: `rgba(6, 10, 18, 0.80)` (recessed inputs, tables, chart wells)
- `--glass-border`: `rgba(255, 255, 255, 0.10)` (specular 1px translucent rim)
- `--glass-border-hover`: `rgba(6, 182, 212, 0.45)` (active cyan edge illumination)
- `--glass-highlight`: `inset 0 1px 0 rgba(255, 255, 255, 0.12)` (delicate top edge gleam)
- `--ink-primary`: `#F8FAFC` (crisp white typography, 100% legibility)
- `--ink-secondary`: `#94A3B8` (cool technical slate for descriptions & labels)
- `--ink-muted`: `#64748B` (subtle units, coordinate grid, background CAD)
- `--accent-cyan`: `#06B6D4` / `#22D3EE` (BMS sensing, active indicators, live telemetry)
- `--accent-electric-blue`: `#2563EB` / `#3B82F6` (primary high-voltage energy flows)
- `--accent-amber`: `#F59E0B` (thermal caution, WARN status)
- `--accent-emerald`: `#10B981` (PASS status, optimal Pareto indicators)
- `--accent-rose`: `#F43F5E` (FAIL status, cutoff alarms, lithium-plating boundary)

### 2. Typography & Numerical Hierarchy
- **Primary Interface**: Inter / System Neo-Grotesk (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`) with tight optical tracking (`tracking-tight`).
- **Telemetry & Numerical Data**: Monospace with tabular numerals (`font-mono tabular-nums tracking-tight`) for all voltages ($V$), currents ($A$), temperatures ($^\circ\text{C}$), internal resistances ($\text{m}\Omega$), and energy values ($\text{kWh}$).
- **Display Headlines**: Weighted neo-grotesk with negative tracking (`-0.03em`) and balanced text wrapping.

### 3. Glassmorphism Tiered Hierarchy
1. **Tier 1: Major Workspace Panels & Hero**: `rgba(11, 16, 27, 0.72)` + `backdrop-filter: blur(24px) saturate(140%)` + `border: 1px solid rgba(255, 255, 255, 0.12)`.
2. **Tier 2: Metric Tiles & Configuration Blocks**: `rgba(15, 23, 42, 0.62)` + `backdrop-filter: blur(18px)` + `border: 1px solid rgba(255, 255, 255, 0.09)`.
3. **Tier 3: Floating Controls & Navigation Capsule**: `rgba(10, 15, 26, 0.78)` + `backdrop-filter: blur(20px)` + `border: 1px solid rgba(255, 255, 255, 0.14)`.
4. **Tier 4: Recessed Data Wells (Tables, Inputs, Charts)**: `rgba(6, 10, 18, 0.80)` + `backdrop-filter: blur(12px)` + `border: 1px solid rgba(255, 255, 255, 0.07)`.

### 4. Motion & Micro-Interactions
- **Idle State**: Background circuit substrate pulses continuously at 12s–18s period with soft cyan and electric-blue energy vectors.
- **Hover Transitions**: Smooth 200–250ms cubic-bezier transition (`cubic-bezier(0.16, 1, 0.3, 1)`): card background elevates from 62% to 75% opacity, border lights up with cyan specular tint, and subtle vertical translation (-2px to -3px).
- **Reduced Motion**: Full support via `@media (prefers-reduced-motion: reduce)` with zero animation latency and clean static presentation.
