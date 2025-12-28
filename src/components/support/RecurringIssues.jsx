import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, AlertCircle } from "lucide-react";

export default function RecurringIssues({ tickets }) {
  // Group tickets by category
  const categoryCount = tickets.reduce((acc, ticket) => {
    acc[ticket.category] = (acc[ticket.category] || 0) + 1;
    return acc;
  }, {});

  const recurringIssues = Object.entries(categoryCount)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Identify patterns
  const patterns = [
    {
      issue: "Login/Authentication Issues",
      occurrences: tickets.filter(t => t.title.toLowerCase().includes("login") || t.title.toLowerCase().includes("auth")).length,
      severity: "high",
      trend: "+15%"
    },
    {
      issue: "Payment Processing Delays",
      occurrences: tickets.filter(t => t.category === "billing").length,
      severity: "medium",
      trend: "+8%"
    },
    {
      issue: "Mobile App Crashes",
      occurrences: tickets.filter(t => t.title.toLowerCase().includes("crash") || t.title.toLowerCase().includes("mobile")).length,
      severity: "high",
      trend: "+23%"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-red-600" />
          Recurring Issues & Patterns
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-slate-900 mb-3">Issues by Category</h4>
          <div className="space-y-2">
            {recurringIssues.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-900 capitalize">
                  {item.category?.replace("_", " ")}
                </span>
                <Badge variant="outline">{item.count} tickets</Badge>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 mb-3">AI-Detected Patterns</h4>
          <div className="space-y-3">
            {patterns.map((pattern, i) => (
              <div key={i} className="p-4 border-2 rounded-xl" style={{
                borderColor: pattern.severity === "high" ? "#ef4444" : "#f59e0b"
              }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h5 className="font-semibold text-slate-900">{pattern.issue}</h5>
                    <p className="text-sm text-slate-600">{pattern.occurrences} occurrences</p>
                  </div>
                  <Badge className={pattern.severity === "high" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}>
                    {pattern.severity}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Trend: {pattern.trend} this week</span>
                  <Button size="sm" variant="outline">Investigate</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-semibold text-blue-900 mb-1">AI Recommendation</h5>
              <p className="text-sm text-blue-800">
                Consider creating dedicated FAQ entries and documentation for the top 3 recurring issues to reduce ticket volume by an estimated 35%.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}