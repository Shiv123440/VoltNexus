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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">VoltNexus Engineering Verification Report</h2>
              <p className="text-xs text-slate-500 font-mono">Run ID: VN-MBSE-2026 • Coupled 1-RC ECM Telemetry Specification</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs flex items-center gap-1.5 hover:bg-blue-700 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadJSON}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-medium text-xs flex items-center gap-1.5 hover:bg-slate-50 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200/70 transition-all cursor-pointer"
              aria-label="Close report modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-sm text-slate-700">
          {/* Executive Summary */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="text-xs font-mono font-bold text-blue-700 uppercase tracking-wider">1. Executive Summary</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              This verification report documents the cross-subsystem boundary validation for the <strong className="text-slate-900">VoltNexus Battery Module</strong>. 
              Simulated under the Thevenin 1-RC ECM model coupled with the Cloos &amp; Wetzel (2025) convective duct thermal gradient and Bruen &amp; Marco (2016) parallel current divergence formulation.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Nominal Voltage</span>
                <span className="font-bold text-slate-900 text-sm">{results.nominalVoltageV} V</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Usable Energy</span>
                <span className="font-bold text-slate-900 text-sm">{results.usableEnergyKwh} kWh</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Peak Core Temp</span>
                <span className="font-bold text-rose-600 text-sm">{results.maxCoreTempC} °C</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Rule Compliance</span>
                <span className="font-bold text-emerald-700 text-sm">{results.passCount}/13 Pass</span>
              </div>
            </div>
          </div>

          {/* Configuration Parameters */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-blue-700 uppercase tracking-wider">2. System Parameters &amp; Operating State</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-slate-400 block text-[10px]">Cell Chemistry:</span>
                <span className="text-slate-900 font-semibold">{parameters?.cellId}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-slate-400 block text-[10px]">Topology (Ns x Np):</span>
                <span className="text-slate-900 font-semibold">{parameters?.nSeries}S {parameters?.nParallel}P ({parameters?.nSeries * parameters?.nParallel} Cells)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-slate-400 block text-[10px]">Interconnect Material:</span>
                <span className="text-slate-900 font-semibold">{parameters?.interconnectId}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-slate-400 block text-[10px]">Cooling System:</span>
                <span className="text-slate-900 font-semibold">{parameters?.coolingId}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-slate-400 block text-[10px]">Discharge Load:</span>
                <span className="text-slate-900 font-semibold">{parameters?.packCurrentA} A Continuous</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-slate-400 block text-[10px]">Ambient Condition:</span>
                <span className="text-slate-900 font-semibold">{parameters?.ambientTempC} °C Ambient</span>
              </div>
            </div>
          </div>

          {/* 13 Compliance Rules Audit Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-blue-700 uppercase tracking-wider">3. Automated MBSE Rules Compliance Audit (13 Requirements)</h3>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 font-mono text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Rule ID</th>
                    <th className="py-2.5 px-3">Subsystems</th>
                    <th className="py-2.5 px-3">Standard / Requirement</th>
                    <th className="py-2.5 px-3">Simulated Metric</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {results.rules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-slate-50/80">
                      <td className="py-2 px-3 font-bold text-blue-700">{rule.id}</td>
                      <td className="py-2 px-3 text-slate-500">{rule.subsystems}</td>
                      <td className="py-2 px-3 text-slate-900 font-sans font-medium">{rule.name}</td>
                      <td className="py-2 px-3 text-slate-600">{rule.metric}</td>
                      <td className="py-2 px-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rule.status === 'PASS' 
                            ? 'vn-badge-pass' 
                            : rule.status === 'WARN' 
                            ? 'vn-badge-warn' 
                            : 'vn-badge-fail'
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
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 font-mono text-slate-500">
            <div>Verified Standards: IEC 60364-5-54 • UL 2580 • AIS-156 Amendment 3</div>
            <div>Engine Platform: VoltNexus MBSE Digital Twin • Generated: {generatedTimestamp}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
