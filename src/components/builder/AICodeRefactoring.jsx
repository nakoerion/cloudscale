import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { base44 } from "@/api/base44Client";
import { 
  Wand2, 
  Loader2, 
  Copy, 
  Check, 
  Sparkles,
  Zap,
  Eye,
  Shield,
  Gauge,
  Code,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

const REFACTOR_OPTIONS = [
  { id: "readability", label: "Improve Readability", icon: Eye, description: "Cleaner variable names, better structure" },
  { id: "performance", label: "Optimize Performance", icon: Zap, description: "Faster execution, less memory" },
  { id: "standards", label: "Coding Standards", icon: Shield, description: "Follow best practices" },
  { id: "resources", label: "Resource Optimization", icon: Gauge, description: "Reduce resource usage" }
];

const CODING_STANDARDS = [
  { value: "airbnb", label: "Airbnb Style Guide" },
  { value: "google", label: "Google Style Guide" },
  { value: "standard", label: "JavaScript Standard" },
  { value: "prettier", label: "Prettier Defaults" }
];

export default function AICodeRefactoring({ code, codeType, onApply }) {
  const [selectedCode, setSelectedCode] = useState(code || "");
  const [refactoring, setRefactoring] = useState(false);
  const [refactoredCode, setRefactoredCode] = useState(null);
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    readability: true,
    performance: false,
    standards: false,
    resources: false
  });
  const [codingStandard, setCodingStandard] = useState("airbnb");
  const [customPrompt, setCustomPrompt] = useState("");

  const refactorCode = async () => {
    if (!selectedCode.trim()) {
      toast.error("Please enter or select code to refactor");
      return;
    }

    setRefactoring(true);
    try {
      const selectedOptions = Object.entries(options)
        .filter(([_, v]) => v)
        .map(([k]) => REFACTOR_OPTIONS.find(o => o.id === k)?.label)
        .join(", ");

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Refactor the following ${codeType || 'code'} with these goals: ${selectedOptions || 'general improvement'}

${options.standards ? `Follow ${CODING_STANDARDS.find(s => s.value === codingStandard)?.label} coding standards.` : ''}

${customPrompt ? `Additional instructions: ${customPrompt}` : ''}

Original Code:
\`\`\`
${selectedCode}
\`\`\`

Provide refactored code with explanation in JSON:
{
  "refactored_code": "<the refactored code>",
  "changes_made": [
    {
      "type": "<readability|performance|standards|resources>",
      "description": "<what was changed>",
      "impact": "<expected impact>"
    }
  ],
  "improvements": {
    "readability_score": <1-10>,
    "performance_gain": "<estimated percentage or description>",
    "resource_savings": "<estimated savings>"
  },
  "suggestions": ["<additional suggestion 1>", "<additional suggestion 2>"]
}`,
        response_json_schema: {
          type: "object",
          properties: {
            refactored_code: { type: "string" },
            changes_made: {
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
            improvements: {
              type: "object",
              properties: {
                readability_score: { type: "number" },
                performance_gain: { type: "string" },
                resource_savings: { type: "string" }
              }
            },
            suggestions: { type: "array", items: { type: "string" } }
          }
        }
      });

      setRefactoredCode(result);
      toast.success("Code refactored successfully!");
    } catch (error) {
      toast.error("Failed to refactor code");
    } finally {
      setRefactoring(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(refactoredCode?.refactored_code || "");
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const applyRefactoring = () => {
    if (onApply && refactoredCode) {
      onApply(refactoredCode.refactored_code);
      toast.success("Refactored code applied!");
    }
  };

  const getTypeColor = (type) => ({
    readability: "bg-blue-100 text-blue-700",
    performance: "bg-amber-100 text-amber-700",
    standards: "bg-purple-100 text-purple-700",
    resources: "bg-emerald-100 text-emerald-700"
  }[type] || "bg-slate-100 text-slate-700");

  return (
    <Card className="border-2 border-indigo-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wand2 className="w-5 h-5 text-indigo-600" />
          AI Code Refactoring
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Code Input */}
        <div>
          <Label className="text-sm mb-2 block">Code to Refactor</Label>
          <Textarea
            value={selectedCode}
            onChange={(e) => setSelectedCode(e.target.value)}
            placeholder="Paste or select code to refactor..."
            className="font-mono text-sm h-40"
          />
        </div>

        {/* Refactoring Options */}
        <div className="grid grid-cols-2 gap-3">
          {REFACTOR_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.id}
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  options[option.id] 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => setOptions({ ...options, [option.id]: !options[option.id] })}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Checkbox checked={options[option.id]} />
                  <Icon className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
                <p className="text-xs text-slate-500 ml-6">{option.description}</p>
              </div>
            );
          })}
        </div>

        {/* Coding Standards */}
        {options.standards && (
          <div>
            <Label className="text-sm mb-2 block">Coding Standard</Label>
            <Select value={codingStandard} onValueChange={setCodingStandard}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CODING_STANDARDS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Custom Instructions */}
        <div>
          <Label className="text-sm mb-2 block">Custom Instructions (Optional)</Label>
          <Textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Add specific refactoring instructions..."
            className="h-20"
          />
        </div>

        {/* Refactor Button */}
        <Button 
          onClick={refactorCode} 
          disabled={refactoring || !selectedCode.trim()}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
        >
          {refactoring ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Refactoring...</>
          ) : (
            <><Sparkles className="w-4 h-4 mr-2" /> Refactor Code</>
          )}
        </Button>

        {/* Results */}
        {refactoredCode && (
          <div className="space-y-4 pt-4 border-t">
            {/* Improvements Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-blue-50 rounded-xl text-center">
                <Eye className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-blue-600">Readability</p>
                <p className="text-lg font-bold text-blue-700">{refactoredCode.improvements?.readability_score}/10</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl text-center">
                <Zap className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <p className="text-xs text-amber-600">Performance</p>
                <p className="text-sm font-bold text-amber-700">{refactoredCode.improvements?.performance_gain || 'N/A'}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl text-center">
                <Gauge className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <p className="text-xs text-emerald-600">Resources</p>
                <p className="text-sm font-bold text-emerald-700">{refactoredCode.improvements?.resource_savings || 'N/A'}</p>
              </div>
            </div>

            {/* Changes Made */}
            {refactoredCode.changes_made?.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">Changes Made</p>
                {refactoredCode.changes_made.map((change, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getTypeColor(change.type)}>{change.type}</Badge>
                      <span className="text-sm font-medium text-slate-900">{change.description}</span>
                    </div>
                    <p className="text-xs text-slate-600">Impact: {change.impact}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Refactored Code */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-slate-700">Refactored Code</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={copyToClipboard}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs overflow-auto max-h-60">
                <code>{refactoredCode.refactored_code}</code>
              </pre>
            </div>

            {/* Suggestions */}
            {refactoredCode.suggestions?.length > 0 && (
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                <p className="text-sm font-semibold text-indigo-900 mb-2">💡 Additional Suggestions</p>
                <ul className="space-y-1">
                  {refactoredCode.suggestions.map((s, i) => (
                    <li key={i} className="text-xs text-indigo-800">• {s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setRefactoredCode(null)} className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" /> Refactor Again
              </Button>
              {onApply && (
                <Button onClick={applyRefactoring} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                  <ArrowRight className="w-4 h-4 mr-2" /> Apply Changes
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}