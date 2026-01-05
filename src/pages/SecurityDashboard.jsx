import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Sparkles,
  FileCode,
  Server,
  Loader2,
  TrendingUp,
  Lock,
  Eye,
  Zap
} from "lucide-react";
import MetricCard from "@/components/dashboard/MetricCard";
import SecurityPostureScore from "@/components/security/SecurityPostureScore";
import AISecurityScanner from "@/components/infrastructure/AISecurityScanner";
import { toast } from "sonner";

export default function SecurityDashboard() {
  const [scanning, setScanning] = useState(false);
  const [securityReport, setSecurityReport] = useState(null);
  const queryClient = useQueryClient();

  const { data: templates = [] } = useQuery({
    queryKey: ["iac-templates"],
    queryFn: () => base44.entities.IaCTemplate.list("-created_date", 50)
  });

  const { data: deployments = [] } = useQuery({
    queryKey: ["iac-deployments"],
    queryFn: () => base44.entities.IaCDeployment.list("-created_date", 20)
  });

  const runFullSecurityScan = async () => {
    setScanning(true);
    try {
      const prompt = `Perform a comprehensive security analysis of this infrastructure:

Templates: ${templates.length} IaC templates
Deployments: ${deployments.length} active deployments
Providers: ${[...new Set(deployments.map(d => d.provider))].join(', ')}

Analyze and provide a security report in this JSON format:
{
  "overall_score": <0-100>,
  "risk_level": "<critical|high|medium|low>",
  "vulnerabilities": [
    {
      "id": "<unique_id>",
      "title": "<vulnerability title>",
      "severity": "<critical|high|medium|low>",
      "category": "<misconfiguration|exposure|credential|encryption|access>",
      "description": "<detailed description>",
      "affected_resources": ["<resource 1>", "<resource 2>"],
      "remediation": {
        "steps": ["<step 1>", "<step 2>"],
        "code_fix": "<code snippet if applicable>"
      },
      "cve_ids": ["<CVE-2024-1234>"]
    }
  ],
  "policy_violations": [
    {
      "policy": "<policy name>",
      "severity": "<critical|high|medium|low>",
      "description": "<violation description>",
      "resources": ["<resource>"]
    }
  ],
  "recommendations": [
    {
      "title": "<recommendation>",
      "priority": "<high|medium|low>",
      "impact": "<security improvement>"
    }
  ],
  "compliance": {
    "pci_dss": "<compliant|non_compliant|partial>",
    "hipaa": "<compliant|non_compliant|partial>",
    "gdpr": "<compliant|non_compliant|partial>",
    "soc2": "<compliant|non_compliant|partial>"
  }
}`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            overall_score: { type: "number" },
            risk_level: { type: "string" },
            vulnerabilities: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  title: { type: "string" },
                  severity: { type: "string" },
                  category: { type: "string" },
                  description: { type: "string" },
                  affected_resources: { type: "array", items: { type: "string" } },
                  remediation: {
                    type: "object",
                    properties: {
                      steps: { type: "array", items: { type: "string" } },
                      code_fix: { type: "string" }
                    }
                  },
                  cve_ids: { type: "array", items: { type: "string" } }
                }
              }
            },
            policy_violations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  policy: { type: "string" },
                  severity: { type: "string" },
                  description: { type: "string" },
                  resources: { type: "array", items: { type: "string" } }
                }
              }
            },
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  priority: { type: "string" },
                  impact: { type: "string" }
                }
              }
            },
            compliance: {
              type: "object",
              properties: {
                pci_dss: { type: "string" },
                hipaa: { type: "string" },
                gdpr: { type: "string" },
                soc2: { type: "string" }
              }
            }
          }
        }
      });

      setSecurityReport(result);
      toast.success("Security scan completed");
    } catch (error) {
      toast.error("Security scan failed");
      console.error(error);
    } finally {
      setScanning(false);
    }
  };

  const getSeverityColor = (severity) => {
    return {
      critical: "bg-red-100 text-red-700 border-red-200",
      high: "bg-orange-100 text-orange-700 border-orange-200",
      medium: "bg-amber-100 text-amber-700 border-amber-200",
      low: "bg-blue-100 text-blue-700 border-blue-200"
    }[severity] || "bg-slate-100 text-slate-700";
  };

  const getComplianceStatus = (status) => {
    return {
      compliant: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
      partial: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
      non_compliant: { icon: XCircle, color: "text-red-600", bg: "bg-red-50" }
    }[status] || { icon: AlertTriangle, color: "text-slate-600", bg: "bg-slate-50" };
  };

  const criticalCount = securityReport?.vulnerabilities?.filter(v => v.severity === 'critical').length || 0;
  const highCount = securityReport?.vulnerabilities?.filter(v => v.severity === 'high').length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Security Dashboard</h1>
            <p className="text-slate-500 mt-1">AI-powered security scanning and compliance monitoring</p>
          </div>
          <Button 
            onClick={runFullSecurityScan}
            disabled={scanning}
            size="lg"
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
          >
            {scanning ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Run Full Security Scan
              </>
            )}
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Security Score"
            value={securityReport?.overall_score || "--"}
            icon={Shield}
            iconColor="text-violet-500"
            iconBg="bg-violet-50"
          />
          <MetricCard
            title="Critical Issues"
            value={criticalCount}
            icon={AlertTriangle}
            iconColor="text-red-500"
            iconBg="bg-red-50"
          />
          <MetricCard
            title="Templates Scanned"
            value={templates.length}
            icon={FileCode}
            iconColor="text-blue-500"
            iconBg="bg-blue-50"
          />
          <MetricCard
            title="Resources Monitored"
            value={deployments.length}
            icon={Server}
            iconColor="text-emerald-500"
            iconBg="bg-emerald-50"
          />
        </div>

        {securityReport && (
          <>
            {/* Security Posture */}
            <div className="mb-8">
              <SecurityPostureScore report={securityReport} />
            </div>

            <Tabs defaultValue="vulnerabilities" className="w-full">
              <TabsList className="bg-white border border-slate-200">
                <TabsTrigger value="vulnerabilities">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Vulnerabilities ({securityReport.vulnerabilities?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="policies">
                  <Lock className="w-4 h-4 mr-2" />
                  Policy Violations
                </TabsTrigger>
                <TabsTrigger value="compliance">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Compliance
                </TabsTrigger>
                <TabsTrigger value="recommendations">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Recommendations
                </TabsTrigger>
              </TabsList>

              <TabsContent value="vulnerabilities" className="mt-6">
                <div className="space-y-4">
                  {securityReport.vulnerabilities?.map((vuln, i) => (
                    <div key={vuln.id || i} className="bg-white rounded-2xl border-2 border-slate-200 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-slate-900 text-lg">{vuln.title}</h3>
                            <Badge className={getSeverityColor(vuln.severity)}>
                              {vuln.severity}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {vuln.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{vuln.description}</p>
                          {vuln.cve_ids?.length > 0 && (
                            <div className="flex gap-2 mb-3">
                              {vuln.cve_ids.map((cve, j) => (
                                <Badge key={j} variant="outline" className="text-xs">
                                  {cve}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {vuln.affected_resources?.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-slate-700 mb-2">Affected Resources:</p>
                          <div className="flex flex-wrap gap-2">
                            {vuln.affected_resources.map((resource, j) => (
                              <span key={j} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                                {resource}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="p-4 bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-xl">
                        <div className="flex items-center gap-2 mb-3">
                          <Zap className="w-4 h-4 text-violet-600" />
                          <p className="font-semibold text-slate-900">Remediation Steps</p>
                        </div>
                        <div className="space-y-2 mb-3">
                          {vuln.remediation?.steps?.map((step, j) => (
                            <div key={j} className="flex items-start gap-2">
                              <span className="text-sm font-medium text-violet-600">{j + 1}.</span>
                              <p className="text-sm text-slate-700">{step}</p>
                            </div>
                          ))}
                        </div>
                        {vuln.remediation?.code_fix && (
                          <div>
                            <p className="text-xs font-medium text-slate-600 mb-2">Code Fix:</p>
                            <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs overflow-x-auto">
                              <code>{vuln.remediation.code_fix}</code>
                            </pre>
                          </div>
                        )}
                      </div>

                      <Button className="w-full mt-4 bg-gradient-to-r from-violet-600 to-indigo-600">
                        Apply Fix
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="policies" className="mt-6">
                <div className="space-y-4">
                  {securityReport.policy_violations?.map((violation, i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-1">{violation.policy}</h4>
                          <p className="text-sm text-slate-600">{violation.description}</p>
                        </div>
                        <Badge className={getSeverityColor(violation.severity)}>
                          {violation.severity}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {violation.resources?.map((resource, j) => (
                          <span key={j} className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded">
                            {resource}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="compliance" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(securityReport.compliance || {}).map(([standard, status]) => {
                    const config = getComplianceStatus(status);
                    const Icon = config.icon;
                    return (
                      <div key={standard} className="bg-white rounded-2xl border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-slate-900 uppercase">{standard.replace('_', '-')}</h3>
                          <div className={`p-3 rounded-xl ${config.bg}`}>
                            <Icon className={`w-6 h-6 ${config.color}`} />
                          </div>
                        </div>
                        <Badge className={
                          status === 'compliant' ? 'bg-emerald-100 text-emerald-700' :
                          status === 'partial' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }>
                          {status.replace('_', ' ')}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="recommendations" className="mt-6">
                <div className="space-y-4">
                  {securityReport.recommendations?.map((rec, i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 mb-2">{rec.title}</h4>
                          <p className="text-sm text-slate-600 mb-3">{rec.impact}</p>
                        </div>
                        <Badge className={
                          rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                          rec.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }>
                          {rec.priority} priority
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}

        {!securityReport && !scanning && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Security Scan Yet</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Run a comprehensive security scan to identify vulnerabilities and compliance issues
            </p>
            <Button 
              onClick={runFullSecurityScan}
              size="lg"
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Security Scan
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}