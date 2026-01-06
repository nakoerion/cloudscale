import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Cloud,
  Loader2,
  CheckCircle2,
  Zap,
  Globe,
  Server,
  Database,
  HardDrive,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CLOUD_PROVIDERS = [
  { 
    id: "aws", 
    name: "AWS", 
    icon: "🔶",
    description: "Amazon Web Services - Most comprehensive cloud platform",
    regions: ["us-east-1", "us-west-2", "eu-west-1", "ap-south-1", "ap-southeast-1"],
    features: ["EC2", "RDS", "S3", "Lambda", "CloudFront"]
  },
  { 
    id: "azure", 
    name: "Azure", 
    icon: "🔷",
    description: "Microsoft Azure - Enterprise-grade cloud services",
    regions: ["eastus", "westeurope", "southeastasia", "australiaeast"],
    features: ["VMs", "SQL Database", "Blob Storage", "Functions", "CDN"]
  },
  { 
    id: "gcp", 
    name: "Google Cloud", 
    icon: "🔴",
    description: "Google Cloud Platform - AI/ML optimized infrastructure",
    regions: ["us-central1", "europe-west1", "asia-southeast1", "australia-southeast1"],
    features: ["Compute Engine", "Cloud SQL", "Cloud Storage", "Cloud Functions", "Cloud CDN"]
  },
  { 
    id: "cloudforge", 
    name: "CloudForge Native", 
    icon: "⚡",
    description: "CloudForge managed hosting - Zero configuration required",
    regions: ["global-edge"],
    features: ["Managed Hosting", "Auto-Scaling", "CDN", "SSL", "Monitoring"]
  }
];

const DEPLOYMENT_STEPS = [
  { id: 1, name: "Provisioning Resources", status: "pending" },
  { id: 2, name: "Configuring Database", status: "pending" },
  { id: 3, name: "Setting Up Storage", status: "pending" },
  { id: 4, name: "Deploying Application", status: "pending" },
  { id: 5, name: "Configuring CDN", status: "pending" },
  { id: 6, name: "Testing Endpoints", status: "pending" }
];

