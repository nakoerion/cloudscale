import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Code, Shield, Zap, FileCode, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const REFACTORING_SUGGESTIONS = [
  {
    id: 1,
    file: "src/components/UserProfile.jsx",
    type: "performance",
    severity: "high",
    title: "Unnecessary Re-renders Detected",
    description: "Component re-renders on every parent update due to inline object creation",
    linesAffected: "45-67",
    before: `function UserProfile({ userId }) {
  const user = useUser(userId);
  
  // ❌ Creates new object on every render
  const styles = {
    container: { padding: 20 },
    header: { fontSize: 24 }
  };
  
  return <div style={styles.container}>
    <h1 style={styles.header}>{user.name}</h1>
  </div>;
}`,
    after: `// ✅ Move styles outside component
const styles = {
  container: { padding: 20 },
  header: { fontSize: 24 }
};

function UserProfile({ userId }) {
  const user = useUser(userId);
  
  return <div style={styles.container}>
    <h1 style={styles.header}>{user.name}</h1>
  </div>;
}`,
    impact: "Reduce re-renders by 70%, improve FPS by 15%"
  },
  {
    id: 2,
    file: "src/api/auth.js",
    type: "security",
    severity: "critical",
    title: "Sensitive Data Logging",
    description: "Password being logged in production environment",
    linesAffected: "89-92",
    before: `async function login(email, password) {
  console.log('Login attempt:', { email, password }); // ❌ Security risk
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  return response.json();
}`,
    after: `async function login(email, password) {
  // ✅ Only log non-sensitive data
  console.log('Login attempt:', { email });
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  return response.json();
}`,
    impact: "Eliminate critical security vulnerability"
  },
  {
    id: 3,
    file: "src/utils/dataProcessor.js",
    type: "performance",
    severity: "medium",
    title: "Inefficient Array Operations",
    description: "Multiple array iterations can be combined into single pass",
    linesAffected: "23-28",
    before: `function processData(items) {
  // ❌ Three separate iterations
  const filtered = items.filter(item => item.active);
  const mapped = filtered.map(item => ({ ...item, processed: true }));
  const sorted = mapped.sort((a, b) => a.priority - b.priority);
  return sorted;
}`,
    after: `function processData(items) {
  // ✅ Single iteration with reduce
  return items
    .filter(item => item.active)
    .map(item => ({ ...item, processed: true }))
    .sort((a, b) => a.priority - b.priority);
}`,
    impact: "Reduce processing time by 40%"
  }
];

export default function AICodeRefactoring() {
  const [copiedId, setCopiedId] = useState(null);

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="w-5 h-5 text-emerald-600" />
          AI Code Refactoring Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {REFACTORING_SUGGESTIONS.map((suggestion) => (
          <div key={suggestion.id} className="border-2 border-slate-200 rounded-xl overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    suggestion.type === "security" ? "bg-red-100" :
                    suggestion.type === "performance" ? "bg-blue-100" :
                    "bg-emerald-100"
                  }`}>
                    {suggestion.type === "security" && <Shield className="w-5 h-5 text-red-600" />}
                    {suggestion.type === "performance" && <Zap className="w-5 h-5 text-blue-600" />}
                    {suggestion.type === "quality" && <FileCode className="w-5 h-5 text-emerald-600" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">{suggestion.title}</h4>
                    <p className="text-sm text-slate-600 mb-2">{suggestion.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-mono">
                        {suggestion.file}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Lines {suggestion.linesAffected}
                      </Badge>
                      <Badge className={
                        suggestion.severity === "critical" ? "bg-red-100 text-red-700" :
                        suggestion.severity === "high" ? "bg-amber-100 text-amber-700" :
                        "bg-blue-100 text-blue-700"
                      }>
                        {suggestion.severity}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-sm font-medium text-emerald-900">
                  📈 Impact: {suggestion.impact}
                </p>
              </div>

              <Tabs defaultValue="before" className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="before">Current Code</TabsTrigger>
                  <TabsTrigger value="after">Optimized Code</TabsTrigger>
                </TabsList>
                <TabsContent value="before">
                  <div className="relative">
                    <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs overflow-x-auto">
                      <code>{suggestion.before}</code>
                    </pre>
                    <button
                      onClick={() => copyCode(suggestion.before, `before-${suggestion.id}`)}
                      className="absolute top-2 right-2 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      {copiedId === `before-${suggestion.id}` ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </div>
                </TabsContent>
                <TabsContent value="after">
                  <div className="relative">
                    <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs overflow-x-auto">
                      <code>{suggestion.after}</code>
                    </pre>
                    <button
                      onClick={() => copyCode(suggestion.after, `after-${suggestion.id}`)}
                      className="absolute top-2 right-2 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      {copiedId === `after-${suggestion.id}` ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 mt-4">
                <Button 
                  size="sm"
                  onClick={() => toast.success("Refactoring applied successfully!")}
                >
                  Apply Refactoring
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => toast.success("Pull request created successfully!")}
                >
                  Create PR
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => toast.info("Suggestion dismissed")}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}