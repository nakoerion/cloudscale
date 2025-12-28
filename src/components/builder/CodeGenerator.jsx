import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Code, 
  Loader2, 
  Download, 
  Copy, 
  CheckCircle2,
  Database,
  Server,
  Layers,
  FileCode
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function CodeGenerator({ appDescription, formData, onComplete }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [techStack, setTechStack] = useState({
    frontend: "react",
    backend: "nodejs",
    database: "postgresql"
  });

  const generateCode = async () => {
    setIsGenerating(true);
    try {
      // Generate Backend Code
      const backendCode = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate production-ready backend code for this application:
        
        App Description: ${appDescription}
        App Type: ${formData.type}
        Template: ${formData.template}
        Features: ${formData.features?.join(", ")}
        Backend Framework: ${techStack.backend === "nodejs" ? "Node.js with Express" : "Python with FastAPI"}
        Database: ${techStack.database}
        
        Generate:
        1. Complete REST API endpoints with CRUD operations
        2. Database schema/models
        3. Authentication middleware (if auth feature is included)
        4. Input validation
        5. Error handling
        
        Return JSON with:
        {
          "api_endpoints": [{"method": "GET/POST/etc", "path": "/api/...", "description": "...", "code": "..."}],
          "database_schema": "SQL or NoSQL schema code",
          "models": "Model/Schema definitions code",
          "middleware": "Authentication/validation middleware code",
          "main_server": "Main server setup code"
        }`,
        response_json_schema: {
          type: "object",
          properties: {
            api_endpoints: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  method: { type: "string" },
                  path: { type: "string" },
                  description: { type: "string" },
                  code: { type: "string" }
                }
              }
            },
            database_schema: { type: "string" },
            models: { type: "string" },
            middleware: { type: "string" },
            main_server: { type: "string" }
          }
        }
      });

      // Generate Frontend Code
      const frontendCode = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate production-ready frontend code for this application:
        
        App Description: ${appDescription}
        App Type: ${formData.type}
        Template: ${formData.template}
        Framework: ${techStack.frontend === "react" ? "React with Hooks" : "Vue.js 3"}
        
        Generate:
        1. Main app component structure
        2. Key page components based on the template
        3. API service layer for backend calls
        4. State management setup
        5. Routing configuration
        
        Return JSON with:
        {
          "app_structure": "Main app component code",
          "components": [{"name": "ComponentName", "code": "..."}],
          "api_service": "API service layer code",
          "routing": "Router setup code",
          "state_management": "State management code"
        }`,
        response_json_schema: {
          type: "object",
          properties: {
            app_structure: { type: "string" },
            components: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  code: { type: "string" }
                }
              }
            },
            api_service: { type: "string" },
            routing: { type: "string" },
            state_management: { type: "string" }
          }
        }
      });

      setGeneratedCode({
        backend: backendCode,
        frontend: frontendCode,
        techStack
      });
      
      toast.success("Code generated successfully!");
    } catch (error) {
      toast.error("Failed to generate code. Please try again.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Copied to clipboard!");
  };

  const downloadCode = (filename, code) => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded successfully!");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full mb-4">
          <Code className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-semibold text-indigo-700">AI Code Generator</span>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">
          Generate Your Application Code
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Select your tech stack and generate production-ready code for your application
        </p>
      </div>

      {!generatedCode ? (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Choose Your Tech Stack</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="frontend" className="text-base mb-3 block">Frontend Framework</Label>
                <Select value={techStack.frontend} onValueChange={(v) => setTechStack({...techStack, frontend: v})}>
                  <SelectTrigger id="frontend" className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="react">⚛️ React</SelectItem>
                    <SelectItem value="vue">🟢 Vue.js</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="backend" className="text-base mb-3 block">Backend Framework</Label>
                <Select value={techStack.backend} onValueChange={(v) => setTechStack({...techStack, backend: v})}>
                  <SelectTrigger id="backend" className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nodejs">🟩 Node.js</SelectItem>
                    <SelectItem value="python">🐍 Python</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="database" className="text-base mb-3 block">Database</Label>
                <Select value={techStack.database} onValueChange={(v) => setTechStack({...techStack, database: v})}>
                  <SelectTrigger id="database" className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="postgresql">🐘 PostgreSQL</SelectItem>
                    <SelectItem value="mongodb">🍃 MongoDB</SelectItem>
                    <SelectItem value="mysql">🐬 MySQL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button
            onClick={generateCode}
            disabled={isGenerating}
            className="w-full py-6 text-lg rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating Code...
              </>
            ) : (
              <>
                <Code className="w-5 h-5 mr-2" />
                Generate Code
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <h3 className="text-xl font-bold text-emerald-900">Code Generated!</h3>
            </div>
            <p className="text-emerald-800">
              Your application code has been generated. Review, download, or copy the code below.
            </p>
          </div>

          <Tabs defaultValue="backend" className="w-full">
            <TabsList className="w-full grid grid-cols-2 h-12">
              <TabsTrigger value="backend" className="text-base">
                <Server className="w-4 h-4 mr-2" /> Backend
              </TabsTrigger>
              <TabsTrigger value="frontend" className="text-base">
                <Layers className="w-4 h-4 mr-2" /> Frontend
              </TabsTrigger>
            </TabsList>

            <TabsContent value="backend" className="space-y-4 mt-6">
              {/* API Endpoints */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-5 h-5 text-slate-600" />
                    <h4 className="font-semibold text-slate-900">API Endpoints</h4>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => downloadCode("api-endpoints.js", 
                      generatedCode.backend.api_endpoints.map(ep => ep.code).join("\n\n")
                    )}
                  >
                    <Download className="w-4 h-4 mr-2" /> Download
                  </Button>
                </div>
                <div className="p-4 space-y-4">
                  {generatedCode.backend.api_endpoints.map((endpoint, i) => (
                    <div key={i} className="border border-slate-200 rounded-lg overflow-hidden">
                      <div className="bg-slate-50 px-4 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className={cn(
                            "font-mono",
                            endpoint.method === "GET" && "bg-blue-100 text-blue-700",
                            endpoint.method === "POST" && "bg-green-100 text-green-700",
                            endpoint.method === "PUT" && "bg-amber-100 text-amber-700",
                            endpoint.method === "DELETE" && "bg-red-100 text-red-700"
                          )}>
                            {endpoint.method}
                          </Badge>
                          <span className="font-mono text-sm text-slate-700">{endpoint.path}</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyToClipboard(endpoint.code)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="px-4 py-2 text-sm text-slate-600">{endpoint.description}</p>
                      <pre className="bg-slate-900 text-slate-100 p-4 overflow-x-auto text-sm">
                        <code>{endpoint.code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </div>

              {/* Database Schema */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-slate-600" />
                    <h4 className="font-semibold text-slate-900">Database Schema</h4>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard(generatedCode.backend.database_schema)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => downloadCode("schema.sql", generatedCode.backend.database_schema)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <pre className="bg-slate-900 text-slate-100 p-6 overflow-x-auto text-sm">
                  <code>{generatedCode.backend.database_schema}</code>
                </pre>
              </div>

              {/* Models */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900">Models</h4>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard(generatedCode.backend.models)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => downloadCode("models.js", generatedCode.backend.models)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <pre className="bg-slate-900 text-slate-100 p-6 overflow-x-auto text-sm">
                  <code>{generatedCode.backend.models}</code>
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="frontend" className="space-y-4 mt-6">
              {/* App Structure */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900">App.{techStack.frontend === "react" ? "jsx" : "vue"}</h4>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard(generatedCode.frontend.app_structure)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => downloadCode(`App.${techStack.frontend === "react" ? "jsx" : "vue"}`, generatedCode.frontend.app_structure)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <pre className="bg-slate-900 text-slate-100 p-6 overflow-x-auto text-sm">
                  <code>{generatedCode.frontend.app_structure}</code>
                </pre>
              </div>

              {/* Components */}
              {generatedCode.frontend.components.map((component, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900">{component.name}</h4>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => copyToClipboard(component.code)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => downloadCode(`${component.name}.${techStack.frontend === "react" ? "jsx" : "vue"}`, component.code)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <pre className="bg-slate-900 text-slate-100 p-6 overflow-x-auto text-sm">
                    <code>{component.code}</code>
                  </pre>
                </div>
              ))}
            </TabsContent>
          </Tabs>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setGeneratedCode(null);
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
              Continue to Deployment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}