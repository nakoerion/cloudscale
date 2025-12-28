import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, TrendingUp, Clock, HardDrive, Cpu, Database } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const PREDICTIONS = [
  {
    id: 1,
    resource: "Storage",
    icon: HardDrive,
    current: 78,
    predicted: 100,
    timeToExhaustion: "4 days",
    confidence: 94,
    trend: "increasing",
    forecast: [
      { day: "Day 1", usage: 78, predicted: 82 },
      { day: "Day 2", usage: 82, predicted: 87 },
      { day: "Day 3", usage: 87, predicted: 93 },
      { day: "Day 4", usage: 93, predicted: 100 }
    ],
    recommendation: "Increase EBS volume from 500GB to 1TB or implement log rotation policy",
    impact: "critical"
  },
  {
    id: 2,
    resource: "Memory",
    icon: Cpu,
    current: 68,
    predicted: 95,
    timeToExhaustion: "7 days",
    confidence: 89,
    trend: "increasing",
    forecast: [
      { day: "Day 1", usage: 68, predicted: 72 },
      { day: "Day 2", usage: 72, predicted: 77 },
      { day: "Day 3", usage: 77, predicted: 83 },
      { day: "Day 4", usage: 83, predicted: 89 },
      { day: "Day 5", usage: 89, predicted: 95 }
    ],
    recommendation: "Scale to t3.large instances or implement memory optimization in application",
    impact: "high"
  },
  {
    id: 3,
    resource: "Database Connections",
    icon: Database,
    current: 142,
    predicted: 200,
    timeToExhaustion: "12 days",
    confidence: 82,
    trend: "increasing",
    forecast: [
      { day: "Day 1", usage: 142, predicted: 155 },
      { day: "Day 2", usage: 155, predicted: 168 },
      { day: "Day 3", usage: 168, predicted: 182 },
      { day: "Day 4", usage: 182, predicted: 200 }
    ],
    recommendation: "Increase max_connections parameter or implement connection pooling",
    impact: "medium"
  }
];

export default function ResourceExhaustionPredictor() {
  const getImpactColor = (impact) => {
    const colors = {
      critical: "text-red-600 bg-red-50",
      high: "text-amber-600 bg-amber-50",
      medium: "text-blue-600 bg-blue-50"
    };
    return colors[impact] || "text-slate-600 bg-slate-50";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-600" />
          Resource Exhaustion Prediction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {PREDICTIONS.map((prediction) => {
          const Icon = prediction.icon;
          return (
            <div key={prediction.id} className="border-2 border-slate-200 rounded-xl p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getImpactColor(prediction.impact)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">{prediction.resource}</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={
                        prediction.impact === "critical" ? "border-red-300 text-red-700" :
                        prediction.impact === "high" ? "border-amber-300 text-amber-700" :
                        "border-blue-300 text-blue-700"
                      }>
                        {prediction.impact} priority
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {prediction.confidence}% confidence
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Clock className="w-4 h-4 text-red-500" />
                    <span className="font-semibold text-red-600">{prediction.timeToExhaustion}</span>
                  </div>
                  <p className="text-xs text-slate-500">until exhaustion</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Current Usage</span>
                  <span className="text-sm font-semibold text-slate-900">{prediction.current}%</span>
                </div>
                <Progress value={prediction.current} className="h-2 mb-1" />
                <p className="text-xs text-slate-500">
                  Predicted to reach {prediction.predicted}% in {prediction.timeToExhaustion}
                </p>
              </div>

              <div className="mb-4 bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-600 mb-2 font-medium">Usage Forecast</p>
                <ResponsiveContainer width="100%" height={100}>
                  <AreaChart data={prediction.forecast}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                    <Tooltip />
                    <Area type="monotone" dataKey="usage" stroke="#3b82f6" fill="#93c5fd" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="predicted" stroke="#ef4444" fill="#fca5a5" fillOpacity={0.2} strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-1">AI Recommendation</p>
                    <p className="text-sm text-blue-800">{prediction.recommendation}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  View Details
                </Button>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                  Auto-Scale Now
                </Button>
              </div>
            </div>
          );
        })}

        <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl">
          <h4 className="font-semibold text-orange-900 mb-2">Predictive Scaling</h4>
          <p className="text-sm text-orange-800">
            AI monitors resource trends and predicts exhaustion before it occurs, enabling proactive scaling and preventing outages.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}