import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Wand2, Loader2, Zap } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function AIAutomationBuilder({ onCreateWorkflow }) {
  const [description, setDescription] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedWorkflow, setGeneratedWorkflow] = useState(null);

  const templates = [
    "When a new user signs up, send welcome email and add to CRM",
    "When invoice is paid, update subscription and send receipt",
    "When support ticket is created, analyze sentiment and assign to agent",
    "When task is completed, notify team and update project status"
  ];

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error("Please describe the workflow");
      return;
    }

    setGenerating(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Create an automation workflow based on this description:

"${description}"

Design a workflow with:
1. Trigger event
2. Conditions/filters
3. Actions to perform
4. Error handling
5. Success notifications`,
        response_json_schema: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            trigger: {
              type: "object",
              properties: {
                type: { type: "string" },
                config: { type: "object" }
              }
            },
            nodes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  type: { type: "string" },
                  label: { type: "string" },
                  config: { type: "object" }
                }
              }
            },
            connections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  from: { type: "string" },
                  to: { type: "string" }
                }
              }
            },
            estimatedExecutionTime: { type: "string" },
            complexity: { type: "string" }
          }
        }
      });

      setGeneratedWorkflow(response);
      toast.success("Workflow generated!");
    } catch (error) {
      toast.error("Failed to generate workflow");
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-purple-600" />
          AI Automation Builder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Describe your workflow
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="E.g., When a customer completes a purchase, send them a thank you email and add them to the loyalty program..."
            rows={4}
          />
        </div>

        <div>
          <p className="text-xs font-medium text-slate-600 mb-2">Quick templates:</p>
          <div className="grid grid-cols-2 gap-2">
            {templates.map((template, i) => (
              <button
                key={i}
                onClick={() => setDescription(template)}
                className="text-xs px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-left text-slate-700 transition-colors"
              >
                {template}
              </button>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={generating || !description.trim()}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Generate Workflow
            </>
          )}
        </Button>

        {generatedWorkflow && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-emerald-900">{generatedWorkflow.name}</h4>
                <p className="text-sm text-emerald-800 mt-1">{generatedWorkflow.description}</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700">{generatedWorkflow.complexity}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-2 bg-white rounded-lg">
                <p className="text-xs text-slate-600">Nodes</p>
                <p className="font-semibold text-slate-900">{generatedWorkflow.nodes?.length || 0}</p>
              </div>
              <div className="p-2 bg-white rounded-lg">
                <p className="text-xs text-slate-600">Execution Time</p>
                <p className="font-semibold text-slate-900">{generatedWorkflow.estimatedExecutionTime}</p>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <p className="text-xs font-semibold text-emerald-900">Workflow Steps:</p>
              {generatedWorkflow.nodes?.slice(0, 3).map((node, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-emerald-800">
                  <div className="w-6 h-6 bg-emerald-200 rounded-full flex items-center justify-center text-emerald-900 font-semibold">
                    {i + 1}
                  </div>
                  <span>{node.label}</span>
                </div>
              ))}
              {generatedWorkflow.nodes?.length > 3 && (
                <p className="text-xs text-emerald-600">+{generatedWorkflow.nodes.length - 3} more steps</p>
              )}
            </div>

            <Button 
              onClick={() => onCreateWorkflow(generatedWorkflow)}
              className="w-full"
            >
              Create Workflow
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}