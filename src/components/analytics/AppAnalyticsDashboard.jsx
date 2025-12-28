import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Activity,
  Globe,
  Clock
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const MOCK_DATA = {
  overview: {
    pageViews: 45678,
    uniqueVisitors: 12345,
    avgSessionTime: "3m 24s",
    bounceRate: "42%"
  },
  trafficTrend: [
    { date: "Mon", views: 2400, visitors: 1200 },
    { date: "Tue", views: 3200, visitors: 1500 },
    { date: "Wed", views: 2800, visitors: 1300 },
    { date: "Thu", views: 3800, visitors: 1800 },
    { date: "Fri", views: 4200, visitors: 2100 },
    { date: "Sat", views: 3500, visitors: 1600 },
    { date: "Sun", views: 2900, visitors: 1400 }
  ],
  topPages: [
    { page: "/dashboard", views: 8234, percentage: 18 },
    { page: "/products", views: 6521, percentage: 14 },
    { page: "/pricing", views: 5432, percentage: 12 },
    { page: "/about", views: 4123, percentage: 9 },
    { page: "/contact", views: 3210, percentage: 7 }
  ],
  geographicData: [
    { country: "United States", visitors: 4532, percentage: 37 },
    { country: "United Kingdom", visitors: 2341, percentage: 19 },
    { country: "Germany", visitors: 1876, percentage: 15 },
    { country: "France", visitors: 1234, percentage: 10 },
    { country: "Others", visitors: 2362, percentage: 19 }
  ],
  deviceBreakdown: [
    { name: "Desktop", value: 6789 },
    { name: "Mobile", value: 4321 },
    { name: "Tablet", value: 1235 }
  ]
};

const COLORS = ['#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4'];

export default function AppAnalyticsDashboard() {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Page Views</CardTitle>
            <Eye className="w-4 h-4 text-violet-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{MOCK_DATA.overview.pageViews.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +12.5% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Unique Visitors</CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{MOCK_DATA.overview.uniqueVisitors.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +8.2% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Avg. Session Time</CardTitle>
            <Clock className="w-4 h-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{MOCK_DATA.overview.avgSessionTime}</div>
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +0.8m from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Bounce Rate</CardTitle>
            <Activity className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{MOCK_DATA.overview.bounceRate}</div>
            <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 rotate-180" /> -3.2% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="traffic" className="w-full">
        <TabsList>
          <TabsTrigger value="traffic">Traffic Trends</TabsTrigger>
          <TabsTrigger value="pages">Top Pages</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
        </TabsList>

        <TabsContent value="traffic" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Trends (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={MOCK_DATA.trafficTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="views" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="visitors" stackId="2" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_DATA.topPages.map((page, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-sm text-slate-900">{page.page}</span>
                        <span className="text-sm font-semibold text-slate-900">{page.views.toLocaleString()} views</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div 
                          className="bg-violet-600 h-2 rounded-full" 
                          style={{ width: `${page.percentage}%` }}
                        />
                      </div>
                    </div>
                    <Badge variant="outline">{page.percentage}%</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geography" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Visitors by Country</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_DATA.geographicData.map((country, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Globe className="w-5 h-5 text-slate-400" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-900">{country.country}</span>
                        <span className="text-sm font-semibold text-slate-900">{country.visitors.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${country.percentage}%` }}
                        />
                      </div>
                    </div>
                    <Badge variant="outline">{country.percentage}%</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={MOCK_DATA.deviceBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {MOCK_DATA.deviceBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}