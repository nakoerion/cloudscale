import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const statusConfig = {
  pending: { icon: Clock, color: "text-slate-400", bg: "bg-slate-100", label: "Pending" },
  in_progress: { icon: Loader2, color: "text-blue-500", bg: "bg-blue-100", label: "Deploying", spin: true },
  success: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-100", label: "Success" },
  failed: { icon: XCircle, color: "text-red-500", bg: "bg-red-100", label: "Failed" },
  rolled_back: { icon: RotateCcw, color: "text-amber-500", bg: "bg-amber-100", label: "Rolled Back" }
};

const envColors = {
  development: "bg-blue-100 text-blue-700",
  staging: "bg-amber-100 text-amber-700",
  production: "bg-emerald-100 text-emerald-700"
};

export default function DeploymentTimeline({ deployments = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Recent Deployments</h3>
        <Badge variant="secondary" className="bg-slate-100">
          {deployments.length} total
        </Badge>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200" />

        <div className="space-y-6">
          {deployments.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8 ml-10">
              No deployments yet
            </p>
          ) : (
            deployments.map((deployment, index) => {
              const status = statusConfig[deployment.status] || statusConfig.pending;
              const StatusIcon = status.icon;

              return (
                <div key={deployment.id || index} className="flex items-start gap-4 relative">
                  {/* Timeline dot */}
                  <div className={cn(
                    "relative z-10 p-2 rounded-full shrink-0",
                    status.bg
                  )}>
                    <StatusIcon className={cn(
                      "w-4 h-4",
                      status.color,
                      status.spin && "animate-spin"
                    )} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pb-6">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={cn("text-xs", envColors[deployment.environment])}>
                        {deployment.environment}
                      </Badge>
                      <span className="text-sm font-medium text-slate-900">
                        v{deployment.version || "1.0.0"}
                      </span>
                      <span className="text-xs text-slate-400">
                        {deployment.cloud_provider?.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-sm text-slate-500 mt-1">
                      {deployment.commit_sha && (
                        <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded mr-2">
                          {deployment.commit_sha.slice(0, 7)}
                        </code>
                      )}
                      {deployment.region && `Deployed to ${deployment.region}`}
                    </p>

                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {deployment.created_date 
                          ? format(new Date(deployment.created_date), "MMM d, HH:mm")
                          : "—"
                        }
                      </span>
                      {deployment.deployed_by && (
                        <span>by {deployment.deployed_by}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}