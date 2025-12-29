import { useState, useEffect } from "react";
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
  Store,
  Upload,
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
  CheckCircle2,
  Star,
  Search,
  Filter,
  X,
  Github,
  GitBranch,
  Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";
import RepositoryConnectModal from "@/components/builder/RepositoryConnectModal";
import PipelineStatus from "@/components/builder/PipelineStatus";
import TemplateMarketplace from "@/components/builder/TemplateMarketplace";
import PublishTemplateModal from "@/components/builder/PublishTemplateModal";
import AIIdeaAnalyzer from "@/components/builder/AIIdeaAnalyzer";
import CodeGenerator from "@/components/builder/CodeGenerator";
import TestingValidator from "@/components/builder/TestingValidator";
import CloudDeploymentWizard from "@/components/builder/CloudDeploymentWizard";
import PublishWizard from "@/components/builder/PublishWizard";
import AppAnalyticsDashboard from "@/components/analytics/AppAnalyticsDashboard";

const STEPS = [
  { id: 0, name: "Describe Idea", icon: Lightbulb },
  { id: 1, name: "Project Type", icon: Sparkles },
  { id: 2, name: "Template", icon: Palette },
  { id: 3, name: "Features", icon: Zap },
  { id: 4, name: "Generate Code", icon: Code },
  { id: 5, name: "Testing", icon: CheckCircle2 },
  { id: 6, name: "Deployment", icon: Cloud },
  { id: 7, name: "Publish", icon: Rocket }
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
  { 
    id: "ecommerce", 
    name: "E-Commerce", 
    icon: ShoppingCart, 
    description: "Online store with payments", 
    features: ["Product catalog", "Shopping cart", "Payment processing", "Order management"],
    category: "business",
    tags: ["store", "payments", "products", "retail"],
    preview: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"
  },
  { 
    id: "crm", 
    name: "CRM", 
    icon: Users, 
    description: "Customer relationship management", 
    features: ["Contact management", "Sales pipeline", "Email integration", "Reporting"],
    category: "business",
    tags: ["sales", "customers", "crm", "leads"],
    preview: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
  },
  { 
    id: "blog", 
    name: "Blog/CMS", 
    icon: FileText, 
    description: "Content management system", 
    features: ["Content editor", "SEO optimization", "Comments", "Media library"],
    category: "content",
    tags: ["blog", "cms", "content", "publishing"],
    preview: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop"
  },
  { 
    id: "booking", 
    name: "Booking System", 
    icon: Calendar, 
    description: "Appointments and scheduling", 
    features: ["Calendar", "Availability", "Notifications", "Payments"],
    category: "business",
    tags: ["appointments", "scheduling", "calendar", "reservations"],
    preview: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&h=400&fit=crop"
  },
  { 
    id: "social", 
    name: "Social Platform", 
    icon: MessageSquare, 
    description: "Community and social features", 
    features: ["User profiles", "Feed", "Messaging", "Notifications"],
    category: "social",
    tags: ["social", "community", "messaging", "networking"],
    preview: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop"
  },
  { 
    id: "dashboard", 
    name: "Analytics Dashboard", 
    icon: Database, 
    description: "Data visualization and reporting", 
    features: ["Charts", "KPIs", "Real-time data", "Exports"],
    category: "analytics",
    tags: ["analytics", "dashboard", "data", "reporting"],
    preview: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"
  },
  { 
    id: "portfolio", 
    name: "Portfolio", 
    icon: Palette, 
    description: "Showcase your work professionally", 
    features: ["Gallery", "Projects", "Contact form", "Testimonials"],
    category: "content",
    tags: ["portfolio", "showcase", "design", "creative"],
    preview: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop"
  },
  { 
    id: "saas", 
    name: "SaaS Platform", 
    icon: Cloud, 
    description: "Software as a service application", 
    features: ["Multi-tenancy", "Subscriptions", "Billing", "Admin panel"],
    category: "business",
    tags: ["saas", "subscription", "software", "enterprise"],
    preview: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"
  },
  { 
    id: "blank", 
    name: "Blank Canvas", 
    icon: Sparkles, 
    description: "Start from scratch", 
    features: [],
    category: "starter",
    tags: ["blank", "custom", "scratch"],
    preview: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=400&fit=crop"
  }
];

