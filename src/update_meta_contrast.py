path = r'C:\Projects\TataProblem\Solution\batterylab_web\src\App.jsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

old_meta = """              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-[9.5px] font-mono tracking-[0.16em] uppercase text-slate-400 font-semibold leading-tight">
                  TATA ELXSI TELIPORT S4
                </span>
                <span className="text-[9px] font-mono text-orange-400/90 font-bold px-1 py-[1px] rounded bg-orange-950/40 border border-orange-500/25">
                  IDV-CS2
                </span>
              </div>
              
              <span className="text-[11.5px] font-medium tracking-tight text-slate-200 leading-snug whitespace-nowrap">
                Case Study 2 <span className="text-slate-500 mx-0.5">•</span> <span className="text-slate-300 font-semibold">MBSE Battery Platform</span>
              </span>"""

new_meta = """              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-[9.5px] font-mono tracking-[0.16em] uppercase text-slate-600 font-bold leading-tight">
                  TATA ELXSI TELIPORT S4
                </span>
                <span className="text-[9px] font-mono text-orange-800 font-bold px-1.5 py-[1px] rounded bg-orange-100 border border-orange-300">
                  IDV-CS2
                </span>
              </div>
              
              <span className="text-[11.5px] font-semibold tracking-tight text-slate-800 leading-snug whitespace-nowrap">
                Case Study 2 <span className="text-slate-400 mx-0.5">•</span> <span className="text-slate-900 font-bold">MBSE Battery Platform</span>
              </span>"""

c = c.replace(old_meta, new_meta)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("Updated App.jsx metadata contrast successfully!")
