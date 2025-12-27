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
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

const IAC_TEMPLATES = [
  {
    id: "vpc",
    name: "VPC with Subnets",
    provider: "AWS",
    description: "Private VPC with public, private, and database subnets",
    resources: ["VPC", "3 Subnets", "Internet Gateway", "NAT Gateway", "Route Tables"]
  },
  {
    id: "kubernetes",
    name: "Kubernetes Cluster",
    provider: "GCP",
    description: "Production-ready GKE cluster with auto-scaling",
    resources: ["GKE Cluster", "Node Pools", "Load Balancer", "Auto-scaling", "Monitoring"]
  },
  {
    id: "serverless",
    name: "Serverless API",
    provider: "AWS",
    description: "API Gateway with Lambda functions and DynamoDB",
    resources: ["API Gateway", "Lambda Functions", "DynamoDB", "CloudWatch", "IAM Roles"]
  },
  {
    id: "database",
    name: "Database Cluster",
    provider: "Azure",
    description: "High-availability PostgreSQL with backups",
    resources: ["PostgreSQL", "Read Replicas", "Backup Vault", "Private Endpoint", "Monitoring"]
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
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Infrastructure as Code</h1>
          <p className="text-slate-500">Provision and manage cloud infrastructure with Terraform templates</p>
        </div>

        <Tabs defaultValue="templates" className="w-full">
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="templates">
              <FileCode className="w-4 h-4 mr-2" /> IaC Templates
            </TabsTrigger>
            <TabsTrigger value="networking">
              <Network className="w-4 h-4 mr-2" /> Private Networking
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" /> Security
            </TabsTrigger>
          </TabsList>

          {/* Templates */}
          <TabsContent value="templates" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {IAC_TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">{template.name}</h3>
                      <Badge variant="outline">{template.provider}</Badge>
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
                    <Button size="sm" variant="outline" className="flex-1">
                      <Code className="w-3 h-3 mr-1" /> View Code
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
                  <Button variant="outline" className="bg-white/10 text-white border-white/20">
                    <Download className="w-4 h-4 mr-2" /> Download
                  </Button>
                </div>
                <pre className="text-sm text-slate-100 overflow-x-auto">
                  <code>{`resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  
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
}`}</code>
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
    </div>
  );
}