import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Copy, Download, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const PROJECT_TYPES = [
  { value: "react", label: "React / Frontend" },
  { value: "node", label: "Node.js Backend" },
  { value: "python", label: "Python Application" },
  { value: "microservices", label: "Microservices" },
  { value: "mobile", label: "Mobile App" },
  { value: "fullstack", label: "Full Stack" }
];

const DEPLOYMENT_TARGETS = [
  { value: "aws", label: "AWS (ECS/EKS)" },
  { value: "azure", label: "Azure (AKS)" },
  { value: "gcp", label: "Google Cloud (GKE)" },
  { value: "vercel", label: "Vercel" },
  { value: "netlify", label: "Netlify" },
  { value: "heroku", label: "Heroku" }
];

export default function AIPipelineGenerator() {
  const [projectType, setProjectType] = useState("");
  const [deploymentTarget, setDeploymentTarget] = useState("");
  const [requirements, setRequirements] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedConfig, setGeneratedConfig] = useState(null);

  const generatePipeline = async () => {
    setGenerating(true);
    toast.info("AI is analyzing your project requirements...");

    // Simulate AI generation
    setTimeout(() => {
      const config = {
        provider: "github-actions",
        yaml: `name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linter
        run: npm run lint
        
      - name: Run tests
        run: npm test -- --coverage
        
      - name: Build application
        run: npm run build
        
      - name: Security scan
        run: npm audit --audit-level=high
        
  deploy:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
          
      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster production \\
            --service app --force-new-deployment`,
        insights: [
          "Added automatic security scanning with npm audit",
          "Included test coverage reporting",
          "Configured deployment only for main branch",
          "Separated build and deploy jobs for better control"
        ],
        estimatedDuration: "8-12 minutes"
      };

      setGeneratedConfig(config);
      setGenerating(false);
      toast.success("Pipeline configuration generated!");
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedConfig.yaml);
    toast.success("Configuration copied to clipboard!");
  };

  const downloadConfig = () => {
    const blob = new Blob([generatedConfig.yaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.github-workflows-ci-cd.yml';
    a.click();
    toast.success("Configuration downloaded!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-600" />
          AI Pipeline Configuration Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Project Type
            </label>
            <Select value={projectType} onValueChange={setProjectType}>
              <SelectTrigger>
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Deployment Target
            </label>
            <Select value={deploymentTarget} onValueChange={setDeploymentTarget}>
              <SelectTrigger>
                <SelectValue placeholder="Select deployment target" />
              </SelectTrigger>
              <SelectContent>
                {DEPLOYMENT_TARGETS.map((target) => (
                  <SelectItem key={target.value} value={target.value}>
                    {target.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Additional Requirements (Optional)
          </label>
          <Textarea
            placeholder="e.g., Need database migrations, require manual approval for production, run E2E tests..."
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            className="h-24"
          />
        </div>

        <Button
          onClick={generatePipeline}
          disabled={!projectType || !deploymentTarget || generating}
          className="w-full bg-violet-600 hover:bg-violet-700"
        >
          {generating ? (
            <>
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              Generating Pipeline...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Pipeline Configuration
            </>
          )}
        </Button>

        {generatedConfig && (
          <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Generated
                </Badge>
                <Badge variant="outline">{generatedConfig.provider}</Badge>
                <Badge variant="outline">~{generatedConfig.estimatedDuration}</Badge>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4 mr-1" /> Copy
                </Button>
                <Button size="sm" variant="outline" onClick={downloadConfig}>
                  <Download className="w-4 h-4 mr-1" /> Download
                </Button>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900 mb-2">AI Insights:</p>
              <ul className="space-y-1">
                {generatedConfig.insights.map((insight, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-violet-600">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900 mb-2">Configuration:</p>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs overflow-x-auto max-h-64 overflow-y-auto">
                <code>{generatedConfig.yaml}</code>
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}