import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp, AlertTriangle, Sparkles, Loader2, Calendar, DollarSign } from "lucide-react";
import { toast } from "sonner";

export default function PredictiveCostAnalyzer({ templates = [], currentSpend = 0 }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [timeframe, setTimeframe] = useState("3months");

  const analyzePredictiveCosts = async () => {
    setAnalyzing(true);
    try {
      const template = templates.find(t => t.id === selectedTemplate);
      
      const prompt = `Perform predictive cost analysis for deploying infrastructure:

Current Monthly Spend: $${currentSpend}
Template: ${template?.name || 'Standard Infrastructure'}
Template Resources: ${template?.template_type || 'compute'}
Provider: ${template?.provider || 'aws'}
Timeframe: ${timeframe}

Provide prediction in this JSON format:
{
  "projected_costs": [
    {"month": "Jan", "cost": <number>, "baseline": <number>},
    {"month": "Feb", "cost": <number>, "baseline": <number>}
  ],
  "total_projected": <number>,
  "confidence": <0-100>,
  "cost_drivers": [
    {"factor": "<factor name>", "impact": "<high|medium|low>", "increase_percent": <number>}
  ],
  "alerts": [
    {
      "severity": "<critical|warning|info>",
      "message": "<alert message>",
      "threshold": <cost threshold>,
      "action": "<recommended action>"
    }
  ],
  "automated_actions": [
    {
      "action": "<action name>",
      "description": "<what it does>",
      "savings": <monthly savings>,
      "risk": "<low|medium|high>",
      "can_automate": <boolean>
    }
  ],
  "recommendations": {
    "reserved_instances": {"savings": <number>, "commitment": "<1yr|3yr>"},
    "spot_instances": {"savings": <number>, "coverage": "<percentage>"},
    "rightsizing": {"savings": <number>, "instances": <count>}
  }
}`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            projected_costs: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  month: { type: "string" },
                  cost: { type: "number" },
                  baseline: { type: "number" }
                }
              }
            },
            total_projected: { type: "number" },
            confidence: { type: "number" },
            cost_drivers: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  factor: { type: "string" },
                  impact: { type: "string" },
                  increase_percent: { type: "number" }
                }
              }
            },
            alerts: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  severity: { type: "string" },
                  message: { type: "string" },
                  threshold: { type: "number" },
                  action: { type: "string" }
                }
              }
            },
            automated_actions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  action: { type: "string" },
                  description: { type: "string" },
                  savings: { type: "number" },
                  risk: { type: "string" },
                  can_automate: { type: "boolean" }
                }
              }
            },
            recommendations: {
              type: "object",
              properties: {
                reserved_instances: {
                  type: "object",
                  properties: {
                    savings: { type: "number" },
                    commitment: { type: "string" }
                  }
                },
                spot_instances: {
                  type: "object",
                  properties: {
                    savings: { type: "number" },
                    coverage: { type: "string" }
                  }
                },
                rightsizing: {
                  type: "object",
                  properties: {
                    savings: { type: "number" },
                    instances: { type: "number" }
                  }
                }
              }
            }
          }
        }
      });

      setPrediction(result);
      toast.success("Predictive analysis complete!");
    } catch (error) {
      toast.error("Failed to generate prediction");
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAutomatedAction = (action) => {
    toast.success(`Scheduling automated action: ${action.action}`);
  };

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Predictive Cost Analysis
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger>
              <SelectValue placeholder="Select Template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map(t => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={analyzePredictiveCosts}
          disabled={analyzing || !selectedTemplate}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
        >
          {analyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Prediction
            </>
          )}
        </Button>

        {prediction && (
          <div className="space-y-4">
            {/* Projection Chart */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-blue-700 mb-1">Projected Total Cost</p>
                  <p className="text-3xl font-bold text-blue-900">${prediction.total_projected?.toFixed(2)}</p>
                </div>
                <Badge className="bg-blue-100 text-blue-700">
                  {prediction.confidence}% confidence
                </Badge>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={prediction.projected_costs}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="baseline" stroke="#94a3b8" fill="#cbd5e1" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="cost" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Alerts */}
            {prediction.alerts?.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">Cost Alerts</p>
                {prediction.alerts.map((alert, i) => (
                  <div key={i} className={`p-3 rounded-lg border-l-4 ${
                    alert.severity === 'critical' ? 'bg-red-50 border-red-500' :
                    alert.severity === 'warning' ? 'bg-amber-50 border-amber-500' :
                    'bg-blue-50 border-blue-500'
                  }`}>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                        alert.severity === 'critical' ? 'text-red-600' :
                        alert.severity === 'warning' ? 'text-amber-600' :
                        'text-blue-600'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{alert.message}</p>
                        <p className="text-xs text-slate-600 mt-1">Threshold: ${alert.threshold}</p>
                        <p className="text-xs text-slate-600">Action: {alert.action}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Automated Actions */}
            {prediction.automated_actions?.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">Automated Cost-Saving Actions</p>
                {prediction.automated_actions.map((action, i) => (
                  <div key={i} className="p-3 bg-white border border-slate-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-slate-900">{action.action}</p>
                        <p className="text-sm text-slate-600">{action.description}</p>
                      </div>
                      <Badge className={
                        action.risk === 'low' ? 'bg-emerald-100 text-emerald-700' :
                        action.risk === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }>
                        {action.risk} risk
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-emerald-600">
                        Save ${action.savings}/mo
                      </span>
                      {action.can_automate && (
                        <Button size="sm" onClick={() => handleAutomatedAction(action)}>
                          Enable Auto-Action
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recommendations */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-xs text-emerald-600 mb-1">Reserved Instances</p>
                <p className="text-lg font-bold text-emerald-900">
                  ${prediction.recommendations?.reserved_instances?.savings || 0}
                </p>
                <p className="text-xs text-emerald-700">
                  {prediction.recommendations?.reserved_instances?.commitment} commitment
                </p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-600 mb-1">Spot Instances</p>
                <p className="text-lg font-bold text-blue-900">
                  ${prediction.recommendations?.spot_instances?.savings || 0}
                </p>
                <p className="text-xs text-blue-700">
                  {prediction.recommendations?.spot_instances?.coverage} coverage
                </p>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-xs text-purple-600 mb-1">Rightsizing</p>
                <p className="text-lg font-bold text-purple-900">
                  ${prediction.recommendations?.rightsizing?.savings || 0}
                </p>
                <p className="text-xs text-purple-700">
                  {prediction.recommendations?.rightsizing?.instances} instances
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}