import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { base44 } from "@/api/base44Client";
import { DollarSign, TrendingDown, Loader2, Sparkles, Server, Database, HardDrive, Zap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { toast } from "sonner";

const CURRENT_COSTS = [
  { category: "Compute", cost: 1250, optimized: 890 },
  { category: "Storage", cost: 480, optimized: 320 },
  { category: "Database", cost: 890, optimized: 650 },
  { category: "Network", cost: 340, optimized: 280 },
  { category: "Other", cost: 190, optimized: 150 }
];

export default function InfrastructureCostOptimizer() {
  const [analyzing, setAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  const analyzeInfrastructure = async () => {
    setAnalyzing(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze infrastructure costs and provide optimization recommendations:

Current Monthly Costs: ${JSON.stringify(CURRENT_COSTS)}
Total: $${CURRENT_COSTS.reduce((s, c) => s + c.cost, 0)}/month

Provide cost optimization analysis in JSON format:
{
  "total_current_cost": <number>,
  "total_optimized_cost": <number>,
  "total_savings": <number>,
  "savings_percentage": <number>,
  "recommendations": [
    {
      "category": "<Compute|Storage|Database|Network>",
      "title": "<recommendation title>",
      "description": "<detailed description>",
      "current_cost": <number>,
      "optimized_cost": <number>,
      "savings": <number>,
      "effort": "<low|medium|high>",
      "risk": "<low|medium|high>",
      "implementation_steps": ["<step 1>", "<step 2>"],
      "timeline": "<estimated time>"
    }
  ],
  "quick_wins": [
    {
      "action": "<quick action>",
      "savings": <number>,
      "timeframe": "<immediate|this week|this month>"
    }
  ],
  "long_term_strategy": "<strategic recommendation>"
}`,
        response_json_schema: {
          type: "object",
          properties: {
            total_current_cost: { type: "number" },
            total_optimized_cost: { type: "number" },
            total_savings: { type: "number" },
            savings_percentage: { type: "number" },
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" },
                  current_cost: { type: "number" },
                  optimized_cost: { type: "number" },
                  savings: { type: "number" },
                  effort: { type: "string" },
                  risk: { type: "string" },
                  implementation_steps: { type: "array", items: { type: "string" } },
                  timeline: { type: "string" }
                }
              }
            },
            quick_wins: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  action: { type: "string" },
                  savings: { type: "number" },
                  timeframe: { type: "string" }
                }
              }
            },
            long_term_strategy: { type: "string" }
          }
        }
      });

      setRecommendations(result);
      toast.success("Cost analysis complete!");
    } catch (error) {
      toast.error("Failed to analyze costs");
    } finally {
      setAnalyzing(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Compute: Server,
      Storage: HardDrive,
      Database: Database,
      Network: Zap
    };
    return icons[category] || Server;
  };

  return (
    <Card className="border-2 border-emerald-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Infrastructure Cost Optimizer
          </span>
          <Button 
            onClick={analyzeInfrastructure} 
            disabled={analyzing}
            className="bg-gradient-to-r from-emerald-600 to-teal-600"
          >
            {analyzing ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" /> Optimize Costs</>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cost Breakdown Chart */}
        <div className="p-4 bg-slate-50 rounded-xl">
          <p className="text-sm font-medium text-slate-700 mb-3">Current vs Optimized Costs</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={CURRENT_COSTS} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="category" width={80} />
              <Tooltip formatter={(value) => `$${value}`} />
              <Bar dataKey="cost" fill="#94a3b8" name="Current" radius={[0, 4, 4, 0]} />
              <Bar dataKey="optimized" fill="#10b981" name="Optimized" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {recommendations && (
          <div className="space-y-4">
            {/* Savings Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-slate-100 rounded-xl text-center">
                <p className="text-xs text-slate-500 mb-1">Current</p>
                <p className="text-xl font-bold text-slate-900">${recommendations.total_current_cost}</p>
              </div>
              <div className="p-4 bg-emerald-100 rounded-xl text-center">
                <p className="text-xs text-emerald-600 mb-1">Optimized</p>
                <p className="text-xl font-bold text-emerald-700">${recommendations.total_optimized_cost}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl text-center text-white">
                <p className="text-xs opacity-80 mb-1">Savings</p>
                <p className="text-xl font-bold">${recommendations.total_savings}</p>
                <p className="text-xs opacity-80">-{recommendations.savings_percentage}%</p>
              </div>
            </div>

            {/* Quick Wins */}
            {recommendations.quick_wins?.length > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm font-semibold text-amber-900 mb-3">⚡ Quick Wins</p>
                <div className="space-y-2">
                  {recommendations.quick_wins.map((win, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-white rounded-lg">
                      <span className="text-sm text-slate-700">{win.action}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{win.timeframe}</Badge>
                        <Badge className="bg-emerald-100 text-emerald-700">Save ${win.savings}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Recommendations */}
            {recommendations.recommendations?.map((rec, i) => {
              const Icon = getCategoryIcon(rec.category);
              return (
                <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Icon className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{rec.title}</p>
                        <p className="text-xs text-slate-500">{rec.category}</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700">Save ${rec.savings}/mo</Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{rec.description}</p>
                  <div className="flex items-center gap-4 text-xs mb-3">
                    <span>Effort: <Badge variant="outline" className="ml-1">{rec.effort}</Badge></span>
                    <span>Risk: <Badge variant="outline" className="ml-1">{rec.risk}</Badge></span>
                    <span>Timeline: <span className="font-medium">{rec.timeline}</span></span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full" onClick={() => toast.success("Implementation guide opened")}>
                    View Implementation Steps
                  </Button>
                </div>
              );
            })}

            {/* Long-term Strategy */}
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl">
              <p className="text-sm font-semibold text-indigo-900 mb-1">📈 Long-term Strategy</p>
              <p className="text-sm text-indigo-800">{recommendations.long_term_strategy}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}