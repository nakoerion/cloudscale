import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Trash2,
  Clock,
  Repeat,
  Filter,
  Link2,
  ArrowDownRight,
  Brain,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import NodeConfigModal from "@/components/workflow/NodeConfigModal";
import AIWorkflowAnalyzer from "@/components/workflow/AIWorkflowAnalyzer";
import AIAutomationBuilder from "@/components/workflow/AIAutomationBuilder";
import UserBehaviorPatterns from "@/components/workflow/UserBehaviorPatterns";

const TRIGGERS = [
  { id: "form_submit", name: "Form Submitted", icon: Zap, color: "bg-violet-500" },
  { id: "schedule", name: "Schedule", icon: Calendar, color: "bg-blue-500" },
  { id: "webhook", name: "Webhook", icon: Cloud, color: "bg-green-500" },
  { id: "database", name: "Database Change", icon: Database, color: "bg-amber-500" }
];

const ACTIONS = [
  { id: "send_email", name: "Send Email", icon: Mail, color: "bg-red-500", category: "action" },
  { id: "create_record", name: "Create Record", icon: Database, color: "bg-blue-500", category: "action" },
  { id: "send_notification", name: "Send Notification", icon: Bell, color: "bg-purple-500", category: "action" },
  { id: "call_api", name: "Call API", icon: Cloud, color: "bg-green-500", category: "action" },
  { id: "run_code", name: "Run Code", icon: Code, color: "bg-slate-500", category: "action" },
  { id: "payment", name: "Process Payment", icon: DollarSign, color: "bg-emerald-500", category: "action" }
];

const LOGIC_NODES = [
  { id: "condition", name: "If/Else", icon: GitBranch, color: "bg-indigo-500", category: "logic" },
  { id: "loop", name: "Loop", icon: Repeat, color: "bg-pink-500", category: "logic" },
  { id: "delay", name: "Delay", icon: Clock, color: "bg-amber-500", category: "logic" },
  { id: "filter", name: "Filter", icon: Filter, color: "bg-cyan-500", category: "logic" }
];

