import { 
  Rocket, 
  GitBranch, 
  Cloud, 
  CheckCircle2, 
  AlertTriangle,
  Settings,
  Users,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const activityIcons = {
  deployment: { icon: Rocket, color: "text-violet-500", bg: "bg-violet-50" },
  build: { icon: GitBranch, color: "text-blue-500", bg: "bg-blue-50" },
  migration: { icon: Cloud, color: "text-indigo-500", bg: "bg-indigo-50" },
  success: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
  warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50" },
  config: { icon: Settings, color: "text-slate-500", bg: "bg-slate-50" },
  team: { icon: Users, color: "text-pink-500", bg: "bg-pink-50" },
  integration: { icon: Zap, color: "text-orange-500", bg: "bg-orange-50" }
};

export default function ActivityFeed({ activities = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-5">Recent Activity</h3>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">No recent activity</p>
        ) : (
          activities.map((activity, index) => {
            const { icon: Icon, color, bg } = activityIcons[activity.type] || activityIcons.config;
            return (
              <div key={index} className="flex items-start gap-3 group">
                <div className={cn("p-2 rounded-lg shrink-0", bg)}>
                  <Icon className={cn("w-4 h-4", color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900 font-medium">{activity.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{activity.description}</p>
                </div>
                <span className="text-xs text-slate-400 shrink-0">
                  {activity.time ? format(new Date(activity.time), "HH:mm") : ""}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}