import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Layers, GitBranch, TestTube, Percent, RefreshCw, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const DEPLOYMENT_STRATEGIES = [
  {
    id: "rolling",
    name: "Rolling Deployment",
    icon: RefreshCw,
    description: "Gradually replace instances with new version",
    risk: "low",
    downtime: "zero",
    rollback: "automatic",
    features: [
      "Gradual instance replacement",
      "Zero downtime",
      "Easy rollback",
      "Default strategy"
    ]
  },
  {
    id: "blue-green",
    name: "Blue-Green Deployment",
    icon: Layers,
    description: "Deploy to parallel environment, then switch traffic",
    risk: "very-low",
    downtime: "zero",
    rollback: "instant",
    features: [
      "Two identical environments",
      "Instant traffic switching",
      "Immediate rollback",
      "Requires 2x resources"
    ]
  },
  {
    id: "canary",
    name: "Canary Release",
    icon: TestTube,
    description: "Deploy to small subset of users first",
    risk: "very-low",
    downtime: "zero",
    rollback: "automatic",
    features: [
      "Progressive traffic shift",
      "A/B testing capability",
      "Risk mitigation",
      "Automated monitoring"
    ]
  },
  {
    id: "recreate",
    name: "Recreate",
    icon: Zap,
    description: "Shut down old version, deploy new version",
    risk: "medium",
    downtime: "short",
    rollback: "manual",
    features: [
      "Simplest strategy",
      "Clean slate deployment",
      "Brief downtime",
      "Low resource usage"
    ]
  }
];

export default function DeploymentStrategySelector({ onSelect, currentStrategy = "rolling" }) {
  const [selectedStrategy, setSelectedStrategy] = useState(currentStrategy);
  const [canaryConfig, setCanaryConfig] = useState({
    initialTraffic: 10,
    incrementStep: 10,
    interval: 10,
    autoPromote: true
  });
  const [blueGreenConfig, setBlueGreenConfig] = useState({
    autoSwitch: false,
    testingPeriod: 30
  });

  const getRiskColor = (risk) => {
    const colors = {
      "very-low": "text-emerald-600 bg-emerald-100",
      "low": "text-blue-600 bg-blue-100",
      "medium": "text-amber-600 bg-amber-100",
      "high": "text-red-600 bg-red-100"
    };
    return colors[risk] || colors.medium;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-indigo-600" />
          Deployment Strategy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEPLOYMENT_STRATEGIES.map((strategy) => {
            const Icon = strategy.icon;
            const isSelected = selectedStrategy === strategy.id;
            
            return (
              <button
                key={strategy.id}
                onClick={() => {
                  setSelectedStrategy(strategy.id);
                  onSelect?.(strategy.id);
                }}
                className={cn(
                  "p-5 rounded-xl border-2 text-left transition-all hover:shadow-lg",
                  isSelected
                    ? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-violet-50 shadow-md"
                    : "border-slate-200 hover:border-indigo-300"
                )}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    isSelected ? "bg-indigo-100" : "bg-slate-100"
                  )}>
                    <Icon className={cn(
                      "w-5 h-5",
                      isSelected ? "text-indigo-600" : "text-slate-600"
                    )} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">{strategy.name}</h4>
                    <p className="text-xs text-slate-600">{strategy.description}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className={getRiskColor(strategy.risk) + " text-xs"}>
                    Risk: {strategy.risk}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {strategy.downtime} downtime
                  </Badge>
                </div>

                <ul className="text-xs text-slate-600 space-y-1">
                  {strategy.features.slice(0, 2).map((feature, i) => (
                    <li key={i} className="flex items-center gap-1">
                      <span className="text-indigo-600">•</span> {feature}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {/* Canary Configuration */}
        {selectedStrategy === "canary" && (
          <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl space-y-4">
            <h4 className="font-semibold text-blue-900 flex items-center gap-2">
              <Percent className="w-4 h-4" />
              Canary Configuration
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-slate-700">Initial Traffic %</Label>
                <Select 
                  value={canaryConfig.initialTraffic.toString()} 
                  onValueChange={(v) => setCanaryConfig({...canaryConfig, initialTraffic: parseInt(v)})}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 20, 25, 50].map(v => (
                      <SelectItem key={v} value={v.toString()}>{v}%</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm text-slate-700">Increment Step %</Label>
                <Select 
                  value={canaryConfig.incrementStep.toString()} 
                  onValueChange={(v) => setCanaryConfig({...canaryConfig, incrementStep: parseInt(v)})}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 20, 25, 50].map(v => (
                      <SelectItem key={v} value={v.toString()}>{v}%</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div>
                <p className="text-sm font-medium text-slate-900">Auto-promote on success</p>
                <p className="text-xs text-slate-600">Automatically promote if metrics pass</p>
              </div>
              <Switch
                checked={canaryConfig.autoPromote}
                onCheckedChange={(checked) => setCanaryConfig({...canaryConfig, autoPromote: checked})}
              />
            </div>
          </div>
        )}

        {/* Blue-Green Configuration */}
        {selectedStrategy === "blue-green" && (
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-4">
            <h4 className="font-semibold text-emerald-900 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Blue-Green Configuration
            </h4>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div>
                <p className="text-sm font-medium text-slate-900">Auto-switch traffic</p>
                <p className="text-xs text-slate-600">Automatically switch after testing period</p>
              </div>
              <Switch
                checked={blueGreenConfig.autoSwitch}
                onCheckedChange={(checked) => setBlueGreenConfig({...blueGreenConfig, autoSwitch: checked})}
              />
            </div>

            {blueGreenConfig.autoSwitch && (
              <div>
                <Label className="text-sm text-slate-700">Testing Period (minutes)</Label>
                <Select 
                  value={blueGreenConfig.testingPeriod.toString()} 
                  onValueChange={(v) => setBlueGreenConfig({...blueGreenConfig, testingPeriod: parseInt(v)})}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[15, 30, 60, 120].map(v => (
                      <SelectItem key={v} value={v.toString()}>{v} min</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}