export default function WorkflowAutomation() {
  const [workflows, setWorkflows] = useState([
    {
      id: 1,
      name: "Contact Form Automation",
      trigger: TRIGGERS[0],
      nodes: [
        { ...ACTIONS[0], nodeId: "n1" },
        { ...LOGIC_NODES[0], nodeId: "n2", config: { condition: "email contains '@business.com'" } },
        { ...ACTIONS[1], nodeId: "n3", branch: "true" }
      ],
      active: true
    }
  ]);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: "",
    trigger: null,
    nodes: []
  });
  const [configNode, setConfigNode] = useState(null);
  const [activeTab, setActiveTab] = useState("workflows");

  const startNewWorkflow = () => {
    setNewWorkflow({ name: "", trigger: null, nodes: [] });
    setIsBuilding(true);
  };

  const addNode = (nodeTemplate) => {
    const newNode = {
      ...nodeTemplate,
      nodeId: `node-${Date.now()}`,
      config: getDefaultConfig(nodeTemplate.id)
    };
    setNewWorkflow({
      ...newWorkflow,
      nodes: [...newWorkflow.nodes, newNode]
    });
  };

  const getDefaultConfig = (nodeType) => {
    const configs = {
      condition: { field: "status", operator: "equals", value: "", trueBranch: [], falseBranch: [] },
      loop: { type: "forEach", source: "items", maxIterations: 100 },
      delay: { duration: 5, unit: "minutes" },
      filter: { field: "", operator: "equals", value: "" },
      call_api: { method: "POST", url: "", headers: {}, body: "" },
      send_email: { to: "", subject: "", body: "" },
      create_record: { entity: "", data: {} },
      run_code: { code: "// Your code here" }
    };
    return configs[nodeType] || {};
  };

  const updateNodeConfig = (nodeId, config) => {
    setNewWorkflow({
      ...newWorkflow,
      nodes: newWorkflow.nodes.map(node =>
        node.nodeId === nodeId ? { ...node, config } : node
      )
    });
    setConfigNode(null);
  };

  const deleteNode = (nodeId) => {
    setNewWorkflow({
      ...newWorkflow,
      nodes: newWorkflow.nodes.filter(node => node.nodeId !== nodeId)
    });
  };

  const saveWorkflow = () => {
    if (newWorkflow.name && newWorkflow.trigger) {
      setWorkflows([
        ...workflows,
        { ...newWorkflow, id: Date.now(), active: false }
      ]);
      setIsBuilding(false);
      setNewWorkflow({ name: "", trigger: null, nodes: [] });
    }
  };

  const handleCreateWorkflow = (workflow) => {
    setWorkflows([
      ...workflows,
      { ...workflow, id: Date.now(), active: false, nodes: workflow.nodes || [] }
    ]);
    toast.success(`Workflow "${workflow.name}" created!`);
  };

  const handleCreateAutomation = (pattern) => {
    toast.success("Automation created from pattern!");
  };

  const renderNode = (node, index, branch = null) => {
    const Icon = node.icon;
    const isCondition = node.category === "logic" && node.id === "condition";

    return (
      <div key={node.nodeId} className={cn(branch && "ml-12")}>
        {index > 0 && (
          <div className="flex items-center justify-center py-2">
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </div>
        )}
        <div className="flex items-center gap-3">
          {branch && (
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <ArrowDownRight className="w-4 h-4" />
              <span className={cn(
                "px-2 py-1 rounded",
                branch === "true" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
              )}>
                {branch === "true" ? "TRUE" : "FALSE"}
              </span>
            </div>
          )}
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", node.color)}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 p-3 bg-white rounded-lg border border-slate-200">
            <p className="font-medium text-slate-900">{node.name}</p>
            <p className="text-xs text-slate-500">
              {node.category === "logic" ? "Logic" : "Action"} • 
              {node.config && Object.keys(node.config).length > 0 && " Configured"}
            </p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setConfigNode(node)}
          >
            <Settings className="w-4 h-4" />
          </Button>
          <button
            onClick={() => deleteNode(node.nodeId)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              Workflow Automation
              <Badge className="bg-purple-100 text-purple-700">
                <Brain className="w-3 h-3 mr-1" /> AI-Powered
              </Badge>
            </h1>
            <p className="text-slate-500">Build intelligent workflows with AI analysis and automation</p>
          </div>
          <Button onClick={startNewWorkflow} className="bg-violet-600 hover:bg-violet-700">
            <Plus className="w-4 h-4 mr-2" /> New Workflow
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={isBuilding ? "builder" : activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-white border border-slate-200 p-1 rounded-xl">
            <TabsTrigger value="workflows" className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700">
              <GitBranch className="w-4 h-4 mr-2" /> My Workflows
            </TabsTrigger>
            <TabsTrigger value="analysis" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <Activity className="w-4 h-4 mr-2" /> AI Analysis
            </TabsTrigger>
            <TabsTrigger value="builder" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              <Zap className="w-4 h-4 mr-2" /> AI Builder
            </TabsTrigger>
            <TabsTrigger value="patterns" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">
              <Brain className="w-4 h-4 mr-2" /> Behavior Patterns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workflows">
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

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      {workflow.nodes?.filter(n => n.category === "action").length || 0} actions
                    </span>
                    <span className="text-slate-500">
                      {workflow.nodes?.filter(n => n.category === "logic").length || 0} logic nodes
                    </span>
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

            <div className="mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Advanced Workflow Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: "Lead Scoring", desc: "Score leads with conditional logic", features: ["If/Else", "API Calls"] },
                  { name: "Auto-Responder", desc: "Send personalized emails with delays", features: ["Delay", "Loops"] },
                  { name: "Data Sync", desc: "Sync records between systems", features: ["Loops", "API Integration"] }
                ].map((template, i) => (
                  <button
                    key={i}
                    className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-violet-500 hover:shadow-lg transition-all text-left"
                  >
                    <GitBranch className="w-8 h-8 text-violet-600 mb-3" />
                    <h3 className="font-semibold text-slate-900 mb-2">{template.name}</h3>
                    <p className="text-sm text-slate-500 mb-3">{template.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {template.features.map((feature, j) => (
                        <Badge key={j} variant="outline" className="text-xs">{feature}</Badge>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis">
            <AIWorkflowAnalyzer 
              workflow={workflows[0] || { name: "Sample Workflow" }}
              analytics={{
                execution_count: 1247,
                avg_execution_time: 45,
                success_rate: 94.5
              }}
            />
          </TabsContent>

          <TabsContent value="builder">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AIAutomationBuilder onCreateWorkflow={handleCreateWorkflow} />
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">AI Recommendations</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-white rounded-xl border border-purple-200">
                    <p className="font-medium text-slate-900 mb-1">Auto-assign Support Tickets</p>
                    <p className="text-sm text-slate-600 mb-2">Based on sentiment and category</p>
                    <Badge className="bg-emerald-100 text-emerald-700">High Impact</Badge>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-purple-200">
                    <p className="font-medium text-slate-900 mb-1">Onboarding Automation</p>
                    <p className="text-sm text-slate-600 mb-2">Guide new users through setup</p>
                    <Badge className="bg-blue-100 text-blue-700">Medium Impact</Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="patterns">
            <UserBehaviorPatterns onCreateAutomation={handleCreateAutomation} />
          </TabsContent>
        </Tabs>

        {isBuilding && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Build Your Workflow</h2>
              <Input
                placeholder="Workflow name (e.g., Lead scoring and routing)"
                value={newWorkflow.name}
                onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                className="text-lg p-6 mb-6"
              />

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Choose a Trigger</h3>
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
                          isSelected ? "border-violet-500 bg-violet-50 shadow-lg" : "border-slate-200 hover:border-slate-300"
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

              {newWorkflow.trigger && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Build Your Workflow</h3>
                  <div className="mb-6 p-6 bg-slate-50 rounded-2xl max-h-[500px] overflow-y-auto">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", newWorkflow.trigger.color)}>
                          <newWorkflow.trigger.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 p-3 bg-white rounded-lg border border-slate-200">
                          <p className="font-medium text-slate-900">{newWorkflow.trigger.name}</p>
                          <p className="text-sm text-slate-500">When this happens</p>
                        </div>
                      </div>
                      {newWorkflow.nodes.map((node, index) => renderNode(node, index + 1))}
                      <div className="flex items-center justify-center py-2">
                        <Plus className="w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-3">Logic & Control</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {LOGIC_NODES.map((node) => {
                          const Icon = node.icon;
                          return (
                            <button key={node.id} onClick={() => addNode(node)} className="p-4 rounded-xl border border-slate-200 hover:border-violet-500 hover:bg-violet-50 transition-all text-left">
                              <div className="flex items-center gap-3">
                                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", node.color)}>
                                  <Icon className="w-5 h-5 text-white" />
                                </div>
                                <p className="text-sm font-medium text-slate-900">{node.name}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-3">Actions</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {ACTIONS.map((action) => {
                          const Icon = action.icon;
                          return (
                            <button key={action.id} onClick={() => addNode(action)} className="p-4 rounded-xl border border-slate-200 hover:border-violet-500 hover:bg-violet-50 transition-all text-left">
                              <div className="flex items-center gap-3">
                                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", action.color)}>
                                  <Icon className="w-5 h-5 text-white" />
                                </div>
                                <p className="text-sm font-medium text-slate-900">{action.name}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
              <Button variant="outline" onClick={() => setIsBuilding(false)}>Cancel</Button>
              <Button onClick={saveWorkflow} disabled={!newWorkflow.name || !newWorkflow.trigger} className="bg-violet-600 hover:bg-violet-700">
                <Save className="w-4 h-4 mr-2" /> Save Workflow
              </Button>
            </div>
          </div>
        )}

      </div>

      {/* Node Configuration Modal */}
      {configNode && (
        <NodeConfigModal
          node={configNode}
          onSave={(config) => updateNodeConfig(configNode.nodeId, config)}
          onClose={() => setConfigNode(null)}
        />
      )}
    </div>
  );
}