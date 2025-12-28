import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Heart, Plus, CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";

const HEALTH_CHECKS = [
  {
    id: 1,
    name: "API Health Check",
    endpoint: "https://api.cloudforge.app/health",
    protocol: "HTTPS",
    interval: 30,
    timeout: 5,
    healthyThreshold: 2,
    unhealthyThreshold: 3,
    status: "healthy",
    lastCheck: "30s ago",
    enabled: true
  },
  {
    id: 2,
    name: "Database Connection Check",
    endpoint: "tcp://db.cloudforge.app:5432",
    protocol: "TCP",
    interval: 60,
    timeout: 10,
    healthyThreshold: 2,
    unhealthyThreshold: 2,
    status: "healthy",
    lastCheck: "1m ago",
    enabled: true
  },
  {
    id: 3,
    name: "Cache Service Check",
    endpoint: "tcp://cache.cloudforge.app:6379",
    protocol: "TCP",
    interval: 30,
    timeout: 3,
    healthyThreshold: 2,
    unhealthyThreshold: 3,
    status: "degraded",
    lastCheck: "45s ago",
    enabled: true
  }
];

export default function HealthCheckManager() {
  const getStatusIcon = (status) => {
    switch(status) {
      case "healthy": return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "degraded": return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case "unhealthy": return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      healthy: "bg-emerald-100 text-emerald-700",
      degraded: "bg-amber-100 text-amber-700",
      unhealthy: "bg-red-100 text-red-700"
    };
    return colors[status] || "bg-slate-100 text-slate-700";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600" />
            Health Checks & Monitoring
          </CardTitle>
          <Button 
            onClick={() => toast.success("Creating new health check...")}
            size="sm"
            className="bg-red-600 hover:bg-red-700"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Check
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {HEALTH_CHECKS.map((check) => (
          <div key={check.id} className="border-2 border-slate-200 rounded-xl p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                {getStatusIcon(check.status)}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{check.name}</h3>
                  <p className="text-sm text-slate-600 mb-2">{check.endpoint}</p>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusBadge(check.status)} style={{ textTransform: 'capitalize' }}>
                      {check.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {check.protocol}
                    </Badge>
                    <span className="text-xs text-slate-500">Last check: {check.lastCheck}</span>
                  </div>
                </div>
              </div>
              <Switch 
                checked={check.enabled}
                onCheckedChange={(enabled) => 
                  toast.success(enabled ? "Health check enabled" : "Health check disabled")
                }
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Interval</p>
                <p className="font-semibold text-slate-900">{check.interval}s</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Timeout</p>
                <p className="font-semibold text-slate-900">{check.timeout}s</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <p className="text-xs text-emerald-600 mb-1">Healthy</p>
                <p className="font-semibold text-emerald-700">{check.healthyThreshold} checks</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-xs text-red-600 mb-1">Unhealthy</p>
                <p className="font-semibold text-red-700">{check.unhealthyThreshold} checks</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => toast.success(`Testing ${check.name}...`)}
              >
                Test Now
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => toast.success("Opening health check history...")}
              >
                View History
              </Button>
            </div>
          </div>
        ))}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h4 className="font-semibold text-blue-900 mb-2">Automated Recovery</h4>
          <p className="text-sm text-blue-800">
            Failed health checks automatically trigger instance replacement and alert notifications via CloudWatch.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}