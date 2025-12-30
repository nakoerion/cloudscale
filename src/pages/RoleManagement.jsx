import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { initializeDefaultRoles } from "@/components/rbac/permissions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Shield, 
  Users, 
  Plus, 
  Edit, 
  Trash2,
  Lock,
  CheckCircle2,
  XCircle,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import RoleEditor from "@/components/roles/RoleEditor";
import PermissionMatrix from "@/components/roles/PermissionMatrix";
import UserRoleManager from "@/components/roles/UserRoleManager";
import AuditLogViewer from "@/components/roles/AuditLogViewer";
import { toast } from "sonner";

export default function RoleManagement() {
  const [showEditor, setShowEditor] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [activeTab, setActiveTab] = useState("roles");

  const queryClient = useQueryClient();

  // Initialize default roles on mount
  useEffect(() => {
    initializeDefaultRoles().then(() => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    });
  }, [queryClient]);

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: () => base44.entities.Role.list()
  });

  const { data: assignments = [] } = useQuery({
    queryKey: ["role-assignments"],
    queryFn: () => base44.entities.UserRoleAssignment.list()
  });

  const deleteRoleMutation = useMutation({
    mutationFn: async (roleId) => {
      const role = roles.find(r => r.id === roleId);
      if (role.is_system_role) {
        throw new Error("Cannot delete system roles");
      }
      await base44.entities.Role.delete(roleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete role");
    }
  });

  const handleCreateRole = () => {
    setEditingRole(null);
    setShowEditor(true);
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setShowEditor(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Role Management</h1>
              <p className="text-slate-500">Define roles and permissions for your team</p>
            </div>
            <Button 
              onClick={handleCreateRole}
              className="bg-violet-600 hover:bg-violet-700"
            >
              <Plus className="w-4 h-4 mr-2" /> Create Role
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white border border-slate-200 mb-6">
            <TabsTrigger value="roles" className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700">
              <Shield className="w-4 h-4 mr-2" /> Roles
            </TabsTrigger>
            <TabsTrigger value="permissions" className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700">
              <Lock className="w-4 h-4 mr-2" /> Permission Matrix
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700">
              <Users className="w-4 h-4 mr-2" /> User Assignments
            </TabsTrigger>
            <TabsTrigger value="audit" className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700">
              <Activity className="w-4 h-4 mr-2" /> Activity Log
            </TabsTrigger>
          </TabsList>

          {/* Roles Tab */}
          <TabsContent value="roles">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-5 h-5 text-violet-600" />
                          <h3 className="font-bold text-slate-900">{role.name}</h3>
                          {role.is_system_role && (
                            <Badge variant="outline" className="text-xs">System</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-500">{role.description}</p>
                      </div>
                    </div>

                    <div className="mb-4 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Users className="w-4 h-4" />
                        <span>{role.user_count || 0} users</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {Object.entries(role.permissions || {}).map(([category, perms]) => {
                        const enabledCount = Object.values(perms).filter(Boolean).length;
                        const totalCount = Object.keys(perms).length;
                        return (
                          <div key={category} className="flex items-center justify-between text-sm">
                            <span className="text-slate-600 capitalize">{category}</span>
                            <span className="text-slate-400">
                              {enabledCount}/{totalCount}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditRole(role)}
                        className="flex-1"
                      >
                        <Edit className="w-3 h-3 mr-1" /> Edit
                      </Button>
                      {!role.is_system_role && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteRoleMutation.mutate(role.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Permission Matrix Tab */}
          <TabsContent value="permissions">
            <PermissionMatrix roles={roles} />
          </TabsContent>

          {/* User Assignments Tab */}
          <TabsContent value="users">
            <UserRoleManager roles={roles} assignments={assignments} />
          </TabsContent>

          {/* Audit Log Tab */}
          <TabsContent value="audit">
            <AuditLogViewer />
          </TabsContent>
        </Tabs>
      </div>

      <RoleEditor
        open={showEditor}
        onClose={() => {
          setShowEditor(false);
          setEditingRole(null);
        }}
        role={editingRole}
      />
    </div>
  );
}