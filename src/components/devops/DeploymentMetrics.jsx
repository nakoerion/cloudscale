import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Zap, Target, CheckCircle2 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const DEPLOYMENT_FREQUENCY_DATA = [
  { day: "Mon", deployments: 12 },
  { day: "Tue", deployments: 8 },
  { day: "Wed", deployments: 15 },
  { day: "Thu", deployments: 11 },
  { day: "Fri", deployments: 9 },
  { day: "Sat", deployments: 3 },
  { day: "Sun", deployments: 2 }
];

const LEAD_TIME_DATA = [
  { week: "W1", leadTime: 4.2 },
  { week: "W2", leadTime: 3.8 },
  { week: "W3", leadTime: 3.5 },
  { week: "W4", leadTime: 2.9 }
];

const DORA_METRICS = [
  {
    name: "Deployment Frequency",
    value: "12/day",
    trend: "+23%",
    status: "elite",
    icon: Zap,
    description: "Elite performers: Multiple deployments per day"
  },
  {
    name: "Lead Time for Changes",
    value: "2.9 hrs",
    trend: "-31%",
    status: "elite",
    icon: Clock,
    description: "Elite performers: Less than one hour"
  },
  {
    name: "Change Failure Rate",
    value: "4.2%",
    trend: "-1.3%",
    status: "high",
    icon: Target,
    description: "High performers: 0-15%"
  },
  {
    name: "Time to Restore",
    value: "47 min",
    trend: "-18%",
    status: "high",
    icon: CheckCircle2,
    description: "High performers: Less than one hour"
  }
];

export default function DeploymentMetrics() {
  const getStatusColor = (status) => {
    const colors = {
      elite: "bg-emerald-100 text-emerald-700",
      high: "bg-blue-100 text-blue-700",
      medium: "bg-amber-100 text-amber-700",
      low: "bg-red-100 text-red-700"
    };
    return colors[status] || colors.medium;
  };

  return (
    <div className="space-y-6">
      {/* DORA Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            DORA Metrics (Real-Time)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DORA_METRICS.map((metric, i) => {
              const Icon = metric.icon;
              return (
                <div key={i} className="p-4 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-violet-50 rounded-lg">
                        <Icon className="w-5 h-5 text-violet-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">{metric.name}</p>
                        <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">{metric.description}</p>
                    <Badge variant="outline" className="text-xs">
                      {metric.trend}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Deployment Frequency (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={DEPLOYMENT_FREQUENCY_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="deployments" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lead Time Trend (Hours)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={LEAD_TIME_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="leadTime" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}