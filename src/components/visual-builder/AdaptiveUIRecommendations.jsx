import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Eye, Mouse, Clock } from "lucide-react";

const BEHAVIORAL_INSIGHTS = [
  {
    id: 1,
    pattern: "Users spend 80% of time on dashboard",
    recommendation: "Expand dashboard widgets and add quick actions",
    impact: "high",
    implementation: "Add more cards to dashboard, reduce navigation depth"
  },
  {
    id: 2,
    pattern: "Mobile users tap navigation 3x more than desktop",
    recommendation: "Implement sticky bottom navigation for mobile",
    impact: "high",
    implementation: "Bottom tab bar with icons for key sections"
  },
  {
    id: 3,
    pattern: "Search used in 45% of sessions",
    recommendation: "Make search more prominent and add keyboard shortcut",
    impact: "medium",
    implementation: "Add ⌘K shortcut and global search in header"
  },
  {
    id: 4,
    pattern: "Users abandon forms at payment step",
    recommendation: "Simplify checkout, show progress indicator",
    impact: "high",
    implementation: "Multi-step form with clear progress and save draft"
  }
];

const DEVICE_ADAPTATIONS = [
  {
    device: "Mobile (68% of users)",
    adaptations: ["Bottom navigation", "Larger tap targets (min 44px)", "Swipe gestures for navigation"]
  },
  {
    device: "Tablet (18% of users)",
    adaptations: ["Split-view layout", "Floating action buttons", "Drag-and-drop support"]
  },
  {
    device: "Desktop (14% of users)",
    adaptations: ["Keyboard shortcuts", "Multi-column layout", "Hover states and tooltips"]
  }
];

export default function AdaptiveUIRecommendations({ onApplyRecommendation }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-600" />
          Adaptive UI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold text-slate-900 mb-3">Behavior-Driven Insights</h4>
          <div className="space-y-3">
            {BEHAVIORAL_INSIGHTS.map((insight) => (
              <div key={insight.id} className="p-4 border-2 rounded-xl" style={{
                borderColor: insight.impact === "high" ? "#f59e0b" : "#3b82f6"
              }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Mouse className="w-4 h-4 text-slate-500" />
                      <p className="text-sm font-medium text-slate-900">{insight.pattern}</p>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{insight.recommendation}</p>
                  </div>
                  <Badge className={
                    insight.impact === "high" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                  }>
                    {insight.impact}
                  </Badge>
                </div>
                
                <div className="p-2 bg-slate-50 rounded-lg mb-3">
                  <p className="text-xs text-slate-600">
                    <strong>Implementation:</strong> {insight.implementation}
                  </p>
                </div>

                <Button 
                  size="sm" 
                  onClick={() => onApplyRecommendation(insight)}
                >
                  Apply Changes
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 mb-3">Device-Specific Optimizations</h4>
          <div className="space-y-3">
            {DEVICE_ADAPTATIONS.map((device, i) => (
              <div key={i} className="p-4 bg-gradient-to-r from-white to-indigo-50 border border-indigo-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-indigo-600" />
                  <h5 className="font-semibold text-slate-900">{device.device}</h5>
                </div>
                <ul className="space-y-1">
                  {device.adaptations.map((adaptation, j) => (
                    <li key={j} className="text-sm text-slate-700 flex items-start gap-2">
                      <span className="text-indigo-600">•</span>
                      {adaptation}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-violet-50 border border-violet-200 rounded-xl">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-semibold text-violet-900 mb-1">Time-Based Adaptations</h5>
              <p className="text-sm text-violet-800 mb-2">
                AI detected that users prefer dark mode during evening hours (6 PM - 6 AM).
              </p>
              <Button size="sm" variant="outline">
                Enable Auto Dark Mode
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}