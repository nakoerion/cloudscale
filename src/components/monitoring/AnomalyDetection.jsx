import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, Zap, Clock, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const ANOMALIES = [
  {
    id: 1,
    type: "Response Time Spike",
    severity: "critical",
    detected: "2 minutes ago",
    metric: "avg_response_time",
    value: 2450,
    baseline: 180,
    confidence: 98
  },
  {
    id: 2,
    type: "Unusual Error Rate",
    severity: "warning",
    detected: "15 minutes ago",
    metric: "error_rate",
    value: 5.2,
    baseline: 0.8,
    confidence: 92
  },
  {
    id: 3,
    type: "Memory Usage Anomaly",
    severity: "info",
    detected: "1 hour ago",
    metric: "memory_usage",
    value: 78,
    baseline: 45,
    confidence: 85
  }
];

const TREND_DATA = [
  { time: "00:00", value: 180, threshold: 500 },
  { time: "04:00", value: 165, threshold: 500 },
  { time: "08:00", value: 220, threshold: 500 },
  { time: "12:00", value: 280, threshold: 500 },
  { time: "16:00", value: 2450, threshold: 500 },
  { time: "20:00", value: 2100, threshold: 500 },
  { time: "Now", value: 1950, threshold: 500 }
];

export default function AnomalyDetection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-600" />
            AI-Powered Anomaly Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ANOMALIES.map((anomaly) => (
              <div 
                key={anomaly.id}
                className="p-4 border-2 rounded-xl bg-gradient-to-r from-white to-slate-50"
                style={{
                  borderColor: 
                    anomaly.severity === "critical" ? "#ef4444" :
                    anomaly.severity === "warning" ? "#f59e0b" :
                    "#3b82f6"
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      anomaly.severity === "critical" ? "bg-red-100" :
                      anomaly.severity === "warning" ? "bg-amber-100" :
                      "bg-blue-100"
                    }`}>
                      <AlertTriangle className={`w-5 h-5 ${
                        anomaly.severity === "critical" ? "text-red-600" :
                        anomaly.severity === "warning" ? "text-amber-600" :
                        "text-blue-600"
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{anomaly.type}</h4>
                      <p className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3" />
                        Detected {anomaly.detected}
                      </p>
                    </div>
                  </div>
                  <Badge className={
                    anomaly.severity === "critical" ? "bg-red-100 text-red-700" :
                    anomaly.severity === "warning" ? "bg-amber-100 text-amber-700" :
                    "bg-blue-100 text-blue-700"
                  }>
                    {anomaly.severity}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3 p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Current Value</p>
                    <p className="font-semibold text-slate-900">{anomaly.value}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Baseline</p>
                    <p className="font-semibold text-slate-900">{anomaly.baseline}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Confidence</p>
                    <p className="font-semibold text-emerald-600">{anomaly.confidence}%</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Investigate</Button>
                  <Button size="sm" variant="outline">Create Alert</Button>
                  <Button size="sm" variant="outline">Dismiss</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-violet-600" />
            Response Time Pattern Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={TREND_DATA}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <ReferenceLine y={500} stroke="#ef4444" strokeDasharray="3 3" label="Threshold" />
              <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>AI Insight:</strong> Response time spike detected at 16:00. Pattern suggests database connection pool exhaustion. Recommend increasing pool size or optimizing slow queries.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}