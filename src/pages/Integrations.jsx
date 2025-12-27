import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Zap, Star, Grid, List } from "lucide-react";
import IntegrationCard from "@/components/dashboard/IntegrationCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "payment", label: "Payment" },
  { value: "analytics", label: "Analytics" },
  { value: "authentication", label: "Authentication" },
  { value: "storage", label: "Storage" },
  { value: "messaging", label: "Messaging" },
  { value: "database", label: "Database" },
  { value: "monitoring", label: "Monitoring" },
  { value: "security", label: "Security" },
  { value: "api", label: "API" }
];

const DEFAULT_INTEGRATIONS = [
  { name: "Stripe", provider: "Stripe Inc.", category: "payment", description: "Accept payments, manage subscriptions, and more", pricing: "freemium", rating: 4.9, install_count: 25000, features: ["Payments", "Subscriptions", "Invoicing"] },
  { name: "Google Analytics", provider: "Google", category: "analytics", description: "Track and analyze user behavior on your app", pricing: "free", rating: 4.7, install_count: 45000, features: ["Real-time", "Audiences", "Goals"] },
  { name: "Auth0", provider: "Okta", category: "authentication", description: "Universal authentication & authorization platform", pricing: "freemium", rating: 4.8, install_count: 18000, features: ["SSO", "MFA", "Social Login"], is_premium: true },
  { name: "AWS S3", provider: "Amazon", category: "storage", description: "Scalable object storage for any type of data", pricing: "paid", monthly_price: 23, rating: 4.6, install_count: 32000, features: ["Versioning", "Encryption", "CDN"] },
  { name: "Twilio", provider: "Twilio Inc.", category: "messaging", description: "Send SMS, voice, and chat messages globally", pricing: "paid", monthly_price: 15, rating: 4.5, install_count: 15000, features: ["SMS", "Voice", "WhatsApp"] },
  { name: "MongoDB Atlas", provider: "MongoDB", category: "database", description: "Fully managed cloud database service", pricing: "freemium", rating: 4.7, install_count: 28000, features: ["Auto-scaling", "Backups", "Global"] },
  { name: "Datadog", provider: "Datadog Inc.", category: "monitoring", description: "Modern monitoring and analytics platform", pricing: "paid", monthly_price: 31, rating: 4.6, install_count: 12000, features: ["APM", "Logs", "Metrics"], is_premium: true },
  { name: "Cloudflare", provider: "Cloudflare", category: "security", description: "Web security and performance services", pricing: "freemium", rating: 4.8, install_count: 38000, features: ["WAF", "DDoS", "CDN"] },
  { name: "SendGrid", provider: "Twilio", category: "messaging", description: "Reliable email delivery at scale", pricing: "freemium", rating: 4.4, install_count: 22000, features: ["Templates", "Analytics", "API"] },
  { name: "Firebase", provider: "Google", category: "database", description: "Backend-as-a-service with real-time database", pricing: "freemium", rating: 4.6, install_count: 41000, features: ["Realtime", "Auth", "Hosting"] },
  { name: "Sentry", provider: "Sentry.io", category: "monitoring", description: "Application monitoring and error tracking", pricing: "freemium", rating: 4.7, install_count: 19000, features: ["Error Tracking", "Performance", "Releases"] },
  { name: "Zapier", provider: "Zapier Inc.", category: "api", description: "Connect apps and automate workflows", pricing: "freemium", rating: 4.5, install_count: 35000, features: ["Automation", "Workflows", "1000+ Apps"] }
];

export default function Integrations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const queryClient = useQueryClient();

  const { data: integrations = [], isLoading } = useQuery({
    queryKey: ["integrations"],
    queryFn: async () => {
      const data = await base44.entities.Integration.list();
      if (data.length === 0) {
        // Seed default integrations
        await Promise.all(DEFAULT_INTEGRATIONS.map(i => 
          base44.entities.Integration.create(i)
        ));
        return base44.entities.Integration.list();
      }
      return data;
    }
  });

  const installMutation = useMutation({
    mutationFn: async (integration) => {
      await base44.entities.Integration.update(integration.id, {
        install_count: (integration.install_count || 0) + 1
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["integrations"] })
  });

  const filteredIntegrations = integrations.filter(i => {
    const matchesSearch = i.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.provider?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || i.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const popularIntegrations = [...integrations].sort((a, b) => 
    (b.install_count || 0) - (a.install_count || 0)
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Integrations Marketplace</h1>
          <p className="text-slate-500 mt-1">Connect third-party services to extend your application</p>
        </div>

        {/* Popular Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-slate-900">Popular Integrations</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularIntegrations.map((integration) => (
              <button
                key={integration.id}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all text-left"
                onClick={() => installMutation.mutate(integration)}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-lg flex items-center justify-center text-lg">
                  {integration.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{integration.name}</p>
                  <p className="text-xs text-slate-500">{integration.install_count?.toLocaleString()} installs</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${viewMode === "grid" ? "bg-slate-100" : ""}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${viewMode === "list" ? "bg-slate-100" : ""}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500">
            {filteredIntegrations.length} integrations found
          </p>
          <div className="flex gap-2">
            {["free", "freemium", "paid"].map((type) => (
              <Badge key={type} variant="outline" className="capitalize">
                {type}
              </Badge>
            ))}
          </div>
        </div>

        {/* Integrations Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filteredIntegrations.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <Zap className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No integrations found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }>
            {filteredIntegrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onInstall={installMutation.mutate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}