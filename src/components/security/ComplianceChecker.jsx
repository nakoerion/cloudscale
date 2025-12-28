import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileCheck, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const COMPLIANCE_FRAMEWORKS = [
  {
    id: 1,
    name: "SOC 2 Type II",
    score: 87,
    status: "compliant",
    controls: {
      passed: 43,
      failed: 6,
      total: 49
    },
    violations: [
      {
        control: "CC6.1 - Logical Access Controls",
        severity: "high",
        description: "MFA not enforced for all administrative accounts"
      },
      {
        control: "CC7.2 - System Monitoring",
        severity: "medium",
        description: "Incomplete logging configuration for critical systems"
      }
    ]
  },
  {
    id: 2,
    name: "PCI DSS 3.2.1",
    score: 92,
    status: "compliant",
    controls: {
      passed: 285,
      failed: 23,
      total: 308
    },
    violations: [
      {
        control: "Requirement 2.3 - Encrypt Non-Console Access",
        severity: "critical",
        description: "Unencrypted administrative access detected"
      }
    ]
  },
  {
    id: 3,
    name: "HIPAA",
    score: 78,
    status: "non-compliant",
    controls: {
      passed: 124,
      failed: 35,
      total: 159
    },
    violations: [
      {
        control: "§164.312(a)(2)(i) - Unique User ID",
        severity: "critical",
        description: "Shared credentials detected in production environment"
      },
      {
        control: "§164.312(e)(1) - Transmission Security",
        severity: "high",
        description: "ePHI transmitted without encryption"
      },
      {
        control: "§164.308(a)(5)(ii)(C) - Log-in Monitoring",
        severity: "medium",
        description: "Insufficient login attempt monitoring"
      }
    ]
  },
  {
    id: 4,
    name: "GDPR",
    score: 94,
    status: "compliant",
    controls: {
      passed: 82,
      failed: 5,
      total: 87
    },
    violations: [
      {
        control: "Article 32 - Security of Processing",
        severity: "medium",
        description: "Data retention policy exceeds necessary duration"
      }
    ]
  }
];

export default function ComplianceChecker() {
  const getStatusConfig = (status) => {
    const configs = {
      compliant: { color: "text-emerald-600", bg: "bg-emerald-100", icon: CheckCircle2 },
      "non-compliant": { color: "text-red-600", bg: "bg-red-100", icon: XCircle }
    };
    return configs[status] || configs.compliant;
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: "bg-red-100 text-red-700",
      high: "bg-amber-100 text-amber-700",
      medium: "bg-blue-100 text-blue-700"
    };
    return colors[severity] || "bg-slate-100 text-slate-700";
  };

  const handleRemediate = (framework, violation) => {
    toast.success(`Remediating ${violation.control}...`);
  };

  const handleGenerateReport = (framework) => {
    toast.success(`Generating ${framework.name} compliance report...`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-indigo-600" />
          Compliance & Regulatory Checker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {COMPLIANCE_FRAMEWORKS.map((framework) => {
          const statusConfig = getStatusConfig(framework.status);
          const StatusIcon = statusConfig.icon;
          
          return (
            <div key={framework.id} className="border-2 border-slate-200 rounded-xl p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">{framework.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge className={statusConfig.bg + " " + statusConfig.color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {framework.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {framework.controls.passed}/{framework.controls.total} controls
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-slate-900">{framework.score}%</p>
                  <p className="text-xs text-slate-500">Compliance Score</p>
                </div>
              </div>

              <div className="mb-4">
                <Progress value={framework.score} className="h-2" />
                <div className="flex justify-between mt-2 text-xs text-slate-500">
                  <span>{framework.controls.passed} Passed</span>
                  <span>{framework.controls.failed} Failed</span>
                </div>
              </div>

              {framework.violations.length > 0 && (
                <div className="mb-4 space-y-2">
                  <p className="text-sm font-semibold text-slate-900">Compliance Violations:</p>
                  {framework.violations.map((violation, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900 mb-1">{violation.control}</p>
                          <p className="text-sm text-slate-600">{violation.description}</p>
                        </div>
                        <Badge className={getSeverityColor(violation.severity)}>
                          {violation.severity}
                        </Badge>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRemediate(framework, violation)}
                      >
                        Remediate
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleGenerateReport(framework)}
                >
                  Generate Report
                </Button>
                <Button size="sm" variant="outline">
                  View All Controls
                </Button>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                  Auto-Remediate All
                </Button>
              </div>
            </div>
          );
        })}

        <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-indigo-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-indigo-900 mb-1">Continuous Compliance Monitoring</h4>
              <p className="text-sm text-indigo-800">
                AI automatically monitors your infrastructure against multiple compliance frameworks and alerts you to violations in real-time.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}