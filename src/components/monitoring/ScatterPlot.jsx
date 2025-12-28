import { cn } from "@/lib/utils";

export default function ScatterPlot({ data, title, xLabel, yLabel }) {
  // data format: [{ x, y, label?, color? }]
  const maxX = Math.max(...data.map(d => d.x));
  const maxY = Math.max(...data.map(d => d.y));
  const minX = Math.min(...data.map(d => d.x));
  const minY = Math.min(...data.map(d => d.y));

  const normalizeX = (x) => ((x - minX) / (maxX - minX)) * 90 + 5;
  const normalizeY = (y) => 95 - ((y - minY) / (maxY - minY)) * 90;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
      <div className="relative w-full h-80 bg-slate-50 rounded-xl overflow-hidden">
        {/* Grid */}
        <div className="absolute inset-0">
          {[0, 25, 50, 75, 100].map((line) => (
            <div key={`h-${line}`}>
              <div 
                className="absolute left-0 right-0 border-t border-slate-200"
                style={{ top: `${line}%` }}
              />
              <div 
                className="absolute top-0 bottom-0 border-l border-slate-200"
                style={{ left: `${line}%` }}
              />
            </div>
          ))}
        </div>

        {/* Data Points */}
        {data.map((point, i) => (
          <div
            key={i}
            className={cn(
              "absolute w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2 hover:scale-150 transition-transform cursor-pointer",
              point.color || "bg-violet-500"
            )}
            style={{
              left: `${normalizeX(point.x)}%`,
              top: `${normalizeY(point.y)}%`
            }}
            title={point.label || `(${point.x.toFixed(2)}, ${point.y.toFixed(2)})`}
          />
        ))}

        {/* Axes Labels */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-slate-600 font-medium">
          {xLabel}
        </div>
        <div 
          className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-600 font-medium"
          style={{ transform: 'translateY(-50%) rotate(-90deg)', transformOrigin: 'center' }}
        >
          {yLabel}
        </div>
      </div>
      <div className="flex justify-between mt-4 text-xs text-slate-500">
        <span>{minX.toFixed(0)}</span>
        <span>{((minX + maxX) / 2).toFixed(0)}</span>
        <span>{maxX.toFixed(0)}</span>
      </div>
    </div>
  );
}