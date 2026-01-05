import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { 
  Sparkles, 
  TrendingDown, 
  Server, 
  HardDrive, 
  Database,
  Zap,
  AlertCircle,
  CheckCircle2,
  Loader2,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";

const OPTIMIZATION_CATEGORIES = {
  compute: { icon: Server, color: "text-blue-500", bg: "bg-blue-50" },
  storage: { icon: HardDrive, color: "text-purple-500", bg: "bg-purple-50" },
  database: { icon: Database, color: "text-emerald-500", bg: "bg-emerald-50" },
  network: { icon: Zap, color: "text-amber-500", bg: "bg-amber-50" }
};

export default function AICostOptimizer({ cloudAccounts = [] }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  const analyzeWithAI = async () => {
    setAnalyzing(true);
    try {
      const accountsData = cloudAccounts.map(acc => ({
        provider: acc.provider,
        monthly_spend: acc.monthly_spend || 0,
        resources_count: acc.resources_count || 0,
        regions: acc.regions || []
      }));

      const prompt = `Analyze cloud infrastructure costs and provide optimization recommendations:

Cloud Accounts: ${JSON.stringify(accountsData, null, 2)}

Provide 5-7 specific cost optimization recommendations in the following JSON format:
{
  "total_potential_savings": <number>,
  "recommendations": [
    {
      "id": "<unique_id>",
      "title": "<brief title>",
      "category": "<compute|storage|database|network>",
      "current_cost": <monthly cost>,
      "optimized_cost": <projected cost>,
      "savings": <monthly savings>,
      "impact": "<high|medium|low>",
      "effort": "<low|medium|high>",
      "description": "<detailed explanation>",
      "action_steps": ["<step 1>", "<step 2>", "<step 3>"],
      "provider": "<aws|azure|gcp|all>"
    }
  ]
}

Focus on realistic recommendations like:
- Rightsizing overprovisioned instances
- Reserved instance purchases for predictable workloads
- Storage tier optimization (move infrequent data to cold storage)
- Spot instances for non-critical workloads
- Removing unused resources
- Database optimization
- Network traffic optimization`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            total_potential_savings: { type: "number" },
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  title: { type: "string" },
                  category: { type: "string" },
                  current_cost: { type: "number" },
                  optimized_cost: { type: "number" },
                  savings: { type: "number" },
                  impact: { type: "string" },
                  effort: { type: "string" },
                  description: { type: "string" },
                  action_steps: { type: "array", items: { type: "string" } },
                  provider: { type: "string" }
                }
              }
            }
          }
        }
      });

      setRecommendations(result);
      toast.success("AI analysis complete - found optimization opportunities!");
    } catch (error) {
      toast.error("Failed to analyze costs");
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  const getImpactColor = (impact) => {
    return {
      high: "bg-emerald-100 text-emerald-700",
      medium: "bg-blue-100 text-blue-700",
      low: "bg-slate-100 text-slate-700"
    }[impact] || "bg-slate-100 text-slate-700";
  };

  const getEffortColor = (effort) => {
    return {
      low: "bg-emerald-100 text-emerald-700",
      medium: "bg-amber-100 text-amber-700",
      high: "bg-red-100 text-red-700"
    }[effort] || "bg-slate-100 text-slate-700";
  };

  return (
    <Card className="border-2 border-violet-200 bg-gradient-to-br from-white to-violet-50/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-600" />
            AI Cost Optimizer
          </span>
          <Button 
            onClick={analyzeWithAI} 
            disabled={analyzing || cloudAccounts.length === 0}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Analyze Costs
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!recommendations && !analyzing && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-violet-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">AI-Powered Cost Analysis</h3>
            <p className="text-sm text-slate-500 mb-4">
              Get personalized recommendations to optimize your cloud spending
            </p>
          </div>
        )}

        {analyzing && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-violet-600 animate-spin mx-auto mb-4" />
            <p className="text-sm text-slate-600">Analyzing your cloud infrastructure...</p>
          </div>
        )}

        {recommendations && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <TrendingDown className="w-6 h-6 text-emerald-600" />
                <h3 className="text-lg font-semibold text-emerald-900">Potential Monthly Savings</h3>
              </div>
              <p className="text-4xl font-bold text-emerald-700">
                ${recommendations.total_potential_savings?.toFixed(2) || '0.00'}
              </p>
              <p className="text-sm text-emerald-600 mt-1">
                Across {recommendations.recommendations?.length || 0} optimization opportunities
              </p>
            </div>

            {/* Recommendations */}
            <div className="space-y-4">
              {recommendations.recommendations?.map((rec, index) => {
                const categoryConfig = OPTIMIZATION_CATEGORIES[rec.category] || OPTIMIZATION_CATEGORIES.compute;
                const Icon = categoryConfig.icon;

                return (
                  <div key={rec.id || index} className="border border-slate-200 rounded-xl p-5 hover:shadow-lg transition-all bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${categoryConfig.bg}`}>
                          <Icon className={`w-5 h-5 ${categoryConfig.color}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 mb-1">{rec.title}</h4>
                          <p className="text-sm text-slate-600 mb-3">{rec.description}</p>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className={getImpactColor(rec.impact)}>
                              {rec.impact} impact
                            </Badge>
                            <Badge className={getEffortColor(rec.effort)}>
                              {rec.effort} effort
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {rec.provider}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Monthly Savings</p>
                        <p className="text-2xl font-bold text-emerald-600">
                          ${rec.savings?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Current Cost</p>
                        <p className="font-semibold text-slate-900">
                          ${rec.current_cost?.toFixed(2)}/mo
                        </p>
                      </div>
                      <div className="p-3 bg-emerald-50 rounded-lg">
                        <p className="text-xs text-emerald-600 mb-1">Optimized Cost</p>
                        <p className="font-semibold text-emerald-700">
                          ${rec.optimized_cost?.toFixed(2)}/mo
                        </p>
                      </div>
                    </div>

                    {/* Action Steps */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-700 mb-2">Action Steps:</p>
                      {rec.action_steps?.map((step, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <p className="text-sm text-slate-600">{step}</p>
                        </div>
                      ))}
                    </div>

                    <Button 
                      className="w-full mt-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                      onClick={() => toast.success("Optimization guide opened - implementation started")}
                    >
                      Implement Optimization
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}