import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2, Clock, ArrowRight, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const STAGE_ICONS = {
  success: CheckCircle2,
  failed: XCircle,
  running: Loader2,
  pending: Clock,
  queued: PlayCircle
};

const STAGE_COLORS = {
  success: "bg-emerald-100 text-emerald-700 border-emerald-300",
  failed: "bg-red-100 text-red-700 border-red-300",
  running: "bg-blue-100 text-blue-700 border-blue-300",
  pending: "bg-slate-100 text-slate-600 border-slate-300",
  queued: "bg-amber-100 text-amber-700 border-amber-300"
};

export default function PipelineStageFlow({ pipeline }) {
  const stages = pipeline.stages || [
    { name: "Build", status: "success", duration: 45 },
    { name: "Test", status: "success", duration: 120 },
    { name: "Staging", status: "running", duration: 30 },
    { name: "Production", status: "pending", duration: 0 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Pipeline Stages - {pipeline.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-3 overflow-x-auto pb-4">
          {stages.map((stage, index) => {
            const Icon = STAGE_ICONS[stage.status];
            const isLast = index === stages.length - 1;
            
            return (
              <div key={index} className="flex items-center gap-3">
                <div className="flex flex-col items-center min-w-[140px]">
                  <div
                    className={cn(
                      "w-full p-4 rounded-xl border-2 transition-all",
                      STAGE_COLORS[stage.status]
                    )}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <Icon
                        className={cn(
                          "w-8 h-8",
                          stage.status === "running" && "animate-spin"
                        )}
                      />
                    </div>
                    <p className="text-sm font-semibold text-center mb-1">
                      {stage.name}
                    </p>
                    <div className="text-center">
                      <Badge
                        variant="outline"
                        className="text-xs"
                      >
                        {stage.status === "running" ? "In Progress" : 
                         stage.status === "success" ? `${stage.duration}s` :
                         stage.status === "failed" ? "Failed" :
                         stage.status === "pending" ? "Waiting" : "Queued"}
                      </Badge>
                    </div>
                  </div>
                </div>
                {!isLast && (
                  <ArrowRight className="w-6 h-6 text-slate-400 shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-slate-500 mb-1">Total Duration</p>
              <p className="font-semibold text-slate-900">
                {stages.reduce((acc, s) => acc + (s.duration || 0), 0)}s
              </p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Success Rate</p>
              <p className="font-semibold text-emerald-600">{pipeline.success_rate}%</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Trigger</p>
              <p className="font-semibold text-slate-900 capitalize">{pipeline.trigger}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Branch</p>
              <p className="font-semibold text-slate-900">{pipeline.branch}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}