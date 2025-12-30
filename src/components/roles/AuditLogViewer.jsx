import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { 
  ScrollText, 
  Shield, 
  User, 
  Lock,
  Plus,
  Trash2,
  Edit,
  UserPlus,
  UserMinus
} from "lucide-react";
import { format } from "date-fns";

const ACTION_CONFIG = {
  role_created: { icon: Plus, color: "text-emerald-600", bg: "bg-emerald-50", label: "Role Created" },
  role_updated: { icon: Edit, color: "text-blue-600", bg: "bg-blue-50", label: "Role Updated" },
  role_deleted: { icon: Trash2, color: "text-red-600", bg: "bg-red-50", label: "Role Deleted" },
  role_assigned: { icon: UserPlus, color: "text-violet-600", bg: "bg-violet-50", label: "Role Assigned" },
  role_removed: { icon: UserMinus, color: "text-amber-600", bg: "bg-amber-50", label: "Role Removed" },
  permission_granted: { icon: Lock, color: "text-emerald-600", bg: "bg-emerald-50", label: "Permission Granted" },
  permission_revoked: { icon: Lock, color: "text-red-600", bg: "bg-red-50", label: "Permission Revoked" }
};

export default function AuditLogViewer() {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: () => base44.entities.AuditLog.list("-created_date", 50)
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-slate-600" />
            Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-3 border-violet-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-slate-600" />
          Activity Log
          <Badge variant="outline" className="ml-auto">{logs.length} events</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-8">
            <ScrollText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No activity recorded yet</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {logs.map((log) => {
              const config = ACTION_CONFIG[log.action] || ACTION_CONFIG.role_updated;
              const Icon = config.icon;
              
              return (
                <div
                  key={log.id}
                  className="flex gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className={`w-10 h-10 ${config.bg} rounded-lg flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <p className="font-medium text-slate-900">{config.label}</p>
                        <p className="text-sm text-slate-600">
                          <span className="font-medium">{log.resource_name || log.resource_id}</span>
                          {log.target_user && (
                            <span> for <span className="font-medium">{log.target_user}</span></span>
                          )}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {log.resource_type}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {log.performed_by}
                      </span>
                      <span>•</span>
                      <span>{format(new Date(log.created_date), "MMM d, h:mm a")}</span>
                      {log.ip_address && (
                        <>
                          <span>•</span>
                          <span>{log.ip_address}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}