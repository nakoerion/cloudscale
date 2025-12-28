import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Activity,
  TrendingUp,
  TrendingDown,
  Server,
  Database,
  Cpu,
  HardDrive,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  LineChart,
  PieChart,
  RefreshCw,
  Plus,
  Trash2,
  LayoutGrid
} from "lucide-react";
import { cn } from "@/lib/utils";
import Heatmap from "@/components/monitoring/Heatmap";
import ScatterPlot from "@/components/monitoring/ScatterPlot";
import GeoMap from "@/components/monitoring/GeoMap";
import ChartSelector from "@/components/monitoring/ChartSelector";
import AnomalyDetection from "@/components/monitoring/AnomalyDetection";
import DistributedTracing from "@/components/monitoring/DistributedTracing";
import AlertConfiguration from "@/components/monitoring/AlertConfiguration";
import ChurnPrediction from "@/components/analytics/ChurnPrediction";
import PerformanceReports from "@/components/analytics/PerformanceReports";
import EngagementOptimizer from "@/components/analytics/EngagementOptimizer";
import AIAnomalyDetection from "@/components/monitoring/AIAnomalyDetection";
import ResourceExhaustionPredictor from "@/components/monitoring/ResourceExhaustionPredictor";
import InfrastructureEventCorrelation from "@/components/monitoring/InfrastructureEventCorrelation";
import AIInfrastructureRecommendations from "@/components/monitoring/AIInfrastructureRecommendations";

const METRICS = [
  { name: "CPU Usage", value: "45%", trend: "down", change: "-2%", status: "healthy", icon: Cpu },
  { name: "Memory", value: "68%", trend: "up", change: "+5%", status: "warning", icon: Server },
  { name: "Disk I/O", value: "1.2 GB/s", trend: "up", change: "+12%", status: "healthy", icon: HardDrive },
  { name: "Database Queries", value: "3.4k/min", trend: "up", change: "+8%", status: "healthy", icon: Database }
];

const ALERTS = [
  { severity: "critical", message: "High memory usage on prod-server-3", time: "2 min ago" },
  { severity: "warning", message: "Slow database queries detected", time: "15 min ago" },
  { severity: "info", message: "Deployment completed successfully", time: "1 hour ago" }
];

