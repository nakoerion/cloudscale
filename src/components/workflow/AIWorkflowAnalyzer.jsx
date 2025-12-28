import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Loader2, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AIWorkflowAnalyzer({ workflow, analytics }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this workflow for optimization opportunities:

Workflow: ${JSON.stringify(workflow)}
Analytics: ${JSON.stringify(analytics)}

Provide:
1. Performance bottlenecks with specific nodes
2. Optimization suggestions with priority
3. Automation opportunities
4. Estimated time savings
5. Risk assessment`,
        response_json_schema: {
          type: "object",
          properties: {
            bottlenecks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  node_name: { type: "string" },
                  issue: { type: "string" },
                  impact: { type: "string" },
                  avg_delay: { type: "string" }
                }
              }
            },
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  priority: { type: "string" },
                  estimated_savings: { type: "string" }
                }
              }
            },
            automationOpportunities: {
              type: "array",
              items: { type: "string" }
            },
            overallScore: { type: "number" },
            riskLevel: { type: "string" }
          }
        }
      });

      setAnalysis(response);
      toast.success("Workflow analyzed successfully!");
    } catch (error) {
      toast.error("Failed to analyze workflow");
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  const performanceData = [
    { time: "Mon", duration: 45 },
    { time: "Tue", duration: 52 },
    { time: "Wed", duration: 38 },
    { time: "Thu", duration: 61 },
    { time: "Fri", duration: 44 },
    { time: "Sat", duration: 35 },
    { time: "Sun", duration: 29 }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            AI Workflow Analysis
          </CardTitle>
          <Button onClick={handleAnalyze} disabled={analyzing} size="sm">
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Workflow"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!analysis ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-slate-500">Click "Analyze Workflow" to get AI insights</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-blue-600 mb-1">Performance Score</p>
                <p className="text-3xl font-bold text-blue-900">{analysis.overallScore}/100</p>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-600 mb-1">Risk Level</p>
                <Badge className="bg-amber-100 text-amber-700 capitalize">{analysis.riskLevel}</Badge>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Performance Trend</h4>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="duration" stroke="#3b82f6" fill="#93c5fd" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {analysis.bottlenecks && analysis.bottlenecks.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Bottlenecks Detected</h4>
                <div className="space-y-2">
                  {analysis.bottlenecks.map((bottleneck, i) => (
                    <div key={i} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-medium text-red-900">{bottleneck.node_name}</span>
                        <Badge className="bg-red-100 text-red-700">{bottleneck.impact}</Badge>
                      </div>
                      <p className="text-sm text-red-800 mb-1">{bottleneck.issue}</p>
                      <p className="text-xs text-red-600">Avg delay: {bottleneck.avg_delay}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.suggestions && analysis.suggestions.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Optimization Suggestions</h4>
                <div className="space-y-2">
                  {analysis.suggestions.map((suggestion, i) => (
                    <div key={i} className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-medium text-emerald-900">{suggestion.title}</span>
                        <Badge className={
                          suggestion.priority === "high" ? "bg-red-100 text-red-700" :
                          suggestion.priority === "medium" ? "bg-amber-100 text-amber-700" :
                          "bg-blue-100 text-blue-700"
                        }>
                          {suggestion.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-emerald-800 mb-1">{suggestion.description}</p>
                      <p className="text-xs text-emerald-600">Est. savings: {suggestion.estimated_savings}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.automationOpportunities && analysis.automationOpportunities.length > 0 && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                <h4 className="font-semibold text-purple-900 mb-2">Automation Opportunities</h4>
                <ul className="space-y-1">
                  {analysis.automationOpportunities.map((opp, i) => (
                    <li key={i} className="text-sm text-purple-800">• {opp}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}