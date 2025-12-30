import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Rocket, 
  CheckCircle2, 
  XCircle, 
  Clock,
  AlertTriangle,
  Terminal,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const STATUS_CONFIG = {
  pending: { icon: Clock, color: "text-slate-500", bg: "bg-slate-100", label: "Pending" },
  planning: { icon: Clock, color: "text-blue-500", bg: "bg-blue-100", label: "Planning" },
  applying: { icon: Clock, color: "text-violet-500", bg: "bg-violet-100", label: "Applying" },
  completed: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-100", label: "Completed" },
  failed: { icon: XCircle, color: "text-red-500", bg: "bg-red-100", label: "Failed" },
  destroying: { icon: Trash2, color: "text-amber-500", bg: "bg-amber-100", label: "Destroying" }
};

export default function IaCProvisioner() {
  const [showProvisionForm, setShowProvisionForm] = useState(false);
  const [formData, setFormData] = useState({
    template_id: "",
    provider: "aws",
    region: "",
    variables_used: {}
  });

  const queryClient = useQueryClient();

  const { data: templates = [] } = useQuery({
    queryKey: ["iac-templates"],
    queryFn: () => base44.entities.IaCTemplate.list("-created_date", 50)
  });

  const { data: deployments = [], isLoading } = useQuery({
    queryKey: ["iac-deployments"],
    queryFn: () => base44.entities.IaCDeployment.list("-created_date", 20)
  });

  const provisionMutation = useMutation({
    mutationFn: (data) => base44.entities.IaCDeployment.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["iac-deployments"] });
      setShowProvisionForm(false);
      toast.success("Infrastructure provisioning started");
      
      // Simulate deployment process
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["iac-deployments"] });
      }, 2000);
    }
  });

  const destroyMutation = useMutation({
    mutationFn: ({ id }) => base44.entities.IaCDeployment.update(id, { status: "destroying" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["iac-deployments"] });
      toast.success("Infrastructure destruction initiated");
    }
  });

  const handleProvision = () => {
    if (!formData.template_id || !formData.region) {
      toast.error("Please select a template and region");
      return;
    }

    provisionMutation.mutate({
      ...formData,
      status: "planning",
      cost_estimate: Math.random() * 500 + 50
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-emerald-600" />
            Infrastructure Provisioning
          </span>
          <Button onClick={() => setShowProvisionForm(!showProvisionForm)} size="sm">
            <Rocket className="w-4 h-4 mr-2" />
            Provision Infrastructure
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showProvisionForm && (
          <div className="mb-6 p-4 border-2 border-emerald-200 rounded-xl bg-emerald-50/50">
            <h3 className="font-semibold text-slate-900 mb-4">Provision New Infrastructure</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Select Template</label>
                <Select value={formData.template_id} onValueChange={(value) => setFormData({ ...formData, template_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} ({template.provider})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Provider</label>
                  <Select value={formData.provider} onValueChange={(value) => setFormData({ ...formData, provider: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aws">AWS</SelectItem>
                      <SelectItem value="azure">Azure</SelectItem>
                      <SelectItem value="gcp">GCP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Region</label>
                  <Input
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    placeholder="e.g., us-east-1"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleProvision} disabled={provisionMutation.isPending}>
                  {provisionMutation.isPending ? "Provisioning..." : "Start Provisioning"}
                </Button>
                <Button variant="outline" onClick={() => setShowProvisionForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : deployments.length === 0 ? (
          <div className="text-center py-8">
            <Rocket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No deployments yet. Provision your first infrastructure.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {deployments.map((deployment) => {
              const config = STATUS_CONFIG[deployment.status] || STATUS_CONFIG.pending;
              const Icon = config.icon;
              const template = templates.find(t => t.id === deployment.template_id);

              return (
                <div key={deployment.id} className="border-2 border-slate-200 rounded-xl p-4 hover:border-emerald-300 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">
                        {template?.name || "Unknown Template"}
                      </h4>
                      <p className="text-sm text-slate-600">
                        {deployment.provider.toUpperCase()} • {deployment.region}
                      </p>
                    </div>
                    <Badge className={`${config.bg} ${config.color}`}>
                      <Icon className="w-3 h-3 mr-1" />
                      {config.label}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                    <div>
                      <span className="text-slate-500">Resources</span>
                      <p className="font-medium text-slate-900">
                        {deployment.resources_created?.length || 0}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Cost Estimate</span>
                      <p className="font-medium text-slate-900">
                        ${deployment.cost_estimate?.toFixed(2) || "0.00"}/mo
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Created</span>
                      <p className="font-medium text-slate-900">
                        {format(new Date(deployment.created_date), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </div>

                  {deployment.error_message && (
                    <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-900">Deployment Failed</p>
                        <p className="text-xs text-red-700">{deployment.error_message}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Terminal className="w-4 h-4 mr-2" />
                      View Logs
                    </Button>
                    {deployment.status === "completed" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => destroyMutation.mutate({ id: deployment.id })}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Destroy
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}