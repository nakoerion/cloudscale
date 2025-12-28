import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Settings, Plus, Trash2, Key } from "lucide-react";
import { toast } from "sonner";

export default function TenantConfigManager({ tenantId }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newConfig, setNewConfig] = useState({
    config_key: "",
    config_value: "",
    config_type: "feature_flag",
    is_encrypted: false
  });

  const queryClient = useQueryClient();

  const { data: configs = [], isLoading } = useQuery({
    queryKey: ["tenant-configs", tenantId],
    queryFn: () => base44.entities.TenantConfiguration.filter({ tenant_id: tenantId }),
    enabled: !!tenantId
  });

  const addConfigMutation = useMutation({
    mutationFn: (data) => base44.entities.TenantConfiguration.create({
      ...data,
      tenant_id: tenantId
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant-configs", tenantId] });
      setShowAddForm(false);
      setNewConfig({ config_key: "", config_value: "", config_type: "feature_flag", is_encrypted: false });
      toast.success("Configuration added");
    }
  });

  const deleteConfigMutation = useMutation({
    mutationFn: (id) => base44.entities.TenantConfiguration.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant-configs", tenantId] });
      toast.success("Configuration deleted");
    }
  });

  const handleAddConfig = () => {
    if (!newConfig.config_key || !newConfig.config_value) {
      toast.error("Please fill in all fields");
      return;
    }
    addConfigMutation.mutate(newConfig);
  };

  if (!tenantId) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-slate-500">Select a tenant to manage configurations</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            Tenant Configuration
          </CardTitle>
          <Button onClick={() => setShowAddForm(!showAddForm)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Config
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddForm && (
          <div className="p-4 bg-slate-50 rounded-xl border-2 border-blue-200 space-y-3">
            <div>
              <Label>Configuration Key</Label>
              <Input
                placeholder="feature_name or api_key"
                value={newConfig.config_key}
                onChange={(e) => setNewConfig({...newConfig, config_key: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Configuration Value (JSON format)</Label>
              <Input
                placeholder='{"enabled": true, "limit": 100}'
                value={newConfig.config_value}
                onChange={(e) => setNewConfig({...newConfig, config_value: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={newConfig.config_type} onValueChange={(v) => setNewConfig({...newConfig, config_type: v})}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feature_flag">Feature Flag</SelectItem>
                  <SelectItem value="ui_customization">UI Customization</SelectItem>
                  <SelectItem value="integration">Integration</SelectItem>
                  <SelectItem value="api_limit">API Limit</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={newConfig.is_encrypted}
                onCheckedChange={(checked) => setNewConfig({...newConfig, is_encrypted: checked})}
              />
              <Label>Encrypt value</Label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddConfig} size="sm">Add</Button>
              <Button onClick={() => setShowAddForm(false)} size="sm" variant="outline">Cancel</Button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : configs.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No configurations yet
          </div>
        ) : (
          <div className="space-y-2">
            {configs.map((config) => (
              <div key={config.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{config.config_key}</p>
                    <p className="text-xs text-slate-500 font-mono">
                      {config.is_encrypted ? "••••••••" : config.config_value}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{config.config_type}</Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteConfigMutation.mutate(config.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}