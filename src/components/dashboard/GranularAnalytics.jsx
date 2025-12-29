import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TrendingUp, Users, Zap, DollarSign, Clock } from "lucide-react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const ENGAGEMENT_DATA = [
  { time: "00:00", active: 120, sessions: 340, actions: 1200 },
  { time: "04:00", active: 85, sessions: 210, actions: 650 },
  { time: "08:00", active: 450, sessions: 890, actions: 3400 },
  { time: "12:00", active: 620, sessions: 1200, actions: 4800 },
  { time: "16:00", active: 580, sessions: 1100, actions: 4200 },
  { time: "20:00", active: 380, sessions: 720, actions: 2600 }
];

const PIPELINE_DATA = [
  { day: "Mon", success: 28, failed: 2, duration: 8.5 },
  { day: "Tue", success: 32, failed: 1, duration: 7.8 },
  { day: "Wed", success: 35, failed: 3, duration: 9.2 },
  { day: "Thu", success: 30, failed: 1, duration: 8.1 },
  { day: "Fri", success: 28, failed: 2, duration: 8.9 },
  { day: "Sat", success: 12, failed: 0, duration: 7.5 },
  { day: "Sun", success: 8, failed: 1, duration: 8.0 }
];

const COST_DATA = [
  { service: "Compute", current: 3240, projected: 2890, savings: 350 },
  { service: "Storage", current: 1850, projected: 1650, savings: 200 },
  { service: "Network", current: 920, projected: 820, savings: 100 },
  { service: "Database", current: 2100, projected: 2100, savings: 0 }
];

export default function GranularAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          Granular Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="engagement" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="engagement">
              <Users className="w-4 h-4 mr-2" />
              User Engagement
            </TabsTrigger>
            <TabsTrigger value="pipelines">
              <Zap className="w-4 h-4 mr-2" />
              Pipeline Performance
            </TabsTrigger>
            <TabsTrigger value="costs">
              <DollarSign className="w-4 h-4 mr-2" />
              Cost Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="engagement" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                <p className="text-sm text-slate-600 mb-1">Peak Active Users</p>
                <p className="text-2xl font-bold text-slate-900">620</p>
                <Badge className="bg-blue-100 text-blue-700 mt-2">at 12:00 PM</Badge>
              </div>
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
                <p className="text-sm text-slate-600 mb-1">Avg Session Length</p>
                <p className="text-2xl font-bold text-slate-900">14.2 min</p>
                <Badge className="bg-emerald-100 text-emerald-700 mt-2">+2.3 min</Badge>
              </div>
              <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl">
                <p className="text-sm text-slate-600 mb-1">Actions per User</p>
                <p className="text-2xl font-bold text-slate-900">7.8</p>
                <Badge className="bg-violet-100 text-violet-700 mt-2">+12%</Badge>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={ENGAGEMENT_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="active" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                <Area type="monotone" dataKey="sessions" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-blue-900 mb-1">💡 AI Insight</p>
              <p className="text-sm text-blue-800">
                User engagement peaks between 12-4 PM. Consider scheduling feature releases during this window for maximum visibility.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="pipelines" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
                <p className="text-sm text-slate-600 mb-1">Success Rate</p>
                <p className="text-2xl font-bold text-slate-900">94.2%</p>
                <Badge className="bg-emerald-100 text-emerald-700 mt-2">+6.5%</Badge>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                <p className="text-sm text-slate-600 mb-1">Avg Duration</p>
                <p className="text-2xl font-bold text-slate-900">8.3 min</p>
                <Badge className="bg-blue-100 text-blue-700 mt-2">-1.2 min</Badge>
              </div>
              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
                <p className="text-sm text-slate-600 mb-1">Total Runs</p>
                <p className="text-2xl font-bold text-slate-900">173</p>
                <Badge className="bg-amber-100 text-amber-700 mt-2">This week</Badge>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={PIPELINE_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="success" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="failed" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-sm font-semibold text-emerald-900 mb-1">💡 AI Insight</p>
              <p className="text-sm text-emerald-800">
                Your pipeline reliability improved significantly after enabling automated testing. Continue this trend by adding integration tests.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="costs" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                <p className="text-sm text-slate-600 mb-1">Current Monthly Cost</p>
                <p className="text-2xl font-bold text-slate-900">$8,110</p>
                <Badge className="bg-blue-100 text-blue-700 mt-2">-5% vs last month</Badge>
              </div>
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
                <p className="text-sm text-slate-600 mb-1">Potential Savings</p>
                <p className="text-2xl font-bold text-emerald-900">$650</p>
                <Badge className="bg-emerald-100 text-emerald-700 mt-2">8% reduction possible</Badge>
              </div>
            </div>

            <div className="space-y-3">
              {COST_DATA.map((item, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900">{item.service}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">${item.current}</span>
                      {item.savings > 0 && (
                        <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                          Save ${item.savings}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${(item.projected / item.current) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">${item.projected}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm font-semibold text-amber-900 mb-1">💡 AI Insight</p>
              <p className="text-sm text-amber-800">
                3 EC2 instances are underutilized during off-peak hours. Enable auto-scaling to save $350/month on compute costs.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}