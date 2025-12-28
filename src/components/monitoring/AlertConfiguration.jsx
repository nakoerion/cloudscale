import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, Trash2, Mail, MessageSquare, Webhook } from "lucide-react";
import { toast } from "sonner";

const ALERT_RULES = [
  {
    id: 1,
    name: "High Error Rate",
    metric: "error_rate",
    condition: ">",
    threshold: 5,
    duration: 5,
    enabled: true,
    channels: ["email", "slack"]
  },
  {
    id: 2,
    name: "Slow Response Time",
    metric: "avg_response_time",
    condition: ">",
    threshold: 1000,
    duration: 3,
    enabled: true,
    channels: ["email"]
  },
  {
    id: 3,
    name: "Low Uptime",
    metric: "uptime",
    condition: "<",
    threshold: 99,
    duration: 1,
    enabled: false,
    channels: ["email", "slack", "webhook"]
  }
];

const METRICS = [
  "error_rate",
  "avg_response_time",
  "uptime",
  "cpu_usage",
  "memory_usage",
  "request_count",
  "database_connections"
];

const NOTIFICATION_CHANNELS = [
  { id: "email", name: "Email", icon: Mail, configured: true },
  { id: "slack", name: "Slack", icon: MessageSquare, configured: true },
  { id: "webhook", name: "Webhook", icon: Webhook, configured: false }
];

export default function AlertConfiguration() {
  const [alerts, setAlerts] = useState(ALERT_RULES);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    name: "",
    metric: "error_rate",
    condition: ">",
    threshold: 0,
    duration: 5,
    channels: ["email"]
  });

  const toggleAlert = (id) => {
    setAlerts(alerts.map(a => a.id === id ? {...a, enabled: !a.enabled} : a));
    toast.success("Alert rule updated");
  };

  const deleteAlert = (id) => {
    setAlerts(alerts.filter(a => a.id !== id));
    toast.success("Alert rule deleted");
  };

  const addAlert = () => {
    if (!newAlert.name || !newAlert.threshold) {
      toast.error("Please fill in all fields");
      return;
    }
    setAlerts([...alerts, { id: Date.now(), ...newAlert, enabled: true }]);
    setNewAlert({ name: "", metric: "error_rate", condition: ">", threshold: 0, duration: 5, channels: ["email"] });
    setShowAddForm(false);
    toast.success("Alert rule created");
  };

  const toggleChannel = (channel) => {
    if (newAlert.channels.includes(channel)) {
      setNewAlert({...newAlert, channels: newAlert.channels.filter(c => c !== channel)});
    } else {
      setNewAlert({...newAlert, channels: [...newAlert.channels, channel]});
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-violet-600" />
              Alert Rules
            </CardTitle>
            <Button onClick={() => setShowAddForm(!showAddForm)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddForm && (
            <div className="p-4 bg-slate-50 rounded-xl border-2 border-violet-200 space-y-3">
              <div>
                <Label>Rule Name</Label>
                <Input
                  placeholder="e.g., High CPU Usage"
                  value={newAlert.name}
                  onChange={(e) => setNewAlert({...newAlert, name: e.target.value})}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Metric</Label>
                  <Select value={newAlert.metric} onValueChange={(v) => setNewAlert({...newAlert, metric: v})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {METRICS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Condition</Label>
                  <Select value={newAlert.condition} onValueChange={(v) => setNewAlert({...newAlert, condition: v})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=">">Greater than</SelectItem>
                      <SelectItem value="<">Less than</SelectItem>
                      <SelectItem value="=">Equal to</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Threshold</Label>
                  <Input
                    type="number"
                    value={newAlert.threshold}
                    onChange={(e) => setNewAlert({...newAlert, threshold: parseFloat(e.target.value)})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Duration (minutes)</Label>
                  <Input
                    type="number"
                    value={newAlert.duration}
                    onChange={(e) => setNewAlert({...newAlert, duration: parseInt(e.target.value)})}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Notification Channels</Label>
                <div className="flex gap-2">
                  {NOTIFICATION_CHANNELS.map(channel => (
                    <button
                      key={channel.id}
                      onClick={() => toggleChannel(channel.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                        newAlert.channels.includes(channel.id)
                          ? "border-violet-500 bg-violet-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <channel.icon className="w-4 h-4" />
                      {channel.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={addAlert}>Create Alert</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-4 bg-white border-2 border-slate-200 rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-slate-900">{alert.name}</h4>
                      <Badge variant="outline">{alert.metric}</Badge>
                    </div>
                    <p className="text-sm text-slate-600">
                      Alert when {alert.metric} {alert.condition} {alert.threshold} for {alert.duration} minutes
                    </p>
                  </div>
                  <Switch
                    checked={alert.enabled}
                    onCheckedChange={() => toggleAlert(alert.id)}
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <div className="flex gap-2">
                    {alert.channels.map(channel => {
                      const Channel = NOTIFICATION_CHANNELS.find(c => c.id === channel);
                      return (
                        <Badge key={channel} variant="outline" className="flex items-center gap-1">
                          <Channel.icon className="w-3 h-3" />
                          {Channel.name}
                        </Badge>
                      );
                    })}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteAlert(alert.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Notification Channels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {NOTIFICATION_CHANNELS.map(channel => (
              <div key={channel.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <channel.icon className="w-5 h-5 text-slate-400" />
                  <span className="font-medium text-slate-900">{channel.name}</span>
                </div>
                {channel.configured ? (
                  <Badge className="bg-emerald-100 text-emerald-700">Configured</Badge>
                ) : (
                  <Button size="sm" variant="outline">Configure</Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}