path = r'C:\Projects\TataProblem\Solution\batterylab_web\src\components\CompareView.jsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# Header
c = c.replace('text-xl font-bold text-slate-100', 'text-xl font-bold text-slate-900')
c = c.replace('text-sm text-slate-400', 'text-sm text-slate-600')

# Table Header
c = c.replace('bg-white/[0.03] backdrop-blur-md font-mono text-slate-200',
              'bg-stone-100/90 border-b border-slate-200 font-mono text-slate-800')
c = c.replace('text-rose-300', 'text-rose-800 font-bold')
c = c.replace('text-emerald-300', 'text-emerald-800 font-bold')
c = c.replace('text-teal-300', 'text-teal-800 font-bold')

# Table rows
c = c.replace('divide-y divide-white/5', 'divide-y divide-slate-200/80')
c = c.replace('hover:bg-white/[0.06] transition-colors', 'hover:bg-orange-500/[0.04] transition-colors')
c = c.replace('text-slate-200">{row.label}', 'text-slate-900 font-semibold">{row.label}')
c = c.replace('text-slate-300">\n                    {row.base', 'text-slate-700 font-medium">\n                    {row.base')
c = c.replace('text-slate-300">\n                    {row.optA', 'text-slate-700 font-medium">\n                    {row.optA')
c = c.replace('text-slate-300">\n                    {row.optB', 'text-slate-700 font-medium">\n                    {row.optB')
c = c.replace('text-rose-400 font-bold', 'text-rose-700 font-bold')
c = c.replace('text-emerald-400 font-bold', 'text-emerald-700 font-bold')
c = c.replace('text-teal-400 font-bold', 'text-teal-700 font-bold')

# Takeaways
c = c.replace('text-sm font-bold text-slate-100', 'text-sm font-bold text-slate-900')
c = c.replace('text-xs text-slate-300 leading-relaxed', 'text-xs text-slate-700 leading-relaxed')

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("Updated CompareView.jsx for light glass successfully!")
