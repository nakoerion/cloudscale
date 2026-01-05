import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { DollarSign, TrendingDown, AlertCircle, Sparkles, Loader2, Lightbulb, Info } from "lucide-react";
import { toast } from "sonner";

const PRICING_DATA = {
  aws: {
    compute: { t2_micro: 8.5, t2_small: 17, t2_medium: 33.8, t3_large: 60 },
    storage: { standard: 0.023, infrequent: 0.0125 },
    database: { small: 29, medium: 116, large: 464 }
  },
  azure: {
    compute: { B1s: 7.59, B2s: 30.37, D2s_v3: 70 },
    storage: { hot: 0.0208, cool: 0.01 },
    database: { basic: 5, standard: 15, premium: 500 }
  },
  gcp: {
    compute: { e2_micro: 6.11, e2_small: 12.23, e2_medium: 24.45 },
    storage: { standard: 0.02, nearline: 0.01 },
    database: { shared: 7.67, standard: 25.55, highMem: 51.10 }
  }
};

export default function CostEstimator({ template, provider, region, onEstimate }) {
  const [breakdown, setBreakdown] = useState(null);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const calculateEstimate = () => {
    const resourceTypes = template?.resources || [];
    let compute = 0, storage = 0, network = 0, database = 0;

    resourceTypes.forEach(resource => {
      if (resource.includes('Instance') || resource.includes('VM') || resource.includes('Compute')) {
        compute += PRICING_DATA[provider]?.compute?.t2_medium || 35;
      }
      if (resource.includes('Storage') || resource.includes('S3') || resource.includes('Blob')) {
        storage += 50 * (PRICING_DATA[provider]?.storage?.standard || 0.02);
      }
      if (resource.includes('Database') || resource.includes('SQL')) {
        database += PRICING_DATA[provider]?.database?.medium || 100;
      }
      if (resource.includes('Gateway') || resource.includes('Load')) {
        network += 20;
      }
    });

    const total = compute + storage + network + database;
    const estimate = {
      compute,
      storage,
      network,
      database,
      total: parseFloat(total.toFixed(2))
    };

    setBreakdown(estimate);
    onEstimate?.(estimate.total);
  };

  const getAIRecommendations = async () => {
    if (!breakdown) return;
    
    setLoadingAI(true);
    try {
      const prompt = `Analyze this infrastructure cost breakdown and provide 3-4 specific optimization recommendations:

Template: ${template?.name || 'Infrastructure'}
Provider: ${provider}
Region: ${region}
Current Monthly Cost: $${breakdown.total.toFixed(2)}

Cost Breakdown:
- Compute: $${breakdown.compute.toFixed(2)}
- Storage: $${breakdown.storage.toFixed(2)}
- Database: $${breakdown.database.toFixed(2)}
- Network: $${breakdown.network.toFixed(2)}

Provide recommendations in this JSON format:
{
  "recommendations": [
    {
      "title": "<brief title>",
      "description": "<specific recommendation>",
      "potential_savings": <monthly savings amount>,
      "priority": "<high|medium|low>",
      "implementation_steps": ["<step 1>", "<step 2>"]
    }
  ]
}

Focus on:
- Right-sizing resources
- Reserved instances/savings plans
- Storage tier optimization
- Region-specific cost advantages`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  potential_savings: { type: "number" },
                  priority: { type: "string" },
                  implementation_steps: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        }
      });

      setAiRecommendations(result.recommendations);
      toast.success("AI recommendations generated!");
    } catch (error) {
      toast.error("Failed to generate recommendations");
      console.error(error);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Cost Estimation
          </span>
          {!breakdown && (
            <Button onClick={calculateEstimate} size="sm">
              Calculate Estimate
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!breakdown ? (
          <div className="text-center py-8">
            <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-600 mb-4">
              Get a cost estimate for this infrastructure deployment
            </p>
            <p className="text-xs text-slate-500">
              Based on {template?.resources?.length || 0} resources in {region}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200">
              <p className="text-sm text-emerald-700 mb-1">Estimated Monthly Cost</p>
              <p className="text-3xl font-bold text-emerald-900">${breakdown.total}</p>
              <p className="text-xs text-emerald-600 mt-1">
                Based on {template?.name} in {provider.toUpperCase()}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-900">Cost Breakdown</h4>
              
              {breakdown.compute > 0 && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-blue-900">Compute Instances</span>
                  <span className="font-semibold text-blue-900">${breakdown.compute.toFixed(2)}</span>
                </div>
              )}
              
              {breakdown.storage > 0 && (
                <div className="flex items-center justify-between p-3 bg-violet-50 rounded-lg">
                  <span className="text-sm text-violet-900">Storage</span>
                  <span className="font-semibold text-violet-900">${breakdown.storage.toFixed(2)}</span>
                </div>
              )}
              
              {breakdown.database > 0 && (
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <span className="text-sm text-amber-900">Database</span>
                  <span className="font-semibold text-amber-900">${breakdown.database.toFixed(2)}</span>
                </div>
              )}
              
              {breakdown.network > 0 && (
                <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                  <span className="text-sm text-cyan-900">Networking</span>
                  <span className="font-semibold text-cyan-900">${breakdown.network.toFixed(2)}</span>
                </div>
              )}
            </div>

            <Button
              onClick={getAIRecommendations}
              disabled={loadingAI}
              variant="outline"
              className="w-full border-violet-200 hover:bg-violet-50"
            >
              {loadingAI ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating AI Recommendations...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2 text-violet-600" />
                  Get AI Optimization Tips
                </>
              )}
            </Button>

            {aiRecommendations && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <h4 className="font-semibold text-slate-900">AI Recommendations</h4>
                </div>
                {aiRecommendations.map((rec, i) => (
                  <div key={i} className="p-4 bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-xl">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-semibold text-slate-900">{rec.title}</h5>
                      <Badge className={
                        rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                        rec.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }>
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{rec.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingDown className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-semibold text-emerald-700">
                        Save up to ${rec.potential_savings?.toFixed(2) || '0.00'}/month
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {rec.implementation_steps?.map((step, j) => (
                        <div key={j} className="flex items-start gap-2">
                          <span className="text-xs font-medium text-violet-600 mt-0.5">{j + 1}.</span>
                          <p className="text-xs text-slate-600">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-500 mt-0.5" />
                <div className="text-xs text-slate-600">
                  <p className="font-medium mb-1">Estimate Details</p>
                  <p>Costs are approximate and based on standard pricing. Actual costs may vary based on usage, data transfer, and specific configurations.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}