export default function CloudDeploymentWizard({ formData, onComplete, onUpdate }) {
  const [selectedProvider, setSelectedProvider] = useState("cloudforge");
  const [region, setRegion] = useState("global-edge");
  const [config, setConfig] = useState({
    autoScaling: true,
    loadBalancing: true,
    cdn: true,
    ssl: true,
    monitoring: true
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentSteps, setDeploymentSteps] = useState(DEPLOYMENT_STEPS);
  const [deploymentResult, setDeploymentResult] = useState(null);

  const provider = CLOUD_PROVIDERS.find(p => p.id === selectedProvider);

  // Update parent form data when provider or region changes
  React.useEffect(() => {
    if (onUpdate) {
      onUpdate({
        cloud_provider: selectedProvider,
        deployment_region: region
      });
    }
  }, [selectedProvider, region, onUpdate]);

  const deploy = async () => {
    setIsDeploying(true);
    
    // Simulate deployment process
    for (let i = 0; i < deploymentSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setDeploymentSteps(prev => prev.map((step, idx) => ({
        ...step,
        status: idx === i ? "in-progress" : idx < i ? "completed" : "pending"
      })));
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setDeploymentSteps(prev => prev.map(step => ({ ...step, status: "completed" })));

    const result = {
      provider: selectedProvider,
      region,
      url: `https://${formData.name.toLowerCase().replace(/\s+/g, '-')}.cloudforge.app`,
      endpoints: {
        api: `https://api-${formData.name.toLowerCase().replace(/\s+/g, '-')}.cloudforge.app`,
        admin: `https://admin-${formData.name.toLowerCase().replace(/\s+/g, '-')}.cloudforge.app`
      },
      resources: {
        compute: config.autoScaling ? "Auto-scaling enabled" : "Fixed instance",
        database: "PostgreSQL 15 - 2GB RAM",
        storage: "50GB SSD",
        cdn: config.cdn ? "Global CDN enabled" : "Direct connection"
      },
      estimatedCost: selectedProvider === "cloudforge" ? "$49/month" : "$75/month"
    };

    setDeploymentResult(result);
    toast.success("Application deployed successfully!");
    setIsDeploying(false);
    if (onComplete) {
      onComplete(result);
    }
  };

  if (deploymentResult) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Deployment Complete!</h2>
          <p className="text-lg text-slate-600">Your application is now live and accessible</p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Application URLs</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl">
              <div>
                <p className="text-sm text-slate-600 mb-1">Main Application</p>
                <a href={deploymentResult.url} target="_blank" className="text-violet-600 font-mono font-medium hover:underline">
                  {deploymentResult.url}
                </a>
              </div>
              <Globe className="w-5 h-5 text-violet-600" />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="text-sm text-slate-600 mb-1">API Endpoint</p>
                <p className="text-slate-900 font-mono text-sm">{deploymentResult.endpoints.api}</p>
              </div>
              <Server className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="text-sm text-slate-600 mb-1">Admin Panel</p>
                <p className="text-slate-900 font-mono text-sm">{deploymentResult.endpoints.admin}</p>
              </div>
              <Server className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Deployment Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Provider</span>
                <span className="font-medium">{provider.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Region</span>
                <span className="font-medium">{deploymentResult.region}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Estimated Cost</span>
                <span className="font-semibold text-emerald-600">{deploymentResult.estimatedCost}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Resources</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Server className="w-4 h-4 text-slate-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Compute</p>
                  <p className="text-xs text-slate-600">{deploymentResult.resources.compute}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Database className="w-4 h-4 text-slate-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Database</p>
                  <p className="text-xs text-slate-600">{deploymentResult.resources.database}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <HardDrive className="w-4 h-4 text-slate-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Storage</p>
                  <p className="text-xs text-slate-600">{deploymentResult.resources.storage}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Globe className="w-4 h-4 text-slate-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">CDN</p>
                  <p className="text-xs text-slate-600">{deploymentResult.resources.cdn}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {onComplete && (
          <Button
            onClick={() => onComplete(deploymentResult)}
            className="w-full py-6 text-lg rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
          >
            Continue <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>
    );
  }

  if (isDeploying) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
            <span className="text-sm font-semibold text-blue-700">Deploying Application</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Setting Up Your Infrastructure</h2>
          <p className="text-lg text-slate-600">This may take a few minutes...</p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-slate-200 p-8">
          <div className="space-y-4">
            {deploymentSteps.map((step) => (
              <div key={step.id} className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                  step.status === "completed" && "bg-emerald-100",
                  step.status === "in-progress" && "bg-blue-100",
                  step.status === "pending" && "bg-slate-100"
                )}>
                  {step.status === "completed" && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  {step.status === "in-progress" && <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />}
                  {step.status === "pending" && <div className="w-3 h-3 rounded-full bg-slate-300" />}
                </div>
                <div className="flex-1">
                  <p className={cn(
                    "font-medium",
                    step.status === "completed" && "text-emerald-600",
                    step.status === "in-progress" && "text-blue-600",
                    step.status === "pending" && "text-slate-400"
                  )}>
                    {step.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
          <Cloud className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-blue-700">Cloud Deployment</span>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">
          Deploy Your Application
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Choose your cloud provider and configure deployment settings
        </p>
      </div>

      <div className="space-y-6">
        {/* Cloud Provider Selection */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
          <Label className="text-lg font-semibold mb-4 block">Select Cloud Provider</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CLOUD_PROVIDERS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedProvider(p.id);
                  setRegion(p.regions[0]);
                }}
                className={cn(
                  "p-6 rounded-xl border-2 text-left transition-all hover:shadow-lg",
                  selectedProvider === p.id
                    ? "border-violet-500 bg-gradient-to-br from-violet-50 to-indigo-50 shadow-lg"
                    : "border-slate-200 hover:border-violet-300"
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="text-4xl">{p.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{p.name}</h3>
                    <p className="text-sm text-slate-600 mb-3">{p.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {p.features.slice(0, 3).map((feature, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{feature}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Region Selection */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
          <Label htmlFor="region" className="text-base mb-3 block">Deployment Region</Label>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger id="region" className="h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {provider?.regions.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Configuration Options */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Infrastructure Configuration</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-violet-600" />
                <div>
                  <p className="font-medium text-slate-900">Auto-Scaling</p>
                  <p className="text-sm text-slate-500">Automatically scale based on traffic</p>
                </div>
              </div>
              <Switch
                checked={config.autoScaling}
                onCheckedChange={(checked) => setConfig({...config, autoScaling: checked})}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-slate-900">Load Balancing</p>
                  <p className="text-sm text-slate-500">Distribute traffic across instances</p>
                </div>
              </div>
              <Switch
                checked={config.loadBalancing}
                onCheckedChange={(checked) => setConfig({...config, loadBalancing: checked})}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="font-medium text-slate-900">Global CDN</p>
                  <p className="text-sm text-slate-500">Edge caching for faster delivery</p>
                </div>
              </div>
              <Switch
                checked={config.cdn}
                onCheckedChange={(checked) => setConfig({...config, cdn: checked})}
              />
            </div>
          </div>
        </div>

        {/* Cost Estimate */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-700 mb-1">Estimated Monthly Cost</p>
              <p className="text-3xl font-bold text-emerald-900">
                {selectedProvider === "cloudforge" ? "$49" : "$75"}
                <span className="text-base font-normal text-emerald-600">/month</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-emerald-600 mb-1">✓ Free SSL Certificate</p>
              <p className="text-xs text-emerald-600 mb-1">✓ 99.9% Uptime SLA</p>
              <p className="text-xs text-emerald-600">✓ 24/7 Monitoring</p>
            </div>
          </div>
        </div>

        <Button
          onClick={deploy}
          className="w-full py-6 text-lg rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          <Cloud className="w-5 h-5 mr-2" />
          Deploy Application
        </Button>
      </div>
    </div>
  );
}