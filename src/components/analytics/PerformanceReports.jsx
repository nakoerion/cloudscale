import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, TrendingUp, TrendingDown, Calendar } from "lucide-react";

const REPORTS = [
  {
    id: 1,
    week: "Dec 22-28, 2025",
    status: "ready",
    generated: "2 hours ago",
    metrics: {
      users: { value: 15420, change: 12.5, trend: "up" },
      revenue: { value: "$45,230", change: 8.3, trend: "up" },
      engagement: { value: "4.2 hrs", change: -3.2, trend: "down" },
      conversions: { value: "3.8%", change: 0.5, trend: "up" }
    },
    highlights: [
      "User growth exceeded target by 25%",
      "Mobile traffic increased 34%",
      "Feature X adoption reached 67%"
    ],
    concerns: [
      "Average session time decreased by 12 minutes",
      "Checkout abandonment rate up to 23%"
    ]
  },
  {
    id: 2,
    week: "Dec 15-21, 2025",
    status: "ready",
    generated: "1 week ago",
    metrics: {
      users: { value: 13760, change: 5.2, trend: "up" },
      revenue: { value: "$41,820", change: 3.1, trend: "up" },
      engagement: { value: "4.4 hrs", change: 2.1, trend: "up" },
      conversions: { value: "3.3%", change: -0.8, trend: "down" }
    }
  }
];

export default function PerformanceReports() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            AI-Generated Performance Reports
          </CardTitle>
          <Button size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Report
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {REPORTS.map((report) => (
          <div key={report.id} className="p-4 bg-white border-2 border-slate-200 rounded-xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">{report.week}</h4>
                <p className="text-sm text-slate-500">Generated {report.generated}</p>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-emerald-100 text-emerald-700">Ready</Badge>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-4">
              {Object.entries(report.metrics).map(([key, data]) => (
                <div key={key} className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600 capitalize mb-1">{key}</p>
                  <p className="text-lg font-bold text-slate-900 mb-1">{data.value}</p>
                  <div className="flex items-center gap-1">
                    {data.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-600" />
                    )}
                    <span className={`text-xs font-semibold ${
                      data.trend === "up" ? "text-emerald-600" : "text-red-600"
                    }`}>
                      {Math.abs(data.change)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {report.highlights && (
              <div className="mb-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-xs font-semibold text-emerald-900 mb-2">✨ Highlights</p>
                <ul className="space-y-1">
                  {report.highlights.map((highlight, i) => (
                    <li key={i} className="text-xs text-emerald-800">• {highlight}</li>
                  ))}
                </ul>
              </div>
            )}

            {report.concerns && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs font-semibold text-amber-900 mb-2">⚠️ Concerns</p>
                <ul className="space-y-1">
                  {report.concerns.map((concern, i) => (
                    <li key={i} className="text-xs text-amber-800">• {concern}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}