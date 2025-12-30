import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Globe, Cloud, DollarSign, Activity, TrendingUp, CheckCircle2, XCircle, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";

const PROVIDER_COLORS = {
  aws: "#FF9900",
  azure: "#0089D6",
  gcp: "#4285F4"
};

const STATUS_ICONS = {
  pending: Clock,
  completed: CheckCircle2,
  failed: XCircle,
  planning: Activity
};

export default function MultiCloudDashboard() {
  const { data: deployments = [], isLoading } = useQuery({
    queryKey: ["iac-deployments-multicloud"],
    queryFn: () => base44.entities.IaCDeployment.filter({ is_multi_cloud: true })
  });

  const { data: allDeployments = [] } = useQuery({
    queryKey: ["iac-deployments-all"],
    queryFn: () => base44.entities.IaCDeployment.list("-created_date", 100)
  });

  // Calculate metrics
  const multiCloudCount = deployments.length;
  const totalProviders = new Set(allDeployments.flatMap(d => 
    d.is_multi_cloud && d.cloud_resources 
      ? Object.keys(d.cloud_resources) 
      : [d.provider]
  )).size;

  const totalCost = allDeployments.reduce((sum, d) => {
    if (d.is_multi_cloud && d.cloud_resources) {
      return sum + Object.values(d.cloud_resources).reduce((s, r) => s + (r.cost || 0), 0);
    }
    return sum + (d.cost_estimate || 0);
  }, 0);

  // Provider distribution
  const providerDistribution = allDeployments.reduce((acc, d) => {
    if (d.is_multi_cloud && d.cloud_resources) {
      Object.keys(d.cloud_resources).forEach(provider => {
        acc[provider] = (acc[provider] || 0) + 1;
      });
    } else {
      acc[d.provider] = (acc[d.provider] || 0) + 1;
    }
    return acc;
  }, {});

  const distributionData = Object.entries(providerDistribution).map(([name, value]) => ({
    name: name.toUpperCase(),
    value,
    color: PROVIDER_COLORS[name] || "#94a3b8"
  }));

  // Cost by provider
  const costByProvider = allDeployments.reduce((acc, d) => {
    if (d.is_multi_cloud && d.cloud_resources) {
      Object.entries(d.cloud_resources).forEach(([provider, data]) => {
        acc[provider] = (acc[provider] || 0) + (data.cost || 0);
      });
    } else {
      acc[d.provider] = (acc[d.provider] || 0) + (d.cost_estimate || 0);
    }
    return acc;
  }, {});

  const costData = Object.entries(costByProvider).map(([provider, cost]) => ({
    provider: provider.toUpperCase(),
    cost: parseFloat(cost.toFixed(2))
  }));

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Multi-Cloud Deployments</p>
                <p className="text-3xl font-bold text-slate-900">{multiCloudCount}</p>
              </div>
              <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Active Providers</p>
                <p className="text-3xl font-bold text-slate-900">{totalProviders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Cloud className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Total Resources</p>
                <p className="text-3xl font-bold text-slate-900">
                  {allDeployments.reduce((sum, d) => sum + (d.resources_created?.length || 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Total Monthly Cost</p>
                <p className="text-3xl font-bold text-slate-900">${totalCost.toFixed(0)}</p>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Provider Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost by Provider</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="provider" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => `$${value}`}
                />
                <Bar dataKey="cost" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Multi-Cloud Deployments List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Multi-Cloud Deployments</span>
            <Badge className="bg-violet-100 text-violet-700">
              {multiCloudCount} Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-3 border-violet-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : deployments.length === 0 ? (
            <div className="text-center py-8">
              <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No multi-cloud deployments yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {deployments.map((deployment) => (
                <div key={deployment.id} className="border-2 border-slate-200 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">
                        Multi-Cloud Deployment #{deployment.id.slice(0, 8)}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {deployment.cloud_resources && Object.entries(deployment.cloud_resources).map(([provider, data]) => {
                          const StatusIcon = STATUS_ICONS[data.status] || Activity;
                          return (
                            <Badge 
                              key={provider}
                              variant="outline" 
                              className="flex items-center gap-1"
                            >
                              <StatusIcon className="w-3 h-3" />
                              {provider.toUpperCase()} • {data.region}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                    <Badge className="bg-violet-100 text-violet-700">
                      <Globe className="w-3 h-3 mr-1" />
                      Multi-Cloud
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    {deployment.cloud_resources && Object.entries(deployment.cloud_resources).map(([provider, data]) => (
                      <div key={provider} className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">{provider.toUpperCase()}</p>
                        <p className="font-semibold text-slate-900">
                          ${(data.cost || 0).toFixed(2)}/mo
                        </p>
                        <p className="text-xs text-slate-600">{data.resources?.length || 0} resources</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}