import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles,
  Code,
  Palette,
  Database,
  Cloud,
  Zap,
  ShoppingCart,
  Users,
  FileText,
  Calendar,
  MessageSquare,
  Rocket,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, name: "Project Type", icon: Sparkles },
  { id: 2, name: "Template", icon: Palette },
  { id: 3, name: "Features", icon: Zap },
  { id: 4, name: "Tech Stack", icon: Code },
  { id: 5, name: "Deployment", icon: Cloud },
  { id: 6, name: "Review", icon: CheckCircle2 }
];

const PROJECT_TYPES = [
  { 
    value: "no-code", 
    label: "No-Code", 
    icon: "🎨",
    description: "Build with visual tools, no coding required",
    best_for: "Rapid prototyping, MVPs, business apps"
  },
  { 
    value: "low-code", 
    label: "Low-Code", 
    icon: "⚡",
    description: "Visual builder with custom code when needed",
    best_for: "Custom workflows, integrations, flexibility"
  },
  { 
    value: "full-code", 
    label: "Full-Code", 
    icon: "💻",
    description: "Complete development freedom with frameworks",
    best_for: "Complex apps, full customization, scalability"
  },
  { 
    value: "hybrid", 
    label: "Hybrid", 
    icon: "🔄",
    description: "Mix visual building with custom code modules",
    best_for: "Enterprise apps, microservices, team collaboration"
  }
];

const TEMPLATES = [
  { id: "ecommerce", name: "E-Commerce", icon: ShoppingCart, description: "Online store with payments", features: ["Product catalog", "Shopping cart", "Payment processing", "Order management"] },
  { id: "crm", name: "CRM", icon: Users, description: "Customer relationship management", features: ["Contact management", "Sales pipeline", "Email integration", "Reporting"] },
  { id: "blog", name: "Blog/CMS", icon: FileText, description: "Content management system", features: ["Content editor", "SEO optimization", "Comments", "Media library"] },
  { id: "booking", name: "Booking System", icon: Calendar, description: "Appointments and scheduling", features: ["Calendar", "Availability", "Notifications", "Payments"] },
  { id: "social", name: "Social Platform", icon: MessageSquare, description: "Community and social features", features: ["User profiles", "Feed", "Messaging", "Notifications"] },
  { id: "dashboard", name: "Analytics Dashboard", icon: Database, description: "Data visualization and reporting", features: ["Charts", "KPIs", "Real-time data", "Exports"] },
  { id: "blank", name: "Blank Canvas", icon: Sparkles, description: "Start from scratch", features: [] }
];

const FEATURES = [
  { id: "auth", name: "Authentication", icon: "🔐", category: "core" },
  { id: "database", name: "Database", icon: "💾", category: "core" },
  { id: "api", name: "REST API", icon: "🔌", category: "core" },
  { id: "payments", name: "Payments", icon: "💳", category: "business" },
  { id: "email", name: "Email Service", icon: "📧", category: "communication" },
  { id: "notifications", name: "Push Notifications", icon: "🔔", category: "communication" },
  { id: "storage", name: "File Storage", icon: "📁", category: "core" },
  { id: "search", name: "Full-text Search", icon: "🔍", category: "features" },
  { id: "realtime", name: "Real-time Updates", icon: "⚡", category: "features" },
  { id: "analytics", name: "Analytics", icon: "📊", category: "features" },
  { id: "social", name: "Social Login", icon: "👥", category: "features" },
  { id: "ai", name: "AI Integration", icon: "🤖", category: "advanced" }
];

const TECH_STACKS = {
  frontend: ["React", "Vue", "Angular", "Next.js", "Svelte"],
  backend: ["Node.js", "Python", "Go", "Java", "Ruby"],
  database: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Firestore"],
  infrastructure: ["Docker", "Kubernetes", "Terraform", "Serverless"]
};

