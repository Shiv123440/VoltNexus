import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileText
} from 'lucide-react';

export default function ExportReportModal({ isOpen, onClose, results, parameters }) {
  const [generatedTimestamp] = useState(() => new Date().toISOString());

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ parameters, results, generatedAt: generatedTimestamp }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `VoltNexus_Report_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">VoltNexus Engineering Verification Report</h2>
              <p className="text-xs text-slate-400 font-mono">Run ID: VN-MBSE-2026 • Coupled 1-RC ECM Telemetry Specification</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-cyan-400 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-white font-medium text-xs flex items-center gap-1.5 hover:bg-white/20 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-sm text-slate-200">
          {/* Executive Summary */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-2">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">1. Executive Summary</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              This verification report documents the cross-subsystem boundary validation for the <strong>VoltNexus Battery Module</strong>. 
              Simulated under the Thevenin 1-RC ECM model coupled with the Cloos & Wetzel (2025) convective duct thermal gradient and Bruen & Marco (2016) parallel current divergence formulation.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-white/5 border border-white/10">
                <span className="text-slate-400 block text-[10px]">Nominal Voltage</span>
                <span className="font-bold text-white text-sm">{results.nominalVoltageV} V</span>
              </div>
              <div className="p-2.5 rounded bg-white/5 border border-white/10">
                <span className="text-slate-400 block text-[10px]">Usable Energy</span>
                <span className="font-bold text-white text-sm">{results.usableEnergyKwh} kWh</span>
              </div>
              <div className="p-2.5 rounded bg-white/5 border border-white/10">
                <span className="text-slate-400 block text-[10px]">Peak Core Temp</span>
                <span className="font-bold text-rose-400 text-sm">{results.maxCoreTempC} °C</span>
              </div>
              <div className="p-2.5 rounded bg-white/5 border border-white/10">
                <span className="text-slate-400 block text-[10px]">Rule Compliance</span>
                <span className="font-bold text-emerald-400 text-sm">{results.passCount}/13 Pass</span>
              </div>
            </div>
          </div>

          {/* Configuration Parameters */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">2. System Parameters & Operating State</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded bg-white/5">
                <span className="text-slate-400 block text-[10px]">Cell Chemistry:</span>
                <span className="text-white font-medium">{parameters?.cellId}</span>
              </div>
              <div className="p-2.5 rounded bg-white/5">
                <span className="text-slate-400 block text-[10px]">Topology (Ns x Np):</span>
                <span className="text-white font-medium">{parameters?.nSeries}S {parameters?.nParallel}P ({parameters?.nSeries * parameters?.nParallel} Cells)</span>
              </div>
              <div className="p-2.5 rounded bg-white/5">
                <span className="text-slate-400 block text-[10px]">Interconnect Material:</span>
                <span className="text-white font-medium">{parameters?.interconnectId}</span>
              </div>
              <div className="p-2.5 rounded bg-white/5">
                <span className="text-slate-400 block text-[10px]">Cooling System:</span>
                <span className="text-white font-medium">{parameters?.coolingId}</span>
              </div>
              <div className="p-2.5 rounded bg-white/5">
                <span className="text-slate-400 block text-[10px]">Discharge Load:</span>
                <span className="text-white font-medium">{parameters?.packCurrentA} A Continuous</span>
              </div>
              <div className="p-2.5 rounded bg-white/5">
                <span className="text-slate-400 block text-[10px]">Ambient Condition:</span>
                <span className="text-white font-medium">{parameters?.ambientTempC} °C Ambient</span>
              </div>
            </div>
          </div>

          {/* 13 Compliance Rules Audit Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">3. Automated MBSE Rules Compliance Audit (13 Requirements)</h3>
            <div className="overflow-x-auto border border-white/10 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 font-mono text-slate-400 border-b border-white/10">
                  <tr>
                    <th className="py-2 px-3">Rule ID</th>
                    <th className="py-2 px-3">Subsystems</th>
                    <th className="py-2 px-3">Standard / Requirement</th>
                    <th className="py-2 px-3">Simulated Metric</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {results.rules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-white/[0.02]">
                      <td className="py-2 px-3 font-bold text-cyan-400">{rule.id}</td>
                      <td className="py-2 px-3 text-slate-400">{rule.subsystems}</td>
                      <td className="py-2 px-3 text-white">{rule.name}</td>
                      <td className="py-2 px-3 text-slate-300">{rule.metric}</td>
                      <td className="py-2 px-3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                          rule.status === 'PASS' 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : rule.status === 'WARN' 
                            ? 'bg-amber-500/20 text-amber-400' 
                            : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {rule.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Certification & Standard Signoff */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 text-xs space-y-1 font-mono text-slate-400">
            <div>Verified Standards: IEC 60364-5-54 • UL 2580 • AIS-156 Amendment 3</div>
            <div>Engine Platform: VoltNexus MBSE Digital Twin • Generated: {generatedTimestamp}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
