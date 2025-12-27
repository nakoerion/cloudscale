import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, GitBranch } from "lucide-react";

const PROVIDERS = [
  { value: "github-actions", label: "GitHub Actions", icon: "⬛" },
  { value: "gitlab-ci", label: "GitLab CI", icon: "🦊" },
  { value: "jenkins", label: "Jenkins", icon: "🔧" },
  { value: "circleci", label: "CircleCI", icon: "⭕" },
  { value: "azure-devops", label: "Azure DevOps", icon: "🔷" }
];

const PIPELINE_TYPES = [
  { value: "ci", label: "CI Only", description: "Build and test only" },
  { value: "cd", label: "CD Only", description: "Deploy only" },
  { value: "ci-cd", label: "CI/CD", description: "Build, test, and deploy" }
];

const TRIGGERS = [
  { value: "push", label: "On Push" },
  { value: "pull_request", label: "On Pull Request" },
  { value: "schedule", label: "Scheduled" },
  { value: "manual", label: "Manual Only" }
];

export default function CreatePipelineModal({ open, onClose, onSubmit, projectId, isLoading }) {
  const [formData, setFormData] = useState({
    project_id: projectId,
    name: "",
    type: "ci-cd",
    provider: "github-actions",
    trigger: "push",
    branch: "main",
    status: "active",
    stages: [
      { name: "Build", status: "pending", duration: 0 },
      { name: "Test", status: "pending", duration: 0 },
      { name: "Deploy", status: "pending", duration: 0 }
    ],
    success_rate: 100,
    avg_duration: 0
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) return;
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Create CI/CD Pipeline
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Pipeline Name *</Label>
            <Input
              id="name"
              placeholder="production-deploy"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Provider */}
          <div className="space-y-2">
            <Label>CI/CD Provider</Label>
            <div className="grid grid-cols-2 gap-3">
              {PROVIDERS.map((provider) => (
                <button
                  key={provider.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, provider: provider.value })}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                    formData.provider === provider.value
                      ? "border-violet-500 bg-violet-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span className="text-xl">{provider.icon}</span>
                  <span className="font-medium text-slate-900">{provider.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>Pipeline Type</Label>
            <div className="grid grid-cols-3 gap-3">
              {PIPELINE_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.value })}
                  className={`p-3 rounded-xl border text-center transition-all ${
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

          {/* Branch & Trigger */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Input
                id="branch"
                placeholder="main"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Trigger</Label>
              <Select 
                value={formData.trigger}
                onValueChange={(value) => setFormData({ ...formData, trigger: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TRIGGERS.map((trigger) => (
                    <SelectItem key={trigger.value} value={trigger.value}>
                      {trigger.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
            Create Pipeline
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}