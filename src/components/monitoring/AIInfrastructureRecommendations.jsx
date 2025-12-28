import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, DollarSign, Shield, TrendingUp, Zap } from "lucide-react";

const RECOMMENDATIONS = [
  {
    id: 1,
    category: "cost",
    icon: DollarSign,
    title: "Right-size EC2 Instances",
    description: "3 instances are over-provisioned based on 30-day usage patterns",
    impact: "$487/month savings",
    confidence: 94,
    priority: "high",
    details: [
      "production-web-01: t3.large → t3.medium (CPU avg: 28%)",
      "production-web-02: t3.large → t3.medium (CPU avg: 31%)",
      "staging-api-01: t3.medium → t3.small (CPU avg: 15%)"
    ],
    actions: ["Apply Changes", "Schedule Resize"]
  },
  {
    id: 2,
    category: "scaling",
    icon: TrendingUp,
    title: "Adjust Auto-Scaling Thresholds",
    description: "Current thresholds causing unnecessary scaling events",
    impact: "Reduce scaling events by 40%",
    confidence: 89,
    priority: "medium",
    details: [
      "Increase scale-out threshold: 70% → 80% CPU",
      "Increase cooldown period: 180s → 300s",
      "Add memory-based scaling (current: CPU only)"
    ],
    actions: ["Update Policies", "Test Changes"]
  },
  {
    id: 3,
    category: "security",
    icon: Shield,
    title: "Enable Enhanced Security Features",
    description: "Security gaps detected in current configuration",
    impact: "Improve security posture by 35%",
    confidence: 96,
    priority: "critical",
    details: [
      "Enable VPC Flow Logs for network monitoring",
      "Implement AWS WAF on API Gateway",
      "Enable GuardDuty threat detection",
      "Rotate IAM access keys (12 keys > 90 days old)"
    ],
    actions: ["Enable All", "Review Policies"]
  },
  {
    id: 4,
    category: "performance",
    icon: Zap,
    title: "Optimize Database Performance",
    description: "RDS instance showing performance bottlenecks",
    impact: "Reduce query time by 60%",
    confidence: 91,
    priority: "high",
    details: [
      "Enable RDS Performance Insights",
      "Add read replicas for read-heavy workload",
      "Implement query result caching with ElastiCache",
      "Optimize 15 slow queries identified by AI"
    ],
    actions: ["Apply Optimizations", "View Queries"]
  },
  {
    id: 5,
    category: "cost",
    icon: DollarSign,
    title: "Reserved Instance Opportunities",
    description: "Consistent workload patterns suitable for Reserved Instances",
    impact: "$1,247/month savings",
    confidence: 98,
    priority: "medium",
    details: [
      "5 EC2 instances: Standard 1-year term, no upfront",
      "2 RDS databases: Standard 1-year term, partial upfront",
      "ElastiCache cluster: Standard 1-year term, no upfront"
    ],
    actions: ["Purchase RIs", "View Pricing"]
  }
];

export default function AIInfrastructureRecommendations() {
  const getCategoryConfig = (category) => {
    const configs = {
      cost: { color: "text-emerald-600", bg: "bg-emerald-50", badge: "bg-emerald-100 text-emerald-700" },
      scaling: { color: "text-blue-600", bg: "bg-blue-50", badge: "bg-blue-100 text-blue-700" },
      security: { color: "text-red-600", bg: "bg-red-50", badge: "bg-red-100 text-red-700" },
      performance: { color: "text-violet-600", bg: "bg-violet-50", badge: "bg-violet-100 text-violet-700" }
    };
    return configs[category] || configs.cost;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: "border-red-300 text-red-700",
      high: "border-amber-300 text-amber-700",
      medium: "border-blue-300 text-blue-700"
    };
    return colors[priority] || "border-slate-300 text-slate-700";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-600" />
          AI Infrastructure Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {RECOMMENDATIONS.map((rec) => {
          const Icon = rec.icon;
          const config = getCategoryConfig(rec.category);
          
          return (
            <div key={rec.id} className="border-2 border-slate-200 rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${config.bg}`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">{rec.title}</h4>
                    <p className="text-sm text-slate-600 mb-2">{rec.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge className={config.badge} style={{ textTransform: 'capitalize' }}>
                        {rec.category}
                      </Badge>
                      <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                        {rec.priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {rec.confidence}% confidence
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3 p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-700">{rec.impact}</span>
                </div>
                <ul className="space-y-1">
                  {rec.details.map((detail, i) => (
                    <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                      <span className="text-slate-400">•</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2">
                {rec.actions.map((action, i) => (
                  <Button 
                    key={i} 
                    size="sm" 
                    variant={i === 0 ? "default" : "outline"}
                    className={i === 0 ? "bg-violet-600 hover:bg-violet-700" : ""}
                  >
                    {action}
                  </Button>
                ))}
              </div>
            </div>
          );
        })}

        <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl">
          <h4 className="font-semibold text-yellow-900 mb-2">Continuous Optimization</h4>
          <p className="text-sm text-yellow-800">
            AI continuously analyzes your infrastructure and provides actionable recommendations for cost savings, performance improvements, and security enhancements.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}