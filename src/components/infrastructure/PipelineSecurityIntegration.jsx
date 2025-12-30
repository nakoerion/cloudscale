import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, CheckCircle2, XCircle, Clock, Terminal } from "lucide-react";

const SCAN_RESULTS = [
  {
    id: 1,
    commit: "a3f2c1d",
    branch: "main",
    timestamp: "2 hours ago",
    status: "passed",
    issues: {
      critical: 0,
      high: 0,
      medium: 2,
      low: 3
    },
    duration: "45s"
  },
  {
    id: 2,
    commit: "b7e9a2f",
    branch: "feature/new-vpc",
    timestamp: "5 hours ago",
    status: "failed",
    issues: {
      critical: 1,
      high: 3,
      medium: 5,
      low: 2
    },
    duration: "52s"
  },
  {
    id: 3,
    commit: "c1d5e8a",
    branch: "main",
    timestamp: "1 day ago",
    status: "passed",
    issues: {
      critical: 0,
      high: 0,
      medium: 1,
      low: 4
    },
    duration: "41s"
  }
];

const STATUS_CONFIG = {
  passed: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100", label: "Passed" },
  failed: { icon: XCircle, color: "text-red-600", bg: "bg-red-100", label: "Failed" },
  scanning: { icon: Clock, color: "text-blue-600", bg: "bg-blue-100", label: "Scanning" }
};

export default function PipelineSecurityIntegration() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-violet-600" />
            Pipeline Security Scans
          </span>
          <Badge className="bg-violet-100 text-violet-700">
            Auto-scan enabled
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Automated Security Scanning</p>
              <p className="text-xs text-blue-700">
                Every commit triggers an AI-powered security scan. Deployments are blocked if critical vulnerabilities are detected.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {SCAN_RESULTS.map((scan) => {
            const config = STATUS_CONFIG[scan.status];
            const Icon = config.icon;
            const hasCritical = scan.issues.critical > 0;

            return (
              <div key={scan.id} className="border-2 border-slate-200 rounded-xl p-4 hover:border-violet-300 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-sm font-mono bg-slate-100 px-2 py-0.5 rounded">
                        {scan.commit}
                      </code>
                      <Badge variant="outline" className="text-xs">{scan.branch}</Badge>
                      <span className="text-xs text-slate-500">{scan.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {scan.issues.critical > 0 && (
                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {scan.issues.critical} Critical
                        </span>
                      )}
                      {scan.issues.high > 0 && (
                        <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded">
                          {scan.issues.high} High
                        </span>
                      )}
                      {scan.issues.medium > 0 && (
                        <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded">
                          {scan.issues.medium} Medium
                        </span>
                      )}
                      {scan.issues.low > 0 && (
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                          {scan.issues.low} Low
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`${config.bg} ${config.color} mb-1`}>
                      <Icon className="w-3 h-3 mr-1" />
                      {config.label}
                    </Badge>
                    <p className="text-xs text-slate-500">{scan.duration}</p>
                  </div>
                </div>

                {hasCritical && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs font-medium text-red-900 mb-1">
                      <XCircle className="w-3 h-3 inline mr-1" />
                      Deployment Blocked
                    </p>
                    <p className="text-xs text-red-700">
                      Critical security issues must be resolved before deployment
                    </p>
                  </div>
                )}

                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline">
                    <Terminal className="w-3 h-3 mr-1" /> View Report
                  </Button>
                  <Button size="sm" variant="outline">
                    View Changes
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Security Gate Configuration</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Block on Critical Issues</span>
              <Badge className="bg-emerald-100 text-emerald-700">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Block on High Issues</span>
              <Badge className="bg-amber-100 text-amber-700">Warn Only</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Auto-remediation</span>
              <Badge className="bg-blue-100 text-blue-700">Suggest</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}