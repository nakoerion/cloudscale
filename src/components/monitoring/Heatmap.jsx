import { cn } from "@/lib/utils";

export default function Heatmap({ data, title }) {
  // data format: [{ x, y, value }]
  const maxValue = Math.max(...data.map(d => d.value));
  const gridSize = Math.sqrt(data.length);

  const getColor = (value) => {
    const intensity = value / maxValue;
    if (intensity > 0.8) return "bg-red-500";
    if (intensity > 0.6) return "bg-orange-500";
    if (intensity > 0.4) return "bg-amber-400";
    if (intensity > 0.2) return "bg-yellow-400";
    return "bg-green-400";
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
      >
        {data.map((cell, i) => (
          <div
            key={i}
            className={cn(
              "aspect-square rounded transition-all hover:scale-105 hover:shadow-lg cursor-pointer",
              getColor(cell.value)
            )}
            title={`${cell.x}, ${cell.y}: ${cell.value}`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded" />
          <span>Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-400 rounded" />
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded" />
          <span>High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded" />
          <span>Critical</span>
        </div>
      </div>
    </div>
  );
}