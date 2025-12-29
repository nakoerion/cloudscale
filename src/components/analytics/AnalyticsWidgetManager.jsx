import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { LayoutGrid, GripVertical, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const AVAILABLE_WIDGETS = [
  { id: "engagement", name: "User Engagement", description: "DAU, sessions, actions", enabled: true },
  { id: "feature-adoption", name: "Feature Adoption", description: "Feature usage and trends", enabled: true },
  { id: "behavior-prediction", name: "AI Predictions", description: "Behavior insights and forecasts", enabled: true },
  { id: "churn-prediction", name: "Churn Risk", description: "At-risk user analysis", enabled: true },
  { id: "performance", name: "Performance Reports", description: "Weekly performance summaries", enabled: false },
  { id: "revenue", name: "Revenue Analytics", description: "MRR, ARR, and growth", enabled: false },
  { id: "conversion", name: "Conversion Funnels", description: "User journey analytics", enabled: false },
  { id: "retention", name: "Retention Cohorts", description: "User retention analysis", enabled: false },
  { id: "geographic", name: "Geographic Data", description: "User location insights", enabled: false },
  { id: "device", name: "Device Analytics", description: "Platform and device usage", enabled: false }
];

export default function AnalyticsWidgetManager({ widgets, onUpdate }) {
  const [localWidgets, setLocalWidgets] = useState(widgets || AVAILABLE_WIDGETS);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(localWidgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLocalWidgets(items);
    onUpdate?.(items);
  };

  const toggleWidget = (widgetId) => {
    const updated = localWidgets.map(w => 
      w.id === widgetId ? { ...w, enabled: !w.enabled } : w
    );
    setLocalWidgets(updated);
    onUpdate?.(updated);
  };

  const enabledCount = localWidgets.filter(w => w.enabled).length;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <LayoutGrid className="w-4 h-4 mr-2" />
          Customize Widgets ({enabledCount})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-violet-600" />
            Manage Analytics Widgets
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              💡 Drag widgets to reorder them. Toggle visibility with the switch.
            </p>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="widgets">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {localWidgets.map((widget, index) => (
                    <Draggable key={widget.id} draggableId={widget.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`p-4 bg-white border-2 rounded-xl transition-all ${
                            snapshot.isDragging 
                              ? "border-violet-500 shadow-lg" 
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                              <GripVertical className="w-5 h-5 text-slate-400" />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-slate-900">{widget.name}</h4>
                                {widget.enabled ? (
                                  <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                                    <Eye className="w-3 h-3 mr-1" /> Visible
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs">
                                    <EyeOff className="w-3 h-3 mr-1" /> Hidden
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-slate-600">{widget.description}</p>
                            </div>

                            <Switch
                              checked={widget.enabled}
                              onCheckedChange={() => toggleWidget(widget.id)}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-slate-600">
              {enabledCount} of {localWidgets.length} widgets enabled
            </p>
            <Button 
              variant="outline"
              onClick={() => {
                const allEnabled = localWidgets.map(w => ({ ...w, enabled: true }));
                setLocalWidgets(allEnabled);
                onUpdate?.(allEnabled);
              }}
            >
              Enable All
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}