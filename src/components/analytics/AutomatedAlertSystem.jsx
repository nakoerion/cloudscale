import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import { Bell, AlertTriangle, CheckCircle2, XCircle, Clock, Plus, Trash2, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

const DEFAULT_ALERTS = [
  { id: 1, name: "High Error Rate", condition: "error_rate > 5%", severity: "critical", enabled: true, channel: "email" },
  { id: 2, name: "Response Time Spike", condition: "avg_response_time > 2s", severity: "warning", enabled: true, channel: "slack" },
  { id: 3, name: "Low Disk Space", condition: "disk_usage > 85%", severity: "warning", enabled: true, channel: "email" },
  { id: 4, name: "CPU Overload", condition: "cpu_usage > 90%", severity: "critical", enabled: false, channel: "pagerduty" },
  { id: 5, name: "Memory Pressure", condition: "memory_usage > 80%", severity: "warning", enabled: true, channel: "slack" }
];

const RECENT_ALERTS = [
  { id: 1, name: "Response Time Spike", triggered: "2 hours ago", status: "resolved", duration: "15 min" },
  { id: 2, name: "High Error Rate", triggered: "5 hours ago", status: "resolved", duration: "8 min" },
  { id: 3, name: "Memory Pressure", triggered: "1 day ago", status: "resolved", duration: "45 min" }
];

export default function AutomatedAlertSystem() {
  const [alerts, setAlerts] = useState(DEFAULT_ALERTS);
  const [generating, setGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  const toggleAlert = (id) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
    toast.success("Alert configuration updated");
  };

  const generateAIAlerts = async () => {
    setGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze current alert configuration and suggest improvements:

Current Alerts: ${JSON.stringify(alerts)}

Provide intelligent alert suggestions in JSON format:
{
  "suggested_alerts": [
    {
      "name": "<alert name>",
      "condition": "<condition expression>",
      "severity": "<critical|warning|info>",
      "reason": "<why this alert is important>",
      "channel": "<email|slack|pagerduty>"
    }
  ],
  "improvements": [
    {
      "current_alert": "<alert name>",
      "suggestion": "<improvement suggestion>",
      "impact": "<expected impact>"
    }
  ],
  "coverage_gaps": ["<gap 1>", "<gap 2>"],
  "alert_fatigue_risk": "<low|medium|high>",
  "recommendations": "<overall recommendations>"
}`,
        response_json_schema: {
          type: "object",
          properties: {
            suggested_alerts: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  condition: { type: "string" },
                  severity: { type: "string" },
                  reason: { type: "string" },
                  channel: { type: "string" }
                }
              }
            },
            improvements: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  current_alert: { type: "string" },
                  suggestion: { type: "string" },
                  impact: { type: "string" }
                }
              }
            },
            coverage_gaps: { type: "array", items: { type: "string" } },
            alert_fatigue_risk: { type: "string" },
            recommendations: { type: "string" }
          }
        }
      });

      setAiSuggestions(result);
      toast.success("AI analysis complete!");
    } catch (error) {
      toast.error("Failed to generate suggestions");
    } finally {
      setGenerating(false);
    }
  };

  const addSuggestedAlert = (alert) => {
    const newAlert = {
      id: Date.now(),
      name: alert.name,
      condition: alert.condition,
      severity: alert.severity,
      enabled: true,
      channel: alert.channel
    };
    setAlerts([...alerts, newAlert]);
    toast.success(`Added: ${alert.name}`);
  };

  const getSeverityColor = (severity) => ({
    critical: "bg-red-100 text-red-700",
    warning: "bg-amber-100 text-amber-700",
    info: "bg-blue-100 text-blue-700"
  }[severity] || "bg-slate-100 text-slate-700");

  return (
    <Card className="border-2 border-violet-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-violet-600" />
            Automated Alert System
          </span>
          <Button 
            onClick={generateAIAlerts} 
            disabled={generating}
            className="bg-gradient-to-r from-violet-600 to-indigo-600"
          >
            {generating ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" /> AI Suggestions</>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Active Alerts Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-emerald-50 rounded-xl text-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-emerald-700">{alerts.filter(a => a.enabled).length}</p>
            <p className="text-xs text-emerald-600">Active Alerts</p>
          </div>
          <div className="p-4 bg-red-50 rounded-xl text-center">
            <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-red-700">{alerts.filter(a => a.severity === 'critical').length}</p>
            <p className="text-xs text-red-600">Critical Rules</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl text-center">
            <Clock className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-blue-700">{RECENT_ALERTS.length}</p>
            <p className="text-xs text-blue-600">Triggered (24h)</p>
          </div>
        </div>

        {/* Configured Alerts */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700">Configured Alerts</p>
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Switch checked={alert.enabled} onCheckedChange={() => toggleAlert(alert.id)} />
                <div>
                  <p className="text-sm font-medium text-slate-900">{alert.name}</p>
                  <p className="text-xs text-slate-500 font-mono">{alert.condition}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                <Badge variant="outline">{alert.channel}</Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Triggered Alerts */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700">Recent Triggers</p>
          {RECENT_ALERTS.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <div>
                  <p className="text-sm font-medium text-slate-900">{alert.name}</p>
                  <p className="text-xs text-slate-500">{alert.triggered} • Duration: {alert.duration}</p>
                </div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700">{alert.status}</Badge>
            </div>
          ))}
        </div>

        {/* AI Suggestions */}
        {aiSuggestions && (
          <div className="space-y-4 pt-4 border-t">
            <p className="text-sm font-semibold text-violet-700">🤖 AI Recommendations</p>
            
            {/* Alert Fatigue Risk */}
            <div className={`p-3 rounded-lg ${
              aiSuggestions.alert_fatigue_risk === 'high' ? 'bg-red-50 border border-red-200' :
              aiSuggestions.alert_fatigue_risk === 'medium' ? 'bg-amber-50 border border-amber-200' :
              'bg-emerald-50 border border-emerald-200'
            }`}>
              <p className="text-sm font-medium">Alert Fatigue Risk: <span className="capitalize">{aiSuggestions.alert_fatigue_risk}</span></p>
            </div>

            {/* Suggested New Alerts */}
            {aiSuggestions.suggested_alerts?.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-600">Suggested New Alerts</p>
                {aiSuggestions.suggested_alerts.map((alert, i) => (
                  <div key={i} className="p-3 bg-violet-50 border border-violet-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-violet-900">{alert.name}</p>
                        <p className="text-xs text-violet-700 font-mono">{alert.condition}</p>
                      </div>
                      <Button size="sm" onClick={() => addSuggestedAlert(alert)}>
                        <Plus className="w-3 h-3 mr-1" /> Add
                      </Button>
                    </div>
                    <p className="text-xs text-violet-600">{alert.reason}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Coverage Gaps */}
            {aiSuggestions.coverage_gaps?.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm font-semibold text-amber-900 mb-2">⚠️ Coverage Gaps</p>
                <ul className="space-y-1">
                  {aiSuggestions.coverage_gaps.map((gap, i) => (
                    <li key={i} className="text-xs text-amber-800">• {gap}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Overall Recommendations */}
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
              <p className="text-sm text-indigo-800">{aiSuggestions.recommendations}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}