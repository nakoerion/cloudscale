import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CreditCard, FileText, Settings, AlertCircle } from "lucide-react";
import PricingPlans from "@/components/billing/PricingPlans";
import InvoiceList from "@/components/billing/InvoiceList";
import { toast } from "sonner";

export default function Billing() {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: subscription } = useQuery({
    queryKey: ["subscription", user?.email],
    queryFn: async () => {
      const subs = await base44.entities.Subscription.filter({ user_email: user.email });
      return subs[0] || { plan: "free", status: "active" };
    },
    enabled: !!user
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ["invoices", user?.email],
    queryFn: () => base44.entities.Invoice.filter({ user_email: user.email }, "-created_date"),
    enabled: !!user
  });

  const checkoutMutation = useMutation({
    mutationFn: async (plan) => {
      const response = await base44.functions.invoke('createCheckoutSession', { plan });
      return response.data;
    },
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: () => {
      toast.error("Failed to start checkout");
    }
  });

  const manageMutation = useMutation({
    mutationFn: async ({ action, plan }) => {
      const response = await base44.functions.invoke('manageSubscription', { action, plan });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
    onError: () => {
      toast.error("Failed to update subscription");
    }
  });

  const handleSelectPlan = (plan) => {
    if (plan === "free") {
      toast.info("Contact support to downgrade to free plan");
      return;
    }

    if (!subscription || subscription.plan === "free") {
      checkoutMutation.mutate(plan);
    } else {
      const currentIndex = ["free", "basic", "pro", "enterprise"].indexOf(subscription.plan);
      const newIndex = ["free", "basic", "pro", "enterprise"].indexOf(plan);
      const action = newIndex > currentIndex ? "upgrade" : "downgrade";
      manageMutation.mutate({ action, plan });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Billing & Subscription</h1>
          <p className="text-slate-600">Manage your subscription and billing information</p>
        </div>

        {/* Current Subscription Card */}
        {subscription && subscription.plan !== "free" && (
          <div className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl p-6 text-white mb-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold capitalize">{subscription.plan} Plan</h2>
                  <Badge className={
                    subscription.status === "active" ? "bg-emerald-500" :
                    subscription.status === "past_due" ? "bg-amber-500" :
                    "bg-slate-500"
                  }>
                    {subscription.status}
                  </Badge>
                </div>
                <p className="text-violet-100 mb-4">
                  {subscription.cancel_at_period_end 
                    ? `Cancels on ${new Date(subscription.current_period_end).toLocaleDateString()}`
                    : `Renews on ${new Date(subscription.current_period_end).toLocaleDateString()}`
                  }
                </p>
                <p className="text-3xl font-bold">${subscription.monthly_price}/month</p>
              </div>
              <CreditCard className="w-12 h-12 text-white/50" />
            </div>

            {subscription.status === "past_due" && (
              <div className="mt-4 p-4 bg-amber-500/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Payment Failed</p>
                  <p className="text-sm text-violet-100">Please update your payment method to continue service.</p>
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              {subscription.cancel_at_period_end ? (
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={() => manageMutation.mutate({ action: "reactivate" })}
                  disabled={manageMutation.isPending}
                >
                  Reactivate Subscription
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={() => manageMutation.mutate({ action: "cancel" })}
                  disabled={manageMutation.isPending}
                >
                  Cancel Subscription
                </Button>
              )}
            </div>
          </div>
        )}

        <Tabs defaultValue="plans" className="w-full">
          <TabsList className="bg-white border border-slate-200 p-1 rounded-xl mb-6">
            <TabsTrigger value="plans" className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700">
              <Settings className="w-4 h-4 mr-2" /> Plans
            </TabsTrigger>
            <TabsTrigger value="invoices" className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700">
              <FileText className="w-4 h-4 mr-2" /> Invoices
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plans">
            <PricingPlans 
              currentPlan={subscription?.plan || "free"}
              onSelectPlan={handleSelectPlan}
            />
          </TabsContent>

          <TabsContent value="invoices">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Invoice History</h3>
              <InvoiceList invoices={invoices} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}