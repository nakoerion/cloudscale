import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Loader2, 
  GitBranch,
  Play,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PipelineStatus({ projectId, repository }) {
  const [pipeline, setPipeline] = useState({
    status: "running",
    stage: "build",
    progress: 45,
    startedAt: new Date().toISOString(),
    logs: []
  });

  useEffect(() => {
    // Simulate pipeline progress
    if (pipeline.status === "running") {
      const interval = setInterval(() => {
        setPipeline(prev => {
          const newProgress = prev.progress + 5;
          if (newProgress >= 100) {
            return { ...prev, status: "success", progress: 100, stage: "completed" };
          }
          return { ...prev, progress: newProgress };
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [pipeline.status, pipeline.progress]);

  const statusConfig = {
    running: { 
      icon: Loader2, 
      color: "text-blue-600", 
      bg: "bg-blue-100", 
      label: "Running",
      spin: true 
    },
    success: { 
      icon: CheckCircle2, 
      color: "text-emerald-600", 
      bg: "bg-emerald-100", 
      label: "Success" 
    },
    failed: { 
      icon: XCircle, 
      color: "text-red-600", 
      bg: "bg-red-100", 
      label: "Failed" 
    },
    pending: { 
      icon: Clock, 
      color: "text-amber-600", 
      bg: "bg-amber-100", 
      label: "Pending" 
    }
  };

  const config = statusConfig[pipeline.status];
  const StatusIcon = config.icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", config.bg)}>
            <StatusIcon className={cn("w-5 h-5", config.color, config.spin && "animate-spin")} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">CI/CD Pipeline</h3>
            <p className="text-sm text-slate-500">
              {repository?.branch || "main"} branch
            </p>
          </div>
        </div>
        <Badge className={cn(config.bg, config.color)}>
          {config.label}
        </Badge>
      </div>

      {/* Progress Bar */}
      {pipeline.status === "running" && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 capitalize">{pipeline.stage}</span>
            <span className="text-sm text-slate-500">{pipeline.progress}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500"
              style={{ width: `${pipeline.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Pipeline Stages */}
      <div className="space-y-2 mb-4">
        {[
          { name: "Setup", status: "success" },
          { name: "Build", status: pipeline.progress > 30 ? "success" : "running" },
          { name: "Test", status: pipeline.progress > 60 ? "success" : "pending" },
          { name: "Deploy", status: pipeline.progress > 90 ? "success" : "pending" }
        ].map((stage, i) => {
          const stageConfig = statusConfig[stage.status];
          const StageIcon = stageConfig.icon;
          return (
            <div key={i} className="flex items-center gap-3 p-2">
              <StageIcon className={cn("w-4 h-4", stageConfig.color, stageConfig.spin && "animate-spin")} />
              <span className="text-sm text-slate-700">{stage.name}</span>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t">
        <Button size="sm" variant="outline" className="flex-1">
          <GitBranch className="w-3 h-3 mr-1" /> View Logs
        </Button>
        <Button size="sm" variant="outline" className="flex-1">
          <ExternalLink className="w-3 h-3 mr-1" /> Open Repo
        </Button>
      </div>
    </div>
  );
}