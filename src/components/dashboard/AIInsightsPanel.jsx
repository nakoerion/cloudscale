import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const AI_INSIGHTS = [
  {
    id: 1,
    type: "opportunity",
    priority: "high",
    metric: "User Engagement",
    title: "Peak Engagement Window Detected",
    description: "User activity spikes 40% between 2-4 PM EST. Consider scheduling deployments outside this window.",
    impact: "+15% user satisfaction",
    action: "Adjust Deployment Schedule",
    icon: TrendingUp,
    color: "emerald"
  },
  {
    id: 2,
    type: "warning",
    priority: "high",
    metric: "Infrastructure Costs",
    title: "Underutilized Resources Identified",
    description: "3 EC2 instances running at <20% capacity during off-peak hours. Potential savings: $1,240/month",
    impact: "-32% infrastructure costs",
    action: "Enable Auto-Scaling",
    icon: AlertTriangle,
    color: "amber"
  },
  {
    id: 3,
    type: "success",
    priority: "medium",
    metric: "Pipeline Success Rate",
    title: "Deployment Velocity Improving",
    description: "Pipeline success rate increased from 87% to 94% after implementing automated testing.",
    impact: "+8% deployment success",
    action: "View Details",
    icon: CheckCircle2,
    color: "blue"
  },
  {
    id: 4,
    type: "alert",
    priority: "critical",
    metric: "User Engagement",
    title: "Churn Risk Detected",
    description: "5 high-value accounts show 60% decrease in activity over last 7 days. Immediate action recommended.",
    impact: "Potential $15K MRR at risk",
    action: "Contact Accounts",
    icon: TrendingDown,
    color: "red"
  }
];

export default function AIInsightsPanel() {
  const getColorClasses = (color) => {
    const colors = {
      emerald: { bg: "bg-emerald-50", text: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700" },
      amber: { bg: "bg-amber-50", text: "text-amber-600", badge: "bg-amber-100 text-amber-700" },
      blue: { bg: "bg-blue-50", text: "text-blue-600", badge: "bg-blue-100 text-blue-700" },
      red: { bg: "bg-red-50", text: "text-red-600", badge: "bg-red-100 text-red-700" }
    };
    return colors[color] || colors.blue;
  };

  const handleAction = (insight) => {
    toast.success(`Initiating action: ${insight.action}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-600" />
          AI-Driven Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {AI_INSIGHTS.map((insight) => {
          const Icon = insight.icon;
          const colors = getColorClasses(insight.color);
          
          return (
            <div key={insight.id} className={`p-4 ${colors.bg} rounded-xl border border-${insight.color}-200`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 bg-white rounded-lg`}>
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-slate-900 mb-1">{insight.title}</p>
                      <p className="text-sm text-slate-600">{insight.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">{insight.metric}</Badge>
                    <Badge className={colors.badge + " text-xs"}>{insight.impact}</Badge>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleAction(insight)}
                  >
                    {insight.action}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}