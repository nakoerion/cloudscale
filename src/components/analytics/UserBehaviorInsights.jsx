import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mouse, Clock, Eye, MousePointer } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const BEHAVIOR_DATA = [
  { page: "Dashboard", visits: 8420, avg_time: "4:32", bounce_rate: 12 },
  { page: "Projects", visits: 6230, avg_time: "3:45", bounce_rate: 18 },
  { page: "Analytics", visits: 4120, avg_time: "5:12", bounce_rate: 9 },
  { page: "Settings", visits: 2890, avg_time: "2:18", bounce_rate: 25 },
  { page: "Billing", visits: 1560, avg_time: "1:45", bounce_rate: 35 }
];

const HOURLY_ACTIVITY = [
  { hour: "00:00", users: 120 },
  { hour: "03:00", users: 85 },
  { hour: "06:00", users: 180 },
  { hour: "09:00", users: 520 },
  { hour: "12:00", users: 680 },
  { hour: "15:00", users: 750 },
  { hour: "18:00", users: 620 },
  { hour: "21:00", users: 380 }
];

const USER_FLOWS = [
  { flow: "Landing → Dashboard → Projects → Deploy", users: 2340, conversion: 68 },
  { flow: "Landing → Pricing → Checkout", users: 890, conversion: 42 },
  { flow: "Dashboard → Analytics → Reports", users: 1450, conversion: 55 },
  { flow: "Projects → Settings → Team", users: 670, conversion: 38 }
];

export default function UserBehaviorInsights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mouse className="w-5 h-5 text-blue-600" />
          AI-Powered User Behavior Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Page Performance */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-3">Page Performance & Engagement</h4>
          <div className="space-y-2">
            {BEHAVIOR_DATA.map((page, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Eye className="w-4 h-4 text-slate-500" />
                    <span className="font-medium text-slate-900">{page.page}</span>
                  </div>
                  <Badge variant="outline">{page.visits.toLocaleString()} visits</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Avg Time: </span>
                    <span className="font-semibold text-slate-900">{page.avg_time}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Bounce Rate: </span>
                    <span className={`font-semibold ${page.bounce_rate < 15 ? "text-emerald-600" : page.bounce_rate < 25 ? "text-amber-600" : "text-red-600"}`}>
                      {page.bounce_rate}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Activity Pattern */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-3">User Activity Patterns (24h)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={HOURLY_ACTIVITY}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>AI Insight:</strong> Peak usage occurs between 3-6 PM. Consider scheduling important updates or notifications during this window for maximum engagement.
            </p>
          </div>
        </div>

        {/* User Flows */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-3">Top User Flows</h4>
          <div className="space-y-2">
            {USER_FLOWS.map((flow, i) => (
              <div key={i} className="p-3 bg-gradient-to-r from-white to-indigo-50 border border-indigo-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MousePointer className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium text-slate-900">{flow.flow}</span>
                  </div>
                  <Badge className="bg-indigo-100 text-indigo-700">{flow.conversion}% conversion</Badge>
                </div>
                <p className="text-xs text-slate-600">{flow.users.toLocaleString()} users completed this flow</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}