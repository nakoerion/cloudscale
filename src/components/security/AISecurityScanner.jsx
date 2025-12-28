import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, XCircle, CheckCircle2, Zap } from "lucide-react";
import { toast } from "sonner";

const VULNERABILITIES = [
  {
    id: 1,
    severity: "critical",
    category: "IAM",
    title: "Overly Permissive IAM Roles",
    description: "3 IAM roles have wildcard permissions (*) allowing unrestricted access",
    affected: ["app-backend-role", "lambda-execution-role", "admin-role"],
    cve: null,
    recommendation: "Apply principle of least privilege. Restrict to specific actions and resources.",
    autoFix: true,
    impact: "High - Could allow unauthorized access to all AWS resources"
  },
  {
    id: 2,
    severity: "critical",
    category: "Network",
    title: "Security Group Allows Unrestricted SSH Access",
    description: "Security group sg-0a1b2c3d allows SSH (port 22) from 0.0.0.0/0",
    affected: ["production-web-sg"],
    cve: null,
    recommendation: "Restrict SSH access to specific IP ranges or use AWS Systems Manager Session Manager",
    autoFix: true,
    impact: "Critical - Exposes servers to brute force attacks"
  },
  {
    id: 3,
    severity: "high",
    category: "Encryption",
    title: "Unencrypted EBS Volumes Detected",
    description: "5 EBS volumes are not encrypted at rest",
    affected: ["vol-1234", "vol-5678", "vol-9abc", "vol-def0", "vol-1111"],
    cve: null,
    recommendation: "Enable encryption for all EBS volumes. Create encrypted snapshots and restore.",
    autoFix: false,
    impact: "High - Data at rest is vulnerable to unauthorized access"
  },
  {
    id: 4,
    severity: "high",
    category: "Dependencies",
    title: "Outdated Dependencies with Known CVEs",
    description: "12 npm packages have critical security vulnerabilities",
    affected: ["axios@0.21.1 (CVE-2021-3749)", "lodash@4.17.19 (CVE-2021-23337)", "minimist@1.2.5 (CVE-2021-44906)"],
    cve: ["CVE-2021-3749", "CVE-2021-23337", "CVE-2021-44906"],
    recommendation: "Update packages to latest versions: axios@1.6.0, lodash@4.17.21, minimist@1.2.8",
    autoFix: true,
    impact: "High - Known exploits available in the wild"
  },
  {
    id: 5,
    severity: "medium",
    category: "Database",
    title: "RDS Database Not Using SSL/TLS",
    description: "PostgreSQL instance allows unencrypted connections",
    affected: ["production-db-1"],
    cve: null,
    recommendation: "Enforce SSL/TLS connections by setting rds.force_ssl=1 parameter",
    autoFix: true,
    impact: "Medium - Data in transit vulnerable to man-in-the-middle attacks"
  },
  {
    id: 6,
    severity: "medium",
    category: "Logging",
    title: "CloudTrail Logging Disabled",
    description: "No audit trail for API calls and AWS account activity",
    affected: ["AWS Account"],
    cve: null,
    recommendation: "Enable CloudTrail in all regions with log file validation",
    autoFix: true,
    impact: "Medium - Unable to track security incidents or unauthorized access"
  }
];

export default function AISecurityScanner() {
  const getSeverityConfig = (severity) => {
    const configs = {
      critical: { color: "text-red-600", bg: "bg-red-50", badge: "bg-red-100 text-red-700", icon: XCircle },
      high: { color: "text-amber-600", bg: "bg-amber-50", badge: "bg-amber-100 text-amber-700", icon: AlertTriangle },
      medium: { color: "text-blue-600", bg: "bg-blue-50", badge: "bg-blue-100 text-blue-700", icon: AlertTriangle }
    };
    return configs[severity] || configs.medium;
  };

  const handleAutoRemediate = (vuln) => {
    toast.success(`Initiating automated remediation for: ${vuln.title}`);
    setTimeout(() => {
      toast.success("Remediation completed successfully!");
    }, 2000);
  };

  const criticalCount = VULNERABILITIES.filter(v => v.severity === "critical").length;
  const highCount = VULNERABILITIES.filter(v => v.severity === "high").length;
  const mediumCount = VULNERABILITIES.filter(v => v.severity === "medium").length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            AI Security Vulnerability Scanner
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-red-100 text-red-700">{criticalCount} Critical</Badge>
            <Badge className="bg-amber-100 text-amber-700">{highCount} High</Badge>
            <Badge className="bg-blue-100 text-blue-700">{mediumCount} Medium</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {VULNERABILITIES.map((vuln) => {
          const config = getSeverityConfig(vuln.severity);
          const Icon = config.icon;
          
          return (
            <div key={vuln.id} className="border-2 border-slate-200 rounded-xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className={`p-2 rounded-lg ${config.bg}`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">{vuln.title}</h4>
                      <p className="text-sm text-slate-600 mb-2">{vuln.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={config.badge}>
                      {vuln.severity}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {vuln.category}
                    </Badge>
                    {vuln.autoFix && (
                      <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                        <Zap className="w-3 h-3 mr-1" /> Auto-fix available
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-700 mb-2">Affected Resources:</p>
                <div className="flex flex-wrap gap-1">
                  {vuln.affected.map((resource, i) => (
                    <Badge key={i} variant="outline" className="text-xs font-mono">
                      {resource}
                    </Badge>
                  ))}
                </div>
              </div>

              {vuln.cve && vuln.cve.length > 0 && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs font-semibold text-red-900 mb-1">CVE IDs:</p>
                  <div className="flex flex-wrap gap-1">
                    {vuln.cve.map((cve, i) => (
                      <Badge key={i} className="bg-red-100 text-red-700 text-xs">
                        {cve}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-1">💡 Recommendation</p>
                <p className="text-sm text-blue-800">{vuln.recommendation}</p>
              </div>

              <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs font-semibold text-amber-900 mb-1">Impact:</p>
                <p className="text-sm text-amber-800">{vuln.impact}</p>
              </div>

              <div className="flex gap-2">
                {vuln.autoFix ? (
                  <Button 
                    size="sm" 
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => handleAutoRemediate(vuln)}
                  >
                    <Zap className="w-3 h-3 mr-1" /> Auto-Remediate
                  </Button>
                ) : (
                  <Button size="sm" variant="outline">
                    Manual Fix Required
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  View Details
                </Button>
                <Button size="sm" variant="outline">
                  Snooze
                </Button>
              </div>
            </div>
          );
        })}

        <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900 mb-1">Continuous Security Monitoring</h4>
              <p className="text-sm text-red-800">
                AI scans your infrastructure 24/7 for vulnerabilities, misconfigurations, and compliance violations. 
                Last scan: 2 minutes ago • Next scan: in 58 minutes
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}