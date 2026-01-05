import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { 
  Network, 
  Database, 
  Server, 
  HardDrive, 
  Zap,
  GitBranch,
  AlertCircle,
  Info,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

const RESOURCE_ICONS = {
  compute: Server,
  database: Database,
  storage: HardDrive,
  network: Zap,
  pipeline: GitBranch
};

const RESOURCE_COLORS = {
  compute: { bg: "bg-blue-100", border: "border-blue-400", text: "text-blue-700" },
  database: { bg: "bg-emerald-100", border: "border-emerald-400", text: "text-emerald-700" },
  storage: { bg: "bg-purple-100", border: "border-purple-400", text: "text-purple-700" },
  network: { bg: "bg-amber-100", border: "border-amber-400", text: "text-amber-700" },
  pipeline: { bg: "bg-indigo-100", border: "border-indigo-400", text: "text-indigo-700" }
};

export default function ResourceDependencyGraph({ deployments = [], pipelines = [] }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);
  const [dependencyMap, setDependencyMap] = useState(null);

  const analyzeWithAI = async () => {
    setAnalyzing(true);
    try {
      const deploymentsData = deployments.slice(0, 10).map(d => ({
        id: d.id,
        environment: d.environment,
        provider: d.cloud_provider,
        resources: d.resources
      }));

      const pipelinesData = pipelines.slice(0, 10).map(p => ({
        id: p.id,
        name: p.name,
        type: p.type,
        status: p.status
      }));

      const prompt = `Analyze these infrastructure resources and create a dependency map:

Deployments: ${JSON.stringify(deploymentsData, null, 2)}
Pipelines: ${JSON.stringify(pipelinesData, null, 2)}

Create a dependency graph in this JSON format:
{
  "nodes": [
    {
      "id": "<unique_id>",
      "name": "<resource_name>",
      "type": "<compute|database|storage|network|pipeline>",
      "status": "<healthy|warning|error>",
      "description": "<brief description>"
    }
  ],
  "edges": [
    {
      "from": "<node_id>",
      "to": "<node_id>",
      "type": "<depends_on|connects_to|deploys_to>",
      "strength": "<critical|high|medium|low>"
    }
  ],
  "impact_analysis": {
    "critical_nodes": ["<node_id>"],
    "recommendations": ["<recommendation>"]
  }
}

Include typical dependencies like:
- Pipelines deploying to compute instances
- Compute instances connecting to databases
- Applications using storage
- Load balancers routing to servers`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            nodes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  type: { type: "string" },
                  status: { type: "string" },
                  description: { type: "string" }
                }
              }
            },
            edges: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  from: { type: "string" },
                  to: { type: "string" },
                  type: { type: "string" },
                  strength: { type: "string" }
                }
              }
            },
            impact_analysis: {
              type: "object",
              properties: {
                critical_nodes: { type: "array", items: { type: "string" } },
                recommendations: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      });

      setDependencyMap(result);
      toast.success("Dependency analysis complete!");
    } catch (error) {
      toast.error("Failed to analyze dependencies");
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  const getNodePosition = (index, total) => {
    const radius = 200;
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    return {
      x: 300 + radius * Math.cos(angle) * zoom,
      y: 300 + radius * Math.sin(angle) * zoom
    };
  };

  const getEdgeColor = (strength) => {
    return {
      critical: "#ef4444",
      high: "#f97316",
      medium: "#eab308",
      low: "#94a3b8"
    }[strength] || "#94a3b8";
  };

  const nodes = dependencyMap?.nodes || [];
  const edges = dependencyMap?.edges || [];

  return (
    <Card className="border-2 border-violet-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Network className="w-5 h-5 text-violet-600" />
            Resource Dependency Map
          </span>
          <div className="flex items-center gap-2">
            <Button
              onClick={analyzeWithAI}
              disabled={analyzing}
              size="sm"
              className="bg-gradient-to-r from-violet-600 to-indigo-600"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze Dependencies
                </>
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!dependencyMap && !analyzing && (
          <div className="text-center py-12">
            <Network className="w-16 h-16 text-violet-300 mx-auto mb-4" />
            <p className="text-sm text-slate-600 mb-4">
              Generate an AI-powered dependency map of your infrastructure
            </p>
            <Button onClick={analyzeWithAI} variant="outline">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Dependency Map
            </Button>
          </div>
        )}

        {analyzing && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-violet-600 animate-spin mx-auto mb-4" />
            <p className="text-sm text-slate-600">Analyzing resource dependencies...</p>
          </div>
        )}

        {dependencyMap && (
          <div className="space-y-6">
            {/* Zoom Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm text-slate-600">{Math.round(zoom * 100)}%</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setZoom(Math.min(2, zoom + 0.2))}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
              <Badge className="bg-violet-100 text-violet-700">
                {nodes.length} Resources, {edges.length} Dependencies
              </Badge>
            </div>

            {/* Graph Visualization */}
            <div className="relative bg-slate-50 rounded-xl border-2 border-slate-200 overflow-hidden" style={{ height: "600px" }}>
              <svg className="w-full h-full">
                {/* Draw edges */}
                {edges.map((edge, i) => {
                  const fromNode = nodes.find(n => n.id === edge.from);
                  const toNode = nodes.find(n => n.id === edge.to);
                  if (!fromNode || !toNode) return null;
                  
                  const fromIndex = nodes.indexOf(fromNode);
                  const toIndex = nodes.indexOf(toNode);
                  const fromPos = getNodePosition(fromIndex, nodes.length);
                  const toPos = getNodePosition(toIndex, nodes.length);
                  
                  return (
                    <g key={i}>
                      <line
                        x1={fromPos.x}
                        y1={fromPos.y}
                        x2={toPos.x}
                        y2={toPos.y}
                        stroke={getEdgeColor(edge.strength)}
                        strokeWidth={edge.strength === 'critical' ? 3 : 2}
                        strokeDasharray={edge.type === 'connects_to' ? '5,5' : '0'}
                        opacity={0.6}
                      />
                      {/* Arrow */}
                      <polygon
                        points={`${toPos.x},${toPos.y} ${toPos.x - 8},${toPos.y - 5} ${toPos.x - 8},${toPos.y + 5}`}
                        fill={getEdgeColor(edge.strength)}
                        opacity={0.6}
                        transform={`rotate(${Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x) * 180 / Math.PI} ${toPos.x} ${toPos.y})`}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Draw nodes */}
              {nodes.map((node, i) => {
                const pos = getNodePosition(i, nodes.length);
                const colors = RESOURCE_COLORS[node.type] || RESOURCE_COLORS.compute;
                const Icon = RESOURCE_ICONS[node.type] || Server;
                const isCritical = dependencyMap.impact_analysis?.critical_nodes?.includes(node.id);

                return (
                  <div
                    key={node.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110 ${
                      selectedNode?.id === node.id ? 'scale-110 z-10' : ''
                    }`}
                    style={{ left: pos.x, top: pos.y }}
                    onClick={() => setSelectedNode(node)}
                  >
                    <div className={`relative p-4 rounded-xl border-2 ${colors.bg} ${colors.border} shadow-lg`}>
                      {isCritical && (
                        <div className="absolute -top-2 -right-2">
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                      )}
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        <p className="text-xs font-medium text-slate-700 bg-white px-2 py-1 rounded shadow-sm">
                          {node.name}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Node Details */}
            {selectedNode && (
              <div className="p-4 bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">{selectedNode.name}</h4>
                    <p className="text-sm text-slate-600">{selectedNode.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`capitalize ${
                      selectedNode.status === 'healthy' ? 'bg-emerald-100 text-emerald-700' :
                      selectedNode.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {selectedNode.status}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {selectedNode.type}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-slate-700 mb-1">Dependencies:</p>
                    <div className="flex flex-wrap gap-1">
                      {edges.filter(e => e.to === selectedNode.id).map((edge, i) => {
                        const fromNode = nodes.find(n => n.id === edge.from);
                        return fromNode ? (
                          <Badge key={i} variant="outline" className="text-xs">
                            ← {fromNode.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-700 mb-1">Dependents:</p>
                    <div className="flex flex-wrap gap-1">
                      {edges.filter(e => e.from === selectedNode.id).map((edge, i) => {
                        const toNode = nodes.find(n => n.id === edge.to);
                        return toNode ? (
                          <Badge key={i} variant="outline" className="text-xs">
                            {toNode.name} →
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Impact Analysis */}
            {dependencyMap.impact_analysis && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Impact Analysis</h4>
                </div>
                <div className="space-y-3">
                  {dependencyMap.impact_analysis.critical_nodes?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-2">Critical Resources:</p>
                      <div className="flex flex-wrap gap-2">
                        {dependencyMap.impact_analysis.critical_nodes.map((nodeId, i) => {
                          const node = nodes.find(n => n.id === nodeId);
                          return node ? (
                            <Badge key={i} className="bg-red-100 text-red-700">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {node.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                  {dependencyMap.impact_analysis.recommendations?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-2">Recommendations:</p>
                      <ul className="space-y-1">
                        {dependencyMap.impact_analysis.recommendations.map((rec, i) => (
                          <li key={i} className="text-sm text-blue-800 flex items-start gap-2">
                            <span>•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-red-500"></div>
                <span>Critical Dependency</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-orange-500"></div>
                <span>High Dependency</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-yellow-500"></div>
                <span>Medium Dependency</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-slate-400 border-dashed" style={{ borderTop: '2px dashed' }}></div>
                <span>Connection</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}