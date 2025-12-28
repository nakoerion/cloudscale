import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, Trash2, Shield } from "lucide-react";
import { toast } from "sonner";

export default function UserRoleManager({ roles, assignments }) {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");

  const queryClient = useQueryClient();

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => base44.entities.User.list()
  });

  const assignRoleMutation = useMutation({
    mutationFn: async (data) => {
      const user = await base44.auth.me();
      return await base44.entities.UserRoleAssignment.create({
        ...data,
        assigned_by: user.email
      });
    },
    onSuccess: async (newAssignment) => {
      // Update role user_count
      const role = roles.find(r => r.id === newAssignment.role_id);
      if (role) {
        await base44.entities.Role.update(role.id, {
          user_count: (role.user_count || 0) + 1
        });
      }
      queryClient.invalidateQueries({ queryKey: ["role-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role assigned successfully");
      setShowAssignModal(false);
      setUserEmail("");
      setSelectedRoleId("");
    }
  });

  const removeAssignmentMutation = useMutation({
    mutationFn: async (assignmentId) => {
      const assignment = assignments.find(a => a.id === assignmentId);
      await base44.entities.UserRoleAssignment.delete(assignmentId);
      
      // Update role user_count
      const role = roles.find(r => r.id === assignment.role_id);
      if (role && role.user_count > 0) {
        await base44.entities.Role.update(role.id, {
          user_count: role.user_count - 1
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role removed");
    }
  });

  const handleAssign = () => {
    if (!userEmail.trim() || !selectedRoleId) {
      toast.error("Please select a user and role");
      return;
    }
    assignRoleMutation.mutate({
      user_email: userEmail,
      role_id: selectedRoleId,
      scope: "global"
    });
  };

  const getUserAssignments = (email) => {
    return assignments.filter(a => a.user_email === email);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button 
          onClick={() => setShowAssignModal(true)}
          className="bg-violet-600 hover:bg-violet-700"
        >
          <UserPlus className="w-4 h-4 mr-2" /> Assign Role
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
        {users.map((user) => {
          const userAssignments = getUserAssignments(user.email);
          return (
            <div key={user.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-violet-100 text-violet-600">
                      {user.full_name?.charAt(0) || user.email.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-slate-900">{user.full_name || user.email}</h3>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  {userAssignments.length === 0 ? (
                    <Badge variant="outline" className="text-slate-500">No roles</Badge>
                  ) : (
                    userAssignments.map((assignment) => {
                      const role = roles.find(r => r.id === assignment.role_id);
                      return role ? (
                        <Badge key={assignment.id} className="bg-violet-100 text-violet-700 flex items-center gap-2">
                          <Shield className="w-3 h-3" />
                          {role.name}
                          <button
                            onClick={() => removeAssignmentMutation.mutate(assignment.id)}
                            className="ml-1 hover:text-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </Badge>
                      ) : null;
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role to User</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="user">User Email *</Label>
              <Input
                id="user"
                placeholder="user@example.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="role">Role *</Label>
              <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowAssignModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAssign}
              disabled={assignRoleMutation.isPending}
              className="bg-violet-600 hover:bg-violet-700"
            >
              {assignRoleMutation.isPending ? "Assigning..." : "Assign Role"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}