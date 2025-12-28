import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GitBranch, Clock, AlertCircle, CheckCircle2, Search, Database, Globe, Cpu } from "lucide-react";

const TRACES = [
  {
    id: "trace-001",
    operation: "POST /api/checkout",
    duration: 2450,
    spans: 12,
    status: "error",
    timestamp: "2025-12-28 14:32:15"
  },
  {
    id: "trace-002",
    operation: "GET /api/products",
    duration: 185,
    spans: 5,
    status: "success",
    timestamp: "2025-12-28 14:31:48"
  },
  {
    id: "trace-003",
    operation: "POST /api/users/signup",
    duration: 890,
    spans: 8,
    status: "success",
    timestamp: "2025-12-28 14:30:22"
  }
];

const TRACE_DETAILS = {
  spans: [
    { name: "API Gateway", service: "gateway", duration: 145, start: 0, type: "http", status: "success" },
    { name: "Auth Middleware", service: "auth", duration: 78, start: 145, type: "middleware", status: "success" },
    { name: "User Service", service: "user-svc", duration: 320, start: 223, type: "grpc", status: "success" },
    { name: "Database Query", service: "postgres", duration: 1200, start: 543, type: "database", status: "slow" },
    { name: "Payment Gateway", service: "stripe", duration: 680, start: 1743, type: "http", status: "error" },
    { name: "Cache Update", service: "redis", duration: 27, start: 2423, type: "cache", status: "success" }
  ]
};

export default function DistributedTracing() {
  const [selectedTrace, setSelectedTrace] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const getServiceIcon = (type) => {
    switch(type) {
      case "database": return Database;
      case "http": return Globe;
      case "cache": return Cpu;
      default: return GitBranch;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-blue-600" />
              Distributed Traces
            </CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search traces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {TRACES.map((trace) => (
              <button
                key={trace.id}
                onClick={() => setSelectedTrace(trace)}
                className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-blue-300 transition-all text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-slate-600">{trace.id}</span>
                    <span className="font-semibold text-slate-900">{trace.operation}</span>
                  </div>
                  <Badge className={
                    trace.status === "error" ? "bg-red-100 text-red-700" :
                    trace.status === "slow" ? "bg-amber-100 text-amber-700" :
                    "bg-emerald-100 text-emerald-700"
                  }>
                    {trace.status === "error" ? <AlertCircle className="w-3 h-3 mr-1" /> : <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {trace.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {trace.duration}ms
                  </span>
                  <span>{trace.spans} spans</span>
                  <span>{trace.timestamp}</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedTrace && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-violet-600" />
              Trace Details: {selectedTrace.id}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {TRACE_DETAILS.spans.map((span, i) => {
                const Icon = getServiceIcon(span.type);
                const widthPercent = (span.duration / 2450) * 100;
                const leftPercent = (span.start / 2450) * 100;

                return (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-900">{span.name}</span>
                        <Badge variant="outline" className="text-xs">{span.service}</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-600">{span.duration}ms</span>
                        <Badge className={
                          span.status === "error" ? "bg-red-100 text-red-700" :
                          span.status === "slow" ? "bg-amber-100 text-amber-700" :
                          "bg-emerald-100 text-emerald-700"
                        }>
                          {span.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="relative h-8 bg-slate-100 rounded-lg overflow-hidden">
                      <div
                        className={`absolute h-full rounded ${
                          span.status === "error" ? "bg-red-400" :
                          span.status === "slow" ? "bg-amber-400" :
                          "bg-blue-400"
                        }`}
                        style={{
                          left: `${leftPercent}%`,
                          width: `${widthPercent}%`
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-sm text-amber-900">
                <strong>Performance Issue Detected:</strong> Database query took 1,200ms (49% of total trace time). Consider adding indexes on frequently queried columns or implementing query result caching.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}