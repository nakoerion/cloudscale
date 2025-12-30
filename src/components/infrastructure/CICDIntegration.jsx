import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  GitBranch, 
  Settings, 
  CheckCircle2,
  XCircle,
  ExternalLink,
  Copy,
  Github,
  GitlabIcon as Gitlab
} from "lucide-react";
import { toast } from "sonner";

const GITHUB_WORKFLOW = `name: Deploy Infrastructure

on:
  push:
    branches: [ main ]
    paths:
      - 'terraform/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
        with:
          terraform_version: 1.6.0
      
      - name: Configure Cloud Credentials
        run: |
          echo "Setting up cloud provider credentials"
          # Add your AWS/Azure/GCP credentials here
      
      - name: Terraform Init
        run: terraform init
        working-directory: ./terraform
      
      - name: Terraform Plan
        run: terraform plan -out=tfplan
        working-directory: ./terraform
      
      - name: Terraform Apply
        run: terraform apply -auto-approve tfplan
        working-directory: ./terraform
      
      - name: Notify CloudForge
        run: |
          curl -X POST "${{ secrets.CLOUDFORGE_WEBHOOK_URL }}" \\
            -H "Content-Type: application/json" \\
            -d '{"status": "completed", "commit": "${{ github.sha }}"}'`;

const GITLAB_CI = `stages:
  - validate
  - plan
  - apply

variables:
  TF_ROOT: terraform

.terraform_template:
  image: hashicorp/terraform:1.6
  before_script:
    - cd $TF_ROOT
    - terraform init

validate:
  extends: .terraform_template
  stage: validate
  script:
    - terraform validate

plan:
  extends: .terraform_template
  stage: plan
  script:
    - terraform plan -out=tfplan
  artifacts:
    paths:
      - $TF_ROOT/tfplan

apply:
  extends: .terraform_template
  stage: apply
  script:
    - terraform apply -auto-approve tfplan
  dependencies:
    - plan
  only:
    - main
  when: manual`;

export default function CICDIntegration({ deploymentId }) {
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState({
    ci_cd_enabled: false,
    git_repository: "",
    git_branch: "main",
    ci_provider: "github-actions"
  });

  const queryClient = useQueryClient();

  const { data: deployment } = useQuery({
    queryKey: ["iac-deployment", deploymentId],
    queryFn: async () => {
      const deployments = await base44.entities.IaCDeployment.filter({ id: deploymentId });
      return deployments[0];
    },
    enabled: !!deploymentId
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.IaCDeployment.update(deploymentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["iac-deployment", deploymentId] });
      queryClient.invalidateQueries({ queryKey: ["iac-deployments"] });
      toast.success("CI/CD configuration updated");
      setShowConfig(false);
    }
  });

  const handleSaveConfig = () => {
    if (!config.git_repository) {
      toast.error("Git repository URL is required");
      return;
    }
    updateMutation.mutate(config);
  };

  const copyWorkflow = (content) => {
    navigator.clipboard.writeText(content);
    toast.success("Workflow copied to clipboard");
  };

  const workflowContent = config.ci_provider === "github-actions" ? GITHUB_WORKFLOW : GITLAB_CI;
  const workflowFile = config.ci_provider === "github-actions" ? ".github/workflows/deploy.yml" : ".gitlab-ci.yml";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-blue-600" />
            CI/CD Integration
          </span>
          <Button onClick={() => setShowConfig(!showConfig)} size="sm" variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showConfig ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-blue-900">Enable Auto-Deployment</p>
                <p className="text-sm text-blue-700">Deploy infrastructure on Git commits</p>
              </div>
              <Switch
                checked={config.ci_cd_enabled}
                onCheckedChange={(checked) => setConfig({ ...config, ci_cd_enabled: checked })}
              />
            </div>

            {config.ci_cd_enabled && (
              <>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">CI/CD Provider</label>
                  <Select value={config.ci_provider} onValueChange={(value) => setConfig({ ...config, ci_provider: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="github-actions">
                        <div className="flex items-center gap-2">
                          <Github className="w-4 h-4" />
                          GitHub Actions
                        </div>
                      </SelectItem>
                      <SelectItem value="gitlab-ci">
                        <div className="flex items-center gap-2">
                          <Gitlab className="w-4 h-4" />
                          GitLab CI
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Git Repository URL</label>
                  <Input
                    value={config.git_repository}
                    onChange={(e) => setConfig({ ...config, git_repository: e.target.value })}
                    placeholder="https://github.com/username/repo"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Branch</label>
                  <Input
                    value={config.git_branch}
                    onChange={(e) => setConfig({ ...config, git_branch: e.target.value })}
                    placeholder="main"
                  />
                </div>

                <div className="border-2 border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-slate-900">Workflow Configuration</h4>
                    <Button size="sm" variant="outline" onClick={() => copyWorkflow(workflowContent)}>
                      <Copy className="w-3 h-3 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">
                    Add this file to your repository: <code className="bg-slate-100 px-2 py-1 rounded">{workflowFile}</code>
                  </p>
                  <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs overflow-x-auto max-h-64">
                    <code>{workflowContent}</code>
                  </pre>
                </div>
              </>
            )}

            <div className="flex gap-3">
              <Button onClick={handleSaveConfig} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save Configuration"}
              </Button>
              <Button variant="outline" onClick={() => setShowConfig(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : deployment?.ci_cd_enabled ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="font-medium text-emerald-900">CI/CD Enabled</p>
                  <p className="text-sm text-emerald-700">Auto-deploying from {deployment.git_branch}</p>
                </div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700">
                {deployment.ci_provider === "github-actions" ? "GitHub Actions" : "GitLab CI"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border border-slate-200 rounded-lg">
                <p className="text-sm text-slate-500 mb-1">Repository</p>
                <p className="text-sm font-medium text-slate-900 truncate">{deployment.git_repository}</p>
              </div>
              <div className="p-3 border border-slate-200 rounded-lg">
                <p className="text-sm text-slate-500 mb-1">Branch</p>
                <p className="text-sm font-medium text-slate-900">{deployment.git_branch}</p>
              </div>
            </div>

            {deployment.last_commit_sha && (
              <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-blue-900">Last Deployment</p>
                    <p className="text-xs text-blue-700 mt-1">{deployment.last_commit_message}</p>
                  </div>
                  {deployment.workflow_url && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={deployment.workflow_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-2" />
                        View Workflow
                      </a>
                    </Button>
                  )}
                </div>
                <p className="text-xs text-blue-600 font-mono">{deployment.last_commit_sha?.substring(0, 7)}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <GitBranch className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-600 mb-4">
              CI/CD not configured. Enable auto-deployment to trigger infrastructure updates on code commits.
            </p>
            <Button onClick={() => setShowConfig(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Configure CI/CD
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}