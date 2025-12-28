import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database, Plus, Settings, Copy, Trash2, Activity, HardDrive, Clock } from "lucide-react";
import { toast } from "sonner";

const MOCK_DATABASES = [
  {
    id: 1,
    name: "production-db",
    engine: "postgresql",
    version: "15.3",
    instance: "db.t3.medium",
    status: "available",
    storage: "100 GB",
    connections: 24,
    cpu: 15,
    backupEnabled: true,
    endpoint: "prod-db.abc123.us-east-1.rds.amazonaws.com:5432"
  },
  {
    id: 2,
    name: "staging-db",
    engine: "postgresql",
    version: "15.3",
    instance: "db.t3.small",
    status: "available",
    storage: "50 GB",
    connections: 8,
    cpu: 8,
    backupEnabled: true,
    endpoint: "stage-db.xyz789.us-east-1.rds.amazonaws.com:5432"
  }
];

export default function DatabaseManager() {
  const [databases, setDatabases] = useState(MOCK_DATABASES);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateDatabase = () => {
    toast.success("Database creation initiated. This may take 5-10 minutes.");
    setShowCreateModal(false);
  };

  const handleScaleInstance = (db) => {
    toast.success(`Scaling ${db.name} instance...`);
  };

  const handleEnableBackup = (db) => {
    toast.success(`Automated backups enabled for ${db.name}`);
  };

  const handleSnapshot = (db) => {
    toast.success(`Creating snapshot of ${db.name}...`);
  };

  const copyEndpoint = (endpoint) => {
    navigator.clipboard.writeText(endpoint);
    toast.success("Endpoint copied to clipboard");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            RDS Database Management
          </CardTitle>
          <Button 
            onClick={() => setShowCreateModal(true)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" /> Create Database
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {databases.map((db) => (
          <div key={db.id} className="border-2 border-slate-200 rounded-xl p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">{db.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-mono">
                    {db.engine} {db.version}
                  </Badge>
                  <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                    {db.status}
                  </Badge>
                </div>
              </div>
              <Button size="icon" variant="ghost">
                <Settings className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Instance Type</p>
                <p className="font-semibold text-slate-900">{db.instance}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Storage</p>
                <p className="font-semibold text-slate-900">{db.storage}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 mb-1">Connections</p>
                <p className="font-semibold text-blue-700">{db.connections}/100</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <p className="text-xs text-amber-600 mb-1">CPU Usage</p>
                <p className="font-semibold text-amber-700">{db.cpu}%</p>
              </div>
            </div>

            <div className="mb-4 p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-3">
                  <p className="text-xs text-slate-500 mb-1">Endpoint</p>
                  <p className="text-xs font-mono text-slate-700 truncate">{db.endpoint}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => copyEndpoint(db.endpoint)}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleScaleInstance(db)}
              >
                <Activity className="w-3 h-3 mr-1" /> Scale
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleSnapshot(db)}
              >
                <HardDrive className="w-3 h-3 mr-1" /> Snapshot
              </Button>
              {!db.backupEnabled && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleEnableBackup(db)}
                >
                  <Clock className="w-3 h-3 mr-1" /> Enable Backups
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-3 h-3 mr-1" /> Delete
              </Button>
            </div>
          </div>
        ))}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h4 className="font-semibold text-blue-900 mb-2">Automated Backups</h4>
          <p className="text-sm text-blue-800 mb-3">
            All databases have automated daily backups with 7-day retention. Point-in-time recovery available.
          </p>
          <Button size="sm" variant="outline">
            Manage Backup Policy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}