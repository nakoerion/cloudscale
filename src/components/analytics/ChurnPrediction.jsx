import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingDown, Users, Mail } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const AT_RISK_USERS = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@company.com",
    churn_risk: 85,
    last_active: "7 days ago",
    engagement_score: 23,
    reasons: ["Decreased login frequency", "Low feature usage", "No recent purchases"]
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike@startup.io",
    churn_risk: 72,
    last_active: "3 days ago",
    engagement_score: 41,
    reasons: ["Support tickets unresolved", "Trial ending soon", "Competitor visits detected"]
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily@tech.co",
    churn_risk: 68,
    last_active: "5 days ago",
    engagement_score: 38,
    reasons: ["Feature adoption declining", "Session time reduced by 60%"]
  }
];

export default function ChurnPrediction() {
  const getRiskColor = (risk) => {
    if (risk >= 80) return "bg-red-500";
    if (risk >= 60) return "bg-amber-500";
    return "bg-blue-500";
  };

  const getRiskBadge = (risk) => {
    if (risk >= 80) return "bg-red-100 text-red-700";
    if (risk >= 60) return "bg-amber-100 text-amber-700";
    return "bg-blue-100 text-blue-700";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-red-600" />
          AI Churn Risk Prediction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-2xl font-bold text-red-700">{AT_RISK_USERS.filter(u => u.churn_risk >= 80).length}</p>
            <p className="text-sm text-red-600">High Risk</p>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-2xl font-bold text-amber-700">{AT_RISK_USERS.filter(u => u.churn_risk >= 60 && u.churn_risk < 80).length}</p>
            <p className="text-sm text-amber-600">Medium Risk</p>
          </div>
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <p className="text-2xl font-bold text-emerald-700">94%</p>
            <p className="text-sm text-emerald-600">Retention Rate</p>
          </div>
        </div>

        {AT_RISK_USERS.map((user) => (
          <div key={user.id} className="p-4 border-2 rounded-xl" style={{ borderColor: user.churn_risk >= 80 ? "#ef4444" : "#f59e0b" }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{user.name}</h4>
                  <p className="text-sm text-slate-600">{user.email}</p>
                </div>
              </div>
              <Badge className={getRiskBadge(user.churn_risk)}>
                {user.churn_risk}% Risk
              </Badge>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-600">Churn Probability</span>
                <span className="text-xs font-semibold text-slate-900">{user.churn_risk}%</span>
              </div>
              <Progress value={user.churn_risk} className="h-2" />
            </div>

            <div className="mb-3">
              <p className="text-xs font-medium text-slate-700 mb-2">Risk Factors:</p>
              <div className="space-y-1">
                {user.reasons.map((reason, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    <span className="text-xs text-slate-600">{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t">
              <Button size="sm" variant="outline" className="flex-1">
                <Mail className="w-3 h-3 mr-2" />
                Send Re-engagement
              </Button>
              <Button size="sm" className="flex-1">View Profile</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}