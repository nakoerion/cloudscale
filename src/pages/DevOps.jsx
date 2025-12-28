import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  GitBranch, 
  Plus, 
  Container, 
  Server, 
  Activity,
  Terminal,
  FileCode,
  Boxes
} from "lucide-react";
import PipelineCard from "@/components/dashboard/PipelineCard";
import DeploymentTimeline from "@/components/dashboard/DeploymentTimeline";
import CreatePipelineModal from "@/components/modals/CreatePipelineModal";
import MetricCard from "@/components/dashboard/MetricCard";
import DNSManager from "@/components/monitoring/DNSManager";
import CDNSettings from "@/components/monitoring/CDNSettings";
import AnalyticsIntegration from "@/components/monitoring/AnalyticsIntegration";

export default function DevOps() {
  const [showPipelineModal, setShowPipelineModal] = useState(false);
  const [activeTab, setActiveTab] = useState("pipelines");
  const queryClient = useQueryClient();

  const { data: pipelines = [], isLoading: loadingPipelines } = useQuery({
    queryKey: ["pipelines"],
    queryFn: () => base44.entities.Pipeline.list("-created_date", 50)
  });

  const { data: deployments = [], isLoading: loadingDeployments } = useQuery({
    queryKey: ["deployments"],
    queryFn: () => base44.entities.Deployment.list("-created_date", 20)
  });

  const createPipelineMutation = useMutation({
    mutationFn: (data) => base44.entities.Pipeline.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipelines"] });
      setShowPipelineModal(false);
    }
  });

  const updatePipelineMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Pipeline.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pipelines"] })
  });

  const handleRunPipeline = (pipeline) => {
    updatePipelineMutation.mutate({
      id: pipeline.id,
      data: { status: "running", last_run: new Date().toISOString() }
    });
    // Simulate completion after 3 seconds
    setTimeout(() => {
      updatePipelineMutation.mutate({
        id: pipeline.id,
        data: { status: "active" }
      });
    }, 3000);
  };

  const handlePausePipeline = (pipeline) => {
    updatePipelineMutation.mutate({
      id: pipeline.id,
      data: { status: "paused" }
    });
  };

  // Calculate metrics
  const activePipelines = pipelines.filter(p => p.status === "active").length;
  const avgSuccessRate = pipelines.reduce((acc, p) => acc + (p.success_rate || 100), 0) / (pipelines.length || 1);
  const successfulDeployments = deployments.filter(d => d.status === "success").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">DevOps</h1>
            <p className="text-slate-500 mt-1">CI/CD pipelines, containers, and infrastructure management</p>
          </div>
          <Button 
            onClick={() => setShowPipelineModal(true)}
            className="bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-200"
          >
            <Plus className="w-4 h-4 mr-2" /> New Pipeline
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <MetricCard
            title="Active Pipelines"
            value={activePipelines}
            icon={GitBranch}
            iconColor="text-violet-500"
            iconBg="bg-violet-50"
          />
          <MetricCard
            title="Avg Success Rate"
            value={`${avgSuccessRate.toFixed(0)}%`}
            change="+2%"
            changeType="positive"
            icon={Activity}
            iconColor="text-emerald-500"
            iconBg="bg-emerald-50"
          />
          <MetricCard
            title="Deployments Today"
            value={successfulDeployments}
            icon={Container}
            iconColor="text-blue-500"
            iconBg="bg-blue-50"
          />
          <MetricCard
            title="Running Containers"
            value={12}
            icon={Boxes}
            iconColor="text-amber-500"
            iconBg="bg-amber-50"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white border border-slate-200 p-1 rounded-xl mb-6">
            <TabsTrigger value="pipelines" className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 rounded-lg">
              <GitBranch className="w-4 h-4 mr-2" /> CI/CD Pipelines
            </TabsTrigger>
            <TabsTrigger value="deployments" className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 rounded-lg">
              <Container className="w-4 h-4 mr-2" /> Deployments
            </TabsTrigger>
            <TabsTrigger value="infrastructure" className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 rounded-lg">
              <Server className="w-4 h-4 mr-2" /> Infrastructure
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pipelines">
            {loadingPipelines ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : pipelines.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
                <GitBranch className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No pipelines yet</h3>
                <p className="text-slate-500 mb-4">Create your first CI/CD pipeline</p>
                <Button 
                  onClick={() => setShowPipelineModal(true)}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  <Plus className="w-4 h-4 mr-2" /> Create Pipeline
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pipelines.map((pipeline) => (
                  <PipelineCard
                    key={pipeline.id}
                    pipeline={pipeline}
                    onRun={handleRunPipeline}
                    onPause={handlePausePipeline}
                    onRetry={handleRunPipeline}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="deployments">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DeploymentTimeline deployments={deployments} />
              
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Container Registry</h3>
                  <div className="space-y-3">
                    {[
                      { name: "app-frontend", tag: "v2.1.0", size: "245 MB" },
                      { name: "app-backend", tag: "v2.0.5", size: "312 MB" },
                      { name: "app-worker", tag: "v1.8.2", size: "189 MB" }
                    ].map((image, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Container className="w-5 h-5 text-slate-400" />
                          <div>
                            <p className="font-medium text-slate-900">{image.name}</p>
                            <p className="text-xs text-slate-500">{image.tag}</p>
                          </div>
                        </div>
                        <span className="text-sm text-slate-500">{image.size}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Kubernetes Clusters</h3>
                  <div className="space-y-3">
                    {[
                      { name: "production-cluster", nodes: 5, status: "healthy" },
                      { name: "staging-cluster", nodes: 2, status: "healthy" }
                    ].map((cluster, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Boxes className="w-5 h-5 text-slate-400" />
                          <div>
                            <p className="font-medium text-slate-900">{cluster.name}</p>
                            <p className="text-xs text-slate-500">{cluster.nodes} nodes</p>
                          </div>
                        </div>
                        <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                          {cluster.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="infrastructure">
            <div className="space-y-6 mb-6">
              <DNSManager domain="your-app.cloudforge.app" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CDNSettings />
                <AnalyticsIntegration />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <FileCode className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Terraform</h3>
                    <p className="text-sm text-slate-500">Infrastructure as Code</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Automate infrastructure deployment with Terraform templates for multi-cloud environments.
                </p>
                <Button variant="outline" className="w-full">
                  View Templates
                </Button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-violet-50 rounded-xl">
                    <Container className="w-6 h-6 text-violet-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Docker</h3>
                    <p className="text-sm text-slate-500">Containerization</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Build and manage container images with integrated Docker support and registry.
                </p>
                <Button variant="outline" className="w-full">
                  Manage Images
                </Button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-amber-50 rounded-xl">
                    <Boxes className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Kubernetes</h3>
                    <p className="text-sm text-slate-500">Orchestration</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Deploy and scale applications with Kubernetes across multiple cloud environments.
                </p>
                <Button variant="outline" className="w-full">
                  Manage Clusters
                </Button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-emerald-50 rounded-xl">
                    <Activity className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Monitoring</h3>
                    <p className="text-sm text-slate-500">Prometheus & Grafana</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Real-time monitoring with Prometheus metrics and Grafana dashboards.
                </p>
                <Button variant="outline" className="w-full">
                  Open Grafana
                </Button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-slate-100 rounded-xl">
                    <Terminal className="w-6 h-6 text-slate-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Logs</h3>
                    <p className="text-sm text-slate-500">Elasticsearch & Kibana</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Centralized logging with Elasticsearch for log aggregation and analysis.
                </p>
                <Button variant="outline" className="w-full">
                  View Logs
                </Button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-red-50 rounded-xl">
                    <Server className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Backups</h3>
                    <p className="text-sm text-slate-500">S3 & Azure Blob</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Automated backups to cloud storage with defined RPO and RTO objectives.
                </p>
                <Button variant="outline" className="w-full">
                  Configure Backups
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CreatePipelineModal
        open={showPipelineModal}
        onClose={() => setShowPipelineModal(false)}
        onSubmit={(data) => createPipelineMutation.mutate(data)}
        isLoading={createPipelineMutation.isPending}
      />
    </div>
  );
}