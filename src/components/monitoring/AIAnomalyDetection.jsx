import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, Activity, Brain } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const ANOMALIES = [
  {
    id: 1,
    metric: "CPU Utilization",
    severity: "critical",
    detected: "5 minutes ago",
    value: 94.5,
    baseline: 45,
    deviation: "+110%",
    description: "Abnormal CPU spike detected on production-web-01",
    trend: [
      { time: "00:00", value: 42, baseline: 45 },
      { time: "00:05", value: 47, baseline: 45 },
      { time: "00:10", value: 44, baseline: 45 },
      { time: "00:15", value: 51, baseline: 45 },
      { time: "00:20", value: 94.5, baseline: 45 }
    ],
    possibleCauses: [
      "Infinite loop in recent deployment",
      "Unexpected traffic surge",
      "Memory leak causing CPU thrashing"
    ]
  },
  {
    id: 2,
    metric: "Database Connections",
    severity: "high",
    detected: "12 minutes ago",
    value: 387,
    baseline: 120,
    deviation: "+223%",
    description: "Connection pool exhaustion risk on primary RDS",
    trend: [
      { time: "00:00", value: 115, baseline: 120 },
      { time: "00:05", value: 125, baseline: 120 },
      { time: "00:10", value: 180, baseline: 120 },
      { time: "00:15", value: 285, baseline: 120 },
      { time: "00:20", value: 387, baseline: 120 }
    ],
    possibleCauses: [
      "Connection leak in application code",
      "Missing connection pooling configuration",
      "Slow queries preventing connection release"
    ]
  },
  {
    id: 3,
    metric: "Response Time",
    severity: "medium",
    detected: "18 minutes ago",
    value: 2.8,
    baseline: 0.3,
    deviation: "+833%",
    description: "API response time degradation detected",
    trend: [
      { time: "00:00", value: 0.28, baseline: 0.3 },
      { time: "00:05", value: 0.32, baseline: 0.3 },
      { time: "00:10", value: 0.85, baseline: 0.3 },
      { time: "00:15", value: 1.6, baseline: 0.3 },
      { time: "00:20", value: 2.8, baseline: 0.3 }
    ],
    possibleCauses: [
      "Database query performance degradation",
      "External API latency increase",
      "Cache invalidation causing increased load"
    ]
  }
];

export default function AIAnomalyDetection() {
  const getSeverityColor = (severity) => {
    const colors = {
      critical: "bg-red-100 text-red-700 border-red-300",
      high: "bg-amber-100 text-amber-700 border-amber-300",
      medium: "bg-blue-100 text-blue-700 border-blue-300"
    };
    return colors[severity] || "bg-slate-100 text-slate-700";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          AI Anomaly Detection
          <Badge className="bg-purple-100 text-purple-700 ml-auto">Live</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {ANOMALIES.map((anomaly) => (
          <div key={anomaly.id} className="border-2 border-slate-200 rounded-xl p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className={`w-6 h-6 ${
                  anomaly.severity === "critical" ? "text-red-500" :
                  anomaly.severity === "high" ? "text-amber-500" :
                  "text-blue-500"
                }`} />
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">{anomaly.metric}</h4>
                  <p className="text-sm text-slate-600 mb-2">{anomaly.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(anomaly.severity)}>
                      {anomaly.severity}
                    </Badge>
                    <span className="text-xs text-slate-500">{anomaly.detected}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-semibold text-red-600">{anomaly.deviation}</span>
                </div>
                <p className="text-xs text-slate-500">vs baseline</p>
              </div>
            </div>

            <div className="mb-4 bg-slate-50 rounded-lg p-3">
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={anomaly.trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <ReferenceLine y={anomaly.baseline} stroke="#94a3b8" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="baseline" stroke="#94a3b8" strokeWidth={1} dot={false} />
                  <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm font-medium text-amber-900 mb-2">🔍 Possible Causes:</p>
              <ul className="space-y-1">
                {anomaly.possibleCauses.map((cause, i) => (
                  <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    {cause}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Activity className="w-3 h-3 mr-1" /> View Metrics
              </Button>
              <Button size="sm" variant="outline">
                Create Alert
              </Button>
              <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                Auto-Remediate
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}