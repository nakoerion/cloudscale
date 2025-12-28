import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, TrendingUp, Users, Clock } from "lucide-react";

const RECOMMENDATIONS = [
  {
    id: 1,
    title: "Send Push Notifications During Peak Hours",
    impact: "high",
    confidence: 94,
    description: "AI detected users are most active between 2-4 PM. Schedule notifications during this window.",
    current_metric: "23% open rate",
    predicted_metric: "41% open rate",
    improvement: "+78%",
    action: "Configure push timing"
  },
  {
    id: 2,
    title: "Personalize Onboarding Flow",
    impact: "high",
    confidence: 89,
    description: "Users with personalized onboarding have 2.4x higher activation rates.",
    current_metric: "45% activation",
    predicted_metric: "72% activation",
    improvement: "+60%",
    action: "Enable personalization"
  },
  {
    id: 3,
    title: "Gamify Feature Discovery",
    impact: "medium",
    confidence: 82,
    description: "Add progress bars and achievement badges to increase feature adoption by 35%.",
    current_metric: "52% feature usage",
    predicted_metric: "70% feature usage",
    improvement: "+35%",
    action: "Implement gamification"
  },
  {
    id: 4,
    title: "Optimize Email Cadence",
    impact: "medium",
    confidence: 78,
    description: "Reduce email frequency to 2x per week to decrease unsubscribe rate.",
    current_metric: "8.2% unsubscribe",
    predicted_metric: "3.1% unsubscribe",
    improvement: "-62%",
    action: "Adjust email schedule"
  }
];

export default function EngagementOptimizer() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-600" />
          AI Engagement Optimization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {RECOMMENDATIONS.map((rec) => (
          <div key={rec.id} className="p-4 border-2 rounded-xl" style={{
            borderColor: rec.impact === "high" ? "#f59e0b" : "#3b82f6"
          }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">{rec.title}</h4>
                <p className="text-sm text-slate-600 mb-2">{rec.description}</p>
              </div>
              <Badge className={
                rec.impact === "high" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
              }>
                {rec.impact} impact
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3 p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="text-xs text-slate-500 mb-1">Current</p>
                <p className="text-sm font-semibold text-slate-900">{rec.current_metric}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Predicted</p>
                <p className="text-sm font-semibold text-emerald-600">{rec.predicted_metric}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Improvement</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                  <p className="text-sm font-semibold text-emerald-600">{rec.improvement}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {rec.confidence}% confidence
                </Badge>
              </div>
              <Button size="sm">
                {rec.action}
              </Button>
            </div>
          </div>
        ))}

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-semibold text-blue-900 mb-1">User Segmentation Insight</h5>
              <p className="text-sm text-blue-800">
                Power users (top 20%) generate 68% of engagement. Focus retention efforts on this segment for maximum impact.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}