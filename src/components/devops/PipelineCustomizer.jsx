import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, GripVertical, Play, GitBranch, Calendar, FileCode } from "lucide-react";
import { toast } from "sonner";

const STAGE_TEMPLATES = [
  { id: "build", name: "Build", icon: "🔨", defaultDuration: 5 },
  { id: "test", name: "Test", icon: "🧪", defaultDuration: 10 },
  { id: "security", name: "Security Scan", icon: "🔒", defaultDuration: 3 },
  { id: "deploy", name: "Deploy", icon: "🚀", defaultDuration: 8 },
  { id: "smoke", name: "Smoke Test", icon: "💨", defaultDuration: 2 },
  { id: "approval", name: "Manual Approval", icon: "✋", defaultDuration: 0 }
];

const TRIGGER_OPTIONS = [
  { value: "push", label: "On Push", icon: GitBranch },
  { value: "pull_request", label: "On Pull Request", icon: GitBranch },
  { value: "schedule", label: "Scheduled", icon: Calendar },
  { value: "manual", label: "Manual", icon: Play }
];

export default function PipelineCustomizer({ pipeline, onSave }) {
  const [stages, setStages] = useState(pipeline?.stages || [
    { id: 1, name: "Build", duration: 5, commands: ["npm install", "npm run build"] },
    { id: 2, name: "Test", duration: 10, commands: ["npm test"] },
    { id: 3, name: "Deploy", duration: 8, commands: ["kubectl apply -f deployment.yaml"] }
  ]);
  const [trigger, setTrigger] = useState(pipeline?.trigger || "push");
  const [branch, setBranch] = useState(pipeline?.branch || "main");
  const [showAddStage, setShowAddStage] = useState(false);

  const addStage = (template) => {
    const newStage = {
      id: Date.now(),
      name: template.name,
      duration: template.defaultDuration,
      commands: []
    };
    setStages([...stages, newStage]);
    setShowAddStage(false);
  };

  const removeStage = (id) => {
    setStages(stages.filter(s => s.id !== id));
  };

  const updateStage = (id, field, value) => {
    setStages(stages.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSave = () => {
    const config = {
      stages,
      trigger,
      branch
    };
    onSave?.(config);
    toast.success("Pipeline configuration saved!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCode className="w-5 h-5 text-violet-600" />
          Pipeline Customizer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trigger Configuration */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-900">Trigger</label>
          <div className="grid grid-cols-2 gap-3">
            <Select value={trigger} onValueChange={setTrigger}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRIGGER_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Branch name"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            />
          </div>
        </div>

        {/* Pipeline Stages */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-900">Pipeline Stages</label>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddStage(!showAddStage)}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Stage
            </Button>
          </div>

          {showAddStage && (
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm font-medium text-slate-700 mb-3">Select a stage template:</p>
              <div className="grid grid-cols-3 gap-2">
                {STAGE_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => addStage(template)}
                    className="p-3 bg-white border border-slate-200 rounded-lg hover:border-violet-500 hover:bg-violet-50 transition-all text-left"
                  >
                    <div className="text-2xl mb-1">{template.icon}</div>
                    <div className="text-sm font-medium text-slate-900">{template.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            {stages.map((stage, index) => (
              <div key={stage.id} className="p-4 bg-white border border-slate-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <GripVertical className="w-5 h-5 text-slate-400 mt-1 cursor-move" />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <Input
                        value={stage.name}
                        onChange={(e) => updateStage(stage.id, 'name', e.target.value)}
                        className="w-48"
                      />
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Stage {index + 1}</Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeStage(stage.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span>Est. Duration:</span>
                      <Input
                        type="number"
                        value={stage.duration}
                        onChange={(e) => updateStage(stage.id, 'duration', parseInt(e.target.value))}
                        className="w-20 h-8"
                      />
                      <span>minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={handleSave} className="bg-violet-600 hover:bg-violet-700">
            Save Configuration
          </Button>
          <Button variant="outline" onClick={() => toast.info("Generating YAML...")}>
            Export YAML
          </Button>
          <Button variant="outline" onClick={() => toast.info("Testing pipeline...")}>
            Test Run
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}