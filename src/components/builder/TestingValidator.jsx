import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  PlayCircle,
  FileCode,
  Bug,
  ChevronRight,
  Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function TestingValidator({ appDescription, formData, generatedCode, onComplete }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [activeTab, setActiveTab] = useState("unit");

  const generateTests = async () => {
    setIsGenerating(true);
    try {
      // Generate Unit Tests
      const unitTests = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate comprehensive unit tests for this application:
        
        App Description: ${appDescription}
        Backend Framework: ${formData.tech_stack?.includes("Node.js") ? "Node.js with Jest" : "Python with pytest"}
        Features: ${formData.features?.join(", ")}
        
        Generate unit tests for:
        1. API endpoints
        2. Database models
        3. Business logic functions
        4. Authentication/authorization
        5. Input validation
        
        Return JSON with:
        {
          "tests": [
            {
              "name": "Test name",
              "description": "What this test validates",
              "code": "Test code using Jest/pytest",
              "category": "api|model|logic|auth|validation"
            }
          ],
          "coverage_estimate": 85,
          "total_tests": 15
        }`,
        response_json_schema: {
          type: "object",
          properties: {
            tests: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  code: { type: "string" },
                  category: { type: "string" }
                }
              }
            },
            coverage_estimate: { type: "number" },
            total_tests: { type: "number" }
          }
        }
      });

      // Generate UI Tests
      const uiTests = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate UI tests for this application:
        
        App Description: ${appDescription}
        Template: ${formData.template}
        Frontend: ${formData.tech_stack?.includes("React") ? "React with Cypress" : "Vue.js with Cypress"}
        
        Generate UI tests for:
        1. Component rendering
        2. User interactions (clicks, inputs)
        3. Form validations
        4. Navigation flows
        5. Responsive behavior
        
        Return JSON with:
        {
          "tests": [
            {
              "name": "Test name",
              "description": "What this test validates",
              "code": "Cypress test code",
              "component": "Component name"
            }
          ],
          "total_tests": 12
        }`,
        response_json_schema: {
          type: "object",
          properties: {
            tests: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  code: { type: "string" },
                  component: { type: "string" }
                }
              }
            },
            total_tests: { type: "number" }
          }
        }
      });

      // Generate Integration Tests
      const integrationTests = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate end-to-end integration tests for this application:
        
        App Description: ${appDescription}
        Features: ${formData.features?.join(", ")}
        
        Generate integration tests for:
        1. Complete user workflows
        2. API to database flows
        3. Authentication flows
        4. Feature-specific scenarios
        
        Return JSON with:
        {
          "tests": [
            {
              "name": "Test name",
              "description": "Workflow being tested",
              "code": "Integration test code",
              "workflow": "Workflow name"
            }
          ],
          "total_tests": 8
        }`,
        response_json_schema: {
          type: "object",
          properties: {
            tests: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  code: { type: "string" },
                  workflow: { type: "string" }
                }
              }
            },
            total_tests: { type: "number" }
          }
        }
      });

      // Validate Code & Generate Error Report
      const validation = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze the generated code and identify potential issues:
        
        App Type: ${formData.type}
        Features: ${formData.features?.join(", ")}
        
        Check for:
        1. Security vulnerabilities
        2. Performance bottlenecks
        3. Error handling gaps
        4. Missing validations
        5. Best practice violations
        
        Return JSON with:
        {
          "issues": [
            {
              "severity": "critical|warning|info",
              "category": "security|performance|validation|best-practice",
              "title": "Issue title",
              "description": "Detailed description",
              "location": "Where in code",
              "suggestion": "How to fix"
            }
          ],
          "overall_score": 85,
          "passed": true
        }`,
        response_json_schema: {
          type: "object",
          properties: {
            issues: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  severity: { type: "string" },
                  category: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" },
                  location: { type: "string" },
                  suggestion: { type: "string" }
                }
              }
            },
            overall_score: { type: "number" },
            passed: { type: "boolean" }
          }
        }
      });

      setTestResults({
        unit: unitTests,
        ui: uiTests,
        integration: integrationTests,
        validation
      });

      toast.success("Tests generated successfully!");
    } catch (error) {
      toast.error("Failed to generate tests");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const severityConfig = {
    critical: { color: "text-red-600", bg: "bg-red-50", border: "border-red-200", icon: XCircle },
    warning: { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", icon: AlertTriangle },
    info: { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", icon: Lightbulb }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-4">
          <Bug className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-semibold text-emerald-700">Testing & Validation</span>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">
          Automated Test Generation
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Generate comprehensive tests and validate your application code
        </p>
      </div>

      {!testResults ? (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <FileCode className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-2">Unit Tests</h3>
                <p className="text-sm text-slate-600">Backend logic & API endpoints</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <PlayCircle className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-2">UI Tests</h3>
                <p className="text-sm text-slate-600">Component rendering & interactions</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-2">Integration Tests</h3>
                <p className="text-sm text-slate-600">End-to-end workflows</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
              <div className="flex gap-4">
                <Bug className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">What will be generated:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Jest/pytest unit tests for backend functions</li>
                    <li>• Cypress UI tests for frontend components</li>
                    <li>• End-to-end integration test scenarios</li>
                    <li>• Code validation and error detection</li>
                    <li>• Security vulnerability analysis</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              onClick={generateTests}
              disabled={isGenerating}
              className="w-full py-6 text-lg rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Tests...
                </>
              ) : (
                <>
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Generate Tests
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Test Results Summary */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-slate-900">{testResults.unit.total_tests}</p>
                <p className="text-sm text-slate-500">Unit Tests</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-slate-900">{testResults.ui.total_tests}</p>
                <p className="text-sm text-slate-500">UI Tests</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-slate-900">{testResults.integration.total_tests}</p>
                <p className="text-sm text-slate-500">Integration Tests</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-600">{testResults.unit.coverage_estimate}%</p>
                <p className="text-sm text-slate-500">Coverage</p>
              </div>
            </div>
          </div>

          {/* Validation Results */}
          {testResults.validation.issues.length > 0 && (
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Code Validation Results</h3>
                <Badge className={cn(
                  testResults.validation.passed 
                    ? "bg-emerald-100 text-emerald-700" 
                    : "bg-amber-100 text-amber-700"
                )}>
                  Score: {testResults.validation.overall_score}/100
                </Badge>
              </div>

              <div className="space-y-3">
                {testResults.validation.issues.map((issue, i) => {
                  const config = severityConfig[issue.severity];
                  const Icon = config.icon;
                  return (
                    <div key={i} className={cn("border-2 rounded-xl p-4", config.bg, config.border)}>
                      <div className="flex items-start gap-3">
                        <Icon className={cn("w-5 h-5 shrink-0 mt-0.5", config.color)} />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className={cn("font-semibold", config.color)}>{issue.title}</h4>
                            <Badge variant="outline" className="text-xs">{issue.category}</Badge>
                          </div>
                          <p className="text-sm text-slate-700 mb-2">{issue.description}</p>
                          <p className="text-xs text-slate-500 mb-3">📍 {issue.location}</p>
                          <div className="bg-white border border-slate-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-semibold text-slate-700 mb-1">Suggested Fix:</p>
                                <p className="text-xs text-slate-600">{issue.suggestion}</p>
                              </div>
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

          {/* Test Code */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3 h-12">
              <TabsTrigger value="unit" className="text-base">Unit Tests</TabsTrigger>
              <TabsTrigger value="ui" className="text-base">UI Tests</TabsTrigger>
              <TabsTrigger value="integration" className="text-base">Integration Tests</TabsTrigger>
            </TabsList>

            <TabsContent value="unit" className="space-y-4 mt-6">
              {testResults.unit.tests.map((test, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-900">{test.name}</h4>
                        <p className="text-sm text-slate-600 mt-1">{test.description}</p>
                      </div>
                      <Badge variant="outline">{test.category}</Badge>
                    </div>
                  </div>
                  <pre className="bg-slate-900 text-slate-100 p-6 overflow-x-auto text-sm">
                    <code>{test.code}</code>
                  </pre>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="ui" className="space-y-4 mt-6">
              {testResults.ui.tests.map((test, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-900">{test.name}</h4>
                        <p className="text-sm text-slate-600 mt-1">{test.description}</p>
                      </div>
                      <Badge variant="outline">{test.component}</Badge>
                    </div>
                  </div>
                  <pre className="bg-slate-900 text-slate-100 p-6 overflow-x-auto text-sm">
                    <code>{test.code}</code>
                  </pre>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="integration" className="space-y-4 mt-6">
              {testResults.integration.tests.map((test, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-900">{test.name}</h4>
                        <p className="text-sm text-slate-600 mt-1">{test.description}</p>
                      </div>
                      <Badge variant="outline">{test.workflow}</Badge>
                    </div>
                  </div>
                  <pre className="bg-slate-900 text-slate-100 p-6 overflow-x-auto text-sm">
                    <code>{test.code}</code>
                  </pre>
                </div>
              ))}
            </TabsContent>
          </Tabs>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setTestResults(null);
                setIsGenerating(false);
              }}
              className="flex-1"
            >
              Generate Again
            </Button>
            <Button
              onClick={onComplete}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              Continue <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}