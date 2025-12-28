import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Shield } from "lucide-react";
import { toast } from "sonner";

const PERMISSION_CATEGORIES = {
  projects: {
    label: "Projects",
    permissions: [
      { id: "view", label: "View Projects" },
      { id: "create", label: "Create Projects" },
      { id: "edit", label: "Edit Projects" },
      { id: "delete", label: "Delete Projects" },
      { id: "deploy", label: "Deploy Projects" }
    ]
  },
  templates: {
    label: "Templates",
    permissions: [
      { id: "view", label: "View Templates" },
      { id: "create", label: "Create Templates" },
      { id: "edit", label: "Edit Templates" },
      { id: "delete", label: "Delete Templates" },
      { id: "publish", label: "Publish to Marketplace" }
    ]
  },
  infrastructure: {
    label: "Infrastructure",
    permissions: [
      { id: "view", label: "View Infrastructure" },
      { id: "manage", label: "Manage Infrastructure" }
    ]
  },
  integrations: {
    label: "Integrations",
    permissions: [
      { id: "view", label: "View Integrations" },
      { id: "install", label: "Install Integrations" },
      { id: "configure", label: "Configure Integrations" }
    ]
  },
  users: {
    label: "Users",
    permissions: [
      { id: "view", label: "View Users" },
      { id: "invite", label: "Invite Users" },
      { id: "manage_roles", label: "Manage User Roles" }
    ]
  }
};

export default function RoleEditor({ open, onClose, role }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: {}
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description || "",
        permissions: role.permissions || {}
      });
    } else {
      // Initialize with all permissions set to false
      const initialPermissions = {};
      Object.keys(PERMISSION_CATEGORIES).forEach(category => {
        initialPermissions[category] = {};
        PERMISSION_CATEGORIES[category].permissions.forEach(perm => {
          initialPermissions[category][perm.id] = false;
        });
      });
      setFormData({
        name: "",
        description: "",
        permissions: initialPermissions
      });
    }
  }, [role, open]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (role) {
        return await base44.entities.Role.update(role.id, data);
      } else {
        return await base44.entities.Role.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success(role ? "Role updated" : "Role created");
      onClose();
    }
  });

  const handlePermissionChange = (category, permissionId, value) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [category]: {
          ...formData.permissions[category],
          [permissionId]: value
        }
      }
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a role name");
      return;
    }
    saveMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-violet-600" />
            {role ? "Edit Role" : "Create New Role"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Role Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Editor, Viewer, Contributor"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this role can do..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="mt-2"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-semibold text-slate-900">Permissions</h3>
            {Object.entries(PERMISSION_CATEGORIES).map(([categoryKey, category]) => (
              <div key={categoryKey} className="border border-slate-200 rounded-xl p-4">
                <h4 className="font-medium text-slate-900 mb-4">{category.label}</h4>
                <div className="space-y-3">
                  {category.permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center justify-between">
                      <Label htmlFor={`${categoryKey}-${permission.id}`} className="text-slate-700">
                        {permission.label}
                      </Label>
                      <Switch
                        id={`${categoryKey}-${permission.id}`}
                        checked={formData.permissions[categoryKey]?.[permission.id] || false}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(categoryKey, permission.id, checked)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={saveMutation.isPending}
            className="bg-violet-600 hover:bg-violet-700"
          >
            {saveMutation.isPending ? "Saving..." : (role ? "Update Role" : "Create Role")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}