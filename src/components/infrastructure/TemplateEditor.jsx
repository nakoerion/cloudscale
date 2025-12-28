import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Save, Download, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export default function TemplateEditor({ template, open, onClose, onSave }) {
  const [name, setName] = useState(template?.name || "");
  const [description, setDescription] = useState(template?.description || "");
  const [code, setCode] = useState(template?.code || "");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Please enter a template name");
      return;
    }
    onSave({
      ...template,
      name,
      description,
      code,
      isCustom: true,
      provider: "Custom"
    });
    onClose();
    toast.success("Template saved successfully");
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/\s+/g, "-").toLowerCase()}.tf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Template downloaded");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>Customize Template</span>
            {template?.isCustom && (
              <Badge variant="outline" className="bg-violet-100 text-violet-700">Custom</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Template Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Custom Template"
              />
            </div>
            <div>
              <Label>Provider</Label>
              <Input
                value={template?.provider || "Custom"}
                disabled
                className="bg-slate-50"
              />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this template does..."
            />
          </div>

          <div>
            <Label>Terraform Code</Label>
            <div className="relative">
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-mono text-sm h-96 bg-slate-900 text-slate-100 border-slate-700"
                placeholder="Enter your Terraform configuration..."
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="absolute top-2 right-2 bg-slate-800 hover:bg-slate-700 text-white"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" /> Download
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-violet-600 hover:bg-violet-700">
            <Save className="w-4 h-4 mr-2" /> Save as Custom Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}