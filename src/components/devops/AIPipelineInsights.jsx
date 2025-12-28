import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Clock, Zap, AlertTriangle } from "lucide-react";

const INSIGHTS = [
  {
    id: 1,
    type: "optimization",
    severity: "high",
    title: "Optimize Build Cache Usage",
    description: "AI detected that your Docker layer caching could be improved by reordering dependencies in Dockerfile.",
    impact: "Reduce build time by ~40% (from 12min to 7min)",
    confidence: 94,
    recommendation: "Move package.json copy before source code copy to leverage layer caching.",
    code_snippet: `# Before:\nCOPY . /app\nRUN npm install\n\n# Optimized:\nCOPY package*.json /app/\nRUN npm install\nCOPY . /app`
  },
  {
    id: 2,
    type: "performance",
    severity: "medium",
    title: "Parallel Test Execution",
    description: "Your test suite runs sequentially. AI suggests enabling parallel test execution.",
    impact: "Reduce test time by ~60% (from 8min to 3min)",
    confidence: 89,
    recommendation: "Configure Jest to run tests in parallel across multiple workers.",
    code_snippet: `// jest.config.js\nmodule.exports = {\n  maxWorkers: '50%',\n  testRunner: 'jest-circus/runner'\n}`
  },
  {
    id: 3,
    type: "security",
    severity: "critical",
    title: "Outdated Dependencies Detected",
    description: "AI security scan found 3 critical vulnerabilities in your dependencies.",
    impact: "Eliminate critical security risks",
    confidence: 98,
    recommendation: "Update react from 17.0.2 to 18.2.0 and axios from 0.21.1 to 1.6.0",
    code_snippet: `npm update react axios\nnpm audit fix`
  }
];

export default function AIPipelineInsights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-600" />
          AI Pipeline Optimization Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {INSIGHTS.map((insight) => (
          <div
            key={insight.id}
            className="p-4 border-2 rounded-xl bg-gradient-to-r from-white to-slate-50"
            style={{
              borderColor:
                insight.severity === "critical" ? "#ef4444" :
                insight.severity === "high" ? "#f59e0b" :
                "#3b82f6"
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  insight.severity === "critical" ? "bg-red-100" :
                  insight.severity === "high" ? "bg-amber-100" :
                  "bg-blue-100"
                }`}>
                  {insight.type === "optimization" && <Zap className="w-5 h-5 text-amber-600" />}
                  {insight.type === "performance" && <Clock className="w-5 h-5 text-blue-600" />}
                  {insight.type === "security" && <AlertTriangle className="w-5 h-5 text-red-600" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 mb-1">{insight.title}</h4>
                  <p className="text-sm text-slate-600 mb-2">{insight.description}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {insight.impact}
                    </Badge>
                    <Badge className="bg-violet-100 text-violet-700 text-xs">
                      {insight.confidence}% confidence
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 mb-3">
              <p className="text-sm font-medium text-slate-900 mb-2">💡 Recommendation:</p>
              <p className="text-sm text-slate-700">{insight.recommendation}</p>
            </div>

            {insight.code_snippet && (
              <details className="mb-3">
                <summary className="text-sm font-medium text-violet-600 cursor-pointer hover:text-violet-700">
                  View code suggestion
                </summary>
                <pre className="mt-2 p-3 bg-slate-900 text-slate-100 rounded-lg text-xs overflow-x-auto">
                  <code>{insight.code_snippet}</code>
                </pre>
              </details>
            )}

            <div className="flex gap-2">
              <Button 
                size="sm"
                onClick={() => {
                  import("sonner").then(({ toast }) => {
                    toast.success("Pipeline optimization applied successfully!");
                  });
                }}
              >
                Apply Suggestion
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  import("sonner").then(({ toast }) => {
                    toast.info("Opening documentation...");
                  });
                }}
              >
                Learn More
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  import("sonner").then(({ toast }) => {
                    toast.info("Insight dismissed");
                  });
                }}
              >
                Dismiss
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}