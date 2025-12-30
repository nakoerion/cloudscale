import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, TrendingDown, Zap, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const RECOMMENDATIONS = [
  {
    id: 1,
    title: "Right-size Compute Instances",
    description: "Your compute instances are consistently running at 20-30% CPU utilization. Consider downsizing to save costs.",
    impact: "high",
    savings: 145,
    effort: "low",
    category: "compute",
    action: "Resize instances from t3.large to t3.medium"
  },
  {
    id: 2,
    title: "Use Reserved Instances",
    description: "You have stable workloads running 24/7. Switch to Reserved Instances for up to 72% savings.",
    impact: "high",
    savings: 320,
    effort: "medium",
    category: "compute",
    action: "Purchase 1-year Reserved Instances"
  },
  {
    id: 3,
    title: "Optimize Storage Class",
    description: "60% of your S3 data hasn't been accessed in 90+ days. Move to Glacier for long-term storage.",
    impact: "medium",
    savings: 85,
    effort: "low",
    category: "storage",
    action: "Create lifecycle policy for infrequent data"
  },
  {
    id: 4,
    title: "Enable Auto-Scaling",
    description: "Your workload shows predictable patterns. Auto-scaling can reduce costs during low-traffic periods.",
    impact: "medium",
    savings: 110,
    effort: "medium",
    category: "compute",
    action: "Configure auto-scaling policies"
  },
  {
    id: 5,
    title: "Delete Unused Resources",
    description: "Found 3 unattached EBS volumes and 2 idle load balancers consuming budget.",
    impact: "low",
    savings: 45,
    effort: "low",
    category: "cleanup",
    action: "Remove unused EBS volumes and load balancers"
  },
  {
    id: 6,
    title: "Optimize Database Instance",
    description: "Your database CPU utilization is consistently below 15%. Consider a smaller instance type.",
    impact: "medium",
    savings: 95,
    effort: "medium",
    category: "database",
    action: "Downgrade from db.t3.large to db.t3.medium"
  }
];

const IMPACT_CONFIG = {
  high: { color: "text-emerald-700", bg: "bg-emerald-100", icon: Zap },
  medium: { color: "text-blue-700", bg: "bg-blue-100", icon: TrendingDown },
  low: { color: "text-slate-700", bg: "bg-slate-100", icon: CheckCircle2 }
};

const EFFORT_CONFIG = {
  low: { label: "Easy", color: "text-emerald-600" },
  medium: { label: "Moderate", color: "text-amber-600" },
  high: { label: "Complex", color: "text-red-600" }
};

export default function CostOptimizationRecommendations() {
  const totalSavings = RECOMMENDATIONS.reduce((sum, rec) => sum + rec.savings, 0);

  const handleApply = (recommendation) => {
    toast.success(`Applying optimization: ${recommendation.title}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Cost Optimization
          </span>
          <Badge className="bg-amber-100 text-amber-700">
            Save ${totalSavings}/mo
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-200">
          <p className="text-sm text-amber-900 font-medium mb-1">Optimization Potential</p>
          <p className="text-2xl font-bold text-amber-900">${totalSavings}/month</p>
          <p className="text-xs text-amber-700 mt-1">{RECOMMENDATIONS.length} recommendations available</p>
        </div>

        <div className="space-y-3">
          {RECOMMENDATIONS.map((rec) => {
            const impactConfig = IMPACT_CONFIG[rec.impact];
            const effortConfig = EFFORT_CONFIG[rec.effort];
            const Icon = impactConfig.icon;

            return (
              <div key={rec.id} className="p-4 border-2 border-slate-200 rounded-xl hover:border-amber-300 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 ${impactConfig.bg} rounded-lg flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 ${impactConfig.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 mb-1">{rec.title}</h4>
                      <p className="text-sm text-slate-600 mb-2">{rec.description}</p>
                      <p className="text-xs text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded">
                        {rec.action}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-lg font-bold text-emerald-600">${rec.savings}</p>
                    <p className="text-xs text-slate-500">per month</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {rec.category}
                    </Badge>
                    <span className={`text-xs font-medium ${effortConfig.color}`}>
                      <Clock className="w-3 h-3 inline mr-1" />
                      {effortConfig.label}
                    </span>
                  </div>
                  <Button size="sm" onClick={() => handleApply(rec)}>
                    Apply
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}