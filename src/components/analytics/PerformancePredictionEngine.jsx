import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { base44 } from "@/api/base44Client";
import { Brain, TrendingUp, Loader2, Sparkles, AlertTriangle, CheckCircle2, Clock, Zap } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

const PERFORMANCE_HISTORY = [
  { day: "Mon", responseTime: 120, errorRate: 0.5, throughput: 850 },
  { day: "Tue", responseTime: 115, errorRate: 0.4, throughput: 920 },
  { day: "Wed", responseTime: 135, errorRate: 0.8, throughput: 780 },
  { day: "Thu", responseTime: 125, errorRate: 0.6, throughput: 890 },
  { day: "Fri", responseTime: 180, errorRate: 1.2, throughput: 650 },
  { day: "Sat", responseTime: 95, errorRate: 0.3, throughput: 420 },
  { day: "Sun", responseTime: 90, errorRate: 0.2, throughput: 380 }
];

export default function PerformancePredictionEngine() {
  const [analyzing, setAnalyzing] = useState(false);
  const [predictions, setPredictions] = useState(null);

  const generatePredictions = async () => {
    setAnalyzing(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze application performance data and predict future behavior:

Historical Performance: ${JSON.stringify(PERFORMANCE_HISTORY)}

Generate performance predictions in JSON format:
{
  "overall_health": "<excellent|good|fair|poor>",
  "health_score": <0-100>,
  "predictions": {
    "response_time": {
      "next_week_avg": <number>,
      "trend": "<improving|stable|degrading>",
      "confidence": <0-100>
    },
    "error_rate": {
      "next_week_avg": <number>,
      "trend": "<improving|stable|degrading>",
      "confidence": <0-100>
    },
    "throughput": {
      "next_week_avg": <number>,
      "trend": "<improving|stable|degrading>",
      "confidence": <0-100>
    }
  },
  "potential_issues": [
    {
      "issue": "<issue description>",
      "probability": <0-100>,
      "impact": "<high|medium|low>",
      "timeframe": "<when it might occur>",
      "prevention": "<how to prevent>"
    }
  ],
  "optimization_opportunities": [
    {
      "area": "<area to optimize>",
      "current_performance": "<current state>",
      "potential_improvement": "<expected improvement>",
      "effort": "<low|medium|high>"
    }
  ],
  "capacity_forecast": {
    "current_utilization": <percentage>,
    "days_until_capacity": <number>,
    "recommendation": "<scaling recommendation>"
  }
}`,
        response_json_schema: {
          type: "object",
          properties: {
            overall_health: { type: "string" },
            health_score: { type: "number" },
            predictions: {
              type: "object",
              properties: {
                response_time: {
                  type: "object",
                  properties: {
                    next_week_avg: { type: "number" },
                    trend: { type: "string" },
                    confidence: { type: "number" }
                  }
                },
                error_rate: {
                  type: "object",
                  properties: {
                    next_week_avg: { type: "number" },
                    trend: { type: "string" },
                    confidence: { type: "number" }
                  }
                },
                throughput: {
                  type: "object",
                  properties: {
                    next_week_avg: { type: "number" },
                    trend: { type: "string" },
                    confidence: { type: "number" }
                  }
                }
              }
            },
            potential_issues: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  issue: { type: "string" },
                  probability: { type: "number" },
                  impact: { type: "string" },
                  timeframe: { type: "string" },
                  prevention: { type: "string" }
                }
              }
            },
            optimization_opportunities: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  area: { type: "string" },
                  current_performance: { type: "string" },
                  potential_improvement: { type: "string" },
                  effort: { type: "string" }
                }
              }
            },
            capacity_forecast: {
              type: "object",
              properties: {
                current_utilization: { type: "number" },
                days_until_capacity: { type: "number" },
                recommendation: { type: "string" }
              }
            }
          }
        }
      });

      setPredictions(result);
      toast.success("Performance predictions generated!");
    } catch (error) {
      toast.error("Failed to generate predictions");
    } finally {
      setAnalyzing(false);
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === "improving") return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    if (trend === "degrading") return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
    return <span className="w-4 h-4 text-slate-400">→</span>;
  };

  const getHealthColor = (health) => ({
    excellent: "bg-emerald-100 text-emerald-700",
    good: "bg-blue-100 text-blue-700",
    fair: "bg-amber-100 text-amber-700",
    poor: "bg-red-100 text-red-700"
  }[health] || "bg-slate-100 text-slate-700");

  return (
    <Card className="border-2 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Performance Prediction Engine
          </span>
          <Button 
            onClick={generatePredictions} 
            disabled={analyzing}
            className="bg-gradient-to-r from-purple-600 to-indigo-600"
          >
            {analyzing ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" /> Generate Predictions</>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Performance Chart */}
        <div className="p-4 bg-slate-50 rounded-xl">
          <p className="text-sm font-medium text-slate-700 mb-3">Historical Performance (7 Days)</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={PERFORMANCE_HISTORY}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="responseTime" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} name="Response Time (ms)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {predictions && (
          <div className="space-y-4">
            {/* Health Score */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
              <div>
                <p className="text-sm text-slate-600">Overall Health</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-3xl font-bold text-slate-900">{predictions.health_score}</p>
                  <span className="text-slate-500">/100</span>
                </div>
              </div>
              <Badge className={getHealthColor(predictions.overall_health)}>
                {predictions.overall_health}
              </Badge>
            </div>

            {/* Metric Predictions */}
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(predictions.predictions || {}).map(([metric, data]) => (
                <div key={metric} className="p-4 bg-white border border-slate-200 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-slate-500 capitalize">{metric.replace('_', ' ')}</p>
                    {getTrendIcon(data.trend)}
                  </div>
                  <p className="text-lg font-bold text-slate-900">
                    {metric === 'error_rate' ? `${data.next_week_avg}%` : 
                     metric === 'response_time' ? `${data.next_week_avg}ms` : 
                     data.next_week_avg}
                  </p>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500">Confidence</span>
                      <span className="font-medium">{data.confidence}%</span>
                    </div>
                    <Progress value={data.confidence} className="h-1" />
                  </div>
                </div>
              ))}
            </div>

            {/* Potential Issues */}
            {predictions.potential_issues?.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">⚠️ Potential Issues</p>
                {predictions.potential_issues.map((issue, i) => (
                  <div key={i} className={`p-3 rounded-lg border-l-4 ${
                    issue.impact === 'high' ? 'bg-red-50 border-red-500' :
                    issue.impact === 'medium' ? 'bg-amber-50 border-amber-500' :
                    'bg-blue-50 border-blue-500'
                  }`}>
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm font-medium text-slate-900">{issue.issue}</p>
                      <Badge variant="outline">{issue.probability}% likely</Badge>
                    </div>
                    <p className="text-xs text-slate-600">Timeframe: {issue.timeframe}</p>
                    <p className="text-xs text-slate-600 mt-1"><strong>Prevention:</strong> {issue.prevention}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Optimization Opportunities */}
            {predictions.optimization_opportunities?.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">🚀 Optimization Opportunities</p>
                {predictions.optimization_opportunities.map((opp, i) => (
                  <div key={i} className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-emerald-900">{opp.area}</p>
                        <p className="text-xs text-emerald-700">Current: {opp.current_performance}</p>
                        <p className="text-xs text-emerald-700">Potential: {opp.potential_improvement}</p>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700">{opp.effort} effort</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Capacity Forecast */}
            {predictions.capacity_forecast && (
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  <p className="text-sm font-semibold text-indigo-900">Capacity Forecast</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <p className="text-xs text-indigo-600">Current Utilization</p>
                    <p className="text-xl font-bold text-indigo-900">{predictions.capacity_forecast.current_utilization}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-indigo-600">Days Until Capacity</p>
                    <p className="text-xl font-bold text-indigo-900">{predictions.capacity_forecast.days_until_capacity}</p>
                  </div>
                </div>
                <p className="text-xs text-indigo-800"><strong>Recommendation:</strong> {predictions.capacity_forecast.recommendation}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}