const CATEGORIES = [
  { value: "all", label: "All Templates", icon: "🎨" },
  { value: "business", label: "Business", icon: "💼" },
  { value: "content", label: "Content", icon: "📝" },
  { value: "social", label: "Social", icon: "👥" },
  { value: "analytics", label: "Analytics", icon: "📊" },
  { value: "starter", label: "Starter", icon: "⚡" }
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
  const [currentStep, setCurrentStep] = useState(0);
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
  
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRepoModal, setShowRepoModal] = useState(false);
  const [repository, setRepository] = useState(null);
  const [showPipeline, setShowPipeline] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [appDescription, setAppDescription] = useState("");
  const [generatedCode, setGeneratedCode] = useState(null);
  const [deploymentResult, setDeploymentResult] = useState(null);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("template_favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const toggleFavorite = (templateId) => {
    const newFavorites = favorites.includes(templateId)
      ? favorites.filter(id => id !== templateId)
      : [...favorites, templateId];
    setFavorites(newFavorites);
    localStorage.setItem("template_favorites", JSON.stringify(newFavorites));
  };

  const filteredTemplates = TEMPLATES.filter(template => {
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const favoriteTemplates = TEMPLATES.filter(t => favorites.includes(t.id));

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createProjectMutation = useMutation({
    mutationFn: (data) => base44.entities.Project.create(data),
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      
      setCurrentStep(11); // Success step
      setTimeout(() => {
        navigate(createPageUrl("ProjectDetails") + `?id=${project.id}`);
      }, 2000);
    }
  });

  const handleRepositoryConnect = (repoData) => {
    setRepository(repoData);
    setShowPipeline(true);
  };

  const handleNext = () => {
    if (currentStep < 7) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 0);
  };

  const handleAIAnalysisComplete = (analysisData) => {
    // Pre-fill form data based on AI analysis
    setAppDescription(analysisData.description);
    setFormData({
      ...formData,
      name: analysisData.suggested_name,
      description: analysisData.description,
      type: analysisData.app_type,
      template: analysisData.recommended_template,
      features: analysisData.key_features,
      tech_stack: analysisData.tech_recommendations
    });
    setCurrentStep(1); // Move to project type confirmation
  };

  const handleFinish = () => {
    const selectedTemplate = TEMPLATES.find(t => t.id === formData.template);
    
    createProjectMutation.mutate({
      name: formData.name,
      description: formData.description || `${selectedTemplate?.name || formData.type} application built with CloudForge`,
      type: formData.type,
      cloud_provider: formData.cloud_provider,
      deployment_region: formData.deployment_region,
      tech_stack: formData.tech_stack.length > 0 ? formData.tech_stack : ["React", "Node.js", "PostgreSQL"],
      status: "development",
      repository_url: repository?.repository_url || null,
      environments: [
        {
          name: "development",
          url: "",
          status: "active"
        },
        {
          name: "production", 
          url: "",
          status: "pending"
        }
      ],
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
      case 0: return false; // AI step handles its own navigation
      case 1: return formData.type && formData.name && formData.name.trim().length > 0;
      case 2: return formData.template;
      case 3: return true; // Features are optional
      case 4: return false; // Code generation handles its own navigation
      case 5: return false; // Testing handles its own navigation
      case 6: return formData.cloud_provider; // Deployment config required
      case 7: return formData.name && formData.type && formData.template && formData.cloud_provider;
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
          {/* Step 0: AI Idea Analyzer */}
          {currentStep === 0 && (
            <AIIdeaAnalyzer onAnalysisComplete={handleAIAnalysisComplete} />
          )}

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
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">
                  Choose a template
                </h2>
                <p className="text-lg text-slate-600">Start with a pre-built template or from scratch</p>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    placeholder="Search templates by name, description, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-10 py-6 text-base rounded-2xl border-2 focus:border-violet-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowMarketplace(true)}
                    variant="outline"
                    className="px-6 py-6 rounded-2xl border-2 hover:border-violet-500 hover:bg-violet-50"
                  >
                    <Store className="w-5 h-5 mr-2" /> Browse Marketplace
                  </Button>
                  {formData.template && (
                    <Button
                      onClick={() => setShowPublishModal(true)}
                      variant="outline"
                      className="px-6 py-6 rounded-2xl border-2 hover:border-emerald-500 hover:bg-emerald-50"
                    >
                      <Upload className="w-5 h-5 mr-2" /> Share Template
                    </Button>
                  )}
                </div>
              </div>

              {/* Category Filters */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={cn(
                      "flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 font-semibold text-sm whitespace-nowrap transition-all duration-300",
                      selectedCategory === category.value
                        ? "border-violet-500 bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-700 shadow-md"
                        : "border-slate-200 bg-white text-slate-600 hover:border-violet-300"
                    )}
                  >
                    <span className="text-lg">{category.icon}</span>
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Favorites Section */}
              {favoriteTemplates.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <h3 className="text-lg font-bold text-slate-900">Favorite Templates</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {favoriteTemplates.map((template) => {
                      const TemplateIcon = template.icon;
                      return (
                        <button
                          key={template.id}
                          onClick={() => setFormData({ ...formData, template: template.id })}
                          className={cn(
                            "group relative rounded-3xl border-2 text-left transition-all duration-500 hover:scale-105 overflow-hidden",
                            formData.template === template.id
                              ? "border-violet-500 shadow-2xl shadow-violet-200/50"
                              : "border-slate-200 bg-white hover:border-violet-300 hover:shadow-xl"
                          )}
                        >
                          <div className="relative h-36 overflow-hidden">
                            <img 
                              src={template.preview} 
                              alt={template.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(template.id);
                              }}
                              className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all"
                            >
                              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            </button>
                          </div>
                          <div className="p-5">
                            <div className="flex items-center gap-2 mb-2">
                              <TemplateIcon className="w-5 h-5 text-violet-600" />
                              <h3 className="text-lg font-bold text-slate-900">{template.name}</h3>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">{template.description}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {template.tags.slice(0, 3).map((tag, i) => (
                                <span key={i} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* All Templates */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedCategory === "all" ? "All Templates" : CATEGORIES.find(c => c.value === selectedCategory)?.label}
                  {searchQuery && ` (${filteredTemplates.length} results)`}
                </h3>
                {filteredTemplates.length === 0 ? (
                  <div className="text-center py-12">
                    <Filter className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No templates found matching your criteria</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredTemplates.map((template) => {
                      const TemplateIcon = template.icon;
                      const isFavorite = favorites.includes(template.id);
                      return (
                        <button
                          key={template.id}
                          onClick={() => setFormData({ ...formData, template: template.id })}
                          className={cn(
                            "group relative rounded-3xl border-2 text-left transition-all duration-500 hover:scale-105 overflow-hidden",
                            formData.template === template.id
                              ? "border-violet-500 shadow-2xl shadow-violet-200/50"
                              : "border-slate-200 bg-white hover:border-violet-300 hover:shadow-xl"
                          )}
                        >
                          <div className="relative h-36 overflow-hidden">
                            <img 
                              src={template.preview} 
                              alt={template.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(template.id);
                              }}
                              className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all"
                            >
                              <Star className={cn(
                                "w-4 h-4 transition-all",
                                isFavorite 
                                  ? "text-amber-500 fill-amber-500" 
                                  : "text-slate-400"
                              )} />
                            </button>
                            {formData.template === template.id && (
                              <div className="absolute top-3 left-3 px-3 py-1.5 bg-violet-600 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                                <Check className="w-3 h-3" /> Selected
                              </div>
                            )}
                          </div>
                          <div className="p-5">
                            <div className="flex items-center gap-2 mb-2">
                              <TemplateIcon className="w-5 h-5 text-violet-600" />
                              <h3 className="text-lg font-bold text-slate-900">{template.name}</h3>
                            </div>
                            <p className="text-sm text-slate-600 mb-3 line-clamp-2">{template.description}</p>
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {template.tags.slice(0, 3).map((tag, i) => (
                                <span key={i} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            {template.features.length > 0 && (
                              <div className="text-xs text-slate-500">
                                {template.features.length} features included
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
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

          {/* Step 4: Code Generation */}
          {currentStep === 4 && (
            <CodeGenerator 
              appDescription={appDescription || formData.description}
              formData={formData}
              onComplete={(code) => {
                setGeneratedCode(code);
                setCurrentStep(5);
              }}
            />
          )}

          {/* Step 5: Testing & Validation */}
          {currentStep === 5 && (
            <TestingValidator 
              appDescription={appDescription || formData.description}
              formData={formData}
              generatedCode={generatedCode}
              onComplete={() => setCurrentStep(6)}
            />
          )}

          {/* Step 6: Cloud Deployment & Repository */}
          {currentStep === 6 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">
                  Deployment Configuration
                </h2>
                <p className="text-lg text-slate-600">Configure cloud deployment and CI/CD (optional)</p>
              </div>

              <CloudDeploymentWizard 
                formData={formData}
                onUpdate={(data) => setFormData({ ...formData, ...data })}
              />

              <div className="border-t pt-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">CI/CD Pipeline (Optional)</h3>
                <p className="text-slate-600 mb-6">Connect a repository to enable automated deployments</p>
                
                {!repository?.connected ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setShowRepoModal(true)}
                      className="group p-6 rounded-2xl border-2 border-slate-200 hover:border-violet-500 bg-white hover:bg-gradient-to-br hover:from-violet-50 hover:to-indigo-50 transition-all duration-300 hover:shadow-lg"
                    >
                      <Github className="w-10 h-10 text-slate-700 mb-3 group-hover:text-violet-600 transition-colors" />
                      <h4 className="text-lg font-bold text-slate-900 mb-2">GitHub</h4>
                      <p className="text-sm text-slate-600">Connect GitHub for automated CI/CD</p>
                    </button>

                    <button
                      onClick={() => setShowRepoModal(true)}
                      className="group p-6 rounded-2xl border-2 border-slate-200 hover:border-violet-500 bg-white hover:bg-gradient-to-br hover:from-violet-50 hover:to-indigo-50 transition-all duration-300 hover:shadow-lg"
                    >
                      <GitBranch className="w-10 h-10 text-slate-700 mb-3 group-hover:text-violet-600 transition-colors" />
                      <h4 className="text-lg font-bold text-slate-900 mb-2">GitLab</h4>
                      <p className="text-sm text-slate-600">Connect GitLab for automated CI/CD</p>
                    </button>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      <h4 className="font-semibold text-emerald-900">Repository Connected</h4>
                    </div>
                    <div className="space-y-1 text-sm text-emerald-700">
                      <p><strong>Provider:</strong> {repository.provider}</p>
                      <p><strong>Repository:</strong> {repository.repository_url}</p>
                      <p><strong>Branch:</strong> {repository.branch}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 7: Publish & Review */}
          {currentStep === 7 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">
                  Review & Publish
                </h2>
                <p className="text-lg text-slate-600">Everything looks good? Let's create your application!</p>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl border-2 border-violet-200">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-violet-600" />
                    Project Details
                  </h3>
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
                        {TEMPLATES.find(t => t.id === formData.template)?.name || "Custom"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Cloud Provider</p>
                      <p className="font-medium text-slate-900 uppercase">{formData.cloud_provider}</p>
                    </div>
                  </div>
                </div>

                {formData.features.length > 0 && (
                  <div className="p-6 bg-white rounded-2xl border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4">Selected Features ({formData.features.length})</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((featureId) => {
                        const feature = FEATURES.find(f => f.id === featureId);
                        return (
                          <Badge key={featureId} className="bg-violet-100 text-violet-700 px-3 py-1">
                            {feature?.icon} {feature?.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}

                {formData.tech_stack.length > 0 && (
                  <div className="p-6 bg-white rounded-2xl border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.tech_stack.map((tech) => (
                        <Badge key={tech} variant="outline" className="px-3 py-1">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {deploymentResult && (
                  <div className="p-6 bg-white rounded-2xl border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4">Deployment Configuration</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Region:</strong> {formData.deployment_region}</p>
                      <p><strong>Environment:</strong> Production-ready</p>
                    </div>
                  </div>
                )}

                {repository?.connected && (
                  <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <h3 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      CI/CD Pipeline Configured
                    </h3>
                    <div className="space-y-2 text-sm text-emerald-700">
                      <p><strong>Provider:</strong> {repository.provider}</p>
                      <p><strong>Repository:</strong> {repository.repository_url}</p>
                      <p><strong>Branch:</strong> {repository.branch}</p>
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-8">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
                      <Rocket className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-emerald-900 mb-2">Ready to Launch! 🚀</h4>
                      <p className="text-emerald-700 mb-4">
                        Your application configuration is complete. Click "Create Application" to:
                      </p>
                      <ul className="text-sm text-emerald-700 space-y-1.5">
                        <li>✓ Create your project in the platform</li>
                        <li>✓ Set up the infrastructure on {formData.cloud_provider.toUpperCase()}</li>
                        <li>✓ Generate initial codebase with selected features</li>
                        {repository?.connected && <li>✓ Configure CI/CD pipeline for automated deployments</li>}
                        <li>✓ Make it accessible via your dashboard</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 11: Success */}
          {currentStep === 11 && (
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
        {currentStep > 0 && currentStep <= 7 && currentStep !== 4 && currentStep !== 5 && (
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0 || createProjectMutation.isPending}
              className="px-10 py-6 text-base rounded-2xl border-2 hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Back
            </Button>

            <div className="flex gap-4">
              {currentStep === 7 ? (
                <Button
                  onClick={handleFinish}
                  disabled={createProjectMutation.isPending || !canProceed()}
                  className="px-12 py-6 text-lg rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 font-semibold"
                >
                  {createProjectMutation.isPending ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Application...
                    </div>
                  ) : (
                    <>
                      <Rocket className="w-6 h-6 mr-2" /> Create Application
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed() || createProjectMutation.isPending}
                  className="px-10 py-6 text-base rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  Continue <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
            </div>
          </div>
        )}

        <RepositoryConnectModal
          open={showRepoModal}
          onClose={() => setShowRepoModal(false)}
          onConnect={handleRepositoryConnect}
          projectName={formData.name}
        />

        <TemplateMarketplace
          open={showMarketplace}
          onClose={() => setShowMarketplace(false)}
          onSelectTemplate={(template) => {
            setFormData({ 
              ...formData, 
              template: template.id,
              features: template.features || [],
              name: formData.name || template.name
            });
          }}
        />

        <PublishTemplateModal
          open={showPublishModal}
          onClose={() => setShowPublishModal(false)}
          templateData={{
            name: formData.name,
            preview: TEMPLATES.find(t => t.id === formData.template)?.preview,
            features: formData.features,
            ...formData
          }}
        />
      </div>
    </div>
  );
}