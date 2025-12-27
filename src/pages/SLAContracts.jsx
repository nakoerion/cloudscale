import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Check, 
  Clock, 
  Phone, 
  Database,
  ArrowRight,
  Zap
} from "lucide-react";
import SLACard from "@/components/dashboard/SLACard";
import { cn } from "@/lib/utils";

const SLA_PLANS = [
  {
    tier: "basic",
    name: "Basic",
    price: 99,
    uptime: 99.5,
    response_time: 24,
    rpo: 24,
    rto: 8,
    support: "email",
    backup: "daily",
    features: [
      "Email Support",
      "Daily Backups",
      "Basic Monitoring",
      "Security Patching"
    ]
  },
  {
    tier: "professional",
    name: "Professional",
    price: 299,
    uptime: 99.9,
    response_time: 4,
    rpo: 4,
    rto: 2,
    support: "priority",
    backup: "hourly",
    features: [
      "Priority Support",
      "Hourly Backups",
      "Advanced Monitoring",
      "Security Patching",
      "Performance Optimization",
      "Custom Scaling Rules"
    ],
    popular: true
  },
  {
    tier: "enterprise",
    name: "Enterprise",
    price: 999,
    uptime: 99.99,
    response_time: 1,
    rpo: 1,
    rto: 0.5,
    support: "24-7-dedicated",
    backup: "real-time",
    features: [
      "24/7 Dedicated Support",
      "Real-time Replication",
      "Custom SLA Terms",
      "Security Audits",
      "Dedicated Account Manager",
      "White-glove Migration",
      "Multi-region Failover",
      "Compliance Reports"
    ]
  }
];

export default function SLAContracts() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const queryClient = useQueryClient();

  const { data: contracts = [], isLoading } = useQuery({
    queryKey: ["sla-contracts"],
    queryFn: () => base44.entities.SLAContract.list()
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: () => base44.entities.Project.list()
  });

  const createContractMutation = useMutation({
    mutationFn: (data) => base44.entities.SLAContract.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sla-contracts"] });
      setSelectedPlan(null);
    }
  });

  const activeContracts = contracts.filter(c => c.status === "active");
  const totalValue = activeContracts.reduce((acc, c) => acc + (c.monthly_price || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-violet-100 text-violet-700 mb-4">Hosting & Maintenance</Badge>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
            SLA Contracts
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Enterprise-grade hosting with guaranteed uptime, 24/7 support, and comprehensive disaster recovery
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {SLA_PLANS.map((plan) => (
            <div
              key={plan.tier}
              className={cn(
                "relative bg-white rounded-3xl border-2 transition-all duration-300",
                plan.popular 
                  ? "border-violet-500 shadow-xl scale-105" 
                  : "border-slate-100 hover:border-slate-200 hover:shadow-lg"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-violet-600 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="p-8">
                <h3 className="text-xl font-semibold text-slate-900">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
                  <span className="text-slate-500">/month</span>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 bg-slate-50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-slate-900">{plan.uptime}%</p>
                    <p className="text-xs text-slate-500">Uptime SLA</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-slate-900">{plan.response_time}h</p>
                    <p className="text-xs text-slate-500">Response Time</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-slate-900">{plan.rpo}h</p>
                    <p className="text-xs text-slate-500">RPO</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-slate-900">{plan.rto}h</p>
                    <p className="text-xs text-slate-500">RTO</p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className={cn(
                    "w-full",
                    plan.popular 
                      ? "bg-violet-600 hover:bg-violet-700" 
                      : "bg-slate-900 hover:bg-slate-800"
                  )}
                  onClick={() => setSelectedPlan(plan)}
                >
                  Get Started <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Active Contracts */}
        {contracts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Active Contracts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contracts.map((contract) => (
                <SLACard
                  key={contract.id}
                  contract={contract}
                  onManage={() => {}}
                  onUpgrade={() => setSelectedPlan(SLA_PLANS.find(p => p.tier === "enterprise"))}
                />
              ))}
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
            Enterprise-Grade Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-violet-500" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">24/7 Support</h3>
              <p className="text-sm text-slate-500">
                Round-the-clock dedicated support team for issue resolution
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Performance Monitoring</h3>
              <p className="text-sm text-slate-500">
                Real-time metrics and alerts for optimal performance
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Disaster Recovery</h3>
              <p className="text-sm text-slate-500">
                Automated backups with defined RPO and RTO objectives
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Security</h3>
              <p className="text-sm text-slate-500">
                Regular patching and vulnerability scanning included
              </p>
            </div>
          </div>
        </div>

        {/* Compliance */}
        <div className="mt-16 bg-slate-900 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Enterprise Compliance Ready
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Our platform adheres to industry standards and regulations
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {["GDPR", "HIPAA", "SOC 2", "ISO 27001", "PCI DSS"].map((cert) => (
              <div key={cert} className="px-6 py-3 bg-white/10 rounded-xl">
                <span className="text-white font-medium">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}