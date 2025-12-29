import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, AlertTriangle, TrendingUp, Users, Mail } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const PREDICTIONS = [
  {
    id: 1,
    type: "upgrade",
    title: "High Upgrade Probability Detected",
    confidence: 89,
    users: 145,
    description: "145 users showing strong signals for upgrading to premium",
    indicators: [
      "Heavy feature usage (80%+ of limits)",
      "Multiple integration attempts",
      "Frequent advanced feature access"
    ],
    recommendation: "Send targeted upgrade campaign with 20% discount",
    potentialRevenue: "$14,500",
    action: "Create Campaign"
  },
  {
    id: 2,
    type: "churn",
    title: "Churn Risk Increasing",
    confidence: 76,
    users: 89,
    description: "89 users showing decreased engagement patterns",
    indicators: [
      "Login frequency dropped 60%",
      "No feature usage in 7 days",
      "Support tickets unresolved"
    ],
    recommendation: "Trigger re-engagement workflow with personalized content",
    potentialLoss: "$8,900",
    action: "Start Re-engagement"
  },
  {
    id: 3,
    type: "expansion",
    title: "Team Expansion Opportunity",
    confidence: 82,
    users: 67,
    description: "67 accounts likely to add team members",
    indicators: [
      "Admin inviting colleagues",
      "Collaboration features heavily used",
      "Workspace capacity at 80%"
    ],
    recommendation: "Promote team plans with multi-user benefits",
    potentialRevenue: "$6,700",
    action: "Send Team Offer"
  }
];

const BEHAVIOR_PATTERNS = [
  {
    pattern: "Morning Power Users",
    percentage: 28,
    behavior: "Peak activity 8-10 AM, high conversion rate",
    recommendation: "Schedule feature releases at 7 AM"
  },
  {
    pattern: "Evening Explorers",
    percentage: 35,
    behavior: "Browse extensively 6-9 PM, low immediate conversion",
    recommendation: "Send follow-up emails next morning"
  },
  {
    pattern: "Weekend Warriors",
    percentage: 18,
    behavior: "High engagement on weekends, long sessions",
    recommendation: "Offer weekend-specific content"
  },
  {
    pattern: "Quick Action Users",
    percentage: 19,
    behavior: "Short sessions, specific goals, high completion rate",
    recommendation: "Optimize for speed and efficiency"
  }
];

export default function BehaviorPredictionEngine() {
  const getTypeColor = (type) => {
    const colors = {
      upgrade: "bg-emerald-100 text-emerald-700",
      churn: "bg-red-100 text-red-700",
      expansion: "bg-blue-100 text-blue-700"
    };
    return colors[type] || colors.expansion;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          AI Behavior Prediction Engine
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Predictions */}
        {PREDICTIONS.map((prediction) => (
          <div key={prediction.id} className="p-5 border-2 rounded-xl" style={{
            borderColor: prediction.type === "upgrade" ? "#10b981" : 
                         prediction.type === "churn" ? "#ef4444" : "#3b82f6"
          }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">{prediction.title}</h4>
                <p className="text-sm text-slate-600">{prediction.description}</p>
              </div>
              <Badge className={getTypeColor(prediction.type)}>
                {prediction.confidence}% confidence
              </Badge>
            </div>

            <div className="mb-4">
              <p className="text-xs text-slate-500 mb-2">Key Indicators:</p>
              <ul className="space-y-1">
                {prediction.indicators.map((indicator, i) => (
                  <li key={i} className="text-sm text-slate-700 flex items-center gap-2">
                    <span className="text-violet-600">•</span> {indicator}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg mb-4">
              <p className="text-xs text-slate-600 mb-1">AI Recommendation:</p>
              <p className="text-sm font-medium text-slate-900">{prediction.recommendation}</p>
              {(prediction.potentialRevenue || prediction.potentialLoss) && (
                <p className="text-xs text-slate-600 mt-2">
                  {prediction.potentialRevenue && `💰 Potential Revenue: ${prediction.potentialRevenue}`}
                  {prediction.potentialLoss && `⚠️ Potential Loss: ${prediction.potentialLoss}`}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                {prediction.action}
              </Button>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </div>
          </div>
        ))}

        {/* Behavior Patterns */}
        <div className="pt-4 border-t">
          <h4 className="font-semibold text-slate-900 mb-4">Discovered Behavior Patterns</h4>
          <div className="space-y-3">
            {BEHAVIOR_PATTERNS.map((pattern, i) => (
              <div key={i} className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-900">{pattern.pattern}</span>
                  <Badge variant="outline">{pattern.percentage}%</Badge>
                </div>
                <p className="text-sm text-slate-600 mb-2">{pattern.behavior}</p>
                <p className="text-xs text-violet-700 font-medium">→ {pattern.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}