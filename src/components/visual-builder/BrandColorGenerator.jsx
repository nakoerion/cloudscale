import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Palette, Copy, Check, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function BrandColorGenerator({ onApplyColors }) {
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("");
  const [personality, setPersonality] = useState("");
  const [colorSchemes, setColorSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedColor, setCopiedColor] = useState(null);

  const generateColorScheme = async () => {
    if (!brandName) {
      toast.error("Please enter a brand name");
      return;
    }

    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate 3 professional color schemes for a brand with these characteristics:
        
Brand Name: ${brandName}
Industry: ${industry || "General"}
Brand Personality: ${personality || "Professional, modern, trustworthy"}

For each color scheme, provide:
- Primary color (main brand color)
- Secondary color (complementary)
- Accent color (highlights, CTAs)
- Background colors (light and dark)
- Text colors (on light and dark backgrounds)
- Reasoning for the color psychology

Each scheme should be production-ready and accessible (WCAG AA compliant).`,
        response_json_schema: {
          type: "object",
          properties: {
            schemes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  primary: { type: "string" },
                  secondary: { type: "string" },
                  accent: { type: "string" },
                  background_light: { type: "string" },
                  background_dark: { type: "string" },
                  text_light: { type: "string" },
                  text_dark: { type: "string" },
                  psychology: { type: "string" }
                }
              }
            }
          }
        }
      });

      setColorSchemes(response.schemes);
      toast.success("Color schemes generated!");
    } catch (error) {
      toast.error("Failed to generate color schemes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyColor = (color) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    toast.success("Color copied!");
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-pink-600" />
          AI Brand Color Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label htmlFor="brandName">Brand Name *</Label>
            <Input
              id="brandName"
              placeholder="Your Brand"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              placeholder="e.g., Tech, Finance"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="personality">Personality</Label>
            <Input
              id="personality"
              placeholder="e.g., Bold, Elegant"
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={generateColorScheme} disabled={loading} className="w-full">
          <Sparkles className="w-4 h-4 mr-2" />
          {loading ? "Generating..." : "Generate Color Schemes"}
        </Button>

        {colorSchemes.length > 0 && (
          <div className="space-y-4 mt-6">
            {colorSchemes.map((scheme, i) => (
              <div key={i} className="p-4 border-2 border-slate-200 rounded-xl bg-white">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-900">{scheme.name}</h4>
                    <p className="text-sm text-slate-600">{scheme.description}</p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => onApplyColors(scheme)}
                  >
                    Apply
                  </Button>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-3">
                  {[
                    { label: "Primary", color: scheme.primary },
                    { label: "Secondary", color: scheme.secondary },
                    { label: "Accent", color: scheme.accent },
                    { label: "BG Light", color: scheme.background_light },
                    { label: "BG Dark", color: scheme.background_dark },
                    { label: "Text Light", color: scheme.text_light },
                    { label: "Text Dark", color: scheme.text_dark }
                  ].map((item, j) => (
                    <div key={j}>
                      <div
                        className="h-16 rounded-lg mb-1 cursor-pointer hover:scale-105 transition-transform border border-slate-200"
                        style={{ backgroundColor: item.color }}
                        onClick={() => copyColor(item.color)}
                      />
                      <p className="text-xs text-slate-600 mb-1">{item.label}</p>
                      <div className="flex items-center gap-1">
                        <code className="text-xs text-slate-500">{item.color}</code>
                        {copiedColor === item.color ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-slate-400 cursor-pointer" onClick={() => copyColor(item.color)} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs font-medium text-blue-900 mb-1">Color Psychology:</p>
                  <p className="text-xs text-blue-800">{scheme.psychology}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}