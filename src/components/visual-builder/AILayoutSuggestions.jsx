import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Zap, Eye } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function AILayoutSuggestions({ currentLayout, onApplySuggestion }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateSuggestions = async () => {
    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this UI layout and provide 3 specific improvement suggestions:
        
Current Layout: ${JSON.stringify(currentLayout)}

Consider:
- Visual hierarchy and information flow
- User attention patterns (F-pattern, Z-pattern)
- White space and breathing room
- Call-to-action placement
- Mobile responsiveness
- Accessibility improvements

Provide actionable suggestions with before/after comparisons.`,
        response_json_schema: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  impact: { type: "string" },
                  confidence: { type: "number" },
                  improvement: { type: "string" },
                  preview_changes: { type: "string" }
                }
              }
            }
          }
        }
      });

      setSuggestions(response.suggestions);
      toast.success("AI suggestions generated!");
    } catch (error) {
      toast.error("Failed to generate suggestions");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-600" />
            AI Layout Optimizer
          </div>
          <Button onClick={generateSuggestions} disabled={loading} size="sm">
            {loading ? "Analyzing..." : "Generate Suggestions"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Sparkles className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>Click "Generate Suggestions" to get AI-powered layout recommendations</p>
          </div>
        ) : (
          suggestions.map((suggestion, i) => (
            <div key={i} className="p-4 border-2 border-violet-200 rounded-xl bg-gradient-to-r from-white to-violet-50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">{suggestion.title}</h4>
                  <p className="text-sm text-slate-600">{suggestion.description}</p>
                </div>
                <Badge className="bg-violet-100 text-violet-700">
                  {suggestion.confidence}% confidence
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-900">Expected Impact</span>
                  </div>
                  <p className="text-sm text-blue-800">{suggestion.impact}</p>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-900">Improvement</span>
                  </div>
                  <p className="text-sm text-emerald-800">{suggestion.improvement}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg mb-3">
                <p className="text-xs font-medium text-slate-700 mb-1">Changes:</p>
                <p className="text-xs text-slate-600">{suggestion.preview_changes}</p>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => onApplySuggestion(suggestion)}
                  className="flex-1"
                >
                  Apply Changes
                </Button>
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}