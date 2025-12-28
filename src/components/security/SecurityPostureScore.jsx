import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, TrendingUp, TrendingDown } from "lucide-react";

const SECURITY_CATEGORIES = [
  { name: "Identity & Access", score: 78, change: -5, trend: "down" },
  { name: "Network Security", score: 85, change: +3, trend: "up" },
  { name: "Data Protection", score: 92, change: +8, trend: "up" },
  { name: "Application Security", score: 68, change: -2, trend: "down" },
  { name: "Logging & Monitoring", score: 88, change: +5, trend: "up" },
  { name: "Compliance", score: 87, change: +2, trend: "up" }
];

export default function SecurityPostureScore() {
  const overallScore = Math.round(
    SECURITY_CATEGORIES.reduce((sum, cat) => sum + cat.score, 0) / SECURITY_CATEGORIES.length
  );

  const getScoreColor = (score) => {
    if (score >= 90) return "text-emerald-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-violet-600" />
          Security Posture Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#e2e8f0"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#8b5cf6"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(overallScore / 100) * 352} 352`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute">
              <p className="text-4xl font-bold text-slate-900">{overallScore}</p>
              <p className="text-xs text-slate-500">Score</p>
            </div>
          </div>
          <div className="mt-4">
            <Badge className={
              overallScore >= 90 ? "bg-emerald-100 text-emerald-700" :
              overallScore >= 70 ? "bg-blue-100 text-blue-700" :
              overallScore >= 50 ? "bg-amber-100 text-amber-700" :
              "bg-red-100 text-red-700"
            }>
              {overallScore >= 90 ? "Excellent" :
               overallScore >= 70 ? "Good" :
               overallScore >= 50 ? "Fair" : "Poor"} Security Posture
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-900">Category Breakdown:</p>
          {SECURITY_CATEGORIES.map((category, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-700">{category.name}</span>
                <div className="flex items-center gap-2">
                  {category.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-semibold ${getScoreColor(category.score)}`}>
                    {category.score}%
                  </span>
                </div>
              </div>
              <Progress value={category.score} className="h-2" />
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-violet-50 border border-violet-200 rounded-lg">
          <p className="text-sm text-violet-900">
            Your security posture has improved by <strong>3.2%</strong> this week. 
            Address the 6 critical vulnerabilities to reach 90+ score.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}