import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Plus, Trash2, CheckCircle2, AlertCircle, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const RECORD_TYPES = ["A", "AAAA", "CNAME", "MX", "TXT"];

export default function DNSManager({ domain }) {
  const [records, setRecords] = useState([
    { id: 1, type: "A", name: "@", value: "192.168.1.1", ttl: 3600, status: "active" },
    { id: 2, type: "CNAME", name: "www", value: domain, ttl: 3600, status: "active" },
    { id: 3, type: "TXT", name: "@", value: "v=spf1 include:_spf.google.com ~all", ttl: 3600, status: "active" }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecord, setNewRecord] = useState({
    type: "A",
    name: "",
    value: "",
    ttl: 3600
  });

  const addRecord = () => {
    if (!newRecord.name || !newRecord.value) {
      toast.error("Please fill in all fields");
      return;
    }

    setRecords([...records, {
      id: Date.now(),
      ...newRecord,
      status: "pending"
    }]);
    setNewRecord({ type: "A", name: "", value: "", ttl: 3600 });
    setShowAddForm(false);
    toast.success("DNS record added");
  };

  const deleteRecord = (id) => {
    setRecords(records.filter(r => r.id !== id));
    toast.success("DNS record deleted");
  };

  const copyValue = (value) => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            DNS Records
          </CardTitle>
          <Button onClick={() => setShowAddForm(!showAddForm)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Record
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddForm && (
          <div className="p-4 bg-slate-50 rounded-xl space-y-3 border-2 border-blue-200">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Type</Label>
                <select
                  value={newRecord.type}
                  onChange={(e) => setNewRecord({...newRecord, type: e.target.value})}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                >
                  {RECORD_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>TTL (seconds)</Label>
                <Input
                  type="number"
                  value={newRecord.ttl}
                  onChange={(e) => setNewRecord({...newRecord, ttl: parseInt(e.target.value)})}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label>Name</Label>
              <Input
                placeholder="@ or subdomain"
                value={newRecord.name}
                onChange={(e) => setNewRecord({...newRecord, name: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Value</Label>
              <Input
                placeholder="IP address or hostname"
                value={newRecord.value}
                onChange={(e) => setNewRecord({...newRecord, value: e.target.value})}
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={addRecord} className="flex-1">Add Record</Button>
              <Button onClick={() => setShowAddForm(false)} variant="outline">Cancel</Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {records.map((record) => (
            <div key={record.id} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
              <Badge variant="outline" className="font-mono">{record.type}</Badge>
              <div className="flex-1 grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-slate-500">Name:</span> 
                  <span className="font-mono ml-1">{record.name}</span>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <span className="text-slate-500">Value:</span> 
                  <span className="font-mono truncate">{record.value}</span>
                  <button onClick={() => copyValue(record.value)} className="text-slate-400 hover:text-slate-600">
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <Badge className={cn(
                record.status === "active" && "bg-emerald-100 text-emerald-700",
                record.status === "pending" && "bg-amber-100 text-amber-700"
              )}>
                {record.status === "active" ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                {record.status}
              </Badge>
              <button onClick={() => deleteRecord(record.id)} className="text-red-500 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}