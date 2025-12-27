import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Clock,
  GitBranch,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const providerLogos = {
  "github-actions": "⬛",
  "gitlab-ci": "🦊",
  "jenkins": "🔧",
  "circleci": "⭕",
  "azure-devops": "🔷"
};

const statusConfig = {
  active: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50", label: "Active" },
  paused: { icon: Pause, color: "text-amber-500", bg: "bg-amber-50", label: "Paused" },
  failed: { icon: XCircle, color: "text-red-500", bg: "bg-red-50", label: "Failed" },
  running: { icon: Loader2, color: "text-blue-500", bg: "bg-blue-50", label: "Running", spin: true }
};

export default function PipelineCard({ pipeline, onRun, onPause, onRetry }) {
  const status = statusConfig[pipeline.status] || statusConfig.active;
  const StatusIcon = status.icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:border-slate-200 hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{providerLogos[pipeline.provider] || "🔧"}</span>
          <div>
            <h3 className="font-semibold text-slate-900">{pipeline.name}</h3>
            <p className="text-sm text-slate-500 capitalize">{pipeline.provider?.replace("-", " ")}</p>
          </div>
        </div>
        <Badge className={cn("text-xs font-medium", status.bg, status.color)}>
          <StatusIcon className={cn("w-3 h-3 mr-1", status.spin && "animate-spin")} />
          {status.label}
        </Badge>
      </div>

      {/* Stages Visualization */}
      {pipeline.stages?.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-1">
            {pipeline.stages.map((stage, i) => (
              <div key={i} className="flex-1 flex items-center">
                <div 
                  className={cn(
                    "h-2 flex-1 rounded-full",
                    stage.status === "success" && "bg-emerald-400",
                    stage.status === "failed" && "bg-red-400",
                    stage.status === "running" && "bg-blue-400 animate-pulse",
                    stage.status === "pending" && "bg-slate-200"
                  )}
                />
                {i < pipeline.stages.length - 1 && (
                  <div className="w-2 h-0.5 bg-slate-200" />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {pipeline.stages.map((stage, i) => (
              <span key={i} className="text-xs text-slate-500 text-center flex-1">
                {stage.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 py-4 border-y border-slate-100 mb-4">
        <div>
          <p className="text-lg font-semibold text-slate-900">
            {pipeline.success_rate?.toFixed(0) || 100}%
          </p>
          <p className="text-xs text-slate-500">Success Rate</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-900">
            {pipeline.avg_duration ? `${Math.round(pipeline.avg_duration / 60)}m` : "—"}
          </p>
          <p className="text-xs text-slate-500">Avg Duration</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-900 flex items-center gap-1">
            <GitBranch className="w-3.5 h-3.5" />
            {pipeline.branch || "main"}
          </p>
          <p className="text-xs text-slate-500">Branch</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {pipeline.last_run 
            ? format(new Date(pipeline.last_run), "MMM d, HH:mm")
            : "Never run"
          }
        </span>
        <div className="flex items-center gap-2">
          {pipeline.status === "failed" && (
            <Button size="sm" variant="outline" onClick={() => onRetry?.(pipeline)}>
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          )}
          {pipeline.status === "running" ? (
            <Button size="sm" variant="outline" onClick={() => onPause?.(pipeline)}>
              <Pause className="w-3.5 h-3.5 mr-1" /> Stop
            </Button>
          ) : (
            <Button 
              size="sm" 
              className="bg-violet-600 hover:bg-violet-700"
              onClick={() => onRun?.(pipeline)}
            >
              <Play className="w-3.5 h-3.5 mr-1" /> Run
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}