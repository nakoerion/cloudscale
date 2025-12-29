import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Zap, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const FEATURE_DATA = [
  {
    name: "Authentication",
    adoption: 98,
    activeUsers: 4820,
    growth: 12,
    category: "core",
    avgSessionTime: "8.2 min",
    conversionRate: 94
  },
  {
    name: "Dashboard",
    adoption: 95,
    activeUsers: 4680,
    growth: 8,
    category: "core",
    avgSessionTime: "12.5 min",
    conversionRate: 89
  },
  {
    name: "AI Assistant",
    adoption: 67,
    activeUsers: 3290,
    growth: 45,
    category: "advanced",
    avgSessionTime: "6.8 min",
    conversionRate: 72
  },
  {
    name: "Reports",
    adoption: 54,
    activeUsers: 2650,
    growth: 23,
    category: "analytics",
    avgSessionTime: "4.2 min",
    conversionRate: 61
  },
  {
    name: "Integrations",
    adoption: 48,
    activeUsers: 2360,
    growth: 18,
    category: "features",
    avgSessionTime: "5.1 min",
    conversionRate: 55
  },
  {
    name: "API Access",
    adoption: 34,
    activeUsers: 1670,
    growth: -5,
    category: "advanced",
    avgSessionTime: "3.5 min",
    conversionRate: 42
  }
];

const ADOPTION_TIMELINE = [
  { week: "W1", authentication: 92, dashboard: 88, ai: 45, reports: 38 },
  { week: "W2", authentication: 94, dashboard: 90, ai: 52, reports: 42 },
  { week: "W3", authentication: 96, dashboard: 92, ai: 58, reports: 48 },
  { week: "W4", authentication: 98, dashboard: 95, ai: 67, reports: 54 }
];

export default function FeatureAdoptionMetrics() {
  const getColor = (adoption) => {
    if (adoption >= 80) return "#10b981";
    if (adoption >= 60) return "#3b82f6";
    if (adoption >= 40) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-600" />
          Feature Adoption & Usage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Feature List */}
        <div className="space-y-4">
          {FEATURE_DATA.map((feature, i) => (
            <div key={i} className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{feature.name}</h4>
                    <p className="text-xs text-slate-500 capitalize">{feature.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    {feature.activeUsers.toLocaleString()}
                  </Badge>
                  <Badge className={
                    feature.growth > 0 
                      ? "bg-emerald-100 text-emerald-700" 
                      : "bg-red-100 text-red-700"
                  }>
                    {feature.growth > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {Math.abs(feature.growth)}%
                  </Badge>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">Adoption Rate</span>
                  <span className="text-sm font-semibold text-slate-900">{feature.adoption}%</span>
                </div>
                <Progress value={feature.adoption} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Avg Session:</span>
                  <span className="font-medium text-slate-900">{feature.avgSessionTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Conversion:</span>
                  <span className="font-medium text-slate-900">{feature.conversionRate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Adoption Timeline */}
        <div className="pt-4 border-t">
          <h4 className="font-semibold text-slate-900 mb-4">Adoption Trends (Last 4 Weeks)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ADOPTION_TIMELINE}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="authentication" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="dashboard" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ai" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="reports" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-semibold text-blue-900 mb-1">💡 AI Insight</p>
          <p className="text-sm text-blue-800">
            AI Assistant adoption growing 45% week-over-week. Consider promoting this feature in onboarding to accelerate adoption.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}