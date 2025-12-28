import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TrendingUp, Plus, Settings, Activity, Server } from "lucide-react";
import { toast } from "sonner";

const MOCK_SCALING_GROUPS = [
  {
    id: 1,
    name: "web-app-asg",
    minInstances: 2,
    maxInstances: 10,
    desiredInstances: 4,
    currentInstances: 4,
    instanceType: "t3.medium",
    enabled: true,
    targetCPU: 70,
    targetMemory: 80,
    scaleOutCooldown: 300,
    scaleInCooldown: 600,
    healthCheckGracePeriod: 300
  },
  {
    id: 2,
    name: "api-backend-asg",
    minInstances: 3,
    maxInstances: 20,
    desiredInstances: 6,
    currentInstances: 6,
    instanceType: "t3.large",
    enabled: true,
    targetCPU: 65,
    targetMemory: 75,
    scaleOutCooldown: 180,
    scaleInCooldown: 600,
    healthCheckGracePeriod: 180
  }
];

export default function AutoScalingManager() {
  const [scalingGroups, setScalingGroups] = useState(MOCK_SCALING_GROUPS);

  const handleToggleScaling = (id, enabled) => {
    setScalingGroups(scalingGroups.map(sg => 
      sg.id === id ? { ...sg, enabled } : sg
    ));
    toast.success(enabled ? "Auto-scaling enabled" : "Auto-scaling disabled");
  };

  const handleUpdatePolicy = (group) => {
    toast.success(`Updating scaling policy for ${group.name}...`);
  };

  const handleManualScale = (group) => {
    toast.success(`Manually adjusting instances for ${group.name}...`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-violet-600" />
            EC2 Auto Scaling Groups
          </CardTitle>
          <Button 
            onClick={() => toast.success("Creating new Auto Scaling Group...")}
            size="sm"
            className="bg-violet-600 hover:bg-violet-700"
          >
            <Plus className="w-4 h-4 mr-2" /> Create ASG
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {scalingGroups.map((group) => (
          <div key={group.id} className="border-2 border-slate-200 rounded-xl p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-slate-900">{group.name}</h3>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={group.enabled}
                      onCheckedChange={(enabled) => handleToggleScaling(group.id, enabled)}
                    />
                    <span className="text-sm text-slate-600">
                      {group.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs font-mono">
                  {group.instanceType}
                </Badge>
              </div>
              <Button size="icon" variant="ghost">
                <Settings className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Min Instances</p>
                <p className="font-semibold text-slate-900">{group.minInstances}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Max Instances</p>
                <p className="font-semibold text-slate-900">{group.maxInstances}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 mb-1">Desired</p>
                <p className="font-semibold text-blue-700">{group.desiredInstances}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <p className="text-xs text-emerald-600 mb-1">Current</p>
                <p className="font-semibold text-emerald-700">{group.currentInstances}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg mb-4">
              <h4 className="font-semibold text-slate-900 mb-3 text-sm">Scaling Policies</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-slate-600">Target CPU %</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Activity className="w-4 h-4 text-amber-500" />
                    <span className="font-semibold text-slate-900">{group.targetCPU}%</span>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-slate-600">Target Memory %</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Server className="w-4 h-4 text-blue-500" />
                    <span className="font-semibold text-slate-900">{group.targetMemory}%</span>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-slate-600">Scale Out Cooldown</Label>
                  <span className="block text-sm font-semibold text-slate-900 mt-1">
                    {group.scaleOutCooldown}s
                  </span>
                </div>
                <div>
                  <Label className="text-xs text-slate-600">Scale In Cooldown</Label>
                  <span className="block text-sm font-semibold text-slate-900 mt-1">
                    {group.scaleInCooldown}s
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleManualScale(group)}
              >
                <Server className="w-3 h-3 mr-1" /> Manual Scale
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleUpdatePolicy(group)}
              >
                <Settings className="w-3 h-3 mr-1" /> Update Policy
              </Button>
              <Button 
                size="sm" 
                variant="outline"
              >
                View Metrics
              </Button>
            </div>
          </div>
        ))}

        <div className="p-4 bg-violet-50 border border-violet-200 rounded-xl">
          <h4 className="font-semibold text-violet-900 mb-2">CloudWatch Integration</h4>
          <p className="text-sm text-violet-800 mb-3">
            Auto-scaling is triggered by CloudWatch metrics including CPU, memory, network, and custom application metrics.
          </p>
          <Button size="sm" variant="outline">
            Configure Alarms
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}