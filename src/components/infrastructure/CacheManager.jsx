import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, Plus, Settings, TrendingUp, Clock, HardDrive } from "lucide-react";
import { toast } from "sonner";

const MOCK_CACHES = [
  {
    id: 1,
    name: "production-redis",
    engine: "Redis 7.0",
    nodeType: "cache.t3.medium",
    status: "available",
    nodes: 2,
    hitRate: 94.5,
    memory: 75,
    connections: 145,
    evictions: 23,
    endpoint: "prod-redis.abc123.cache.amazonaws.com:6379"
  },
  {
    id: 2,
    name: "session-cache",
    engine: "Redis 7.0",
    nodeType: "cache.t3.small",
    status: "available",
    nodes: 1,
    hitRate: 98.2,
    memory: 45,
    connections: 67,
    evictions: 5,
    endpoint: "session-redis.xyz789.cache.amazonaws.com:6379"
  }
];

export default function CacheManager() {
  const [caches, setCaches] = useState(MOCK_CACHES);

  const handleFlushCache = (cache) => {
    toast.success(`Flushing ${cache.name}...`);
  };

  const handleScaleCluster = (cache) => {
    toast.success(`Scaling ${cache.name} cluster...`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-600" />
            ElastiCache Management
          </CardTitle>
          <Button 
            onClick={() => toast.success("Creating new cache cluster...")}
            size="sm"
            className="bg-amber-600 hover:bg-amber-700"
          >
            <Plus className="w-4 h-4 mr-2" /> Create Cluster
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {caches.map((cache) => (
          <div key={cache.id} className="border-2 border-slate-200 rounded-xl p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">{cache.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-mono">
                    {cache.engine}
                  </Badge>
                  <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                    {cache.status}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {cache.nodes} nodes
                  </Badge>
                </div>
              </div>
              <Button size="icon" variant="ghost">
                <Settings className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Node Type</p>
                <p className="font-semibold text-slate-900">{cache.nodeType}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                  <p className="text-xs text-emerald-600">Hit Rate</p>
                </div>
                <p className="font-semibold text-emerald-700">{cache.hitRate}%</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 mb-1">Connections</p>
                <p className="font-semibold text-blue-700">{cache.connections}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <p className="text-xs text-amber-600 mb-1">Evictions</p>
                <p className="font-semibold text-amber-700">{cache.evictions}/hr</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Memory Usage</span>
                <span className="text-sm font-semibold text-slate-900">{cache.memory}%</span>
              </div>
              <Progress value={cache.memory} className="h-2" />
            </div>

            <div className="mb-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Primary Endpoint</p>
              <p className="text-xs font-mono text-slate-700">{cache.endpoint}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleScaleCluster(cache)}
              >
                <HardDrive className="w-3 h-3 mr-1" /> Scale Cluster
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleFlushCache(cache)}
              >
                <Zap className="w-3 h-3 mr-1" /> Flush Cache
              </Button>
              <Button 
                size="sm" 
                variant="outline"
              >
                <Clock className="w-3 h-3 mr-1" /> Backup
              </Button>
            </div>
          </div>
        ))}

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <h4 className="font-semibold text-amber-900 mb-2">Performance Optimization</h4>
          <p className="text-sm text-amber-800 mb-3">
            Redis clusters are configured with automatic failover and read replicas for high availability.
          </p>
          <Button size="sm" variant="outline">
            View Performance Metrics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}