import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Loader2, Rocket, Server, Database, Cpu, HardDrive } from "lucide-react";

const ENVIRONMENTS = [
  { value: "development", label: "Development", color: "bg-blue-100 text-blue-700" },
  { value: "staging", label: "Staging", color: "bg-amber-100 text-amber-700" },
  { value: "production", label: "Production", color: "bg-emerald-100 text-emerald-700" }
];

const CLOUD_PROVIDERS = [
  { value: "aws", label: "AWS", regions: ["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1"] },
  { value: "azure", label: "Azure", regions: ["eastus", "westus2", "westeurope", "southeastasia"] },
  { value: "gcp", label: "GCP", regions: ["us-central1", "europe-west1", "asia-east1"] }
];

export default function DeployModal({ open, onClose, onSubmit, project, isLoading }) {
  const [formData, setFormData] = useState({
    project_id: project?.id,
    environment: "staging",
    version: "1.0.0",
    cloud_provider: project?.cloud_provider !== "none" ? project?.cloud_provider : "aws",
    region: "us-east-1",
    replicas: 1,
    resources: {
      cpu: "0.5",
      memory: "512Mi",
      storage: "1Gi"
    },
    status: "pending"
  });

  const selectedProvider = CLOUD_PROVIDERS.find(p => p.value === formData.cloud_provider);

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      deployed_by: "current_user"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            Deploy {project?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Environment */}
          <div className="space-y-2">
            <Label>Environment</Label>
            <div className="grid grid-cols-3 gap-3">
              {ENVIRONMENTS.map((env) => (
                <button
                  key={env.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, environment: env.value })}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    formData.environment === env.value
                      ? "border-violet-500 bg-violet-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span className={`text-sm font-medium px-2 py-0.5 rounded ${env.color}`}>
                    {env.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Version */}
          <div className="space-y-2">
            <Label htmlFor="version">Version</Label>
            <Input
              id="version"
              placeholder="1.0.0"
              value={formData.version}
              onChange={(e) => setFormData({ ...formData, version: e.target.value })}
            />
          </div>

          {/* Cloud & Region */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cloud Provider</Label>
              <Select 
                value={formData.cloud_provider}
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  cloud_provider: value,
                  region: CLOUD_PROVIDERS.find(p => p.value === value)?.regions[0] || ""
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLOUD_PROVIDERS.map((provider) => (
                    <SelectItem key={provider.value} value={provider.value}>
                      {provider.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Region</Label>
              <Select 
                value={formData.region}
                onValueChange={(value) => setFormData({ ...formData, region: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectedProvider?.regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Replicas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Server className="w-4 h-4" /> Replicas
              </Label>
              <span className="text-sm font-medium text-slate-900">{formData.replicas}</span>
            </div>
            <Slider
              value={[formData.replicas]}
              onValueChange={(value) => setFormData({ ...formData, replicas: value[0] })}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <Label>Resources</Label>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                  <Cpu className="w-3.5 h-3.5" />
                  <span className="text-xs">CPU</span>
                </div>
                <Select 
                  value={formData.resources.cpu}
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    resources: { ...formData.resources, cpu: value }
                  })}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.25">0.25 vCPU</SelectItem>
                    <SelectItem value="0.5">0.5 vCPU</SelectItem>
                    <SelectItem value="1">1 vCPU</SelectItem>
                    <SelectItem value="2">2 vCPU</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                  <Database className="w-3.5 h-3.5" />
                  <span className="text-xs">Memory</span>
                </div>
                <Select 
                  value={formData.resources.memory}
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    resources: { ...formData.resources, memory: value }
                  })}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="256Mi">256 MB</SelectItem>
                    <SelectItem value="512Mi">512 MB</SelectItem>
                    <SelectItem value="1Gi">1 GB</SelectItem>
                    <SelectItem value="2Gi">2 GB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                  <HardDrive className="w-3.5 h-3.5" />
                  <span className="text-xs">Storage</span>
                </div>
                <Select 
                  value={formData.resources.storage}
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    resources: { ...formData.resources, storage: value }
                  })}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1Gi">1 GB</SelectItem>
                    <SelectItem value="5Gi">5 GB</SelectItem>
                    <SelectItem value="10Gi">10 GB</SelectItem>
                    <SelectItem value="20Gi">20 GB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-violet-600 hover:bg-violet-700"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Rocket className="w-4 h-4 mr-2" />
            )}
            Deploy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}