import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Boxes, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function AIComponentOptimizer({ elements, onOptimize }) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async () => {
    if (!elements || elements.length === 0) {
      toast.error("No components to analyze");
      return;
    }

    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert in React component architecture. Analyze these UI components and suggest optimizations for reusability:

Components:
${JSON.stringify(elements, null, 2)}

Identify:
1. Duplicate patterns that can be extracted
2. Components that can be made more reusable
3. Props that should be abstracted
4. Composition opportunities
5. Performance optimizations`,
        response_json_schema: {
          type: "object",
          properties: {
            reusabilityScore: { type: "number" },
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  impact: { type: "string" },
                  componentName: { type: "string" },
                  propsStructure: { type: "object" },
                  usage: { type: "string" }
                }
              }
            },
            duplicatePatterns: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  pattern: { type: "string" },
                  occurrences: { type: "number" },
                  suggestion: { type: "string" }
                }
              }
            },
            compositionOpportunities: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      setAnalysis(response);
      toast.success("Component analysis complete!");
    } catch (error) {
      toast.error("Failed to analyze components");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-amber-600";
    return "text-red-600";
  };

  const getImpactColor = (impact) => {
    switch(impact?.toLowerCase()) {
      case "high": return "bg-emerald-100 text-emerald-700";
      case "medium": return "bg-blue-100 text-blue-700";
      case "low": return "bg-slate-100 text-slate-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-teal-600" />
            Component Reusability Optimizer
          </CardTitle>
          <Button 
            onClick={handleAnalyze} 
            disabled={loading || !elements?.length}
            variant="outline"
            size="sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Analyze Components
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!analysis ? (
          <div className="text-center py-8 text-slate-500">
            <Boxes className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>Analyze your components for reusability improvements</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Reusability Score</p>
                  <p className={`text-4xl font-bold ${getScoreColor(analysis.reusabilityScore)}`}>
                    {analysis.reusabilityScore}%
                  </p>
                </div>
                <div className="text-right">
                  <Badge className="bg-teal-100 text-teal-700 mb-2">
                    {analysis.suggestions?.length || 0} suggestions
                  </Badge>
                  <p className="text-xs text-slate-600">
                    {analysis.duplicatePatterns?.length || 0} duplicate patterns
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Optimization Suggestions</h4>
              <div className="space-y-3">
                {analysis.suggestions?.map((suggestion, i) => (
                  <div key={i} className="p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-teal-300 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="font-semibold text-slate-900">{suggestion.title}</h5>
                        <p className="text-sm text-slate-600 mt-1">{suggestion.description}</p>
                      </div>
                      <Badge className={getImpactColor(suggestion.impact)}>
                        {suggestion.impact}
                      </Badge>
                    </div>
                    
                    {suggestion.componentName && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs font-semibold text-slate-700 mb-1">
                          Suggested Component: <code className="text-teal-600">{suggestion.componentName}</code>
                        </p>
                        {suggestion.usage && (
                          <pre className="text-xs text-slate-600 mt-2 overflow-x-auto">
                            {suggestion.usage}
                          </pre>
                        )}
                      </div>
                    )}
                    
                    <Button 
                      size="sm" 
                      className="mt-3"
                      onClick={() => onOptimize(suggestion)}
                    >
                      Apply Optimization
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {analysis.duplicatePatterns && analysis.duplicatePatterns.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Duplicate Patterns</h4>
                <div className="space-y-2">
                  {analysis.duplicatePatterns.map((pattern, i) => (
                    <div key={i} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-sm font-medium text-amber-900">
                          {pattern.pattern}
                        </span>
                        <Badge className="bg-amber-100 text-amber-700">
                          {pattern.occurrences}x
                        </Badge>
                      </div>
                      <p className="text-xs text-amber-800">{pattern.suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.compositionOpportunities && analysis.compositionOpportunities.length > 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-blue-900 mb-2">Composition Opportunities</h5>
                    <ul className="space-y-1">
                      {analysis.compositionOpportunities.map((opportunity, i) => (
                        <li key={i} className="text-sm text-blue-800">• {opportunity}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}