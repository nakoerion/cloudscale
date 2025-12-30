import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Code,
  FileCode,
  Server,
  Shield,
  Network,
  Lock,
  Download,
  Play,
  Settings,
  CheckCircle2,
  Edit,
  Wand2,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import TemplateEditor from "@/components/infrastructure/TemplateEditor";
import TerraformGenerator from "@/components/infrastructure/TerraformGenerator";
import TenantManager from "@/components/infrastructure/TenantManager";
import DataIsolationViewer from "@/components/infrastructure/DataIsolationViewer";
import TenantConfigManager from "@/components/infrastructure/TenantConfigManager";
import DatabaseSchemaOptimizer from "@/components/infrastructure/DatabaseSchemaOptimizer";
import DatabaseManager from "@/components/infrastructure/DatabaseManager";
import CacheManager from "@/components/infrastructure/CacheManager";
import AutoScalingManager from "@/components/infrastructure/AutoScalingManager";
import HealthCheckManager from "@/components/infrastructure/HealthCheckManager";
import IaCTemplateManager from "@/components/infrastructure/IaCTemplateManager";
import IaCProvisioner from "@/components/infrastructure/IaCProvisioner";
import { toast } from "sonner";

const DEFAULT_TEMPLATES = [
  {
    id: "vpc",
    name: "VPC with Subnets",
    provider: "AWS",
    description: "Private VPC with public, private, and database subnets",
    resources: ["VPC", "3 Subnets", "Internet Gateway", "NAT Gateway", "Route Tables"],
    code: `resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name = "main-vpc"
  }
}

resource "aws_subnet" "public" {
  count             = 3
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index)
  availability_zone = data.aws_availability_zones.available.names[count.index]
  
  tags = {
    Name = "public-subnet-\${count.index + 1}"
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  
  tags = {
    Name = "main-igw"
  }
}

resource "aws_nat_gateway" "main" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[0].id
}`
  },
  {
    id: "kubernetes",
    name: "Kubernetes Cluster",
    provider: "GCP",
    description: "Production-ready GKE cluster with auto-scaling",
    resources: ["GKE Cluster", "Node Pools", "Load Balancer", "Auto-scaling", "Monitoring"],
    code: `resource "google_container_cluster" "primary" {
  name     = "gke-cluster"
  location = "us-central1"
  
  initial_node_count = 1
  
  node_config {
    machine_type = "e2-medium"
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  }
}`
  },
  {
    id: "serverless",
    name: "Serverless API",
    provider: "AWS",
    description: "API Gateway with Lambda functions and DynamoDB",
    resources: ["API Gateway", "Lambda Functions", "DynamoDB", "CloudWatch", "IAM Roles"],
    code: `resource "aws_lambda_function" "api" {
  filename      = "lambda.zip"
  function_name = "api-handler"
  role          = aws_iam_role.lambda.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"
}

resource "aws_api_gateway_rest_api" "api" {
  name        = "serverless-api"
  description = "Serverless API Gateway"
}`
  },
  {
    id: "database",
    name: "Database Cluster",
    provider: "Azure",
    description: "High-availability PostgreSQL with backups",
    resources: ["PostgreSQL", "Read Replicas", "Backup Vault", "Private Endpoint", "Monitoring"],
    code: `resource "azurerm_postgresql_flexible_server" "main" {
  name                = "postgres-server"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  
  sku_name   = "GP_Standard_D2s_v3"
  version    = "15"
  
  storage_mb = 32768
}`
  }
];

const SECURITY_FEATURES = [
  { name: "VPC Isolation", status: "active", icon: Network },
  { name: "Private Endpoints", status: "active", icon: Lock },
  { name: "Security Groups", status: "configured", icon: Shield },
  { name: "SSL/TLS", status: "active", icon: Lock },
  { name: "IAM Policies", status: "configured", icon: Shield },
  { name: "VPN Gateway", status: "inactive", icon: Network }
];