const CLOUD_PROVIDERS = [
  { value: "aws", label: "AWS", icon: "🔶", description: "Scalable and reliable" },
  { value: "azure", label: "Azure", icon: "🔷", description: "Microsoft ecosystem" },
  { value: "gcp", label: "Google Cloud", icon: "🔴", description: "AI and ML ready" },
  { value: "multi-cloud", label: "Multi-Cloud", icon: "🌐", description: "Best of all worlds" }
];

export default function ApplicationBuilder() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    template: "",
    features: [],
    tech_stack: [],
    cloud_provider: "aws",
    deployment_region: "us-east-1"
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createProjectMutation = useMutation({
    mutationFn: (data) => base44.entities.Project.create(data),
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setCurrentStep(7); // Success step
      setTimeout(() => {
        navigate(createPageUrl("ProjectDetails") + `?id=${project.id}`);
      }, 2000);
    }
  });

  const handleNext = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleFinish = () => {
    const selectedTemplate = TEMPLATES.find(t => t.id === formData.template);
    createProjectMutation.mutate({
      name: formData.name,
      description: formData.description,
      type: formData.type,
      cloud_provider: formData.cloud_provider,
      deployment_region: formData.deployment_region,
      tech_stack: formData.tech_stack,
      status: "draft",
      metrics: {
        uptime: 100,
        requests_today: 0,
        avg_response_time: 0,
        error_rate: 0
      }
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.type && formData.name;
      case 2: return formData.template;
      case 3: return true;
      case 4: return formData.tech_stack.length > 0;
      case 5: return formData.cloud_provider;
      case 6: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-violet-200 mb-6 shadow-lg">
            <Sparkles className="w-4 h-4 text-violet-600 animate-pulse" />
            <span className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Application Builder
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-4 leading-tight">
            Build Your Dream<br />
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Application
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Create production-ready applications in minutes with our intelligent guided builder
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1 relative">
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 mb-3 relative z-10",
                        isCompleted && "bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/50 scale-110",
                        isActive && "bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-600 ring-4 ring-violet-200 shadow-xl scale-110",
                        !isActive && !isCompleted && "bg-slate-100 text-slate-400"
                      )}>
                        {isCompleted ? (
                          <Check className="w-7 h-7" />
                        ) : (
                          <StepIcon className="w-7 h-7" />
                        )}
                      </div>
                      <span className={cn(
                        "text-xs font-semibold text-center transition-all duration-300",
                        isActive && "text-violet-700 scale-110",
                        isCompleted && "text-slate-700",
                        !isActive && !isCompleted && "text-slate-400"
                      )}>
                        {step.name}
                      </span>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div className={cn(
                        "h-1 flex-1 mx-2 rounded-full transition-all duration-500 relative top-[-20px]",
                        currentStep > step.id 
                          ? "bg-gradient-to-r from-violet-600 to-indigo-600" 
                          : "bg-slate-200"
                      )} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-10 md:p-16 mb-10 min-h-[600px] transition-all duration-500">
          {/* Step 1: Project Type */}
          {currentStep === 1 && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">
                  Let's start with the basics
                </h2>
                <p className="text-lg text-slate-600">Choose your project type and give it a name</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base">Project Name *</Label>
                  <Input
                    id="name"
                    placeholder="My Awesome Project"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="text-lg p-6"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base">Description (optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="What will your application do?"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="text-base"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-lg font-semibold text-slate-900">Project Type *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {PROJECT_TYPES.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setFormData({ ...formData, type: type.value })}
                        className={cn(
                          "group p-8 rounded-3xl border-2 text-left transition-all duration-500 hover:scale-[1.02]",
                          formData.type === type.value
                            ? "border-violet-500 bg-gradient-to-br from-violet-50 to-indigo-50 shadow-2xl shadow-violet-200/50"
                            : "border-slate-200 bg-white hover:border-violet-300 hover:shadow-xl"
                        )}
                      >
                        <div className="flex items-start gap-5">
                          <div className={cn(
                            "w-16 h-16 rounded-2xl flex items-center justify-center text-4xl transition-all duration-300",
                            formData.type === type.value 
                              ? "bg-white shadow-lg scale-110" 
                              : "bg-slate-50 group-hover:bg-white group-hover:shadow-md"
                          )}>
                            {type.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{type.label}</h3>
                            <p className="text-sm text-slate-600 mb-3 leading-relaxed">{type.description}</p>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold">
                              <Sparkles className="w-3 h-3" />
                              {type.best_for}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Template Selection */}
          {currentStep === 2 && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">
                  Choose a template
                </h2>
                <p className="text-lg text-slate-600">Start with a pre-built template or from scratch</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TEMPLATES.map((template) => {
                  const TemplateIcon = template.icon;
                  return (
                    <button
                      key={template.id}
                      onClick={() => setFormData({ ...formData, template: template.id })}
                      className={cn(
                        "group p-6 rounded-3xl border-2 text-left transition-all duration-500 hover:scale-105",
                        formData.template === template.id
                          ? "border-violet-500 bg-gradient-to-br from-violet-50 to-indigo-50 shadow-2xl shadow-violet-200/50"
                          : "border-slate-200 bg-white hover:border-violet-300 hover:shadow-xl"
                      )}
                    >
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300",
                        formData.template === template.id
                          ? "bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg"
                          : "bg-gradient-to-br from-violet-100 to-indigo-100 group-hover:from-violet-200 group-hover:to-indigo-200"
                      )}>
                        <TemplateIcon className={cn(
                          "w-8 h-8 transition-all duration-300",
                          formData.template === template.id ? "text-white" : "text-violet-600"
                        )} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{template.name}</h3>
                      <p className="text-sm text-slate-600 mb-4 leading-relaxed">{template.description}</p>
                      {template.features.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {template.features.slice(0, 2).map((feature, i) => (
                            <span key={i} className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-full text-slate-700 font-medium">
                              {feature}
                            </span>
                          ))}
                          {template.features.length > 2 && (
                            <span className="text-xs px-3 py-1.5 bg-violet-100 text-violet-700 rounded-full font-semibold">
                              +{template.features.length - 2} more
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Features */}
          {currentStep === 3 && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">
                  Select features
                </h2>
                <p className="text-lg text-slate-600">Choose the features you need for your application</p>
              </div>

              {["core", "business", "communication", "features", "advanced"].map((category) => {
                const categoryFeatures = FEATURES.filter(f => f.category === category);
                if (categoryFeatures.length === 0) return null;

                return (
                  <div key={category}>
                    <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-violet-600 to-indigo-600 rounded-full" />
                      {category}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {categoryFeatures.map((feature) => {
                        const isSelected = formData.features.includes(feature.id);
                        return (
                          <button
                            key={feature.id}
                            onClick={() => {
                              setFormData({
                                ...formData,
                                features: isSelected
                                  ? formData.features.filter(f => f !== feature.id)
                                  : [...formData.features, feature.id]
                              });
                            }}
                            className={cn(
                              "group p-5 rounded-2xl border-2 text-center transition-all duration-300 hover:scale-105",
                              isSelected
                                ? "border-violet-500 bg-gradient-to-br from-violet-50 to-indigo-50 shadow-lg shadow-violet-200/50"
                                : "border-slate-200 bg-white hover:border-violet-300 hover:shadow-lg"
                            )}
                          >
                            <div className={cn(
                              "w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center text-3xl transition-all duration-300",
                              isSelected 
                                ? "bg-white shadow-md" 
                                : "bg-slate-50 group-hover:bg-white"
                            )}>
                              {feature.icon}
                            </div>
                            <span className="text-sm font-semibold text-slate-900 block">{feature.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Step 4: Tech Stack */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Choose your tech stack</h2>
                <p className="text-slate-500">Select the technologies for your application</p>
              </div>

              {Object.entries(TECH_STACKS).map(([category, technologies]) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {technologies.map((tech) => {
                      const isSelected = formData.tech_stack.includes(tech);
                      return (
                        <button
                          key={tech}
                          onClick={() => {
                            setFormData({
                              ...formData,
                              tech_stack: isSelected
                                ? formData.tech_stack.filter(t => t !== tech)
                                : [...formData.tech_stack, tech]
                            });
                          }}
                          className={cn(
                            "px-6 py-3 rounded-xl border-2 text-sm font-medium transition-all",
                            isSelected
                              ? "border-violet-500 bg-violet-50 text-violet-700"
                              : "border-slate-200 text-slate-600 hover:border-slate-300"
                          )}
                        >
                          {tech}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 5: Deployment */}
          {currentStep === 5 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Deployment configuration</h2>
                <p className="text-slate-500">Choose where to deploy your application</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base">Cloud Provider</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {CLOUD_PROVIDERS.map((provider) => (
                      <button
                        key={provider.value}
                        onClick={() => setFormData({ ...formData, cloud_provider: provider.value })}
                        className={cn(
                          "p-6 rounded-2xl border-2 text-left transition-all",
                          formData.cloud_provider === provider.value
                            ? "border-violet-500 bg-violet-50 shadow-lg"
                            : "border-slate-200 hover:border-slate-300"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{provider.icon}</span>
                          <div>
                            <h3 className="font-semibold text-slate-900 mb-1">{provider.label}</h3>
                            <p className="text-sm text-slate-500">{provider.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region" className="text-base">Deployment Region</Label>
                  <Input
                    id="region"
                    placeholder="us-east-1"
                    value={formData.deployment_region}
                    onChange={(e) => setFormData({ ...formData, deployment_region: e.target.value })}
                    className="text-base p-6"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <Cloud className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Auto-scaling enabled</h4>
                      <p className="text-sm text-blue-700">
                        Your application will automatically scale based on demand with built-in load balancing and health checks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {currentStep === 6 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Review your application</h2>
                <p className="text-slate-500">Check everything before we create your project</p>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-slate-50 rounded-2xl">
                  <h3 className="font-semibold text-slate-900 mb-4">Project Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Name</p>
                      <p className="font-medium text-slate-900">{formData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Type</p>
                      <p className="font-medium text-slate-900 capitalize">{formData.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Template</p>
                      <p className="font-medium text-slate-900">
                        {TEMPLATES.find(t => t.id === formData.template)?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Cloud Provider</p>
                      <p className="font-medium text-slate-900 uppercase">{formData.cloud_provider}</p>
                    </div>
                  </div>
                </div>

                {formData.features.length > 0 && (
                  <div className="p-6 bg-slate-50 rounded-2xl">
                    <h3 className="font-semibold text-slate-900 mb-4">Selected Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((featureId) => {
                        const feature = FEATURES.find(f => f.id === featureId);
                        return (
                          <Badge key={featureId} className="bg-violet-100 text-violet-700">
                            {feature?.icon} {feature?.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}

                {formData.tech_stack.length > 0 && (
                  <div className="p-6 bg-slate-50 rounded-2xl">
                    <h3 className="font-semibold text-slate-900 mb-4">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.tech_stack.map((tech) => (
                        <Badge key={tech} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-emerald-900 mb-1">Ready to launch!</h4>
                      <p className="text-sm text-emerald-700">
                        Your application will be created as a draft. You can start building right away and deploy when ready.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Success */}
          {currentStep === 7 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <Rocket className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Application Created!</h2>
              <p className="text-lg text-slate-500 mb-6">
                Your project has been successfully created. Redirecting to project details...
              </p>
              <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        {currentStep <= 6 && (
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-10 py-6 text-base rounded-2xl border-2 hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Back
            </Button>

            <div className="flex gap-4">
              {currentStep < 6 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="px-10 py-6 text-base rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  Next <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleFinish}
                  disabled={createProjectMutation.isPending || !canProceed()}
                  className="px-10 py-6 text-base rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {createProjectMutation.isPending ? (
                    <>Creating...</>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5 mr-2" /> Create Application
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}