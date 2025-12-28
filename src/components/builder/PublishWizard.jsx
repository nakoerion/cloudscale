import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2,
  Globe,
  Search,
  Shield,
  Rocket,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CHECKLIST_ITEMS = [
  { id: "seo", name: "SEO Configuration", icon: Search },
  { id: "domain", name: "Custom Domain", icon: Globe },
  { id: "ssl", name: "SSL Certificate", icon: Shield },
  { id: "analytics", name: "Analytics Setup", icon: CheckCircle2 }
];

export default function PublishWizard({ formData, deploymentResult, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [publishConfig, setPublishConfig] = useState({
    seo: {
      title: formData.name,
      description: formData.description || "",
      keywords: "",
      ogImage: ""
    },
    domain: {
      customDomain: "",
      useCustom: false
    },
    ssl: {
      enabled: true,
      autoRenew: true
    },
    analytics: {
      enabled: true,
      trackPageViews: true,
      trackEvents: true
    }
  });
  const [checklist, setChecklist] = useState(
    CHECKLIST_ITEMS.map(item => ({ ...item, completed: false }))
  );

  const completeStep = (stepId) => {
    setChecklist(prev => prev.map(item => 
      item.id === stepId ? { ...item, completed: true } : item
    ));
  };

  const allCompleted = checklist.every(item => item.completed);

  const handlePublish = () => {
    toast.success("Application published successfully!");
    onComplete();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-full mb-4">
          <Rocket className="w-4 h-4 text-violet-600" />
          <span className="text-sm font-semibold text-violet-700">Ready to Publish</span>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">
          Final Steps Before Going Live
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Complete the checklist to ensure your application is ready for production
        </p>
      </div>

      {/* Progress Checklist */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Pre-Launch Checklist</h3>
        <div className="space-y-3">
          {checklist.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentStep(CHECKLIST_ITEMS.findIndex(i => i.id === item.id))}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                  item.completed 
                    ? "border-emerald-200 bg-emerald-50" 
                    : "border-slate-200 hover:border-violet-300 hover:bg-violet-50"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  item.completed ? "bg-emerald-100" : "bg-slate-100"
                )}>
                  {item.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <Icon className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <span className={cn(
                  "flex-1 font-medium",
                  item.completed ? "text-emerald-900" : "text-slate-900"
                )}>
                  {item.name}
                </span>
                {item.completed && <Badge className="bg-emerald-100 text-emerald-700">✓ Done</Badge>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Configuration Forms */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-8">
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-6 h-6 text-violet-600" />
              <h3 className="text-xl font-bold text-slate-900">SEO Configuration</h3>
            </div>
            
            <div>
              <Label htmlFor="seo-title">Page Title</Label>
              <Input
                id="seo-title"
                value={publishConfig.seo.title}
                onChange={(e) => setPublishConfig({
                  ...publishConfig,
                  seo: { ...publishConfig.seo, title: e.target.value }
                })}
                className="mt-2"
                placeholder="Your App Name - Best Solution"
              />
            </div>

            <div>
              <Label htmlFor="seo-description">Meta Description</Label>
              <Textarea
                id="seo-description"
                value={publishConfig.seo.description}
                onChange={(e) => setPublishConfig({
                  ...publishConfig,
                  seo: { ...publishConfig.seo, description: e.target.value }
                })}
                className="mt-2"
                placeholder="Brief description for search engines (150-160 characters)"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="seo-keywords">Keywords (comma-separated)</Label>
              <Input
                id="seo-keywords"
                value={publishConfig.seo.keywords}
                onChange={(e) => setPublishConfig({
                  ...publishConfig,
                  seo: { ...publishConfig.seo, keywords: e.target.value }
                })}
                className="mt-2"
                placeholder="app, solution, platform"
              />
            </div>

            <div>
              <Label htmlFor="og-image">Open Graph Image URL</Label>
              <Input
                id="og-image"
                value={publishConfig.seo.ogImage}
                onChange={(e) => setPublishConfig({
                  ...publishConfig,
                  seo: { ...publishConfig.seo, ogImage: e.target.value }
                })}
                className="mt-2"
                placeholder="https://..."
              />
            </div>

            <Button
              onClick={() => completeStep('seo')}
              className="w-full bg-violet-600 hover:bg-violet-700"
            >
              Save SEO Settings
            </Button>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-slate-900">Custom Domain</h3>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-blue-900 mb-2">
                <strong>Default URL:</strong> {deploymentResult?.url}
              </p>
              <a href={deploymentResult?.url} target="_blank" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                Visit your app <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-900">Use Custom Domain</p>
                <p className="text-sm text-slate-500">Connect your own domain name</p>
              </div>
              <Switch
                checked={publishConfig.domain.useCustom}
                onCheckedChange={(checked) => setPublishConfig({
                  ...publishConfig,
                  domain: { ...publishConfig.domain, useCustom: checked }
                })}
              />
            </div>

            {publishConfig.domain.useCustom && (
              <div>
                <Label htmlFor="custom-domain">Domain Name</Label>
                <Input
                  id="custom-domain"
                  value={publishConfig.domain.customDomain}
                  onChange={(e) => setPublishConfig({
                    ...publishConfig,
                    domain: { ...publishConfig.domain, customDomain: e.target.value }
                  })}
                  className="mt-2"
                  placeholder="app.yourdomain.com"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Add a CNAME record pointing to: {deploymentResult?.url}
                </p>
              </div>
            )}

            <Button
              onClick={() => completeStep('domain')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {publishConfig.domain.useCustom ? "Configure Domain" : "Skip Custom Domain"}
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-emerald-600" />
              <h3 className="text-xl font-bold text-slate-900">SSL Certificate</h3>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-semibold text-emerald-900 mb-2">Free SSL Certificate Included</h4>
                  <p className="text-sm text-emerald-700 mb-3">
                    Your application is automatically protected with a free SSL certificate from Let's Encrypt.
                  </p>
                  <ul className="text-sm text-emerald-700 space-y-1">
                    <li>✓ 256-bit encryption</li>
                    <li>✓ Automatic renewal every 90 days</li>
                    <li>✓ HTTPS enforced by default</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-900">Auto-Renew SSL</p>
                <p className="text-sm text-slate-500">Automatically renew certificate</p>
              </div>
              <Switch checked={true} disabled />
            </div>

            <Button
              onClick={() => completeStep('ssl')}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              Confirm SSL Settings
            </Button>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl font-bold text-slate-900">Analytics Setup</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-medium text-slate-900">Enable Analytics</p>
                  <p className="text-sm text-slate-500">Track app performance and usage</p>
                </div>
                <Switch
                  checked={publishConfig.analytics.enabled}
                  onCheckedChange={(checked) => setPublishConfig({
                    ...publishConfig,
                    analytics: { ...publishConfig.analytics, enabled: checked }
                  })}
                />
              </div>

              {publishConfig.analytics.enabled && (
                <>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-medium text-slate-900">Track Page Views</p>
                      <p className="text-sm text-slate-500">Monitor visitor traffic</p>
                    </div>
                    <Switch
                      checked={publishConfig.analytics.trackPageViews}
                      onCheckedChange={(checked) => setPublishConfig({
                        ...publishConfig,
                        analytics: { ...publishConfig.analytics, trackPageViews: checked }
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-medium text-slate-900">Track Custom Events</p>
                      <p className="text-sm text-slate-500">Monitor user interactions</p>
                    </div>
                    <Switch
                      checked={publishConfig.analytics.trackEvents}
                      onCheckedChange={(checked) => setPublishConfig({
                        ...publishConfig,
                        analytics: { ...publishConfig.analytics, trackEvents: checked }
                      })}
                    />
                  </div>
                </>
              )}
            </div>

            <Button
              onClick={() => completeStep('analytics')}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Save Analytics Settings
            </Button>
          </div>
        )}
      </div>

      {/* Publish Button */}
      {allCompleted && (
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border-2 border-violet-200 rounded-2xl p-8 text-center">
          <CheckCircle2 className="w-16 h-16 text-violet-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready to Go Live!</h3>
          <p className="text-slate-600 mb-6">
            All pre-launch checks completed. Your application is ready to be published.
          </p>
          <Button
            onClick={handlePublish}
            className="px-12 py-6 text-lg rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
          >
            <Rocket className="w-5 h-5 mr-2" />
            Publish Application
          </Button>
        </div>
      )}
    </div>
  );
}