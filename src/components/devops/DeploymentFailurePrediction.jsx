import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle2, TrendingDown, Brain } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const PREDICTION = {
  failureRisk: 68,
  confidence: 92,
  factors: [
    { name: "Code complexity increased by 45%", impact: "high", weight: 35 },
    { name: "High memory usage in staging tests", impact: "medium", weight: 20 },
    { name: "Database migration pending", impact: "medium", weight: 18 },
    { name: "New dependencies added", impact: "low", weight: 10 },
    { name: "Deployment time is peak hours", impact: "low", weight: 5 }
  ],
  recommendations: [
    "Review and simplify complex code modules before deployment",
    "Optimize memory-intensive operations",
    "Test database migration in staging first",
    "Schedule deployment during low-traffic hours"
  ]
};

const HISTORY_DATA = [
  { date: "Mon", success: 95, failures: 5 },
  { date: "Tue", success: 98, failures: 2 },
  { date: "Wed", success: 92, failures: 8 },
  { date: "Thu", success: 97, failures: 3 },
  { date: "Fri", success: 89, failures: 11 },
  { date: "Sat", success: 94, failures: 6 },
  { date: "Sun", success: 96, failures: 4 }
];

export default function DeploymentFailurePrediction() {
  const getRiskColor = (risk) => {
    if (risk < 30) return "text-emerald-600";
    if (risk < 60) return "text-amber-600";
    return "text-red-600";
  };

  const getRiskBgColor = (risk) => {
    if (risk < 30) return "bg-emerald-100";
    if (risk < 60) return "bg-amber-100";
    return "bg-red-100";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-600" />
            AI Deployment Failure Prediction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-slate-600 mb-1">Current Deployment Risk</p>
                <div className="flex items-center gap-3">
                  <span className={`text-4xl font-bold ${getRiskColor(PREDICTION.failureRisk)}`}>
                    {PREDICTION.failureRisk}%
                  </span>
                  <Badge className={getRiskBgColor(PREDICTION.failureRisk)}>
                    {PREDICTION.failureRisk < 30 ? "Low Risk" : PREDICTION.failureRisk < 60 ? "Medium Risk" : "High Risk"}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600 mb-1">AI Confidence</p>
                <p className="text-2xl font-bold text-violet-600">{PREDICTION.confidence}%</p>
              </div>
            </div>
            <Progress value={PREDICTION.failureRisk} className="h-3" />
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-slate-900 mb-3">Risk Factors (AI Analysis)</h4>
            <div className="space-y-2">
              {PREDICTION.factors.map((factor, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {factor.impact === "high" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                      {factor.impact === "medium" && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                      {factor.impact === "low" && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                      <span className="text-sm font-medium text-slate-900">{factor.name}</span>
                    </div>
                    <Progress value={factor.weight} className="h-1.5" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {factor.weight}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              AI Recommendations to Reduce Risk
            </h4>
            <ul className="space-y-2">
              {PREDICTION.recommendations.map((rec, i) => (
                <li key={i} className="text-sm text-blue-800 flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deployment Success Rate (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={HISTORY_DATA}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="success" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="failures" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}