import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, Clock, Zap } from "lucide-react";

export default function UserBehaviorPatterns({ onCreateAutomation }) {
  const patterns = [
    {
      pattern: "Users typically complete onboarding tasks in sequence",
      occurrences: 847,
      confidence: 94,
      suggestion: "Create guided workflow to automate sequential task completion",
      potential_time_savings: "2.5 hrs/user"
    },
    {
      pattern: "Support tickets are created after failed payment attempts",
      occurrences: 234,
      confidence: 89,
      suggestion: "Auto-create support ticket when payment fails and notify team",
      potential_time_savings: "15 min/incident"
    },
    {
      pattern: "Users export reports every Monday morning",
      occurrences: 156,
      confidence: 91,
      suggestion: "Schedule automatic report generation and email delivery",
      potential_time_savings: "30 min/week"
    },
    {
      pattern: "Project status updates trigger team notifications",
      occurrences: 423,
      confidence: 87,
      suggestion: "Automate status-based notifications with custom templates",
      potential_time_savings: "1 hr/day"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          Detected Behavior Patterns
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {patterns.map((pattern, i) => (
          <div key={i} className="p-4 border-2 border-indigo-200 rounded-xl bg-indigo-50">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="font-semibold text-indigo-900 mb-1">{pattern.pattern}</p>
                <p className="text-sm text-indigo-800 mb-2">{pattern.suggestion}</p>
              </div>
              <Badge className="bg-indigo-100 text-indigo-700 shrink-0">
                {pattern.confidence}% match
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="p-2 bg-white rounded-lg">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="w-3 h-3 text-slate-600" />
                  <p className="text-xs text-slate-600">Occurrences</p>
                </div>
                <p className="text-sm font-semibold text-slate-900">{pattern.occurrences}</p>
              </div>
              <div className="p-2 bg-white rounded-lg col-span-2">
                <div className="flex items-center gap-1 mb-1">
                  <Clock className="w-3 h-3 text-slate-600" />
                  <p className="text-xs text-slate-600">Time Savings</p>
                </div>
                <p className="text-sm font-semibold text-emerald-600">{pattern.potential_time_savings}</p>
              </div>
            </div>

            <Button 
              size="sm" 
              className="w-full"
              onClick={() => onCreateAutomation(pattern)}
            >
              <Zap className="w-3 h-3 mr-2" />
              Create Automation
            </Button>
          </div>
        ))}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl mt-4">
          <p className="text-sm text-blue-900 font-semibold mb-1">💡 AI Insight</p>
          <p className="text-xs text-blue-800">
            Automating these 4 patterns could save your team approximately <strong>18 hours per week</strong> and reduce manual errors by 67%.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}