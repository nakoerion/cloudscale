import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Layers, 
  Activity,
  TrendingUp,
  Zap
} from "lucide-react";
import MetricCard from "@/components/dashboard/MetricCard";
import ProjectCard from "@/components/dashboard/ProjectCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import CreateProjectModal from "@/components/modals/CreateProjectModal";
import AIInsightsPanel from "@/components/dashboard/AIInsightsPanel";
import WidgetCustomizer from "@/components/dashboard/WidgetCustomizer";
import GranularAnalytics from "@/components/dashboard/GranularAnalytics";
import FeatureTourTooltip from "@/components/onboarding/FeatureTourTooltip";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [visibleWidgets, setVisibleWidgets] = useState([
    "metrics", "projects", "ai-insights", "analytics", "activity"
  ]);
  const [showFeatureTour, setShowFeatureTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
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

  const tourSteps = [
    { title: "Create Your First Project", description: "Click here to create a new project. Choose from templates or start from scratch." },
    { title: "AI Insights", description: "Get intelligent recommendations to optimize your infrastructure and workflows." }
  ];

  // Mock activity data
  const recentActivity = [
    { type: "deployment", title: "Production Deployed", description: "E-commerce App v2.1.0", time: new Date() },
    { type: "build", title: "Build Successful", description: "Dashboard project #156", time: new Date(Date.now() - 3600000) },
    { type: "integration", title: "Stripe Connected", description: "Payment integration added", time: new Date(Date.now() - 7200000) },
    { type: "team", title: "New Member", description: "john@example.com joined", time: new Date(Date.now() - 10800000) }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/20 to-indigo-50/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-violet-900 to-indigo-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        <div className="max-w-7xl mx-auto px-6 py-12 relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="px-3 py-1 bg-violet-500/20 border border-violet-400/30 rounded-full">
                  <span className="text-xs font-medium text-violet-200">CloudForge Platform</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                Welcome back 👋
              </h1>
              <p className="text-lg text-slate-300 max-w-2xl">
                Manage your projects, monitor deployments, and scale your infrastructure with enterprise-grade tools.
              </p>
            </div>
            <div className="flex gap-3">
              <WidgetCustomizer 
                visibleWidgets={visibleWidgets}
                onUpdateWidgets={setVisibleWidgets}
              />
              <div className="relative">
                <Button
                  onClick={() => setShowCreateModal(true)}
                  size="lg"
                  className="bg-white text-violet-700 hover:bg-violet-50 shadow-xl shadow-violet-900/20"
                >
                  <Plus className="w-5 h-5 mr-2" /> New Project
                </Button>
                {showFeatureTour && tourStep === 0 && (
                  <FeatureTourTooltip
                    feature={tourSteps[0]}
                    position="bottom"
                    step={1}
                    totalSteps={2}
                    onNext={() => setTourStep(1)}
                    onDismiss={() => setShowFeatureTour(false)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">

        {/* Metrics */}
        {visibleWidgets.includes("metrics") && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-2xl hover:border-violet-200 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                    <Layers className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">+12%</span>
                </div>
                <p className="text-sm text-slate-500 mb-1">Total Projects</p>
                <p className="text-3xl font-bold text-slate-900">{totalProjects}</p>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-2xl hover:border-emerald-200 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">+8%</span>
                </div>
                <p className="text-sm text-slate-500 mb-1">Active in Production</p>
                <p className="text-3xl font-bold text-slate-900">{activeProjects}</p>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-2xl hover:border-blue-200 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">+0.2%</span>
                </div>
                <p className="text-sm text-slate-500 mb-1">Avg Uptime</p>
                <p className="text-3xl font-bold text-slate-900">{avgUptime.toFixed(1)}%</p>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-2xl hover:border-amber-200 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">+23%</span>
                </div>
                <p className="text-sm text-slate-500 mb-1">Deployments</p>
                <p className="text-3xl font-bold text-slate-900">{monthlyDeployments}</p>
              </div>
            </div>
          </div>
        )}

        {/* AI Insights */}
        {visibleWidgets.includes("ai-insights") && (
          <div className="mb-8 relative">
            <AIInsightsPanel />
            {showFeatureTour && tourStep === 1 && (
              <FeatureTourTooltip
                feature={tourSteps[1]}
                position="top"
                step={2}
                totalSteps={tourSteps.length}
                onNext={handleTourNext}
                onDismiss={handleTourDismiss}
              />
            )}
          </div>
        )}

        {/* Granular Analytics */}
        {visibleWidgets.includes("analytics") && (
          <div className="mb-8">
            <GranularAnalytics />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects Grid */}
          {visibleWidgets.includes("projects") && (
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Your Projects</h2>
            </div>
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
              <div className="flex gap-2 flex-wrap">
                {["all", "no-code", "low-code", "full-code", "hybrid"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      typeFilter === type
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30"
                        : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {type === "all" ? "All Projects" : type}
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
              <div className="text-center py-20 bg-gradient-to-br from-white to-violet-50/30 rounded-3xl border-2 border-dashed border-slate-200">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Layers className="w-10 h-10 text-violet-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No projects yet</h3>
                <p className="text-slate-500 mb-6 max-w-sm mx-auto">Start building something amazing by creating your first project</p>
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  size="lg"
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-xl shadow-violet-500/30"
                >
                  <Plus className="w-5 h-5 mr-2" /> Create Your First Project
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
          )}

          {/* Sidebar */}
          {visibleWidgets.includes("activity") && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Activity</h2>
              <ActivityFeed activities={recentActivity} />
            </div>
          </div>
          )}
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