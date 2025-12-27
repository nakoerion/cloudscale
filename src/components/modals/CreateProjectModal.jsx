import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Loader2 } from "lucide-react";

const PROJECT_TYPES = [
  { value: "no-code", label: "No-Code", description: "Build without writing code" },
  { value: "low-code", label: "Low-Code", description: "Visual builder with custom code" },
  { value: "full-code", label: "Full-Code", description: "Complete development freedom" },
  { value: "hybrid", label: "Hybrid", description: "Mix of visual and code" }
];

const CLOUD_PROVIDERS = [
  { value: "none", label: "None (Later)" },
  { value: "aws", label: "AWS" },
  { value: "azure", label: "Azure" },
  { value: "gcp", label: "Google Cloud" },
  { value: "alibaba", label: "Alibaba Cloud" },
  { value: "multi-cloud", label: "Multi-Cloud" }
];

const TECH_OPTIONS = [
  "React", "Vue", "Angular", "Node.js", "Python", "Docker", 
  "Kubernetes", "Terraform", "PostgreSQL", "MongoDB", "Redis"
];

export default function CreateProjectModal({ open, onClose, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "no-code",
    cloud_provider: "none",
    tech_stack: []
  });

  const handleTechToggle = (tech) => {
    setFormData(prev => ({
      ...prev,
      tech_stack: prev.tech_stack.includes(tech)
        ? prev.tech_stack.filter(t => t !== tech)
        : [...prev.tech_stack, tech]
    }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return;
    onSubmit({
      ...formData,
      status: "draft",
      metrics: {
        uptime: 100,
        requests_today: 0,
        avg_response_time: 0,
        error_rate: 0
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              placeholder="My Awesome Project"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What will this project do?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {/* Project Type */}
          <div className="space-y-2">
            <Label>Project Type</Label>
            <div className="grid grid-cols-2 gap-3">
              {PROJECT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.value })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    formData.type === type.value
                      ? "border-violet-500 bg-violet-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <p className="font-medium text-slate-900">{type.label}</p>
                  <p className="text-xs text-slate-500">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Cloud Provider */}
          <div className="space-y-2">
            <Label>Cloud Provider</Label>
            <Select 
              value={formData.cloud_provider}
              onValueChange={(value) => setFormData({ ...formData, cloud_provider: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CLOUD_PROVIDERS.map((provider) => (
                  <SelectItem key={provider.value} value={provider.value}>
                    {provider.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tech Stack */}
          <div className="space-y-2">
            <Label>Tech Stack (optional)</Label>
            <div className="flex flex-wrap gap-2">
              {TECH_OPTIONS.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => handleTechToggle(tech)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    formData.tech_stack.includes(tech)
                      ? "bg-violet-100 text-violet-700 border border-violet-200"
                      : "bg-slate-50 text-slate-600 border border-transparent hover:bg-slate-100"
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
            {formData.tech_stack.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {formData.tech_stack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="gap-1">
                    {tech}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => handleTechToggle(tech)} 
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!formData.name.trim() || isLoading}
            className="bg-violet-600 hover:bg-violet-700"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}