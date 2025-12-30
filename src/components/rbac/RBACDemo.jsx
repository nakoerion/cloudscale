import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, CheckCircle2, XCircle } from "lucide-react";
import ProtectedFeature from "./ProtectedFeature";
import PermissionButton from "./PermissionButton";
import { usePermissions } from "./usePermissions";

/**
 * RBAC Demo Component
 * Demonstrates how to use the RBAC system
 */
export default function RBACDemo() {
  const { permissions, loading, user } = usePermissions();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-violet-600" />
          RBAC System Demo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Info */}
        <div className="p-4 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600 mb-2">Current User:</p>
          <p className="font-semibold text-slate-900">{user?.email || "Not logged in"}</p>
          <Badge className="mt-2">{user?.role || "No role"}</Badge>
        </div>

        {/* Permission Examples */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-3">Permission Checks:</h4>
          <div className="space-y-2">
            {[
              { resource: "projects", action: "view" },
              { resource: "projects", action: "create" },
              { resource: "projects", action: "delete" },
              { resource: "users", action: "manage_roles" },
              { resource: "billing", action: "manage" }
            ].map((check, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <span className="text-sm text-slate-700">
                  Can {check.action} {check.resource}?
                </span>
                {permissions?.[check.resource]?.[check.action] ? (
                  <Badge className="bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Yes
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-slate-500">
                    <XCircle className="w-3 h-3 mr-1" /> No
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Protected Content Example */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-3">Protected Content:</h4>
          
          <ProtectedFeature resource="billing" action="manage" showMessage>
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-sm text-emerald-900">
                ✅ You can see this because you have billing.manage permission
              </p>
            </div>
          </ProtectedFeature>

          <ProtectedFeature 
            resource="infrastructure" 
            action="manage"
            fallback={
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-sm text-slate-600">
                  🔒 Infrastructure management is hidden (no permission)
                </p>
              </div>
            }
          >
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                ✅ Advanced infrastructure settings visible
              </p>
            </div>
          </ProtectedFeature>
        </div>

        {/* Permission Buttons */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-3">Permission Buttons:</h4>
          <div className="flex flex-wrap gap-2">
            <PermissionButton
              resource="projects"
              action="create"
              onClick={() => alert("Creating project...")}
            >
              Create Project
            </PermissionButton>
            
            <PermissionButton
              resource="projects"
              action="delete"
              onClick={() => alert("Deleting project...")}
              variant="destructive"
            >
              Delete Project
            </PermissionButton>
            
            <PermissionButton
              resource="users"
              action="invite"
              onClick={() => alert("Inviting user...")}
            >
              Invite User
            </PermissionButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}