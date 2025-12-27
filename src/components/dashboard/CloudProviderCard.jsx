import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Plus, ExternalLink } from "lucide-react";

const providerBranding = {
  aws: {
    name: "Amazon Web Services",
    logo: "🔶",
    gradient: "from-orange-500 to-amber-500",
    description: "Ideal for scaling and complex computing needs"
  },
  azure: {
    name: "Microsoft Azure",
    logo: "🔷",
    gradient: "from-blue-500 to-cyan-500",
    description: "Great for Microsoft-heavy environments"
  },
  gcp: {
    name: "Google Cloud Platform",
    logo: "🔴",
    gradient: "from-red-500 to-blue-500",
    description: "Strong in big data and machine learning"
  },
  alibaba: {
    name: "Alibaba Cloud",
    logo: "🟠",
    gradient: "from-orange-500 to-red-500",
    description: "Excellent for Asia-based clients"
  },
  ibm: {
    name: "IBM Cloud",
    logo: "🔵",
    gradient: "from-blue-600 to-indigo-600",
    description: "Enterprise-focused workloads"
  },
  oracle: {
    name: "Oracle Cloud",
    logo: "🔴",
    gradient: "from-red-600 to-red-700",
    description: "Database and enterprise applications"
  }
};

export default function CloudProviderCard({ 
  provider, 
  isConnected = false, 
  accountInfo,
  onConnect,
  onManage 
}) {
  const branding = providerBranding[provider];
  
  if (!branding) return null;

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl border transition-all duration-300",
      isConnected 
        ? "border-emerald-200 bg-white shadow-lg" 
        : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-md"
    )}>
      {/* Header */}
      <div className={cn(
        "h-20 bg-gradient-to-r p-4",
        `${branding.gradient}`
      )}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{branding.logo}</span>
          <div className="text-white">
            <h3 className="font-semibold">{branding.name}</h3>
            <p className="text-xs text-white/80">{branding.description}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {isConnected ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-emerald-100 text-emerald-700">
                <Check className="w-3 h-3 mr-1" /> Connected
              </Badge>
            </div>
            {accountInfo && (
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Account</span>
                  <span className="text-slate-900 font-medium">{accountInfo.account_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Resources</span>
                  <span className="text-slate-900 font-medium">{accountInfo.resources_count || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Monthly Spend</span>
                  <span className="text-slate-900 font-medium">${accountInfo.monthly_spend?.toFixed(2) || "0.00"}</span>
                </div>
              </div>
            )}
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => onManage?.(provider)}
            >
              Manage <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-4">
              Connect your {branding.name} account to deploy and manage resources.
            </p>
            <Button 
              className="w-full bg-slate-900 hover:bg-slate-800"
              onClick={() => onConnect?.(provider)}
            >
              <Plus className="w-4 h-4 mr-2" /> Connect Account
            </Button>
          </>
        )}
      </div>
    </div>
  );
}