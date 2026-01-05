import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Lock, Shield, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const SECURITY_POLICIES = [
  {
    id: "no-public-buckets",
    name: "No Public Storage Buckets",
    description: "Prevent creation of publicly accessible storage buckets",
    category: "storage",
    severity: "critical",
    enabled: true
  },
  {
    id: "encryption-at-rest",
    name: "Encryption at Rest",
    description: "All data must be encrypted when stored",
    category: "encryption",
    severity: "high",
    enabled: true
  },
  {
    id: "mfa-required",
    name: "MFA Required",
    description: "Multi-factor authentication required for all users",
    category: "access",
    severity: "high",
    enabled: true
  },
  {
    id: "no-root-access",
    name: "No Root Access",
    description: "Prevent direct root/admin access to resources",
    category: "access",
    severity: "critical",
    enabled: true
  },
  {
    id: "security-groups",
    name: "Restricted Security Groups",
    description: "Security groups must not allow unrestricted inbound access",
    category: "network",
    severity: "high",
    enabled: true
  },
  {
    id: "ssl-tls-only",
    name: "SSL/TLS Only",
    description: "All communications must use SSL/TLS encryption",
    category: "encryption",
    severity: "high",
    enabled: true
  },
  {
    id: "audit-logging",
    name: "Audit Logging",
    description: "All resource access must be logged",
    category: "monitoring",
    severity: "medium",
    enabled: false
  },
  {
    id: "backup-enabled",
    name: "Automated Backups",
    description: "Critical resources must have automated backups",
    category: "resilience",
    severity: "medium",
    enabled: false
  }
];

export default function SecurityPolicyEnforcer() {
  const [policies, setPolicies] = useState(SECURITY_POLICIES);

  const togglePolicy = (id) => {
    setPolicies(prev => prev.map(p => 
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
    toast.success("Policy updated");
  };

  const getSeverityColor = (severity) => {
    return {
      critical: "bg-red-100 text-red-700",
      high: "bg-orange-100 text-orange-700",
      medium: "bg-amber-100 text-amber-700",
      low: "bg-blue-100 text-blue-700"
    }[severity];
  };

  const enabledCount = policies.filter(p => p.enabled).length;
  const criticalEnabled = policies.filter(p => p.severity === 'critical' && p.enabled).length;
  const criticalTotal = policies.filter(p => p.severity === 'critical').length;

  return (
    <Card className="border-2 border-indigo-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-600" />
            Security Policy Enforcement
          </span>
          <Badge className="bg-indigo-100 text-indigo-700">
            {enabledCount}/{policies.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl border border-indigo-200">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-indigo-600" />
              <p className="text-sm font-medium text-slate-700">Active Policies</p>
            </div>
            <p className="text-3xl font-bold text-slate-900">{enabledCount}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-sm font-medium text-slate-700">Critical Policies</p>
            </div>
            <p className="text-3xl font-bold text-slate-900">{criticalEnabled}/{criticalTotal}</p>
          </div>
        </div>

        <div className="space-y-3">
          {policies.map((policy) => (
            <div 
              key={policy.id}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-slate-900">{policy.name}</h4>
                    <Badge className={getSeverityColor(policy.severity)}>
                      {policy.severity}
                    </Badge>
                    <Badge variant="outline" className="capitalize text-xs">
                      {policy.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">{policy.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={policy.enabled}
                    onCheckedChange={() => togglePolicy(policy.id)}
                  />
                  {policy.enabled ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> Enabled policies will be automatically enforced during infrastructure provisioning. 
            Resources that violate policies will be blocked or flagged.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}