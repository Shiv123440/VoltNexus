path = r'C:\Projects\TataProblem\Solution\batterylab_web\src\components\ui\BatteryModule3D.jsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('text-[11px] font-mono tracking-wider uppercase text-slate-300 font-semibold',
              'text-[11px] font-mono tracking-wider uppercase text-slate-700 font-bold')

c = c.replace('text-slate-400 hover:text-slate-200', 'text-slate-600 hover:text-slate-900')

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("Updated BatteryModule3D.jsx for light glass successfully!")
