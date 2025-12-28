import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Building2, Plus, Settings, Database, Shield, Users, HardDrive } from "lucide-react";
import { toast } from "sonner";

export default function TenantManager() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTenant, setNewTenant] = useState({
    name: "",
    slug: "",
    admin_email: "",
    plan: "free",
    isolation_level: "shared"
  });

  const queryClient = useQueryClient();

  const { data: tenants = [], isLoading } = useQuery({
    queryKey: ["tenants"],
    queryFn: () => base44.entities.Tenant.list()
  });

  const createTenantMutation = useMutation({
    mutationFn: (data) => base44.entities.Tenant.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      setShowCreateModal(false);
      setNewTenant({ name: "", slug: "", admin_email: "", plan: "free", isolation_level: "shared" });
      toast.success("Tenant created successfully");
    }
  });

  const handleCreateTenant = () => {
    if (!newTenant.name || !newTenant.slug || !newTenant.admin_email) {
      toast.error("Please fill in all required fields");
      return;
    }
    createTenantMutation.mutate(newTenant);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-violet-600" />
            Multi-Tenant Management
          </CardTitle>
          <Button onClick={() => setShowCreateModal(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Tenant
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="space-y-3">
            {tenants.map((tenant) => (
              <div key={tenant.id} className="p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-violet-300 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-slate-900">{tenant.name}</h4>
                      <Badge variant="outline" className="text-xs font-mono">
                        {tenant.slug}
                      </Badge>
                      <Badge className={
                        tenant.status === "active" ? "bg-emerald-100 text-emerald-700" :
                        tenant.status === "trial" ? "bg-blue-100 text-blue-700" :
                        tenant.status === "suspended" ? "bg-red-100 text-red-700" :
                        "bg-slate-100 text-slate-700"
                      }>
                        {tenant.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        {tenant.isolation_level}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {tenant.current_users}/{tenant.max_users} users
                      </span>
                      <span className="flex items-center gap-1">
                        <HardDrive className="w-3 h-3" />
                        {tenant.current_storage_gb}/{tenant.max_storage_gb} GB
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Plan: <strong className="text-slate-700">{tenant.plan}</strong>
                  </span>
                  <span className="text-xs text-slate-500">
                    Admin: {tenant.admin_email}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Tenant</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Tenant Name *</Label>
              <Input
                placeholder="Acme Corp"
                value={newTenant.name}
                onChange={(e) => setNewTenant({...newTenant, name: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Slug *</Label>
              <Input
                placeholder="acme-corp"
                value={newTenant.slug}
                onChange={(e) => setNewTenant({...newTenant, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Admin Email *</Label>
              <Input
                type="email"
                placeholder="admin@acme.com"
                value={newTenant.admin_email}
                onChange={(e) => setNewTenant({...newTenant, admin_email: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Plan</Label>
              <Select value={newTenant.plan} onValueChange={(v) => setNewTenant({...newTenant, plan: v})}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Data Isolation Level</Label>
              <Select value={newTenant.isolation_level} onValueChange={(v) => setNewTenant({...newTenant, isolation_level: v})}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shared">Shared (Multi-tenant DB)</SelectItem>
                  <SelectItem value="dedicated_schema">Dedicated Schema</SelectItem>
                  <SelectItem value="dedicated_database">Dedicated Database</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button onClick={handleCreateTenant} disabled={createTenantMutation.isPending}>
              {createTenantMutation.isPending ? "Creating..." : "Create Tenant"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}