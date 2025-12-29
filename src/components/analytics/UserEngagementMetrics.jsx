import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, MousePointer, Target } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const ENGAGEMENT_DATA = [
  { time: "Mon", dau: 3420, sessions: 8900, actions: 45200, satisfaction: 8.2 },
  { time: "Tue", dau: 3680, sessions: 9450, actions: 48100, satisfaction: 8.4 },
  { time: "Wed", dau: 3890, sessions: 10200, actions: 51800, satisfaction: 8.6 },
  { time: "Thu", dau: 3720, sessions: 9800, actions: 49600, satisfaction: 8.3 },
  { time: "Fri", dau: 3580, sessions: 9200, actions: 47400, satisfaction: 8.1 },
  { time: "Sat", dau: 2890, sessions: 6800, actions: 34500, satisfaction: 7.9 },
  { time: "Sun", dau: 2650, sessions: 6200, actions: 31800, satisfaction: 7.8 }
];

const SESSION_QUALITY = [
  { metric: "Avg Session Duration", value: "14.2 min", change: "+8%", trend: "up" },
  { metric: "Pages per Session", value: "6.8", change: "+12%", trend: "up" },
  { metric: "Bounce Rate", value: "18.3%", change: "-5%", trend: "down" },
  { metric: "Return Visitor Rate", value: "67%", change: "+15%", trend: "up" }
];

const ENGAGEMENT_COHORTS = [
  { cohort: "Power Users", percentage: 12, sessions: "25+ per week", value: "High" },
  { cohort: "Regular Users", percentage: 38, sessions: "10-24 per week", value: "Medium" },
  { cohort: "Casual Users", percentage: 35, sessions: "3-9 per week", value: "Low" },
  { cohort: "At Risk", percentage: 15, sessions: "< 3 per week", value: "Critical" }
];

export default function UserEngagementMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          User Engagement Deep Dive
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SESSION_QUALITY.map((item, i) => (
            <div key={i} className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 mb-1">{item.metric}</p>
              <p className="text-2xl font-bold text-slate-900 mb-1">{item.value}</p>
              <Badge className={
                item.trend === "up" 
                  ? "bg-emerald-100 text-emerald-700 text-xs" 
                  : "bg-red-100 text-red-700 text-xs"
              }>
                {item.change}
              </Badge>
            </div>
          ))}
        </div>

        {/* Engagement Timeline */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-3">Daily Active Users & Sessions</h4>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={ENGAGEMENT_DATA}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="dau" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              <Area type="monotone" dataKey="sessions" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* User Actions */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-3">User Actions per Day</h4>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={ENGAGEMENT_DATA}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="actions" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* User Cohorts */}
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-900">Engagement Cohorts</h4>
          {ENGAGEMENT_COHORTS.map((cohort, i) => (
            <div key={i} className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    cohort.value === "High" ? "bg-emerald-500" :
                    cohort.value === "Medium" ? "bg-blue-500" :
                    cohort.value === "Low" ? "bg-amber-500" : "bg-red-500"
                  }`} />
                  <span className="font-medium text-slate-900">{cohort.cohort}</span>
                </div>
                <Badge variant="outline">{cohort.percentage}%</Badge>
              </div>
              <p className="text-sm text-slate-600 ml-6">{cohort.sessions}</p>
            </div>
          ))}
        </div>

        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <p className="text-sm font-semibold text-emerald-900 mb-1">💡 AI Insight</p>
          <p className="text-sm text-emerald-800">
            67% return visitor rate is excellent! Power users (12%) generate 45% of total engagement. Focus retention efforts on Regular Users to convert them to Power Users.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}