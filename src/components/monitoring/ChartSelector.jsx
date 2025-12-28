import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  MapPin,
  Grid3x3,
  ScatterChart
} from "lucide-react";

const CHART_TYPES = [
  { id: "line", name: "Line Chart", icon: LineChart, description: "Time series data" },
  { id: "bar", name: "Bar Chart", icon: BarChart3, description: "Comparison data" },
  { id: "pie", name: "Pie Chart", icon: PieChart, description: "Distribution data" },
  { id: "heatmap", name: "Heatmap", icon: Grid3x3, description: "Intensity visualization" },
  { id: "scatter", name: "Scatter Plot", icon: ScatterChart, description: "Correlation analysis" },
  { id: "geo", name: "Geographic Map", icon: MapPin, description: "Location-based data" }
];

export default function ChartSelector({ open, onClose, onSelect }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Chart to Dashboard</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {CHART_TYPES.map((chart) => {
            const Icon = chart.icon;
            return (
              <button
                key={chart.id}
                onClick={() => {
                  onSelect(chart.id);
                  onClose();
                }}
                className="p-6 rounded-xl border-2 border-slate-200 hover:border-violet-500 hover:bg-violet-50 transition-all text-left group"
              >
                <Icon className="w-8 h-8 text-violet-600 mb-3" />
                <h3 className="font-semibold text-slate-900 mb-1">{chart.name}</h3>
                <p className="text-sm text-slate-500">{chart.description}</p>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}