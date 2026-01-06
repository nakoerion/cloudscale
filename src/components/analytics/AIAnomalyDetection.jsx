import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { AlertTriangle, Activity, Loader2, Sparkles, CheckCircle2, XCircle, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { toast } from "sonner";

const MOCK_METRICS = [
  { time: "00:00", value: 120, baseline: 125 },
  { time: "04:00", value: 85, baseline: 90 },
  { time: "08:00", value: 220, baseline: 200 },
  { time: "12:00", value: 380, baseline: 350 },
  { time: "14:00", value: 890, baseline: 400 },
  { time: "16:00", value: 420, baseline: 380 },
  { time: "20:00", value: 280, baseline: 250 },
  { time: "23:00", value: 150, baseline: 140 }
];

export default function AIAnomalyDetection() {
  const [analyzing, setAnalyzing] = useState(false);
  const [anomalies, setAnomalies] = useState(null);

  const detectAnomalies = async () => {
    setAnalyzing(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze application metrics for anomaly detection:

Metrics Data: ${JSON.stringify(MOCK_METRICS)}

Detect anomalies and provide analysis in JSON format:
{
  "anomalies_detected": <number>,
  "severity": "<critical|warning|info>",
  "anomalies": [
    {
      "timestamp": "<time>",
      "metric": "<metric name>",
      "expected_value": <number>,
      "actual_value": <number>,
      "deviation_percent": <number>,
      "severity": "<critical|warning|info>",
      "probable_cause": "<explanation>",
      "recommended_action": "<action>"
    }
  ],
  "patterns": [
    {
      "pattern": "<pattern name>",
      "description": "<what was detected>",
      "impact": "<potential impact>"
    }
  ],
  "health_score": <0-100>,
  "prediction": "<what might happen next>"
}`,
        response_json_schema: {
          type: "object",
          properties: {
            anomalies_detected: { type: "number" },
            severity: { type: "string" },
            anomalies: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  timestamp: { type: "string" },
                  metric: { type: "string" },
                  expected_value: { type: "number" },
                  actual_value: { type: "number" },
                  deviation_percent: { type: "number" },
                  severity: { type: "string" },
                  probable_cause: { type: "string" },
                  recommended_action: { type: "string" }
                }
              }
            },
            patterns: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  pattern: { type: "string" },
                  description: { type: "string" },
                  impact: { type: "string" }
                }
              }
            },
            health_score: { type: "number" },
            prediction: { type: "string" }
          }
        }
      });

      setAnomalies(result);
      toast.success("Anomaly detection complete!");
    } catch (error) {
      toast.error("Failed to detect anomalies");
    } finally {
      setAnalyzing(false);
    }
  };

  const getSeverityColor = (severity) => ({
    critical: "bg-red-100 text-red-700 border-red-200",
    warning: "bg-amber-100 text-amber-700 border-amber-200",
    info: "bg-blue-100 text-blue-700 border-blue-200"
  }[severity] || "bg-slate-100 text-slate-700");

  return (
    <Card className="border-2 border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            AI Anomaly Detection
          </span>
          <Button 
            onClick={detectAnomalies} 
            disabled={analyzing}
            className="bg-gradient-to-r from-orange-600 to-red-600"
          >
            {analyzing ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" /> Detect Anomalies</>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Metrics Chart */}
        <div className="p-4 bg-slate-50 rounded-xl">
          <p className="text-sm font-medium text-slate-700 mb-3">Request Volume (Last 24h)</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={MOCK_METRICS}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="baseline" stroke="#94a3b8" strokeDasharray="5 5" name="Expected" />
              <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} name="Actual" />
              <ReferenceLine y={400} stroke="#ef4444" strokeDasharray="3 3" label="Threshold" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {anomalies && (
          <div className="space-y-4">
            {/* Health Score */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-orange-50 rounded-xl border border-orange-200">
              <div>
                <p className="text-sm text-slate-600">System Health Score</p>
                <p className="text-3xl font-bold text-slate-900">{anomalies.health_score}/100</p>
              </div>
              <div className="text-right">
                <Badge className={getSeverityColor(anomalies.severity)}>
                  {anomalies.anomalies_detected} anomalies detected
                </Badge>
                <p className="text-xs text-slate-500 mt-1">Overall: {anomalies.severity}</p>
              </div>
            </div>

            {/* Anomalies List */}
            {anomalies.anomalies?.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-700">Detected Anomalies</p>
                {anomalies.anomalies.map((anomaly, i) => (
                  <div key={i} className={`p-4 rounded-xl border-l-4 ${
                    anomaly.severity === 'critical' ? 'bg-red-50 border-red-500' :
                    anomaly.severity === 'warning' ? 'bg-amber-50 border-amber-500' :
                    'bg-blue-50 border-blue-500'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-900">{anomaly.timestamp}</span>
                      </div>
                      <Badge className={getSeverityColor(anomaly.severity)}>{anomaly.severity}</Badge>
                    </div>
                    <p className="text-sm text-slate-700 mb-2">{anomaly.metric}</p>
                    <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                      <div><span className="text-slate-500">Expected:</span> <span className="font-medium">{anomaly.expected_value}</span></div>
                      <div><span className="text-slate-500">Actual:</span> <span className="font-medium">{anomaly.actual_value}</span></div>
                      <div><span className="text-slate-500">Deviation:</span> <span className="font-medium text-red-600">+{anomaly.deviation_percent}%</span></div>
                    </div>
                    <p className="text-xs text-slate-600"><strong>Cause:</strong> {anomaly.probable_cause}</p>
                    <p className="text-xs text-slate-600"><strong>Action:</strong> {anomaly.recommended_action}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Patterns */}
            {anomalies.patterns?.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">Detected Patterns</p>
                {anomalies.patterns.map((pattern, i) => (
                  <div key={i} className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <p className="text-sm font-medium text-indigo-900">{pattern.pattern}</p>
                    <p className="text-xs text-indigo-700">{pattern.description}</p>
                    <p className="text-xs text-indigo-600 mt-1"><strong>Impact:</strong> {pattern.impact}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Prediction */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl">
              <p className="text-sm font-semibold text-purple-900 mb-1">🔮 AI Prediction</p>
              <p className="text-sm text-purple-800">{anomalies.prediction}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}