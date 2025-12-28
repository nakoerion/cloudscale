import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Database, Lock, CheckCircle2 } from "lucide-react";

const ISOLATION_STRATEGIES = [
  {
    id: "shared",
    name: "Shared Database",
    description: "All tenants share the same database with tenant_id filtering",
    pros: ["Cost-effective", "Easy maintenance", "Simple scaling"],
    cons: ["Higher security risk", "Performance impact", "Limited customization"],
    security_level: "medium",
    complexity: "low",
    cost: "low"
  },
  {
    id: "dedicated_schema",
    name: "Dedicated Schema",
    description: "Each tenant has their own database schema",
    pros: ["Better isolation", "Per-tenant backups", "Schema customization"],
    cons: ["More complex", "Higher overhead", "Limited by DB connections"],
    security_level: "high",
    complexity: "medium",
    cost: "medium"
  },
  {
    id: "dedicated_database",
    name: "Dedicated Database",
    description: "Each tenant has their own separate database",
    pros: ["Complete isolation", "Max security", "Independent scaling"],
    cons: ["Highest cost", "Complex management", "More infrastructure"],
    security_level: "very high",
    complexity: "high",
    cost: "high"
  }
];

const SECURITY_FEATURES = [
  { name: "Row-Level Security (RLS)", enabled: true, description: "Automatic tenant filtering at database level" },
  { name: "Connection Pooling", enabled: true, description: "Tenant-aware connection management" },
  { name: "Encryption at Rest", enabled: true, description: "All tenant data encrypted" },
  { name: "Audit Logging", enabled: true, description: "Track all cross-tenant access attempts" },
  { name: "Query Timeout Limits", enabled: true, description: "Prevent resource exhaustion" }
];

export default function DataIsolationViewer() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            Data Isolation Strategies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {ISOLATION_STRATEGIES.map((strategy) => (
            <div key={strategy.id} className="p-4 border-2 border-slate-200 rounded-xl">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Database className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">{strategy.name}</h4>
                    <p className="text-sm text-slate-600 mb-3">{strategy.description}</p>
                    <div className="flex gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        Security: {strategy.security_level}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Complexity: {strategy.complexity}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Cost: {strategy.cost}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-emerald-700 mb-2">✓ Advantages</p>
                  <ul className="text-xs text-slate-600 space-y-1">
                    {strategy.pros.map((pro, i) => (
                      <li key={i}>• {pro}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-amber-700 mb-2">⚠ Considerations</p>
                  <ul className="text-xs text-slate-600 space-y-1">
                    {strategy.cons.map((con, i) => (
                      <li key={i}>• {con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" />
            Security Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {SECURITY_FEATURES.map((feature, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h5 className="font-medium text-slate-900 mb-1">{feature.name}</h5>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}