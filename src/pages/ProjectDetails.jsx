import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  Rocket,
  GitBranch,
  Cloud,
  Settings,
  Activity,
  Users,
  Terminal,
  ExternalLink,
  MoreVertical,
  RefreshCw,
  Trash2
} from "lucide-react";
import PipelineCard from "@/components/dashboard/PipelineCard";
import DeploymentTimeline from "@/components/dashboard/DeploymentTimeline";
import DeployModal from "@/components/modals/DeployModal";
import CreatePipelineModal from "@/components/modals/CreatePipelineModal";
import { cn } from "@/lib/utils";

const statusColors = {
  draft: "bg-slate-100 text-slate-700",
  development: "bg-blue-100 text-blue-700",
  staging: "bg-amber-100 text-amber-700",
  production: "bg-emerald-100 text-emerald-700",
  archived: "bg-slate-100 text-slate-500"
};

export default function ProjectDetails() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showPipelineModal, setShowPipelineModal] = useState(false);
  const queryClient = useQueryClient();

  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get("id");

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => base44.entities.Project.filter({ id: projectId }),
    select: (data) => data[0],
    enabled: !!projectId
  });

  const { data: pipelines = [] } = useQuery({
    queryKey: ["project-pipelines", projectId],
    queryFn: () => base44.entities.Pipeline.filter({ project_id: projectId }),
    enabled: !!projectId
  });

  const { data: deployments = [] } = useQuery({
    queryKey: ["project-deployments", projectId],
    queryFn: () => base44.entities.Deployment.filter({ project_id: projectId }),
    enabled: !!projectId
  });

  const createDeploymentMutation = useMutation({
    mutationFn: (data) => base44.entities.Deployment.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-deployments", projectId] });
      setShowDeployModal(false);
    }
  });

  const createPipelineMutation = useMutation({
    mutationFn: (data) => base44.entities.Pipeline.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-pipelines", projectId] });
      setShowPipelineModal(false);
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Project not found</h2>
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-violet-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Link 
            to={createPageUrl("Dashboard")} 
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold">{project.name}</h1>
                <Badge className={cn("text-xs", statusColors[project.status])}>
                  {project.status}
                </Badge>
              </div>
              <p className="text-slate-300 mb-4">{project.description || "No description"}</p>
              
              {project.tech_stack?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((tech, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-white/10 rounded-lg">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Settings className="w-4 h-4 mr-2" /> Settings
              </Button>
              <Button 
                onClick={() => setShowDeployModal(true)}
                className="bg-violet-600 hover:bg-violet-700"
              >
                <Rocket className="w-4 h-4 mr-2" /> Deploy
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-sm text-slate-300">Uptime</p>
              <p className="text-2xl font-bold">{project.metrics?.uptime?.toFixed(1) || 100}%</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-sm text-slate-300">Requests Today</p>
              <p className="text-2xl font-bold">{project.metrics?.requests_today || 0}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-sm text-slate-300">Avg Latency</p>
              <p className="text-2xl font-bold">{project.metrics?.avg_response_time || 0}ms</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-sm text-slate-300">Error Rate</p>
              <p className="text-2xl font-bold">{project.metrics?.error_rate || 0}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white border border-slate-200 p-1 rounded-xl mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 rounded-lg">
              <Activity className="w-4 h-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="pipelines" className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 rounded-lg">
              <GitBranch className="w-4 h-4 mr-2" /> Pipelines
            </TabsTrigger>
            <TabsTrigger value="deployments" className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 rounded-lg">
              <Cloud className="w-4 h-4 mr-2" /> Deployments
            </TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 rounded-lg">
              <Users className="w-4 h-4 mr-2" /> Team
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Environments */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Environments</h3>
                  <div className="space-y-3">
                    {["development", "staging", "production"].map((env) => {
                      const deployment = deployments.find(d => d.environment === env);
                      return (
                        <div key={env} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-3 h-3 rounded-full",
                              deployment?.status === "success" && "bg-emerald-500",
                              !deployment && "bg-slate-300"
                            )} />
                            <div>
                              <p className="font-medium text-slate-900 capitalize">{env}</p>
                              <p className="text-xs text-slate-500">
                                {deployment ? `v${deployment.version}` : "Not deployed"}
                              </p>
                            </div>
                          </div>
                          {deployment && (
                            <Button size="sm" variant="ghost">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
                  <DeploymentTimeline deployments={deployments.slice(0, 5)} />
                </div>
              </div>

              <div className="space-y-6">
                {/* Project Info */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Project Info</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-500">Type</p>
                      <p className="font-medium text-slate-900 capitalize">{project.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Cloud Provider</p>
                      <p className="font-medium text-slate-900 capitalize">{project.cloud_provider || "None"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Region</p>
                      <p className="font-medium text-slate-900">{project.deployment_region || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">SLA Tier</p>
                      <p className="font-medium text-slate-900 capitalize">{project.sla_tier || "Basic"}</p>
                    </div>
                    {project.repository_url && (
                      <div>
                        <p className="text-sm text-slate-500">Repository</p>
                        <a href={project.repository_url} className="text-violet-600 hover:underline">
                          View on GitHub
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button className="w-full justify-start" variant="outline">
                      <Terminal className="w-4 h-4 mr-2" /> View Logs
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Activity className="w-4 h-4 mr-2" /> Monitoring
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" /> Restart App
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pipelines">
            <div className="flex justify-end mb-6">
              <Button 
                onClick={() => setShowPipelineModal(true)}
                className="bg-violet-600 hover:bg-violet-700"
              >
                <GitBranch className="w-4 h-4 mr-2" /> New Pipeline
              </Button>
            </div>
            {pipelines.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
                <GitBranch className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No pipelines yet</h3>
                <p className="text-slate-500 mb-4">Create your first CI/CD pipeline for this project</p>
                <Button 
                  onClick={() => setShowPipelineModal(true)}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  Create Pipeline
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pipelines.map((pipeline) => (
                  <PipelineCard key={pipeline.id} pipeline={pipeline} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="deployments">
            <DeploymentTimeline deployments={deployments} />
          </TabsContent>

          <TabsContent value="team">
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Team Members</h3>
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" /> Invite Member
                </Button>
              </div>
              {project.team_members?.length > 0 ? (
                <div className="space-y-3">
                  {project.team_members.map((email, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-medium">
                          {email.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-slate-900">{email}</span>
                      </div>
                      <Badge variant="outline">Member</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">No team members added yet</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <DeployModal
        open={showDeployModal}
        onClose={() => setShowDeployModal(false)}
        project={project}
        onSubmit={(data) => createDeploymentMutation.mutate(data)}
        isLoading={createDeploymentMutation.isPending}
      />

      <CreatePipelineModal
        open={showPipelineModal}
        onClose={() => setShowPipelineModal(false)}
        projectId={projectId}
        onSubmit={(data) => createPipelineMutation.mutate(data)}
        isLoading={createPipelineMutation.isPending}
      />
    </div>
  );
}