import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileCode, Plus, Trash2, Eye, Rocket, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const TERRAFORM_TEMPLATES = {
  aws_ec2: `# AWS EC2 Instance
provider "aws" {
  region = var.aws_region
}

resource "aws_instance" "app_server" {
  ami           = var.ami_id
  instance_type = var.instance_type
  
  tags = {
    Name = var.instance_name
  }
}

variable "aws_region" {
  default = "us-east-1"
}

variable "ami_id" {
  default = "ami-0c55b159cbfafe1f0"
}

variable "instance_type" {
  default = "t2.micro"
}

variable "instance_name" {
  default = "AppServer"
}`,
  
  aws_s3: `# AWS S3 Bucket
provider "aws" {
  region = var.aws_region
}

resource "aws_s3_bucket" "storage" {
  bucket = var.bucket_name
  
  tags = {
    Environment = var.environment
  }
}

resource "aws_s3_bucket_versioning" "storage_versioning" {
  bucket = aws_s3_bucket.storage.id
  versioning_configuration {
    status = "Enabled"
  }
}

variable "aws_region" {
  default = "us-east-1"
}

variable "bucket_name" {
  default = "my-app-bucket"
}

variable "environment" {
  default = "production"
}`,

  azure_vm: `# Azure Virtual Machine
provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_virtual_network" "main" {
  name                = "\${var.prefix}-network"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
}

resource "azurerm_subnet" "internal" {
  name                 = "internal"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.2.0/24"]
}

resource "azurerm_linux_virtual_machine" "main" {
  name                = "\${var.prefix}-vm"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  size                = var.vm_size
  admin_username      = var.admin_username
  
  network_interface_ids = [
    azurerm_network_interface.main.id,
  ]
  
  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }
}

variable "location" {
  default = "East US"
}

variable "resource_group_name" {
  default = "my-resources"
}

variable "prefix" {
  default = "app"
}

variable "vm_size" {
  default = "Standard_B2s"
}

variable "admin_username" {
  default = "adminuser"
}`,

  gcp_compute: `# GCP Compute Instance
provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_compute_instance" "default" {
  name         = var.instance_name
  machine_type = var.machine_type
  zone         = var.zone

  boot_disk {
    initialize_params {
      image = var.image
    }
  }

  network_interface {
    network = "default"
    access_config {
      // Ephemeral IP
    }
  }

  metadata = {
    environment = var.environment
  }
}

variable "project_id" {
  default = "my-project-id"
}

variable "region" {
  default = "us-central1"
}

variable "zone" {
  default = "us-central1-a"
}

variable "instance_name" {
  default = "app-instance"
}

variable "machine_type" {
  default = "e2-medium"
}

variable "image" {
  default = "debian-cloud/debian-11"
}

variable "environment" {
  default = "production"
}`
};

export default function IaCTemplateManager() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    provider: "aws",
    iac_tool: "terraform",
    template_type: "compute",
    template_content: "",
    variables: {}
  });

  const queryClient = useQueryClient();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["iac-templates"],
    queryFn: () => base44.entities.IaCTemplate.list("-created_date", 50)
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.IaCTemplate.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["iac-templates"] });
      setShowCreateForm(false);
      resetForm();
      toast.success("Template created successfully");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.IaCTemplate.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["iac-templates"] });
      toast.success("Template deleted");
    }
  });

  const loadSampleTemplate = (key) => {
    setFormData(prev => ({
      ...prev,
      template_content: TERRAFORM_TEMPLATES[key]
    }));
    toast.success("Sample template loaded");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      provider: "aws",
      iac_tool: "terraform",
      template_type: "compute",
      template_content: "",
      variables: {}
    });
  };

  const copyTemplate = (content, id) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success("Template copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-violet-600" />
            Infrastructure Templates
          </span>
          <Button onClick={() => setShowCreateForm(!showCreateForm)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showCreateForm && (
          <div className="mb-6 p-4 border-2 border-violet-200 rounded-xl bg-violet-50/50">
            <h3 className="font-semibold text-slate-900 mb-4">Create New Template</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="My Infrastructure Template"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">IaC Tool</label>
                  <Select value={formData.iac_tool} onValueChange={(value) => setFormData({ ...formData, iac_tool: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="terraform">Terraform</SelectItem>
                      <SelectItem value="pulumi">Pulumi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Provider</label>
                  <Select value={formData.provider} onValueChange={(value) => setFormData({ ...formData, provider: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aws">AWS</SelectItem>
                      <SelectItem value="azure">Azure</SelectItem>
                      <SelectItem value="gcp">GCP</SelectItem>
                      <SelectItem value="multi-cloud">Multi-Cloud</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Type</label>
                  <Select value={formData.template_type} onValueChange={(value) => setFormData({ ...formData, template_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compute">Compute</SelectItem>
                      <SelectItem value="storage">Storage</SelectItem>
                      <SelectItem value="database">Database</SelectItem>
                      <SelectItem value="networking">Networking</SelectItem>
                      <SelectItem value="kubernetes">Kubernetes</SelectItem>
                      <SelectItem value="serverless">Serverless</SelectItem>
                      <SelectItem value="complete-stack">Complete Stack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Description</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Infrastructure template description"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700">Template Code</label>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => loadSampleTemplate('aws_ec2')}>
                      AWS EC2 Sample
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => loadSampleTemplate('aws_s3')}>
                      AWS S3 Sample
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => loadSampleTemplate('azure_vm')}>
                      Azure VM Sample
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => loadSampleTemplate('gcp_compute')}>
                      GCP Compute Sample
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={formData.template_content}
                  onChange={(e) => setFormData({ ...formData, template_content: e.target.value })}
                  placeholder="Enter your Terraform or Pulumi code here..."
                  className="font-mono text-sm h-64"
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={() => createMutation.mutate(formData)} disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create Template"}
                </Button>
                <Button variant="outline" onClick={() => { setShowCreateForm(false); resetForm(); }}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-3 border-violet-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-8">
            <FileCode className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No templates yet. Create your first IaC template.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {templates.map((template) => (
              <div key={template.id} className="border-2 border-slate-200 rounded-xl p-4 hover:border-violet-300 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">{template.name}</h4>
                    <p className="text-sm text-slate-600">{template.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className="bg-violet-100 text-violet-700">{template.iac_tool}</Badge>
                    <Badge variant="outline">{template.provider}</Badge>
                    <Badge variant="outline">{template.template_type}</Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                  <span>Status: <span className="font-medium">{template.status}</span></span>
                  <span>•</span>
                  <span>Deployments: <span className="font-medium">{template.deployment_count || 0}</span></span>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedTemplate(template.id === selectedTemplate ? null : template.id)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {selectedTemplate === template.id ? "Hide" : "View"} Code
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyTemplate(template.template_content, template.id)}
                  >
                    {copiedId === template.id ? (
                      <Check className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => toast.info("Deployment functionality ready - integrate with provisioner")}
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    Deploy
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(template.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>

                {selectedTemplate === template.id && (
                  <div className="mt-4">
                    <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs overflow-x-auto">
                      <code>{template.template_content}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}