import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, GitCommit, User, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_DEPLOYMENTS = [
  {
    id: 1,
    version: "v2.5.0",
    environment: "production",
    status: "success",
    timestamp: "2 hours ago",
    duration: "3m 45s",
    commit: "a3f9d2c",
    author: "john@example.com",
    stages: [
      { name: "Build", status: "success" },
      { name: "Test", status: "success" },
      { name: "Deploy", status: "success" }
    ]
  },
  {
    id: 2,
    version: "v2.4.9",
    environment: "staging",
    status: "success",
    timestamp: "5 hours ago",
    duration: "2m 30s",
    commit: "b8e1f5a",
    author: "sarah@example.com",
    stages: [
      { name: "Build", status: "success" },
      { name: "Test", status: "success" },
      { name: "Deploy", status: "success" }
    ]
  },
  {
    id: 3,
    version: "v2.4.8",
    environment: "production",
    status: "failed",
    timestamp: "1 day ago",
    duration: "1m 20s",
    commit: "c7d3a1b",
    author: "mike@example.com",
    stages: [
      { name: "Build", status: "success" },
      { name: "Test", status: "failed" },
      { name: "Deploy", status: "pending" }
    ]
  },
  {
    id: 4,
    version: "v2.4.7",
    environment: "staging",
    status: "success",
    timestamp: "2 days ago",
    duration: "3m 10s",
    commit: "d9f2b4e",
    author: "john@example.com",
    stages: [
      { name: "Build", status: "success" },
      { name: "Test", status: "success" },
      { name: "Deploy", status: "success" }
    ]
  },
  {
    id: 5,
    version: "v2.4.6",
    environment: "production",
    status: "success",
    timestamp: "3 days ago",
    duration: "4m 05s",
    commit: "e1a5c3f",
    author: "sarah@example.com",
    stages: [
      { name: "Build", status: "success" },
      { name: "Test", status: "success" },
      { name: "Deploy", status: "success" }
    ]
  }
];

export default function DeploymentTimeline() {
  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getEnvColor = (env) => {
    return env === "production"
      ? "bg-purple-100 text-purple-700"
      : "bg-blue-100 text-blue-700";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          Deployment Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {MOCK_DEPLOYMENTS.map((deployment, index) => (
            <div key={deployment.id} className="relative">
              {index !== MOCK_DEPLOYMENTS.length - 1 && (
                <div className="absolute left-[21px] top-12 bottom-0 w-0.5 bg-slate-200" />
              )}
              
              <div className="flex gap-4">
                <div className="relative z-10 flex-shrink-0">
                  {getStatusIcon(deployment.status)}
                </div>

                <div className="flex-1 pb-6">
                  <div className="bg-white border-2 border-slate-200 rounded-xl p-4 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-slate-900">
                            {deployment.version}
                          </h4>
                          <Badge className={getEnvColor(deployment.environment)}>
                            {deployment.environment}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={cn(
                              deployment.status === "success" && "border-emerald-300 text-emerald-700",
                              deployment.status === "failed" && "border-red-300 text-red-700"
                            )}
                          >
                            {deployment.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {deployment.timestamp}
                          </div>
                          <div className="flex items-center gap-1">
                            <GitCommit className="w-4 h-4" />
                            {deployment.commit}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {deployment.author.split("@")[0]}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Duration</p>
                        <p className="font-semibold text-slate-900">{deployment.duration}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      {deployment.stages.map((stage, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          {idx > 0 && <ArrowRight className="w-3 h-3 text-slate-400" />}
                          <div
                            className={cn(
                              "px-3 py-1 rounded-lg text-xs font-medium",
                              stage.status === "success" && "bg-emerald-100 text-emerald-700",
                              stage.status === "failed" && "bg-red-100 text-red-700",
                              stage.status === "pending" && "bg-slate-100 text-slate-600"
                            )}
                          >
                            {stage.name}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Logs
                      </Button>
                      {deployment.status === "failed" && (
                        <Button size="sm" variant="outline">
                          Retry
                        </Button>
                      )}
                      {deployment.status === "success" && deployment.environment === "staging" && (
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          Promote to Production
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ArrowRight({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}