export default function Monitoring() {
  const [timeRange, setTimeRange] = useState("1h");
  const [showChartSelector, setShowChartSelector] = useState(false);
  const [customDashboard, setCustomDashboard] = useState([
    { id: "heatmap-1", type: "heatmap" },
    { id: "scatter-1", type: "scatter" },
    { id: "geo-1", type: "geo" }
  ]);

  const generateHeatmapData = () => {
    const data = [];
    for (let i = 0; i < 144; i++) {
      data.push({
        x: i % 12,
        y: Math.floor(i / 12),
        value: Math.random() * 100
      });
    }
    return data;
  };

  const generateScatterData = () => {
    return Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      label: `Server ${Math.floor(Math.random() * 10)}`,
      color: Math.random() > 0.5 ? "bg-violet-500" : "bg-emerald-500"
    }));
  };

  const generateGeoData = () => {
    return [
      { lat: 40.7128, lng: -74.0060, label: "New York", value: 15420, color: "#8b5cf6" },
      { lat: 51.5074, lng: -0.1278, label: "London", value: 12800, color: "#8b5cf6" },
      { lat: 35.6762, lng: 139.6503, label: "Tokyo", value: 18900, color: "#8b5cf6" },
      { lat: -33.8688, lng: 151.2093, label: "Sydney", value: 8600, color: "#8b5cf6" },
      { lat: 37.7749, lng: -122.4194, label: "San Francisco", value: 14200, color: "#8b5cf6" },
      { lat: 48.8566, lng: 2.3522, label: "Paris", value: 11500, color: "#8b5cf6" }
    ];
  };

  const addChart = (chartType) => {
    setCustomDashboard([
      ...customDashboard,
      { id: `${chartType}-${Date.now()}`, type: chartType }
    ]);
  };

  const removeChart = (chartId) => {
    setCustomDashboard(customDashboard.filter(c => c.id !== chartId));
  };

  const renderChart = (chart) => {
    switch (chart.type) {
      case "heatmap":
        return <Heatmap data={generateHeatmapData()} title="Server Load Heatmap (24h)" />;
      case "scatter":
        return <ScatterPlot 
          data={generateScatterData()} 
          title="Response Time vs CPU Usage"
          xLabel="CPU Usage (%)"
          yLabel="Response Time (ms)"
        />;
      case "geo":
        return <GeoMap locations={generateGeoData()} title="Global Traffic Distribution" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Monitoring & Analytics</h1>
            <p className="text-slate-500">Real-time performance metrics and insights</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              {["1h", "24h", "7d", "30d"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    timeRange === range
                      ? "bg-violet-600 text-white"
                      : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
            <Button 
              onClick={() => setShowChartSelector(true)}
              className="bg-violet-600 hover:bg-violet-700"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Chart
            </Button>
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {METRICS.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.name} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-violet-600" />
                  </div>
                  <Badge className={cn(
                    metric.status === "healthy" && "bg-emerald-100 text-emerald-700",
                    metric.status === "warning" && "bg-amber-100 text-amber-700",
                    metric.status === "critical" && "bg-red-100 text-red-700"
                  )}>
                    {metric.status}
                  </Badge>
                </div>
                <p className="text-sm text-slate-500 mb-1">{metric.name}</p>
                <p className="text-2xl font-bold text-slate-900 mb-2">{metric.value}</p>
                <div className="flex items-center gap-2 text-sm">
                  {metric.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={metric.trend === "up" ? "text-emerald-600" : "text-red-600"}>
                    {metric.change}
                  </span>
                  <span className="text-slate-400">vs last hour</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* CPU Usage Chart */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">CPU Usage Over Time</h3>
                <LineChart className="w-5 h-5 text-slate-400" />
              </div>
              <div className="h-64 flex items-end justify-between gap-2">
                {[65, 72, 58, 81, 69, 75, 62, 78, 71, 68, 73, 67].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end">
                    <div
                      className="bg-gradient-to-t from-violet-600 to-violet-400 rounded-t"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-xs text-slate-500">
                {["00:00", "02:00", "04:00", "06:00", "08:00", "10:00"].map((time, i) => (
                  <span key={i}>{time}</span>
                ))}
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">API Response Time</h3>
                <BarChart3 className="w-5 h-5 text-slate-400" />
              </div>
              <div className="space-y-4">
                {[
                  { endpoint: "/api/users", avg: 45, p95: 120, p99: 250 },
                  { endpoint: "/api/products", avg: 62, p95: 180, p99: 320 },
                  { endpoint: "/api/orders", avg: 38, p95: 95, p99: 180 }
                ].map((endpoint, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-900">{endpoint.endpoint}</span>
                      <span className="text-sm text-slate-500">{endpoint.avg}ms avg</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                        style={{ width: `${(endpoint.avg / 300) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Request Distribution */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Request Distribution</h3>
                <PieChart className="w-5 h-5 text-slate-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "GET", count: "45.2k", color: "bg-blue-500", percent: 45 },
                  { label: "POST", count: "28.1k", color: "bg-emerald-500", percent: 28 },
                  { label: "PUT", count: "15.8k", color: "bg-amber-500", percent: 16 },
                  { label: "DELETE", count: "10.9k", color: "bg-red-500", percent: 11 }
                ].map((method, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={cn("w-3 h-3 rounded-full", method.color)} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-900">{method.label}</span>
                        <span className="text-sm text-slate-500">{method.count}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", method.color)}
                          style={{ width: `${method.percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Alerts */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Recent Alerts</h3>
                <Badge variant="outline">{ALERTS.length}</Badge>
              </div>
              <div className="space-y-3">
                {ALERTS.map((alert, i) => (
                  <div key={i} className={cn(
                    "p-3 rounded-lg border-l-4",
                    alert.severity === "critical" && "bg-red-50 border-red-500",
                    alert.severity === "warning" && "bg-amber-50 border-amber-500",
                    alert.severity === "info" && "bg-blue-50 border-blue-500"
                  )}>
                    <div className="flex items-start gap-2 mb-1">
                      {alert.severity === "critical" ? (
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      ) : alert.severity === "warning" ? (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      )}
                      <p className={cn(
                        "text-sm font-medium flex-1",
                        alert.severity === "critical" && "text-red-900",
                        alert.severity === "warning" && "text-amber-900",
                        alert.severity === "info" && "text-blue-900"
                      )}>
                        {alert.message}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 ml-6">{alert.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">System Health</h3>
              <div className="space-y-4">
                {[
                  { name: "API Gateway", status: "healthy", uptime: "99.99%" },
                  { name: "Database", status: "healthy", uptime: "99.95%" },
                  { name: "Cache Layer", status: "healthy", uptime: "100%" },
                  { name: "CDN", status: "healthy", uptime: "99.98%" }
                ].map((service, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span className="text-sm font-medium text-slate-900">{service.name}</span>
                    </div>
                    <span className="text-sm text-slate-500">{service.uptime}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Monitoring Tools</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="w-4 h-4 mr-2" /> Grafana Dashboard
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Server className="w-4 h-4 mr-2" /> Prometheus Metrics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Database className="w-4 h-4 mr-2" /> CloudWatch Logs
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Infrastructure Intelligence */}
        <div className="mt-8 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-slate-900">AI Infrastructure Intelligence</h2>
          </div>
          
          <div className="space-y-6">
            <AIAnomalyDetection />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResourceExhaustionPredictor />
              <InfrastructureEventCorrelation />
            </div>
            <AIInfrastructureRecommendations />
          </div>
        </div>

        {/* Advanced Monitoring Tools */}
        <div className="mt-8 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-6 h-6 text-violet-600" />
            <h2 className="text-2xl font-bold text-slate-900">Advanced Monitoring</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnomalyDetection />
            <DistributedTracing />
          </div>
          
          <AlertConfiguration />
        </div>

        {/* AI-Driven Analytics */}
        <div className="mt-8 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-slate-900">AI Analytics Insights</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ChurnPrediction />
            <PerformanceReports />
            <EngagementOptimizer />
          </div>
        </div>

        {/* Custom Dashboard */}
        {customDashboard.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <LayoutGrid className="w-6 h-6 text-violet-600" />
                <h2 className="text-2xl font-bold text-slate-900">Custom Dashboard</h2>
              </div>
              <Badge variant="outline">{customDashboard.length} charts</Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {customDashboard.map((chart) => (
                <div key={chart.id} className="relative group">
                  {renderChart(chart)}
                  <button
                    onClick={() => removeChart(chart.id)}
                    className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ChartSelector
        open={showChartSelector}
        onClose={() => setShowChartSelector(false)}
        onSelect={addChart}
      />
    </div>
  );
}