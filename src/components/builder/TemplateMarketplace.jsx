import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Store, 
  Star, 
  Download, 
  Search, 
  TrendingUp,
  Clock,
  Award,
  X,
  Filter,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import TemplateReviews from "./TemplateReviews";

const CATEGORIES = [
  { value: "all", label: "All", icon: "🎨" },
  { value: "business", label: "Business", icon: "💼" },
  { value: "content", label: "Content", icon: "📝" },
  { value: "social", label: "Social", icon: "👥" },
  { value: "analytics", label: "Analytics", icon: "📊" },
  { value: "starter", label: "Starter", icon: "⚡" }
];

export default function TemplateMarketplace({ open, onClose, onSelectTemplate }) {
  const [activeTab, setActiveTab] = useState("featured");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const queryClient = useQueryClient();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["community-templates", activeTab, selectedCategory],
    queryFn: async () => {
      const filters = { status: "approved" };
      const templates = await base44.entities.CommunityTemplate.filter(filters);
      
      // Sort based on active tab
      if (activeTab === "featured") {
        return templates.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
      } else if (activeTab === "popular") {
        return templates.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
      } else {
        return templates.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
      }
    },
    enabled: open
  });

  const downloadMutation = useMutation({
    mutationFn: async (templateId) => {
      const template = templates.find(t => t.id === templateId);
      await base44.entities.CommunityTemplate.update(templateId, {
        downloads: (template.downloads || 0) + 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-templates"] });
    }
  });

  const handleUseTemplate = (template) => {
    downloadMutation.mutate(template.id);
    onSelectTemplate(template);
    toast.success(`Using "${template.name}" template`);
    onClose();
  };

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Store className="w-6 h-6 text-violet-600" />
            Template Marketplace
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Search and Filters */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search community templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="featured" className="flex items-center gap-2">
                  <Award className="w-4 h-4" /> Featured
                </TabsTrigger>
                <TabsTrigger value="popular" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Popular
                </TabsTrigger>
                <TabsTrigger value="recent" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Recent
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-medium text-sm whitespace-nowrap transition-all",
                    selectedCategory === category.value
                      ? "border-violet-500 bg-violet-50 text-violet-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-violet-300"
                  )}
                >
                  <span>{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No templates found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="group bg-white rounded-2xl border-2 border-slate-200 hover:border-violet-300 hover:shadow-lg transition-all overflow-hidden cursor-pointer"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="relative h-32 overflow-hidden">
                    <img 
                      src={template.preview_image} 
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 mb-1">{template.name}</h3>
                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">{template.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-semibold text-slate-900">
                          {(template.average_rating || 0).toFixed(1)}
                        </span>
                        <span className="text-xs text-slate-500">
                          ({template.review_count || 0})
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500">
                        <Download className="w-3 h-3" />
                        <span className="text-xs">{template.downloads || 0}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.tags?.slice(0, 2).map((tag, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-slate-400">by {template.author_name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Template Details Modal */}
        {selectedTemplate && (
          <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedTemplate.name}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <img 
                  src={selectedTemplate.preview_image} 
                  alt={selectedTemplate.name}
                  className="w-full h-64 object-cover rounded-xl"
                />
                
                <p className="text-slate-600 text-lg">{selectedTemplate.description}</p>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span className="font-semibold text-lg">{(selectedTemplate.average_rating || 0).toFixed(1)}</span>
                    <span className="text-slate-500">({selectedTemplate.review_count || 0} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Download className="w-5 h-5" />
                    <span>{selectedTemplate.downloads || 0} downloads</span>
                  </div>
                </div>

                {selectedTemplate.features?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3 text-lg">Included Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.features.map((feature, i) => (
                        <Badge key={i} variant="outline" className="text-sm py-1.5 px-3">{feature}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between py-4 border-y">
                  <p className="text-sm text-slate-500">Created by <strong className="text-slate-700">{selectedTemplate.author_name}</strong></p>
                  <Button 
                    onClick={() => handleUseTemplate(selectedTemplate)}
                    className="bg-violet-600 hover:bg-violet-700"
                  >
                    <Download className="w-4 h-4 mr-2" /> Use Template
                  </Button>
                </div>

                {/* Reviews Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="w-5 h-5 text-violet-600" />
                    <h3 className="text-xl font-bold text-slate-900">Reviews</h3>
                  </div>
                  <TemplateReviews 
                    templateId={selectedTemplate.id} 
                    template={selectedTemplate}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}