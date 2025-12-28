import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, Sparkles, TrendingUp, Loader2, Copy, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function AICodeRefactor({ currentCode, onApply }) {
  const [loading, setLoading] = useState(false);
  const [refactorResult, setRefactorResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleRefactor = async () => {
    if (!currentCode) {
      toast.error("No code to refactor");
      return;
    }

    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert React developer. Analyze and refactor this code for better performance, readability, and maintainability:

\`\`\`jsx
${currentCode}
\`\`\`

Provide:
1. Refactored code with improvements
2. List of changes made
3. Performance impact assessment
4. Best practices applied`,
        response_json_schema: {
          type: "object",
          properties: {
            refactoredCode: { type: "string" },
            changes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  description: { type: "string" },
                  impact: { type: "string" }
                }
              }
            },
            performanceGain: { type: "string" },
            readabilityScore: { type: "number" },
            bestPractices: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      setRefactorResult(response);
      toast.success("Code refactored successfully!");
    } catch (error) {
      toast.error("Failed to refactor code");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (refactorResult?.refactoredCode) {
      await navigator.clipboard.writeText(refactorResult.refactoredCode);
      setCopied(true);
      toast.success("Code copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
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
            <Code2 className="w-5 h-5 text-indigo-600" />
            AI Code Refactoring
          </CardTitle>
          <Button 
            onClick={handleRefactor} 
            disabled={loading || !currentCode}
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
                Refactor Code
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!refactorResult ? (
          <div className="text-center py-8 text-slate-500">
            <Code2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>Click "Refactor Code" to analyze and improve your code</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-xs text-emerald-600 mb-1">Performance Gain</p>
                <p className="text-lg font-bold text-emerald-900">
                  {refactorResult.performanceGain}
                </p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-600 mb-1">Readability Score</p>
                <p className="text-lg font-bold text-blue-900">
                  {refactorResult.readabilityScore}/10
                </p>
              </div>
            </div>

            <Tabs defaultValue="changes" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="changes" className="flex-1">Changes</TabsTrigger>
                <TabsTrigger value="code" className="flex-1">Refactored Code</TabsTrigger>
                <TabsTrigger value="practices" className="flex-1">Best Practices</TabsTrigger>
              </TabsList>

              <TabsContent value="changes" className="space-y-2 mt-3">
                {refactorResult.changes?.map((change, i) => (
                  <div key={i} className="p-3 bg-slate-50 border rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-sm font-medium text-slate-900 capitalize">
                        {change.type}
                      </span>
                      <Badge className={getImpactColor(change.impact)}>
                        {change.impact} impact
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">{change.description}</p>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="code" className="mt-3">
                <div className="relative">
                  <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 text-xs overflow-x-auto max-h-96">
                    <code>{refactorResult.refactoredCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 bg-slate-800 hover:bg-slate-700"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button 
                    onClick={() => onApply(refactorResult.refactoredCode)}
                    className="flex-1"
                  >
                    Apply Changes
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Compare Side-by-Side
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="practices" className="space-y-2 mt-3">
                {refactorResult.bestPractices?.map((practice, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-indigo-900">{practice}</p>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}