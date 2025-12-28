import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database, TrendingUp, Zap, CheckCircle2, AlertTriangle } from "lucide-react";

const OPTIMIZATION_RECOMMENDATIONS = [
  {
    id: 1,
    table: "users",
    issue: "Missing Index",
    severity: "high",
    description: "Queries filtering by tenant_id are slow",
    current_performance: "2.3s avg query time",
    optimized_performance: "45ms avg query time",
    impact: "95% faster queries",
    sql: "CREATE INDEX idx_users_tenant_id ON users(tenant_id);"
  },
  {
    id: 2,
    table: "orders",
    issue: "Partition Recommendation",
    severity: "medium",
    description: "Large table should be partitioned by tenant_id for better performance",
    current_performance: "850ms avg query time",
    optimized_performance: "180ms avg query time",
    impact: "78% faster queries, better data management",
    sql: `CREATE TABLE orders_partitioned (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  ...
) PARTITION BY LIST (tenant_id);

CREATE TABLE orders_tenant_1 PARTITION OF orders_partitioned
  FOR VALUES IN ('tenant-uuid-1');`
  },
  {
    id: 3,
    table: "audit_logs",
    issue: "Archiving Strategy Needed",
    severity: "low",
    description: "Table growing too large, implement time-based archiving",
    current_performance: "12GB table size",
    optimized_performance: "2GB active data",
    impact: "83% storage reduction, faster backups",
    sql: `-- Move old data to archive table
INSERT INTO audit_logs_archive 
SELECT * FROM audit_logs 
WHERE created_date < NOW() - INTERVAL '90 days';

DELETE FROM audit_logs 
WHERE created_date < NOW() - INTERVAL '90 days';`
  }
];

const SCHEMA_BEST_PRACTICES = [
  { name: "Tenant ID in All Tables", status: "implemented", description: "All tables include tenant_id column" },
  { name: "Composite Indexes", status: "implemented", description: "Indexes include tenant_id as first column" },
  { name: "Foreign Key Constraints", status: "implemented", description: "All FKs include tenant_id check" },
  { name: "RLS Policies", status: "implemented", description: "Row-level security enforced on all tables" },
  { name: "Connection Pooling", status: "implemented", description: "Tenant-aware connection pooling configured" },
  { name: "Query Timeouts", status: "implemented", description: "Per-tenant query timeout limits set" }
];

export default function DatabaseSchemaOptimizer() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-violet-600" />
            Schema Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {OPTIMIZATION_RECOMMENDATIONS.map((rec) => (
            <div key={rec.id} className="p-4 border-2 rounded-xl" style={{
              borderColor: rec.severity === "high" ? "#f59e0b" : rec.severity === "medium" ? "#3b82f6" : "#64748b"
            }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    rec.severity === "high" ? "bg-amber-100" :
                    rec.severity === "medium" ? "bg-blue-100" :
                    "bg-slate-100"
                  }`}>
                    <AlertTriangle className={`w-5 h-5 ${
                      rec.severity === "high" ? "text-amber-600" :
                      rec.severity === "medium" ? "text-blue-600" :
                      "text-slate-600"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900">{rec.issue}</h4>
                      <Badge variant="outline" className="text-xs font-mono">{rec.table}</Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{rec.description}</p>
                  </div>
                </div>
                <Badge className={
                  rec.severity === "high" ? "bg-amber-100 text-amber-700" :
                  rec.severity === "medium" ? "bg-blue-100 text-blue-700" :
                  "bg-slate-100 text-slate-700"
                }>
                  {rec.severity}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3 p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Current</p>
                  <p className="text-sm font-semibold text-red-600">{rec.current_performance}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Optimized</p>
                  <p className="text-sm font-semibold text-emerald-600">{rec.optimized_performance}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Impact</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-600" />
                    <p className="text-sm font-semibold text-emerald-600">{rec.impact}</p>
                  </div>
                </div>
              </div>

              <details className="mb-3">
                <summary className="text-sm font-medium text-violet-600 cursor-pointer hover:text-violet-700">
                  View SQL
                </summary>
                <pre className="mt-2 p-3 bg-slate-900 text-slate-100 rounded-lg text-xs overflow-x-auto">
                  <code>{rec.sql}</code>
                </pre>
              </details>

              <div className="flex gap-2">
                <Button size="sm">
                  <Zap className="w-3 h-3 mr-2" />
                  Apply Optimization
                </Button>
                <Button size="sm" variant="outline">Test in Staging</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Multi-Tenancy Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {SCHEMA_BEST_PRACTICES.map((practice, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h5 className="font-medium text-emerald-900 mb-1">{practice.name}</h5>
                  <p className="text-sm text-emerald-700">{practice.description}</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700">{practice.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}