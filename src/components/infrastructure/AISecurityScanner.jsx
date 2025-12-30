import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { Shield, AlertTriangle, CheckCircle2, Zap, Copy, Code } from "lucide-react";
import { toast } from "sonner";

const SEVERITY_CONFIG = {
  critical: { color: "text-red-700", bg: "bg-red-50", border: "border-red-200", badge: "bg-red-100 text-red-700" },
  high: { color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", badge: "bg-orange-100 text-orange-700" },
  medium: { color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-100 text-amber-700" },
  low: { color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-700" }
};

export default function AISecurityScanner({ template, onRemediate }) {
  const [scanning, setScanning] = useState(false);
  const [vulnerabilities, setVulnerabilities] = useState(null);

  const scanTemplate = async () => {
    setScanning(true);
    
    try {
      // Use AI to analyze template for security issues
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this Infrastructure as Code template for security vulnerabilities and misconfigurations:

${template?.template_content || template?.code || "No template content"}

Provider: ${template?.provider || "Unknown"}
Type: ${template?.iac_tool || "terraform"}

Identify security issues in these categories:
1. Authentication & Access Control
2. Encryption & Data Protection
3. Network Security
4. Resource Exposure
5. Compliance Violations

For each issue found, provide:
- Severity (critical/high/medium/low)
- Category
- Description
- Risk explanation
- Remediation code snippet`,
        response_json_schema: {
          type: "object",
          properties: {
            scan_date: { type: "string" },
            total_issues: { type: "number" },
            critical_count: { type: "number" },
            high_count: { type: "number" },
            medium_count: { type: "number" },
            low_count: { type: "number" },
            security_score: { type: "number" },
            issues: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  severity: { type: "string" },
                  category: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" },
                  risk: { type: "string" },
                  remediation: { type: "string" },
                  code_fix: { type: "string" }
                }
              }
            }
          }
        }
      });

      setVulnerabilities(response);
      toast.success("Security scan completed");
    } catch (error) {
      toast.error("Failed to scan template");
      console.error(error);
    } finally {
      setScanning(false);
    }
  };

  const handleCopyFix = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Remediation code copied");
  };

  const handleApplyFix = (issue) => {
    onRemediate?.(issue);
    toast.success("Remediation applied");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-violet-600" />
            AI Security Scanner
          </span>
          <Button 
            onClick={scanTemplate} 
            disabled={scanning || !template}
            size="sm"
            className="bg-violet-600 hover:bg-violet-700"
          >
            <Zap className="w-4 h-4 mr-2" />
            {scanning ? "Scanning..." : "Scan Template"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!vulnerabilities ? (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-600 mb-2">
              {template ? "Run AI security scan to detect vulnerabilities" : "Select a template to scan"}
            </p>
            <p className="text-xs text-slate-500">
              Powered by AI to identify misconfigurations and security risks
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Security Score */}
            <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border-2 border-violet-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-violet-900">Security Score</p>
                <Badge className={
                  vulnerabilities.security_score >= 80 ? "bg-emerald-100 text-emerald-700" :
                  vulnerabilities.security_score >= 60 ? "bg-amber-100 text-amber-700" :
                  "bg-red-100 text-red-700"
                }>
                  {vulnerabilities.security_score}/100
                </Badge>
              </div>
              <div className="flex gap-2 text-xs">
                {vulnerabilities.critical_count > 0 && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
                    {vulnerabilities.critical_count} Critical
                  </span>
                )}
                {vulnerabilities.high_count > 0 && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded">
                    {vulnerabilities.high_count} High
                  </span>
                )}
                {vulnerabilities.medium_count > 0 && (
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded">
                    {vulnerabilities.medium_count} Medium
                  </span>
                )}
                {vulnerabilities.low_count > 0 && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {vulnerabilities.low_count} Low
                  </span>
                )}
              </div>
            </div>

            {/* Vulnerabilities List */}
            <div className="space-y-3">
              {vulnerabilities.issues?.map((issue, index) => {
                const config = SEVERITY_CONFIG[issue.severity] || SEVERITY_CONFIG.medium;
                return (
                  <div key={index} className={`border-2 ${config.border} ${config.bg} rounded-xl p-4`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <AlertTriangle className={`w-5 h-5 ${config.color} mt-0.5 shrink-0`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-semibold ${config.color}`}>{issue.title}</h4>
                            <Badge className={config.badge}>{issue.severity}</Badge>
                            <Badge variant="outline" className="text-xs">{issue.category}</Badge>
                          </div>
                          <p className="text-sm text-slate-700 mb-2">{issue.description}</p>
                          <div className="p-2 bg-white/60 rounded-lg border border-slate-200 mb-3">
                            <p className="text-xs font-medium text-slate-600 mb-1">Risk:</p>
                            <p className="text-xs text-slate-700">{issue.risk}</p>
                          </div>
                          
                          {/* Remediation */}
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-emerald-700">
                              <CheckCircle2 className="w-3 h-3 inline mr-1" />
                              Recommended Fix:
                            </p>
                            <p className="text-xs text-slate-700 mb-2">{issue.remediation}</p>
                            
                            {issue.code_fix && (
                              <div className="relative">
                                <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto">
                                  <code>{issue.code_fix}</code>
                                </pre>
                                <div className="absolute top-2 right-2 flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    className="h-6 text-xs bg-slate-800 hover:bg-slate-700 text-white"
                                    onClick={() => handleCopyFix(issue.code_fix)}
                                  >
                                    <Copy className="w-3 h-3 mr-1" /> Copy
                                  </Button>
                                  <Button 
                                    size="sm"
                                    className="h-6 text-xs bg-emerald-600 hover:bg-emerald-700"
                                    onClick={() => handleApplyFix(issue)}
                                  >
                                    Apply Fix
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}