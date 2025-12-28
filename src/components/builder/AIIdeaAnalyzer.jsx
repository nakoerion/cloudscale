import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Lightbulb, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AIIdeaAnalyzer({ onAnalysisComplete }) {
  const [description, setDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const analyzeIdea = async () => {
    if (!description.trim()) {
      toast.error("Please describe your app idea");
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this app idea and provide structured recommendations: "${description}"
        
        Return a JSON object with:
        {
          "app_type": "no-code" | "low-code" | "full-code" | "hybrid",
          "recommended_template": "ecommerce" | "crm" | "blog" | "booking" | "social" | "dashboard" | "portfolio" | "saas" | "blank",
          "suggested_name": "A catchy app name",
          "key_features": ["feature1", "feature2", ...] (list of specific features needed like "auth", "payments", "database", "email", "notifications"),
          "app_category": "business" | "content" | "social" | "analytics" | "starter",
          "tech_recommendations": ["React", "Node.js", ...],
          "reasoning": "Brief explanation of recommendations"
        }`,
        response_json_schema: {
          type: "object",
          properties: {
            app_type: { type: "string" },
            recommended_template: { type: "string" },
            suggested_name: { type: "string" },
            key_features: { type: "array", items: { type: "string" } },
            app_category: { type: "string" },
            tech_recommendations: { type: "array", items: { type: "string" } },
            reasoning: { type: "string" }
          }
        }
      });

      setAnalysis(result);
    } catch (error) {
      toast.error("Failed to analyze your idea. Please try again.");
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAcceptSuggestions = () => {
    onAnalysisComplete({
      description,
      ...analysis
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-full mb-4">
          <Lightbulb className="w-4 h-4 text-violet-600" />
          <span className="text-sm font-semibold text-violet-700">AI-Powered Assistant</span>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">
          Describe Your App Idea
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Tell us what you want to build in your own words, and our AI will help you get started
        </p>
      </div>

      <div className="space-y-4">
        <Textarea
          placeholder="Example: I want to build an online store where customers can browse products, add them to cart, and checkout with Stripe payments..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          className="text-lg p-6 rounded-2xl border-2 focus:border-violet-400"
        />

        <Button
          onClick={analyzeIdea}
          disabled={isAnalyzing || !description.trim()}
          className="w-full py-6 text-lg rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Analyze My Idea
            </>
          )}
        </Button>
      </div>

      {/* AI Analysis Results */}
      {analysis && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <h3 className="text-xl font-bold text-emerald-900">Analysis Complete!</h3>
            </div>
            <p className="text-emerald-800">{analysis.reasoning}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Suggested Name */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Suggested Name
              </h4>
              <p className="text-2xl font-bold text-slate-900">{analysis.suggested_name}</p>
            </div>

            {/* App Type */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Recommended Type
              </h4>
              <Badge className="text-lg py-2 px-4 bg-violet-100 text-violet-700 capitalize">
                {analysis.app_type}
              </Badge>
            </div>

            {/* Template */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Best Template Match
              </h4>
              <p className="text-xl font-semibold text-slate-900 capitalize">
                {analysis.recommended_template}
              </p>
            </div>

            {/* Category */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Category
              </h4>
              <p className="text-xl font-semibold text-slate-900 capitalize">
                {analysis.app_category}
              </p>
            </div>
          </div>

          {/* Key Features */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
              Recommended Features
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.key_features.map((feature, i) => (
                <Badge key={i} variant="outline" className="text-sm py-2 px-4">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
              Suggested Technologies
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.tech_recommendations.map((tech, i) => (
                <Badge key={i} className="bg-blue-100 text-blue-700 text-sm py-2 px-4">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={handleAcceptSuggestions}
            className="w-full py-6 text-lg rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
          >
            Continue with These Suggestions
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}