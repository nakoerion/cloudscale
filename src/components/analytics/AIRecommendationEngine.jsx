import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Target, Zap, Users, TrendingUp } from "lucide-react";

const RECOMMENDATIONS = [
  {
    id: 1,
    category: "Retention",
    title: "Launch Win-Back Campaign",
    description: "AI identified 342 users who haven't logged in for 14+ days but had high historical engagement.",
    priority: "high",
    impact: "Recover ~68% of inactive users",
    effort: "Low",
    roi: "320%",
    actions: ["Create email sequence", "Offer incentive", "Personalize messaging"]
  },
  {
    id: 2,
    category: "Growth",
    title: "Expand Mobile App Features",
    description: "68% of users access via mobile, but feature usage is 45% lower than desktop.",
    priority: "high",
    impact: "Increase mobile engagement by 40%",
    effort: "Medium",
    roi: "215%",
    actions: ["Optimize mobile UX", "Add mobile-specific features", "Push notifications"]
  },
  {
    id: 3,
    category: "Monetization",
    title: "Introduce Premium Tier",
    description: "AI analysis shows 23% of users consistently max out free tier limits.",
    priority: "medium",
    impact: "Potential $45K MRR increase",
    effort: "High",
    roi: "180%",
    actions: ["Design pricing tiers", "Feature segmentation", "Upgrade prompts"]
  },
  {
    id: 4,
    category: "Engagement",
    title: "Gamify Onboarding",
    description: "Users who complete >3 onboarding steps have 3.2x higher retention.",
    priority: "medium",
    impact: "Improve activation by 35%",
    effort: "Medium",
    roi: "265%",
    actions: ["Progress indicators", "Achievement badges", "Reward system"]
  }
];

export default function AIRecommendationEngine() {
  const getIcon = (category) => {
    switch(category) {
      case "Retention": return <Target className="w-4 h-4" />;
      case "Growth": return <TrendingUp className="w-4 h-4" />;
      case "Monetization": return <Zap className="w-4 h-4" />;
      case "Engagement": return <Users className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    return priority === "high" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          AI Strategic Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {RECOMMENDATIONS.map((rec) => (
          <div key={rec.id} className="p-4 border-2 rounded-xl bg-gradient-to-r from-white to-amber-50" style={{
            borderColor: rec.priority === "high" ? "#f59e0b" : "#3b82f6"
          }}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
                  {getIcon(rec.category)}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{rec.title}</h4>
                  <Badge variant="outline" className="mt-1">{rec.category}</Badge>
                </div>
              </div>
              <Badge className={getPriorityColor(rec.priority)}>
                {rec.priority}
              </Badge>
            </div>

            <p className="text-sm text-slate-600 mb-3">{rec.description}</p>

            <div className="grid grid-cols-3 gap-2 mb-3 p-3 bg-white rounded-lg">
              <div>
                <p className="text-xs text-slate-500">Impact</p>
                <p className="text-xs font-semibold text-emerald-600">{rec.impact}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Effort</p>
                <p className="text-xs font-semibold text-blue-600">{rec.effort}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Est. ROI</p>
                <p className="text-xs font-semibold text-violet-600">{rec.roi}</p>
              </div>
            </div>

            <details className="mb-3">
              <summary className="text-sm font-medium text-slate-700 cursor-pointer hover:text-slate-900">
                View action items
              </summary>
              <ul className="mt-2 space-y-1">
                {rec.actions.map((action, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    {action}
                  </li>
                ))}
              </ul>
            </details>

            <Button size="sm" className="w-full">
              Implement Recommendation
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}