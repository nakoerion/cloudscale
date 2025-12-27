import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function NodeConfigModal({ node, onSave, onClose }) {
  const [config, setConfig] = useState(node.config || {});

  useEffect(() => {
    setConfig(node.config || {});
  }, [node]);

  const updateConfig = (key, value) => {
    setConfig({ ...config, [key]: value });
  };

  const renderConfigFields = () => {
    switch (node.id) {
      case "condition":
        return (
          <div className="space-y-4">
            <div>
              <Label>Field to check</Label>
              <Input
                placeholder="e.g., user.email, status, amount"
                value={config.field || ""}
                onChange={(e) => updateConfig("field", e.target.value)}
              />
            </div>
            <div>
              <Label>Operator</Label>
              <Select value={config.operator || "equals"} onValueChange={(v) => updateConfig("operator", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="not_equals">Not Equals</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                  <SelectItem value="greater_than">Greater Than</SelectItem>
                  <SelectItem value="less_than">Less Than</SelectItem>
                  <SelectItem value="is_empty">Is Empty</SelectItem>
                  <SelectItem value="is_not_empty">Is Not Empty</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Value to compare</Label>
              <Input
                placeholder="e.g., active, 100, @business.com"
                value={config.value || ""}
                onChange={(e) => updateConfig("value", e.target.value)}
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-900">
                If <Badge variant="outline" className="mx-1">{config.field || "field"}</Badge>
                <Badge variant="outline" className="mx-1">{config.operator || "equals"}</Badge>
                <Badge variant="outline" className="mx-1">{config.value || "value"}</Badge>
              </p>
            </div>
          </div>
        );

      case "loop":
        return (
          <div className="space-y-4">
            <div>
              <Label>Loop Type</Label>
              <Select value={config.type || "forEach"} onValueChange={(v) => updateConfig("type", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="forEach">For Each Item</SelectItem>
                  <SelectItem value="while">While Condition</SelectItem>
                  <SelectItem value="count">Fixed Count</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {config.type === "forEach" && (
              <div>
                <Label>Array/Collection Source</Label>
                <Input
                  placeholder="e.g., users, items, results"
                  value={config.source || ""}
                  onChange={(e) => updateConfig("source", e.target.value)}
                />
              </div>
            )}
            {config.type === "count" && (
              <div>
                <Label>Number of Iterations</Label>
                <Input
                  type="number"
                  placeholder="e.g., 10"
                  value={config.count || ""}
                  onChange={(e) => updateConfig("count", e.target.value)}
                />
              </div>
            )}
            <div>
              <Label>Max Iterations (safety limit)</Label>
              <Input
                type="number"
                placeholder="100"
                value={config.maxIterations || "100"}
                onChange={(e) => updateConfig("maxIterations", e.target.value)}
              />
            </div>
          </div>
        );

      case "delay":
        return (
          <div className="space-y-4">
            <div>
              <Label>Delay Duration</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="5"
                  value={config.duration || ""}
                  onChange={(e) => updateConfig("duration", e.target.value)}
                  className="flex-1"
                />
                <Select value={config.unit || "minutes"} onValueChange={(v) => updateConfig("unit", v)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seconds">Seconds</SelectItem>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-900">
                Wait for {config.duration || "5"} {config.unit || "minutes"} before continuing
              </p>
            </div>
          </div>
        );

      case "filter":
        return (
          <div className="space-y-4">
            <div>
              <Label>Filter Field</Label>
              <Input
                placeholder="e.g., status, category, price"
                value={config.field || ""}
                onChange={(e) => updateConfig("field", e.target.value)}
              />
            </div>
            <div>
              <Label>Condition</Label>
              <Select value={config.operator || "equals"} onValueChange={(v) => updateConfig("operator", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                  <SelectItem value="greater_than">Greater Than</SelectItem>
                  <SelectItem value="less_than">Less Than</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Filter Value</Label>
              <Input
                placeholder="Value to filter by"
                value={config.value || ""}
                onChange={(e) => updateConfig("value", e.target.value)}
              />
            </div>
          </div>
        );

      case "call_api":
        return (
          <div className="space-y-4">
            <div>
              <Label>HTTP Method</Label>
              <Select value={config.method || "POST"} onValueChange={(v) => updateConfig("method", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>API URL</Label>
              <Input
                placeholder="https://api.example.com/endpoint"
                value={config.url || ""}
                onChange={(e) => updateConfig("url", e.target.value)}
              />
            </div>
            <div>
              <Label>Headers (JSON)</Label>
              <Textarea
                placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
                value={typeof config.headers === 'string' ? config.headers : JSON.stringify(config.headers || {}, null, 2)}
                onChange={(e) => updateConfig("headers", e.target.value)}
                rows={3}
              />
            </div>
            {config.method !== "GET" && (
              <div>
                <Label>Request Body (JSON)</Label>
                <Textarea
                  placeholder='{"key": "value"}'
                  value={config.body || ""}
                  onChange={(e) => updateConfig("body", e.target.value)}
                  rows={4}
                />
              </div>
            )}
          </div>
        );

      case "send_email":
        return (
          <div className="space-y-4">
            <div>
              <Label>To Email</Label>
              <Input
                placeholder="user@example.com or {{user.email}}"
                value={config.to || ""}
                onChange={(e) => updateConfig("to", e.target.value)}
              />
            </div>
            <div>
              <Label>Subject</Label>
              <Input
                placeholder="Email subject line"
                value={config.subject || ""}
                onChange={(e) => updateConfig("subject", e.target.value)}
              />
            </div>
            <div>
              <Label>Email Body</Label>
              <Textarea
                placeholder="Email content..."
                value={config.body || ""}
                onChange={(e) => updateConfig("body", e.target.value)}
                rows={6}
              />
            </div>
          </div>
        );

      case "create_record":
        return (
          <div className="space-y-4">
            <div>
              <Label>Entity Name</Label>
              <Input
                placeholder="e.g., Lead, Contact, Order"
                value={config.entity || ""}
                onChange={(e) => updateConfig("entity", e.target.value)}
              />
            </div>
            <div>
              <Label>Record Data (JSON)</Label>
              <Textarea
                placeholder='{"name": "{{user.name}}", "email": "{{user.email}}"}'
                value={typeof config.data === 'string' ? config.data : JSON.stringify(config.data || {}, null, 2)}
                onChange={(e) => updateConfig("data", e.target.value)}
                rows={6}
              />
            </div>
          </div>
        );

      case "run_code":
        return (
          <div className="space-y-4">
            <div>
              <Label>Custom Code (JavaScript)</Label>
              <Textarea
                placeholder="// Your JavaScript code here\nconst result = data.items.filter(item => item.active);\nreturn result;"
                value={config.code || ""}
                onChange={(e) => updateConfig("code", e.target.value)}
                rows={10}
                className="font-mono text-sm"
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-900">
                Available variables: <code>data</code> (workflow data), <code>trigger</code> (trigger data)
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div>
              <Label>Configuration</Label>
              <Textarea
                placeholder="Node configuration (JSON)"
                value={JSON.stringify(config, null, 2)}
                onChange={(e) => {
                  try {
                    setConfig(JSON.parse(e.target.value));
                  } catch (err) {
                    // Invalid JSON, ignore
                  }
                }}
                rows={8}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${node.color}`}>
              <node.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-lg">Configure {node.name}</p>
              <p className="text-sm font-normal text-slate-500">{node.category === "logic" ? "Logic Node" : "Action Node"}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {renderConfigFields()}
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(config)} className="bg-violet-600 hover:bg-violet-700">
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}