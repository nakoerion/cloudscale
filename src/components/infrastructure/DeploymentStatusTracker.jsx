import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { 
  Activity, 
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";

const STATUS_CONFIG = {
  pending: { 
    icon: Clock, 
    color: "text-slate-500", 
    bg: "bg-slate-100", 
    label: "Pending",
    description: "Waiting to start"
  },
  planning: { 
    icon: Activity, 
    color: "text-blue-500", 
    bg: "bg-blue-100", 
    label: "Planning",
    description: "Analyzing infrastructure changes"
  },
  applying: { 
    icon: Activity, 
    color: "text-violet-500", 
    bg: "bg-violet-100", 
    label: "Applying",
    description: "Creating/updating resources"
  },
  completed: { 
    icon: CheckCircle2, 
    color: "text-emerald-500", 
    bg: "bg-emerald-100", 
    label: "Completed",
    description: "Successfully deployed"
  },
  failed: { 
    icon: XCircle, 
    color: "text-red-500", 
    bg: "bg-red-100", 
    label: "Failed",
    description: "Deployment failed"
  },
  destroying: { 
    icon: AlertTriangle, 
    color: "text-amber-500", 
    bg: "bg-amber-100", 
    label: "Destroying",
    description: "Removing infrastructure"
  }
};

export default function DeploymentStatusTracker() {
  const { data: deployments = [], isLoading, refetch } = useQuery({
    queryKey: ["iac-deployments-status"],
    queryFn: () => base44.entities.IaCDeployment.list("-created_date", 10),
    refetchInterval: 5000 // Auto-refresh every 5 seconds
  });

  const { data: templates = [] } = useQuery({
    queryKey: ["iac-templates"],
    queryFn: () => base44.entities.IaCTemplate.list("-created_date", 50)
  });

  const activeDeployments = deployments.filter(d => 
    ["pending", "planning", "applying", "destroying"].includes(d.status)
  );

  const recentDeployments = deployments.slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Active Deployments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-violet-600" />
              Active Deployments
            </span>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-3 h-3 mr-2" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-3 border-violet-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : activeDeployments.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No active deployments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeDeployments.map((deployment) => {
                const config = STATUS_CONFIG[deployment.status];
                const Icon = config.icon;
                const template = templates.find(t => t.id === deployment.template_id);

                return (
                  <div key={deployment.id} className="p-4 border-2 border-slate-200 rounded-xl">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-slate-900">{template?.name || "Deployment"}</h4>
                        <p className="text-sm text-slate-600">
                          {deployment.provider.toUpperCase()} • {deployment.region}
                        </p>
                      </div>
                      <Badge className={`${config.bg} ${config.color}`}>
                        <Icon className="w-3 h-3 mr-1 animate-pulse" />
                        {config.label}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{config.description}</span>
                    </div>

                    {deployment.ci_cd_enabled && deployment.last_commit_sha && (
                      <div className="mt-3 p-2 bg-blue-50 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                          <span className="text-xs text-blue-700">
                            Triggered by commit: {deployment.last_commit_sha.substring(0, 7)}
                          </span>
                        </div>
                        {deployment.workflow_url && (
                          <Button size="sm" variant="ghost" className="h-6" asChild>
                            <a href={deployment.workflow_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Deployments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-600" />
            Recent Deployments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-3 border-slate-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : recentDeployments.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No deployments yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentDeployments.map((deployment) => {
                const config = STATUS_CONFIG[deployment.status];
                const Icon = config.icon;
                const template = templates.find(t => t.id === deployment.template_id);

                return (
                  <div key={deployment.id} className="p-3 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${config.bg} rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-4 h-4 ${config.color}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{template?.name || "Deployment"}</p>
                          <p className="text-xs text-slate-500">
                            {deployment.provider.toUpperCase()} • {deployment.region}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {config.label}
                      </Badge>
                    </div>

                    {deployment.ci_cd_enabled && deployment.last_commit_message && (
                      <div className="text-xs text-slate-600 mb-2 line-clamp-1">
                        {deployment.last_commit_message}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{format(new Date(deployment.created_date), "MMM d, h:mm a")}</span>
                      {deployment.cost_estimate && (
                        <span className="font-medium">${deployment.cost_estimate.toFixed(2)}/mo</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}