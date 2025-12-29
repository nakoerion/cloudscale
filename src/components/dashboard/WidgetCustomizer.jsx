import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { LayoutGrid, Plus, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AVAILABLE_WIDGETS = [
  { id: "metrics", name: "Key Metrics", category: "analytics" },
  { id: "projects", name: "Recent Projects", category: "projects" },
  { id: "pipelines", name: "Active Pipelines", category: "devops" },
  { id: "ai-insights", name: "AI Insights", category: "intelligence" },
  { id: "costs", name: "Cost Analysis", category: "billing" },
  { id: "activity", name: "Activity Feed", category: "general" },
  { id: "deployments", name: "Recent Deployments", category: "devops" },
  { id: "alerts", name: "System Alerts", category: "monitoring" },
  { id: "team", name: "Team Activity", category: "collaboration" },
  { id: "performance", name: "Performance Metrics", category: "analytics" }
];

export default function WidgetCustomizer({ visibleWidgets = [], onUpdateWidgets }) {
  const [widgets, setWidgets] = useState(visibleWidgets);

  const toggleWidget = (widgetId) => {
    const updated = widgets.includes(widgetId)
      ? widgets.filter(id => id !== widgetId)
      : [...widgets, widgetId];
    setWidgets(updated);
    onUpdateWidgets?.(updated);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Customize Dashboard
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-violet-600" />
            Customize Your Dashboard
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          <p className="text-sm text-slate-600">
            Choose which widgets to display on your dashboard. You can rearrange them by dragging.
          </p>
          
          {["analytics", "devops", "intelligence", "monitoring", "billing", "projects", "collaboration", "general"].map((category) => {
            const categoryWidgets = AVAILABLE_WIDGETS.filter(w => w.category === category);
            if (categoryWidgets.length === 0) return null;
            
            return (
              <div key={category} className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-900 capitalize">
                  {category}
                </h4>
                <div className="space-y-2">
                  {categoryWidgets.map((widget) => (
                    <div
                      key={widget.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg">
                          <LayoutGrid className="w-4 h-4 text-slate-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-900">
                          {widget.name}
                        </span>
                      </div>
                      <Switch
                        checked={widgets.includes(widget.id)}
                        onCheckedChange={() => toggleWidget(widget.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between items-center pt-4 border-t">
          <Badge variant="outline">
            {widgets.length} widgets active
          </Badge>
          <Button onClick={() => {
            setWidgets(AVAILABLE_WIDGETS.map(w => w.id));
            onUpdateWidgets?.(AVAILABLE_WIDGETS.map(w => w.id));
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Enable All
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}