import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, TrendingDown, Info, AlertCircle } from "lucide-react";

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

  const calculateEstimate = () => {
    // Simulate cost calculation based on template resources
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