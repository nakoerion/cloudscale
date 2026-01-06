import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Download,
  Calendar,
  BarChart3,
  Activity,
  Target
} from "lucide-react";
import ChurnPrediction from "@/components/analytics/ChurnPrediction";
import PerformanceReports from "@/components/analytics/PerformanceReports";
import EngagementOptimizer from "@/components/analytics/EngagementOptimizer";
import AppAnalyticsDashboard from "@/components/analytics/AppAnalyticsDashboard";
import UserBehaviorInsights from "@/components/analytics/UserBehaviorInsights.jsx";
import PredictiveAnalytics from "@/components/analytics/PredictiveAnalytics.jsx";
import AIRecommendationEngine from "@/components/analytics/AIRecommendationEngine.jsx";
import FeatureAdoptionMetrics from "@/components/analytics/FeatureAdoptionMetrics";
import UserEngagementMetrics from "@/components/analytics/UserEngagementMetrics";
import BehaviorPredictionEngine from "@/components/analytics/BehaviorPredictionEngine";
import AnalyticsWidgetManager from "@/components/analytics/AnalyticsWidgetManager";
import AIAnomalyDetection from "@/components/analytics/AIAnomalyDetection";
import InfrastructureCostOptimizer from "@/components/analytics/InfrastructureCostOptimizer";
import AutomatedAlertSystem from "@/components/analytics/AutomatedAlertSystem";
import PerformancePredictionEngine from "@/components/analytics/PerformancePredictionEngine";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("7d");
  const [activeTab, setActiveTab] = useState("overview");
  const [widgets, setWidgets] = useState([
    { id: "engagement", name: "User Engagement", description: "DAU, sessions, actions", enabled: true },
    { id: "feature-adoption", name: "Feature Adoption", description: "Feature usage and trends", enabled: true },
    { id: "behavior-prediction", name: "AI Predictions", description: "Behavior insights and forecasts", enabled: true },
    { id: "churn-prediction", name: "Churn Risk", description: "At-risk user analysis", enabled: true },
    { id: "performance", name: "Performance Reports", description: "Weekly performance summaries", enabled: true }
  ]);

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: () => base44.entities.Project.list("-created_date", 50)
  });

  const totalUsers = 15420;
  const activeUsers = 12350;
  const churnRate = 6.2;
  const avgEngagement = 4.2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <Brain className="w-8 h-8 text-indigo-600" />
              AI Analytics Dashboard
            </h1>
            <p className="text-slate-500 mt-1">Deep insights powered by artificial intelligence</p>
          </div>
          <div className="flex items-center gap-3">
            <AnalyticsWidgetManager widgets={widgets} onUpdate={setWidgets} />
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
              {["24h", "7d", "30d", "90d"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    timeRange === range
                      ? "bg-indigo-600 text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" /> Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-10 h-10 text-blue-600 bg-blue-50 p-2 rounded-xl" />
              <Badge className="bg-emerald-100 text-emerald-700">+12%</Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900">{totalUsers.toLocaleString()}</p>
            <p className="text-sm text-slate-500">Total Users</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <Activity className="w-10 h-10 text-emerald-600 bg-emerald-50 p-2 rounded-xl" />
              <Badge className="bg-emerald-100 text-emerald-700">+8%</Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900">{activeUsers.toLocaleString()}</p>
            <p className="text-sm text-slate-500">Active Users</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-10 h-10 text-amber-600 bg-amber-50 p-2 rounded-xl" />
              <Badge className="bg-red-100 text-red-700">-2.1%</Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900">{churnRate}%</p>
            <p className="text-sm text-slate-500">Churn Rate</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <Target className="w-10 h-10 text-violet-600 bg-violet-50 p-2 rounded-xl" />
              <Badge className="bg-emerald-100 text-emerald-700">+5%</Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900">{avgEngagement}hrs</p>
            <p className="text-sm text-slate-500">Avg Engagement</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white border border-slate-200 p-1 rounded-xl mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 rounded-lg">
              <BarChart3 className="w-4 h-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="behavior" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 rounded-lg">
              <Users className="w-4 h-4 mr-2" /> User Behavior
            </TabsTrigger>
            <TabsTrigger value="churn" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 rounded-lg">
              <TrendingUp className="w-4 h-4 mr-2" /> Churn Analysis
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 rounded-lg">
              <Brain className="w-4 h-4 mr-2" /> AI Recommendations
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 rounded-lg">
              <Calendar className="w-4 h-4 mr-2" /> Reports
            </TabsTrigger>
            <TabsTrigger value="ai-suite" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 rounded-lg">
              <Brain className="w-4 h-4 mr-2" /> AI Suite
            </TabsTrigger>
            </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              {widgets.find(w => w.id === "engagement" && w.enabled) && <UserEngagementMetrics />}
              {widgets.find(w => w.id === "feature-adoption" && w.enabled) && <FeatureAdoptionMetrics />}
              <AppAnalyticsDashboard />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {widgets.find(w => w.id === "behavior-prediction" && w.enabled) && <BehaviorPredictionEngine />}
                <PredictiveAnalytics />
                <AIRecommendationEngine />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="behavior">
            <div className="space-y-6">
              <UserEngagementMetrics />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <UserBehaviorInsights />
                </div>
                <EngagementOptimizer />
              </div>
              <BehaviorPredictionEngine />
            </div>
          </TabsContent>

          <TabsContent value="churn">
            <div className="space-y-6">
              {widgets.find(w => w.id === "churn-prediction" && w.enabled) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ChurnPrediction />
                  <BehaviorPredictionEngine />
                </div>
              )}
              <AIRecommendationEngine />
            </div>
          </TabsContent>

          <TabsContent value="recommendations">
            <div className="space-y-6">
              <BehaviorPredictionEngine />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EngagementOptimizer />
                <AIRecommendationEngine />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <div className="space-y-6">
              {widgets.find(w => w.id === "performance" && w.enabled) && <PerformanceReports />}
              <FeatureAdoptionMetrics />
            </div>
          </TabsContent>

          <TabsContent value="ai-suite">
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl">
                <h3 className="text-xl font-bold text-purple-900 mb-2">🤖 AI-Powered Analytics Suite</h3>
                <p className="text-purple-700">Advanced AI capabilities for predictive insights, anomaly detection, cost optimization, and automated alerting.</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PerformancePredictionEngine />
                <AIAnomalyDetection />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InfrastructureCostOptimizer />
                <AutomatedAlertSystem />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}