import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Save, 
  Play, 
  Zap,
  Mail,
  Database,
  Code,
  Bell,
  Cloud,
  GitBranch,
  Calendar,
  DollarSign,
  ArrowRight,
  Settings,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

const TRIGGERS = [
  { id: "form_submit", name: "Form Submitted", icon: Zap, color: "bg-violet-500" },
  { id: "schedule", name: "Schedule", icon: Calendar, color: "bg-blue-500" },
  { id: "webhook", name: "Webhook", icon: Cloud, color: "bg-green-500" },
  { id: "database", name: "Database Change", icon: Database, color: "bg-amber-500" }
];

const ACTIONS = [
  { id: "send_email", name: "Send Email", icon: Mail, color: "bg-red-500" },
  { id: "create_record", name: "Create Record", icon: Database, color: "bg-blue-500" },
  { id: "send_notification", name: "Send Notification", icon: Bell, color: "bg-purple-500" },
  { id: "call_api", name: "Call API", icon: Cloud, color: "bg-green-500" },
  { id: "run_code", name: "Run Code", icon: Code, color: "bg-slate-500" },
  { id: "payment", name: "Process Payment", icon: DollarSign, color: "bg-emerald-500" }
];

const CONDITIONS = [
  { id: "if", name: "If/Else", icon: GitBranch },
  { id: "filter", name: "Filter", icon: Settings },
  { id: "delay", name: "Delay", icon: Calendar }
];

export default function WorkflowAutomation() {
  const [workflows, setWorkflows] = useState([
    {
      id: 1,
      name: "Contact Form Automation",
      trigger: TRIGGERS[0],
      actions: [ACTIONS[0], ACTIONS[1]],
      active: true
    }
  ]);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: "",
    trigger: null,
    actions: []
  });

  const startNewWorkflow = () => {
    setNewWorkflow({ name: "", trigger: null, actions: [] });
    setIsBuilding(true);
  };

  const addAction = (action) => {
    setNewWorkflow({
      ...newWorkflow,
      actions: [...newWorkflow.actions, action]
    });
  };

  const saveWorkflow = () => {
    if (newWorkflow.name && newWorkflow.trigger) {
      setWorkflows([
        ...workflows,
        { ...newWorkflow, id: Date.now(), active: false }
      ]);
      setIsBuilding(false);
      setNewWorkflow({ name: "", trigger: null, actions: [] });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Workflow Automation</h1>
            <p className="text-slate-500">Automate business processes with visual workflows</p>
          </div>
          <Button onClick={startNewWorkflow} className="bg-violet-600 hover:bg-violet-700">
            <Plus className="w-4 h-4 mr-2" /> New Workflow
          </Button>
        </div>

        {isBuilding ? (
          /* Workflow Builder */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Build Your Workflow</h2>
              <Input
                placeholder="Workflow name (e.g., Send welcome email)"
                value={newWorkflow.name}
                onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                className="text-lg p-6 mb-6"
              />

              {/* Trigger Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  1. Choose a Trigger
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {TRIGGERS.map((trigger) => {
                    const Icon = trigger.icon;
                    const isSelected = newWorkflow.trigger?.id === trigger.id;
                    return (
                      <button
                        key={trigger.id}
                        onClick={() => setNewWorkflow({ ...newWorkflow, trigger })}
                        className={cn(
                          "p-6 rounded-2xl border-2 text-center transition-all",
                          isSelected
                            ? "border-violet-500 bg-violet-50 shadow-lg"
                            : "border-slate-200 hover:border-slate-300"
                        )}
                      >
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3", trigger.color)}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="font-medium text-slate-900">{trigger.name}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              {newWorkflow.trigger && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    2. Add Actions
                  </h3>
                  
                  {/* Workflow Visual */}
                  <div className="mb-6 p-6 bg-slate-50 rounded-2xl">
                    <div className="flex flex-col gap-3">
                      {/* Trigger */}
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", newWorkflow.trigger.color)}>
                          <newWorkflow.trigger.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 p-3 bg-white rounded-lg border border-slate-200">
                          <p className="font-medium text-slate-900">{newWorkflow.trigger.name}</p>
                          <p className="text-sm text-slate-500">When this happens</p>
                        </div>
                      </div>

                      {/* Actions */}
                      {newWorkflow.actions.map((action, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-center py-2">
                            <ArrowRight className="w-5 h-5 text-slate-400" />
                          </div>
                          <div className="flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", action.color)}>
                              <action.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 p-3 bg-white rounded-lg border border-slate-200">
                              <p className="font-medium text-slate-900">{action.name}</p>
                              <p className="text-sm text-slate-500">Action {index + 1}</p>
                            </div>
                            <button
                              onClick={() => {
                                setNewWorkflow({
                                  ...newWorkflow,
                                  actions: newWorkflow.actions.filter((_, i) => i !== index)
                                });
                              }}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Add Action Button */}
                      <div className="flex items-center justify-center py-2">
                        <Plus className="w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  {/* Available Actions */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {ACTIONS.map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.id}
                          onClick={() => addAction(action)}
                          className="p-4 rounded-xl border border-slate-200 hover:border-violet-500 hover:bg-violet-50 transition-all text-center"
                        >
                          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2", action.color)}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <p className="text-sm font-medium text-slate-900">{action.name}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
              <Button variant="outline" onClick={() => setIsBuilding(false)}>
                Cancel
              </Button>
              <Button 
                onClick={saveWorkflow}
                disabled={!newWorkflow.name || !newWorkflow.trigger}
                className="bg-violet-600 hover:bg-violet-700"
              >
                <Save className="w-4 h-4 mr-2" /> Save Workflow
              </Button>
            </div>
          </div>
        ) : (
          /* Workflow List */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{workflow.name}</h3>
                    <Badge className={workflow.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}>
                      {workflow.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <Button size="icon" variant="ghost">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3 mb-4">
                  {/* Trigger */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", workflow.trigger.color)}>
                      <workflow.trigger.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{workflow.trigger.name}</p>
                      <p className="text-xs text-slate-500">Trigger</p>
                    </div>
                  </div>

                  {/* Actions Count */}
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <ArrowRight className="w-4 h-4" />
                    <span>{workflow.actions.length} action{workflow.actions.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Play className="w-3 h-3 mr-1" /> Test
                  </Button>
                  <Button size="sm" className="flex-1 bg-violet-600 hover:bg-violet-700">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Templates */}
        {!isBuilding && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Workflow Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Welcome Email", desc: "Send email when user signs up", trigger: "User Registration" },
                { name: "Order Confirmation", desc: "Notify customer after purchase", trigger: "Payment Successful" },
                { name: "Daily Report", desc: "Send analytics report daily", trigger: "Schedule: Daily 9AM" }
              ].map((template, i) => (
                <button
                  key={i}
                  className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-violet-500 hover:shadow-lg transition-all text-left"
                >
                  <Zap className="w-8 h-8 text-violet-600 mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-slate-500 mb-3">{template.desc}</p>
                  <Badge variant="outline" className="text-xs">{template.trigger}</Badge>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}