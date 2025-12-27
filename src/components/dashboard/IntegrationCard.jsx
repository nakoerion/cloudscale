import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Plus, Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const categoryIcons = {
  payment: "💳",
  analytics: "📊",
  authentication: "🔐",
  storage: "💾",
  messaging: "💬",
  database: "🗄️",
  monitoring: "📈",
  security: "🛡️",
  api: "🔌"
};

const categoryColors = {
  payment: "bg-emerald-100 text-emerald-700",
  analytics: "bg-blue-100 text-blue-700",
  authentication: "bg-violet-100 text-violet-700",
  storage: "bg-amber-100 text-amber-700",
  messaging: "bg-pink-100 text-pink-700",
  database: "bg-indigo-100 text-indigo-700",
  monitoring: "bg-cyan-100 text-cyan-700",
  security: "bg-red-100 text-red-700",
  api: "bg-slate-100 text-slate-700"
};

export default function IntegrationCard({ 
  integration, 
  isInstalled = false,
  onInstall,
  onConfigure 
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:border-slate-200 hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-2xl">
          {integration.icon_url ? (
            <img src={integration.icon_url} alt="" className="w-8 h-8" />
          ) : (
            categoryIcons[integration.category] || "🔌"
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900">{integration.name}</h3>
            {integration.is_premium && (
              <Badge className="bg-amber-100 text-amber-700 text-xs">Premium</Badge>
            )}
          </div>
          <p className="text-sm text-slate-500">{integration.provider}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
        {integration.description || "Connect and integrate with ease."}
      </p>

      {/* Category & Rating */}
      <div className="flex items-center gap-2 mb-4">
        <Badge className={cn("text-xs", categoryColors[integration.category])}>
          {integration.category}
        </Badge>
        {integration.rating && (
          <div className="flex items-center gap-1 text-sm text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{integration.rating.toFixed(1)}</span>
          </div>
        )}
        <span className="text-xs text-slate-400">
          {integration.install_count?.toLocaleString() || 0} installs
        </span>
      </div>

      {/* Features */}
      {integration.features?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {integration.features.slice(0, 3).map((feature, i) => (
            <span key={i} className="text-xs px-2 py-1 bg-slate-50 text-slate-600 rounded">
              {feature}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="text-sm">
          {integration.pricing === "free" ? (
            <span className="text-emerald-600 font-medium">Free</span>
          ) : integration.pricing === "freemium" ? (
            <span className="text-blue-600 font-medium">Freemium</span>
          ) : (
            <span className="text-slate-900 font-medium">
              ${integration.monthly_price?.toFixed(2) || "—"}/mo
            </span>
          )}
        </div>
        {isInstalled ? (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onConfigure?.(integration)}
          >
            <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Configure
          </Button>
        ) : (
          <Button 
            size="sm" 
            className="bg-slate-900 hover:bg-slate-800"
            onClick={() => onInstall?.(integration)}
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Install
          </Button>
        )}
      </div>
    </div>
  );
}