import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { BarChart3, ExternalLink, CheckCircle2, Settings } from "lucide-react";
import { toast } from "sonner";

const ANALYTICS_PROVIDERS = [
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Track website traffic and user behavior",
    icon: "📊",
    configField: "GA Measurement ID",
    placeholder: "G-XXXXXXXXXX"
  },
  {
    id: "mixpanel",
    name: "Mixpanel",
    description: "Product analytics and user insights",
    icon: "📈",
    configField: "Project Token",
    placeholder: "your_project_token"
  },
  {
    id: "hotjar",
    name: "Hotjar",
    description: "Heatmaps and session recordings",
    icon: "🔥",
    configField: "Site ID",
    placeholder: "1234567"
  },
  {
    id: "segment",
    name: "Segment",
    description: "Customer data platform",
    icon: "🎯",
    configField: "Write Key",
    placeholder: "your_write_key"
  }
];

export default function AnalyticsIntegration() {
  const [integrations, setIntegrations] = useState([
    { id: "google-analytics", enabled: true, config: "G-ABC123XYZ" },
    { id: "mixpanel", enabled: false, config: "" }
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editConfig, setEditConfig] = useState("");

  const isEnabled = (providerId) => {
    return integrations.find(i => i.id === providerId)?.enabled || false;
  };

  const getConfig = (providerId) => {
    return integrations.find(i => i.id === providerId)?.config || "";
  };

  const toggleIntegration = (providerId) => {
    const existing = integrations.find(i => i.id === providerId);
    if (existing) {
      setIntegrations(integrations.map(i => 
        i.id === providerId ? {...i, enabled: !i.enabled} : i
      ));
    } else {
      setIntegrations([...integrations, { id: providerId, enabled: true, config: "" }]);
    }
    toast.success("Integration updated");
  };

  const saveConfig = (providerId) => {
    const existing = integrations.find(i => i.id === providerId);
    if (existing) {
      setIntegrations(integrations.map(i =>
        i.id === providerId ? {...i, config: editConfig} : i
      ));
    } else {
      setIntegrations([...integrations, { id: providerId, enabled: true, config: editConfig }]);
    }
    setEditingId(null);
    setEditConfig("");
    toast.success("Configuration saved");
  };

  const startEdit = (providerId) => {
    setEditingId(providerId);
    setEditConfig(getConfig(providerId));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-violet-600" />
          Analytics Integrations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {ANALYTICS_PROVIDERS.map((provider) => {
          const enabled = isEnabled(provider.id);
          const config = getConfig(provider.id);
          const isEditing = editingId === provider.id;

          return (
            <div key={provider.id} className="p-4 border-2 border-slate-200 rounded-xl">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{provider.icon}</span>
                  <div>
                    <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                      {provider.name}
                      {enabled && config && (
                        <Badge className="bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      )}
                    </h4>
                    <p className="text-sm text-slate-600">{provider.description}</p>
                  </div>
                </div>
                <Switch
                  checked={enabled}
                  onCheckedChange={() => toggleIntegration(provider.id)}
                />
              </div>

              {enabled && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm">{provider.configField}</Label>
                        <Input
                          value={editConfig}
                          onChange={(e) => setEditConfig(e.target.value)}
                          placeholder={provider.placeholder}
                          className="mt-1"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => saveConfig(provider.id)}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : config ? (
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                      <span className="text-sm font-mono text-slate-700">{config}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => startEdit(provider.id)}>
                          <Settings className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <a href="#" target="_blank">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View
                          </a>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button size="sm" onClick={() => startEdit(provider.id)} variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure {provider.name}
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}