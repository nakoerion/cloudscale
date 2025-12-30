import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Cloud, Zap, CheckCircle2, Globe } from "lucide-react";
import { toast } from "sonner";

const CLOUD_PROVIDERS = [
  { id: "aws", name: "AWS", color: "bg-amber-100 text-amber-700", regions: ["us-east-1", "us-west-2", "eu-west-1"] },
  { id: "azure", name: "Azure", color: "bg-blue-100 text-blue-700", regions: ["eastus", "westus2", "westeurope"] },
  { id: "gcp", name: "GCP", color: "bg-green-100 text-green-700", regions: ["us-central1", "us-east1", "europe-west1"] }
];

export default function MultiCloudOrchestrator({ template, onDeploy }) {
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [providerConfigs, setProviderConfigs] = useState({
    aws: { region: "us-east-1", resources: [] },
    azure: { region: "eastus", resources: [] },
    gcp: { region: "us-central1", resources: [] }
  });

  const handleProviderToggle = (providerId) => {
    setSelectedProviders(prev => 
      prev.includes(providerId) 
        ? prev.filter(p => p !== providerId)
        : [...prev, providerId]
    );
  };

  const handleRegionChange = (providerId, region) => {
    setProviderConfigs(prev => ({
      ...prev,
      [providerId]: { ...prev[providerId], region }
    }));
  };

  const handleDeploy = () => {
    if (selectedProviders.length === 0) {
      toast.error("Please select at least one cloud provider");
      return;
    }

    const cloudResources = {};
    selectedProviders.forEach(provider => {
      cloudResources[provider] = {
        status: "pending",
        resources: [],
        cost: 0,
        region: providerConfigs[provider].region
      };
    });

    onDeploy?.({
      is_multi_cloud: selectedProviders.length > 1,
      provider: selectedProviders.length === 1 ? selectedProviders[0] : "multi-cloud",
      cloud_resources: cloudResources,
      region: providerConfigs[selectedProviders[0]]?.region || "multi-region"
    });

    toast.success(`Deploying to ${selectedProviders.length} cloud provider(s)`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-violet-600" />
          Multi-Cloud Orchestration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Select Cloud Providers</h4>
            <div className="space-y-3">
              {CLOUD_PROVIDERS.map((provider) => (
                <div key={provider.id} className="border-2 border-slate-200 rounded-xl p-4 hover:border-violet-300 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedProviders.includes(provider.id)}
                        onCheckedChange={() => handleProviderToggle(provider.id)}
                      />
                      <Cloud className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-900">{provider.name}</p>
                        <Badge className={provider.color}>{provider.id.toUpperCase()}</Badge>
                      </div>
                    </div>
                  </div>

                  {selectedProviders.includes(provider.id) && (
                    <div className="mt-3 pl-8">
                      <label className="text-xs font-medium text-slate-700 mb-2 block">Region</label>
                      <select
                        value={providerConfigs[provider.id].region}
                        onChange={(e) => handleRegionChange(provider.id, e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                      >
                        {provider.regions.map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-violet-50 rounded-xl border-2 border-violet-200">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-violet-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-violet-900 mb-1">Multi-Cloud Benefits</p>
                <ul className="text-xs text-violet-700 space-y-1">
                  <li>• High availability across regions and providers</li>
                  <li>• Avoid vendor lock-in with distributed architecture</li>
                  <li>• Cost optimization by leveraging best pricing</li>
                  <li>• Compliance with data residency requirements</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              {selectedProviders.length === 0 && "No providers selected"}
              {selectedProviders.length === 1 && `Deploying to ${selectedProviders[0].toUpperCase()}`}
              {selectedProviders.length > 1 && `Multi-cloud deployment to ${selectedProviders.length} providers`}
            </div>
            <Button 
              onClick={handleDeploy} 
              disabled={selectedProviders.length === 0}
              className="bg-violet-600 hover:bg-violet-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              Deploy Infrastructure
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}