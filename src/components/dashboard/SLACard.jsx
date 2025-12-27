import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Clock, 
  Phone, 
  Database, 
  Check,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const tierConfig = {
  basic: {
    name: "Basic",
    color: "from-slate-500 to-slate-600",
    badge: "bg-slate-100 text-slate-700"
  },
  professional: {
    name: "Professional",
    color: "from-violet-500 to-indigo-600",
    badge: "bg-violet-100 text-violet-700"
  },
  enterprise: {
    name: "Enterprise",
    color: "from-amber-500 to-orange-600",
    badge: "bg-amber-100 text-amber-700"
  }
};

export default function SLACard({ contract, onUpgrade, onManage }) {
  const tier = tierConfig[contract?.tier] || tierConfig.basic;

  if (!contract) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="text-center py-8">
          <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No SLA Contract</h3>
          <p className="text-sm text-slate-500 mb-4">
            Get guaranteed uptime, support, and disaster recovery
          </p>
          <Button onClick={onUpgrade} className="bg-violet-600 hover:bg-violet-700">
            View SLA Plans <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className={cn("bg-gradient-to-r p-6 text-white", tier.color)}>
        <div className="flex items-center justify-between">
          <div>
            <Badge className="bg-white/20 text-white mb-2">{tier.name} Plan</Badge>
            <h3 className="text-2xl font-bold">${contract.monthly_price}/mo</h3>
          </div>
          <Shield className="w-12 h-12 opacity-80" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Status */}
        <div className="flex items-center gap-2 mb-6">
          <Badge className={cn(
            contract.status === "active" && "bg-emerald-100 text-emerald-700",
            contract.status === "pending" && "bg-amber-100 text-amber-700",
            contract.status === "expired" && "bg-red-100 text-red-700"
          )}>
            {contract.status}
          </Badge>
          {contract.auto_renew && (
            <span className="text-xs text-slate-500">Auto-renews</span>
          )}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs">Uptime Guarantee</span>
            </div>
            <p className="text-xl font-bold text-slate-900">
              {contract.uptime_guarantee}%
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Phone className="w-4 h-4" />
              <span className="text-xs">Response Time</span>
            </div>
            <p className="text-xl font-bold text-slate-900">
              {contract.response_time_hours}h
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Database className="w-4 h-4" />
              <span className="text-xs">RPO</span>
            </div>
            <p className="text-xl font-bold text-slate-900">
              {contract.rpo_hours}h
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Database className="w-4 h-4" />
              <span className="text-xs">RTO</span>
            </div>
            <p className="text-xl font-bold text-slate-900">
              {contract.rto_hours}h
            </p>
          </div>
        </div>

        {/* Features */}
        {contract.included_features?.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium text-slate-700 mb-3">Included Features</p>
            <div className="space-y-2">
              {contract.included_features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button 
            className="flex-1 bg-slate-900 hover:bg-slate-800"
            onClick={() => onManage?.(contract)}
          >
            Manage Contract
          </Button>
          {contract.tier !== "enterprise" && (
            <Button 
              variant="outline" 
              onClick={onUpgrade}
            >
              Upgrade
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}