import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, AlertCircle, CheckCircle2, Brain } from "lucide-react";

const PREDICTIONS = [
  {
    id: 1,
    metric: "User Growth",
    current: "15,420 users",
    predicted: "18,900 users",
    timeframe: "Next 30 days",
    confidence: 89,
    trend: "up",
    change: "+23%"
  },
  {
    id: 2,
    metric: "Revenue",
    current: "$142,350",
    predicted: "$168,200",
    timeframe: "Next 30 days",
    confidence: 92,
    trend: "up",
    change: "+18%"
  },
  {
    id: 3,
    metric: "Churn Rate",
    current: "6.2%",
    predicted: "4.8%",
    timeframe: "Next 30 days",
    confidence: 85,
    trend: "down",
    change: "-23%"
  },
  {
    id: 4,
    metric: "Feature Adoption",
    current: "54%",
    predicted: "67%",
    timeframe: "Next 30 days",
    confidence: 78,
    trend: "up",
    change: "+24%"
  }
];

export default function PredictiveAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          Predictive Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {PREDICTIONS.map((prediction) => (
          <div key={prediction.id} className="p-4 border-2 rounded-xl" style={{
            borderColor: prediction.trend === "up" ? "#10b981" : "#3b82f6"
          }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">{prediction.metric}</h4>
                <p className="text-sm text-slate-600">{prediction.timeframe}</p>
              </div>
              <Badge className={
                prediction.trend === "up" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
              }>
                {prediction.change}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Current</p>
                <p className="text-lg font-bold text-slate-900">{prediction.current}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg">
                <p className="text-xs text-emerald-600 mb-1">Predicted</p>
                <p className="text-lg font-bold text-emerald-700">{prediction.predicted}</p>
              </div>
            </div>

            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-600">AI Confidence</span>
                <span className="text-xs font-semibold text-slate-900">{prediction.confidence}%</span>
              </div>
              <Progress value={prediction.confidence} className="h-2" />
            </div>
          </div>
        ))}

        <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-semibold text-purple-900 mb-1">Overall Outlook</h5>
              <p className="text-sm text-purple-800">
                AI predicts strong growth trajectory with decreasing churn. All key metrics trending positively based on historical patterns and market conditions.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}