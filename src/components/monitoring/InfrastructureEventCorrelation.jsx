import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitBranch, AlertTriangle, Clock, Server, Link2 } from "lucide-react";

const CORRELATIONS = [
  {
    id: 1,
    deployment: {
      version: "v2.4.8",
      timestamp: "1 day ago",
      status: "failed",
      commit: "c7d3a1b"
    },
    events: [
      {
        type: "cpu_spike",
        metric: "CPU Usage",
        value: "92%",
        time: "2 minutes after deploy",
        severity: "critical"
      },
      {
        type: "error_rate",
        metric: "Error Rate",
        value: "12.5%",
        time: "3 minutes after deploy",
        severity: "critical"
      },
      {
        type: "memory_leak",
        metric: "Memory Usage",
        value: "89%",
        time: "5 minutes after deploy",
        severity: "high"
      }
    ],
    correlation: 96,
    rootCause: "Memory leak in new feature causing CPU thrashing and increased error rate",
    recommendation: "Rollback to v2.4.7 and investigate memory management in UserProfile component"
  },
  {
    id: 2,
    deployment: {
      version: "v2.4.6",
      timestamp: "3 days ago",
      status: "success",
      commit: "e1a5c3f"
    },
    events: [
      {
        type: "db_slow_query",
        metric: "Query Time",
        value: "2.3s",
        time: "10 minutes after deploy",
        severity: "medium"
      },
      {
        type: "response_time",
        metric: "API Response Time",
        value: "1.8s",
        time: "12 minutes after deploy",
        severity: "medium"
      }
    ],
    correlation: 88,
    rootCause: "Missing database index on new queries introduced in migration",
    recommendation: "Add composite index on (user_id, created_at) to improve query performance"
  }
];

export default function InfrastructureEventCorrelation() {
  const getSeverityColor = (severity) => {
    const colors = {
      critical: "bg-red-100 text-red-700",
      high: "bg-amber-100 text-amber-700",
      medium: "bg-blue-100 text-blue-700"
    };
    return colors[severity] || "bg-slate-100 text-slate-700";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-cyan-600" />
          Deployment Event Correlation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {CORRELATIONS.map((correlation) => (
          <div key={correlation.id} className="border-2 border-slate-200 rounded-xl p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  correlation.deployment.status === "failed" ? "bg-red-100" : "bg-emerald-100"
                }`}>
                  <GitBranch className={`w-5 h-5 ${
                    correlation.deployment.status === "failed" ? "text-red-600" : "text-emerald-600"
                  }`} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">
                    Deployment {correlation.deployment.version}
                  </h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-mono">
                      {correlation.deployment.commit}
                    </Badge>
                    <span className="text-xs text-slate-500">{correlation.deployment.timestamp}</span>
                  </div>
                </div>
              </div>
              <Badge className="bg-cyan-100 text-cyan-700">
                {correlation.correlation}% correlation
              </Badge>
            </div>

            <div className="mb-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-xs font-semibold text-slate-700 mb-3">Correlated Infrastructure Events:</p>
              <div className="space-y-2">
                {correlation.events.map((event, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-white rounded-lg">
                    <Server className="w-4 h-4 text-slate-400" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-900">{event.metric}</span>
                        <Badge className={getSeverityColor(event.severity)} style={{ fontSize: '10px' }}>
                          {event.value}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-500">{event.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-900 mb-1">Root Cause Analysis</p>
                  <p className="text-sm text-amber-800">{correlation.rootCause}</p>
                </div>
              </div>
            </div>

            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-1">💡 Recommendation</p>
              <p className="text-sm text-blue-800">{correlation.recommendation}</p>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                View Timeline
              </Button>
              <Button size="sm" variant="outline">
                View Metrics
              </Button>
              {correlation.deployment.status === "failed" && (
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  Rollback
                </Button>
              )}
            </div>
          </div>
        ))}

        <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl">
          <h4 className="font-semibold text-cyan-900 mb-2">AI-Powered Correlation</h4>
          <p className="text-sm text-cyan-800">
            Machine learning analyzes deployment patterns and infrastructure events to identify causal relationships and predict failure scenarios.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}