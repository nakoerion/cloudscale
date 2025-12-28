import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Perfect for getting started",
    features: [
      "1 Project",
      "Basic templates",
      "Community support",
      "CloudForge hosting"
    ],
    limitations: ["No custom domain", "Limited API calls"]
  },
  {
    id: "basic",
    name: "Basic",
    price: 29,
    description: "For small teams and growing projects",
    features: [
      "5 Projects",
      "All templates",
      "Email support",
      "Custom domain",
      "10K API calls/month",
      "Basic analytics"
    ],
    popular: false
  },
  {
    id: "pro",
    name: "Pro",
    price: 99,
    description: "For professional developers",
    features: [
      "Unlimited projects",
      "All templates + premium",
      "Priority support",
      "Custom domains",
      "100K API calls/month",
      "Advanced analytics",
      "Team collaboration",
      "White-label options"
    ],
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 299,
    description: "For large organizations",
    features: [
      "Everything in Pro",
      "Dedicated support",
      "Unlimited API calls",
      "SLA guarantee",
      "Custom integrations",
      "Advanced security",
      "Multi-region deployment",
      "Custom contracts"
    ],
    popular: false
  }
];

export default function PricingPlans({ currentPlan, onSelectPlan }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {PLANS.map((plan) => {
        const isCurrent = currentPlan === plan.id;
        const isUpgrade = PLANS.findIndex(p => p.id === currentPlan) < PLANS.findIndex(p => p.id === plan.id);
        
        return (
          <div
            key={plan.id}
            className={cn(
              "relative rounded-2xl border-2 p-6 transition-all",
              plan.popular && "ring-4 ring-violet-200 border-violet-500",
              !plan.popular && "border-slate-200"
            )}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-indigo-600">
                Most Popular
              </Badge>
            )}
            
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
              <p className="text-sm text-slate-600">{plan.description}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
                <span className="text-slate-600">/month</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">{feature}</span>
                </div>
              ))}
              {plan.limitations?.map((limitation, i) => (
                <div key={i} className="flex items-start gap-2 opacity-50">
                  <span className="text-sm text-slate-500 line-through">{limitation}</span>
                </div>
              ))}
            </div>

            <Button
              onClick={() => onSelectPlan(plan.id)}
              disabled={isCurrent}
              className={cn(
                "w-full",
                plan.popular && "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700",
                !plan.popular && "bg-slate-900 hover:bg-slate-800"
              )}
            >
              {isCurrent ? "Current Plan" : isUpgrade ? "Upgrade" : "Downgrade"}
              {!isCurrent && <Zap className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        );
      })}
    </div>
  );
}