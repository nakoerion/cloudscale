import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Layers, 
  Cloud, 
  GitBranch, 
  Activity,
  TrendingUp,
  Zap,
  Filter
} from "lucide-react";
import MetricCard from "@/components/dashboard/MetricCard";
import ProjectCard from "@/components/dashboard/ProjectCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import CreateProjectModal from "@/components/modals/CreateProjectModal";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => base44.entities.Project.list("-created_date", 50)
  });

  const { data: deployments = [] } = useQuery({
    queryKey: ["deployments"],
    queryFn: () => base44.entities.Deployment.list("-created_date", 10)
  });

  const createProjectMutation = useMutation({
    mutationFn: (data) => base44.entities.Project.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setShowCreateModal(false);
    }
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (id) => base44.entities.Project.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] })
  });

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Calculate metrics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === "production").length;
  const avgUptime = projects.reduce((acc, p) => acc + (p.metrics?.uptime || 100), 0) / (projects.length || 1);
  const monthlyDeployments = deployments.length;

  // Mock activity data
  const recentActivity = [
    { type: "deployment", title: "Production Deployed", description: "E-commerce App v2.1.0", time: new Date() },
    { type: "build", title: "Build Successful", description: "Dashboard project #156", time: new Date(Date.now() - 3600000) },
    { type: "integration", title: "Stripe Connected", description: "Payment integration added", time: new Date(Date.now() - 7200000) },
    { type: "team", title: "New Member", description: "john@example.com joined", time: new Date(Date.now() - 10800000) }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage your projects, deployments, and infrastructure</p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-200"
          >
            <Plus className="w-4 h-4 mr-2" /> New Project
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <MetricCard
            title="Total Projects"
            value={totalProjects}
            change="+12%"
            changeType="positive"
            icon={Layers}
            iconColor="text-violet-500"
            iconBg="bg-violet-50"
          />
          <MetricCard
            title="Active in Production"
            value={activeProjects}
            change="+8%"
            changeType="positive"
            icon={Activity}
            iconColor="text-emerald-500"
            iconBg="bg-emerald-50"
          />
          <MetricCard
            title="Avg Uptime"
            value={`${avgUptime.toFixed(1)}%`}
            change="+0.2%"
            changeType="positive"
            icon={TrendingUp}
            iconColor="text-blue-500"
            iconBg="bg-blue-50"
          />
          <MetricCard
            title="Deployments"
            value={monthlyDeployments}
            change="+23%"
            changeType="positive"
            icon={Zap}
            iconColor="text-amber-500"
            iconBg="bg-amber-50"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects Grid */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {["all", "no-code", "low-code", "full-code", "hybrid"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      typeFilter === type
                        ? "bg-violet-100 text-violet-700"
                        : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                    }`}
                  >
                    {type === "all" ? "All" : type}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
                <Layers className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No projects yet</h3>
                <p className="text-slate-500 mb-4">Create your first project to get started</p>
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  <Plus className="w-4 h-4 mr-2" /> Create Project
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onDelete={(p) => deleteProjectMutation.mutate(p.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ActivityFeed activities={recentActivity} />
          </div>
        </div>
      </div>

      <CreateProjectModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={(data) => createProjectMutation.mutate(data)}
        isLoading={createProjectMutation.isPending}
      />
    </div>
  );
}