export default function Infrastructure() {
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);

  const handleSaveTemplate = (template) => {
    const newTemplate = {
      ...template,
      id: `custom-${Date.now()}`,
      isCustom: true
    };
    setTemplates([...templates, newTemplate]);
    setShowEditor(false);
    toast.success("Custom template saved");
  };

  const handleGenerateTemplate = (template) => {
    const newTemplate = {
      ...template,
      id: `generated-${Date.now()}`,
      isCustom: true
    };
    setTemplates([...templates, newTemplate]);
  };

  const handleCustomize = (template) => {
    setEditingTemplate(template);
    setShowEditor(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Infrastructure as Code</h1>
            <p className="text-slate-500">Provision and manage cloud infrastructure with Terraform templates</p>
          </div>
          <Button 
            onClick={() => setShowGenerator(true)}
            className="bg-violet-600 hover:bg-violet-700"
          >
            <Wand2 className="w-4 h-4 mr-2" /> Generate Terraform
          </Button>
        </div>

        <Tabs defaultValue="iac" className="w-full">
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="iac">
              <Code className="w-4 h-4 mr-2" /> IaC Manager
            </TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="caching">Caching</TabsTrigger>
            <TabsTrigger value="scaling">Auto-Scaling</TabsTrigger>
            <TabsTrigger value="health">Health Checks</TabsTrigger>
            <TabsTrigger value="multi-tenancy">
              <Server className="w-4 h-4 mr-2" /> Multi-Tenancy
            </TabsTrigger>
            <TabsTrigger value="templates">
              <FileCode className="w-4 h-4 mr-2" /> IaC Templates
            </TabsTrigger>
            <TabsTrigger value="networking">
              <Network className="w-4 h-4 mr-2" /> Networking
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" /> Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="iac" className="mt-6">
            <div className="space-y-6">
              <IaCTemplateManager />
              <IaCProvisioner />
            </div>
          </TabsContent>

          <TabsContent value="database" className="mt-6">
            <DatabaseManager />
          </TabsContent>

          <TabsContent value="caching" className="mt-6">
            <CacheManager />
          </TabsContent>

          <TabsContent value="scaling" className="mt-6">
            <AutoScalingManager />
          </TabsContent>

          <TabsContent value="health" className="mt-6">
            <HealthCheckManager />
          </TabsContent>

          {/* Multi-Tenancy */}
          <TabsContent value="multi-tenancy" className="mt-6">
            <div className="space-y-6">
              <TenantManager />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DataIsolationViewer />
                <div className="space-y-6">
                  <TenantConfigManager tenantId={selectedTenant} />
                  <DatabaseSchemaOptimizer />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Templates */}
          <TabsContent value="templates" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">{template.name}</h3>
                      <div className="flex gap-2">
                        <Badge variant="outline">{template.provider}</Badge>
                        {template.isCustom && (
                          <Badge className="bg-violet-100 text-violet-700">Custom</Badge>
                        )}
                      </div>
                    </div>
                    <FileCode className="w-8 h-8 text-violet-600" />
                  </div>
                  <p className="text-sm text-slate-500 mb-4">{template.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.resources.slice(0, 3).map((resource, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                        {resource}
                      </span>
                    ))}
                    {template.resources.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-slate-100 text-slate-500 rounded">
                        +{template.resources.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <Code className="w-3 h-3 mr-1" /> View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleCustomize(template)}
                    >
                      <Edit className="w-3 h-3 mr-1" /> Customize
                    </Button>
                    <Button size="sm" className="flex-1 bg-violet-600 hover:bg-violet-700">
                      <Play className="w-3 h-3 mr-1" /> Deploy
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {selectedTemplate && (
              <div className="bg-slate-900 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{selectedTemplate.name} - Terraform</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="bg-white/10 text-white border-white/20"
                      onClick={() => handleCustomize(selectedTemplate)}
                    >
                      <Edit className="w-4 h-4 mr-2" /> Customize
                    </Button>
                    <Button variant="outline" className="bg-white/10 text-white border-white/20">
                      <Download className="w-4 h-4 mr-2" /> Download
                    </Button>
                  </div>
                </div>
                <pre className="text-sm text-slate-100 overflow-x-auto">
                  <code>{selectedTemplate.code}</code>
                </pre>
              </div>
            )}
          </TabsContent>

          {/* Networking */}
          <TabsContent value="networking" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">VPC Configuration</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Network className="w-5 h-5 text-blue-600" />
                      <h4 className="font-medium text-blue-900">Public Subnet</h4>
                    </div>
                    <p className="text-sm text-blue-700">10.0.1.0/24 - Internet accessible</p>
                  </div>
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Lock className="w-5 h-5 text-purple-600" />
                      <h4 className="font-medium text-purple-900">Private Subnet</h4>
                    </div>
                    <p className="text-sm text-purple-700">10.0.2.0/24 - Internal only</p>
                  </div>
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Server className="w-5 h-5 text-emerald-600" />
                      <h4 className="font-medium text-emerald-900">Database Subnet</h4>
                    </div>
                    <p className="text-sm text-emerald-700">10.0.3.0/24 - Isolated</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Network Features</h3>
                <div className="space-y-3">
                  {[
                    { name: "Internet Gateway", desc: "Public internet access" },
                    { name: "NAT Gateway", desc: "Outbound internet for private subnets" },
                    { name: "VPC Peering", desc: "Connect multiple VPCs" },
                    { name: "VPN Connection", desc: "Secure on-premises connectivity" },
                    { name: "Route Tables", desc: "Control traffic routing" }
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">{feature.name}</p>
                        <p className="text-sm text-slate-500">{feature.desc}</p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SECURITY_FEATURES.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6 text-violet-600" />
                      </div>
                      <Badge className={cn(
                        feature.status === "active" && "bg-emerald-100 text-emerald-700",
                        feature.status === "configured" && "bg-blue-100 text-blue-700",
                        feature.status === "inactive" && "bg-slate-100 text-slate-700"
                      )}>
                        {feature.status}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{feature.name}</h3>
                    <Button variant="outline" size="sm" className="w-full">
                      <Settings className="w-3 h-3 mr-2" /> Configure
                    </Button>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Security Best Practices</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Enable encryption at rest and in transit",
                  "Use private subnets for sensitive workloads",
                  "Implement least privilege access with IAM",
                  "Enable VPC Flow Logs for monitoring",
                  "Use AWS WAF for application protection",
                  "Regular security audits and compliance checks"
                ].map((practice, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-700">{practice}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <TemplateEditor
        template={editingTemplate}
        open={showEditor}
        onClose={() => {
          setShowEditor(false);
          setEditingTemplate(null);
        }}
        onSave={handleSaveTemplate}
      />

      <TerraformGenerator
        open={showGenerator}
        onClose={() => setShowGenerator(false)}
        onGenerate={handleGenerateTemplate}
      />
    </div>
  );
}