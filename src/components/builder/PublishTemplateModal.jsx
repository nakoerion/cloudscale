import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CATEGORIES = [
  { value: "business", label: "Business", icon: "💼" },
  { value: "content", label: "Content", icon: "📝" },
  { value: "social", label: "Social", icon: "👥" },
  { value: "analytics", label: "Analytics", icon: "📊" },
  { value: "starter", label: "Starter", icon: "⚡" }
];

export default function PublishTemplateModal({ open, onClose, templateData }) {
  const [formData, setFormData] = useState({
    name: templateData?.name || "",
    description: "",
    category: "starter",
    tags: [],
    preview_image: templateData?.preview || "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=400&fit=crop",
    features: templateData?.features || []
  });
  const [tagInput, setTagInput] = useState("");

  const queryClient = useQueryClient();

  const publishMutation = useMutation({
    mutationFn: async (data) => {
      const user = await base44.auth.me();
      return await base44.entities.CommunityTemplate.create({
        ...data,
        author_name: user.full_name || user.email.split('@')[0],
        author_email: user.email,
        template_config: templateData,
        status: "approved" // In production, would be "pending"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-templates"] });
      toast.success("Template published to marketplace!");
      onClose();
    },
    onError: () => {
      toast.error("Failed to publish template");
    }
  });

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim().toLowerCase()]
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handlePublish = () => {
    if (!formData.name || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }
    publishMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Upload className="w-6 h-6 text-violet-600" />
            Publish Template to Marketplace
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Share with the Community</h4>
                <p className="text-sm text-blue-700">
                  Your template will be reviewed and made available to all CloudForge users.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Template Name *</Label>
              <Input
                id="name"
                placeholder="My Awesome Template"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe what your template does and what problems it solves..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tags">Tags (for better discoverability)</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="tags"
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" onClick={handleAddTag} variant="outline">
                  Add
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="preview">Preview Image URL</Label>
              <Input
                id="preview"
                placeholder="https://..."
                value={formData.preview_image}
                onChange={(e) => setFormData({ ...formData, preview_image: e.target.value })}
                className="mt-2"
              />
              {formData.preview_image && (
                <img 
                  src={formData.preview_image} 
                  alt="Preview"
                  className="mt-3 w-full h-32 object-cover rounded-lg"
                />
              )}
            </div>

            {formData.features?.length > 0 && (
              <div>
                <Label>Included Features</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.features.map((feature, i) => (
                    <Badge key={i} variant="outline">{feature}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handlePublish}
            disabled={publishMutation.isPending}
            className="bg-violet-600 hover:bg-violet-700"
          >
            {publishMutation.isPending ? "Publishing..." : "Publish Template"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}