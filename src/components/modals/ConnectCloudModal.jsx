import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Shield, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PROVIDERS = {
  aws: {
    name: "Amazon Web Services",
    fields: [
      { key: "account_name", label: "Account Name", placeholder: "My AWS Account" },
      { key: "account_id", label: "AWS Account ID", placeholder: "123456789012" },
      { key: "default_region", label: "Default Region", type: "select", options: [
        "us-east-1", "us-west-2", "eu-west-1", "eu-central-1", "ap-southeast-1"
      ]}
    ]
  },
  azure: {
    name: "Microsoft Azure",
    fields: [
      { key: "account_name", label: "Account Name", placeholder: "My Azure Account" },
      { key: "account_id", label: "Subscription ID", placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" },
      { key: "default_region", label: "Default Region", type: "select", options: [
        "eastus", "westus2", "westeurope", "northeurope", "southeastasia"
      ]}
    ]
  },
  gcp: {
    name: "Google Cloud Platform",
    fields: [
      { key: "account_name", label: "Account Name", placeholder: "My GCP Account" },
      { key: "account_id", label: "Project ID", placeholder: "my-project-123456" },
      { key: "default_region", label: "Default Region", type: "select", options: [
        "us-central1", "us-east1", "europe-west1", "asia-east1", "asia-southeast1"
      ]}
    ]
  },
  alibaba: {
    name: "Alibaba Cloud",
    fields: [
      { key: "account_name", label: "Account Name", placeholder: "My Alibaba Cloud Account" },
      { key: "account_id", label: "Account ID", placeholder: "1234567890" },
      { key: "default_region", label: "Default Region", type: "select", options: [
        "cn-hangzhou", "cn-shanghai", "cn-beijing", "ap-southeast-1", "us-west-1"
      ]}
    ]
  },
  ibm: {
    name: "IBM Cloud",
    fields: [
      { key: "account_name", label: "Account Name", placeholder: "My IBM Cloud Account" },
      { key: "account_id", label: "Account ID", placeholder: "abc123xyz456" },
      { key: "default_region", label: "Default Region", type: "select", options: [
        "us-south", "us-east", "eu-gb", "eu-de", "jp-tok"
      ]}
    ]
  },
  oracle: {
    name: "Oracle Cloud",
    fields: [
      { key: "account_name", label: "Account Name", placeholder: "My Oracle Cloud Account" },
      { key: "account_id", label: "Tenancy OCID", placeholder: "ocid1.tenancy.oc1..." },
      { key: "default_region", label: "Default Region", type: "select", options: [
        "us-phoenix-1", "us-ashburn-1", "eu-frankfurt-1", "uk-london-1", "ap-tokyo-1"
      ]}
    ]
  }
};

export default function ConnectCloudModal({ open, onClose, provider, onSubmit, isLoading }) {
  const providerConfig = PROVIDERS[provider];
  const [formData, setFormData] = useState({
    provider,
    account_name: "",
    account_id: "",
    default_region: "",
    status: "pending",
    regions: [],
    monthly_spend: 0,
    resources_count: 0
  });

  if (!providerConfig) return null;

  const handleSubmit = () => {
    if (!formData.account_name || !formData.account_id) return;
    onSubmit({
      ...formData,
      regions: formData.default_region ? [formData.default_region] : []
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Connect {providerConfig.name}</DialogTitle>
        </DialogHeader>

        <Alert className="bg-blue-50 border-blue-200">
          <Info className="w-4 h-4 text-blue-600" />
          <AlertDescription className="text-blue-800 text-sm">
            Your credentials are encrypted and stored securely. We never store access keys directly.
          </AlertDescription>
        </Alert>

        <div className="space-y-4 py-4">
          {providerConfig.fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              {field.type === "select" ? (
                <Select 
                  value={formData[field.key]}
                  onValueChange={(value) => setFormData({ ...formData, [field.key]: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={field.key}
                  placeholder={field.placeholder}
                  value={formData[field.key]}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                />
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!formData.account_name || !formData.account_id || isLoading}
            className="bg-slate-900 hover:bg-slate-800"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Shield className="w-4 h-4 mr-2" />
            )}
            Connect Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}