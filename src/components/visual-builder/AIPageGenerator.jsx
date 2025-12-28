import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Wand2, Sparkles, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function AIPageGenerator({ onGenerate }) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState(null);

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error("Please enter a page description");
      return;
    }

    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert UI/UX designer. Generate a complete page layout based on this description:

"${description}"

Create a comprehensive layout with appropriate sections, components, and styling. Return a structured layout object.`,
        response_json_schema: {
          type: "object",
          properties: {
            pageName: { type: "string" },
            sections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  type: { type: "string" },
                  title: { type: "string" },
                  components: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        type: { type: "string" },
                        props: { type: "object" }
                      }
                    }
                  }
                }
              }
            },
            colorScheme: {
              type: "object",
              properties: {
                primary: { type: "string" },
                secondary: { type: "string" },
                background: { type: "string" }
              }
            },
            reasoning: { type: "string" }
          }
        }
      });

      setLastGenerated(response);
      onGenerate(response);
      toast.success("Page layout generated successfully!");
    } catch (error) {
      toast.error("Failed to generate layout");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    "E-commerce product listing page with filters and shopping cart",
    "SaaS dashboard with KPI cards, charts, and activity feed",
    "Landing page for a fitness app with hero section and pricing",
    "Blog homepage with featured posts and category navigation"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-purple-600" />
          AI Page Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Describe your page
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the page you want to create..."
            rows={4}
            className="resize-none"
          />
        </div>

        <div>
          <p className="text-xs font-medium text-slate-600 mb-2">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((example, i) => (
              <button
                key={i}
                onClick={() => setDescription(example)}
                className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={loading || !description.trim()}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Page Layout
            </>
          )}
        </Button>

        {lastGenerated && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h5 className="font-semibold text-emerald-900 mb-1">
                  {lastGenerated.pageName}
                </h5>
                <p className="text-sm text-emerald-800 mb-2">{lastGenerated.reasoning}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-emerald-100 text-emerald-700">
                    {lastGenerated.sections?.length || 0} sections
                  </Badge>
                  {lastGenerated.colorScheme && (
                    <div className="flex gap-1">
                      {Object.entries(lastGenerated.colorScheme).map(([key, color]) => (
                        <div
                          key={key}
                          className="w-6 h-6 rounded border-2 border-white shadow-sm"
                          style={{ backgroundColor: color }}
                          title={key}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}