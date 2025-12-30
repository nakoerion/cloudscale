import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cloud, Plus, RefreshCw, Settings } from "lucide-react";
import CloudProviderCard from "@/components/dashboard/CloudProviderCard";
import ConnectCloudModal from "@/components/modals/ConnectCloudModal";
import MetricCard from "@/components/dashboard/MetricCard";

const ALL_PROVIDERS = ["aws", "azure", "gcp", "alibaba", "ibm", "oracle"];

export default function CloudProviders() {
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const queryClient = useQueryClient();

  const { data: cloudAccounts = [], isLoading, refetch } = useQuery({
    queryKey: ["cloud-accounts"],
    queryFn: () => base44.entities.CloudAccount.list()
  });

  const connectMutation = useMutation({
    mutationFn: (data) => base44.entities.CloudAccount.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cloud-accounts"] });
      setConnectModalOpen(false);
      setSelectedProvider(null);
    }
  });

  const handleConnect = (provider) => {
    setSelectedProvider(provider);
    setConnectModalOpen(true);
  };

  const connectedProviders = cloudAccounts.map(a => a.provider);
  const totalSpend = cloudAccounts.reduce((acc, a) => acc + (a.monthly_spend || 0), 0);
  const totalResources = cloudAccounts.reduce((acc, a) => acc + (a.resources_count || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Cloud Providers</h1>
            <p className="text-slate-500 mt-1">Connect and manage your multi-cloud infrastructure</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Sync
            </Button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <MetricCard
            title="Connected Clouds"
            value={cloudAccounts.length}
            icon={Cloud}
            iconColor="text-blue-500"
            iconBg="bg-blue-50"
          />
          <MetricCard
            title="Total Resources"
            value={totalResources}
            icon={Settings}
            iconColor="text-violet-500"
            iconBg="bg-violet-50"
          />
          <MetricCard
            title="Monthly Spend"
            value={`$${totalSpend.toFixed(2)}`}
            change="-5%"
            changeType="positive"
            icon={Cloud}
            iconColor="text-emerald-500"
            iconBg="bg-emerald-50"
          />
          <MetricCard
            title="Active Regions"
            value={cloudAccounts.reduce((acc, a) => acc + (a.regions?.length || 0), 0)}
            icon={Cloud}
            iconColor="text-amber-500"
            iconBg="bg-amber-50"
          />
        </div>

        {/* Cloud Providers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_PROVIDERS.map((provider) => {
            const account = cloudAccounts.find(a => a.provider === provider);
            return (
              <CloudProviderCard
                key={provider}
                provider={provider}
                isConnected={!!account}
                accountInfo={account}
                onConnect={handleConnect}
                onManage={(provider) => {
                  import("sonner").then(({ toast }) => {
                    toast.info(`Opening ${provider.toUpperCase()} management console...`);
                  });
                }}
              />
            );
          })}
        </div>

        {/* Features */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Multi-Cloud Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Seamless Migration</h3>
              <p className="text-sm text-slate-500">
                Migrate applications between cloud providers with minimal friction using our Infrastructure as Code templates.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Unified Monitoring</h3>
              <p className="text-sm text-slate-500">
                Monitor all your cloud resources from a single dashboard with Prometheus, Grafana, and CloudWatch integration.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Cost Optimization</h3>
              <p className="text-sm text-slate-500">
                Automatically identify cost-saving opportunities across your multi-cloud infrastructure.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ConnectCloudModal
        open={connectModalOpen}
        onClose={() => {
          setConnectModalOpen(false);
          setSelectedProvider(null);
        }}
        provider={selectedProvider}
        onSubmit={(data) => connectMutation.mutate(data)}
        isLoading={connectMutation.isPending}
      />
    </div>
  );
}