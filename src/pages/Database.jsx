import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Database, 
  Plus, 
  Trash2, 
  Edit, 
  Table, 
  Key, 
  Link2, 
  Settings,
  Eye,
  Copy,
  Check,
  ChevronRight,
  FileJson,
  Sparkles,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";

const FIELD_TYPES = [
  { value: "string", label: "String", icon: "Aa" },
  { value: "number", label: "Number", icon: "#" },
  { value: "boolean", label: "Boolean", icon: "⊘" },
  { value: "date", label: "Date", icon: "📅" },
  { value: "datetime", label: "DateTime", icon: "🕐" },
  { value: "email", label: "Email", icon: "@" },
  { value: "url", label: "URL", icon: "🔗" },
  { value: "text", label: "Long Text", icon: "¶" },
  { value: "json", label: "JSON", icon: "{}" },
  { value: "array", label: "Array", icon: "[]" },
  { value: "reference", label: "Reference", icon: "→" }
];

const SAMPLE_SCHEMAS = [
  {
    id: "users",
    name: "Users",
    description: "User accounts and profiles",
    fields: [
      { name: "email", type: "email", required: true, unique: true, indexed: true },
      { name: "full_name", type: "string", required: true },
      { name: "avatar_url", type: "url", required: false },
      { name: "role", type: "string", required: true, default: "user", enum: ["admin", "user", "guest"] },
      { name: "is_active", type: "boolean", required: false, default: true },
      { name: "last_login", type: "datetime", required: false }
    ]
  },
  {
    id: "products",
    name: "Products",
    description: "Product catalog",
    fields: [
      { name: "name", type: "string", required: true, indexed: true },
      { name: "description", type: "text", required: false },
      { name: "price", type: "number", required: true },
      { name: "sku", type: "string", required: true, unique: true },
      { name: "category", type: "string", required: false },
      { name: "in_stock", type: "boolean", required: false, default: true },
      { name: "images", type: "array", required: false }
    ]
  },
  {
    id: "orders",
    name: "Orders",
    description: "Customer orders",
    fields: [
      { name: "order_number", type: "string", required: true, unique: true },
      { name: "customer_id", type: "reference", required: true, ref: "users" },
      { name: "status", type: "string", required: true, default: "pending", enum: ["pending", "processing", "shipped", "delivered", "cancelled"] },
      { name: "total_amount", type: "number", required: true },
      { name: "items", type: "json", required: true },
      { name: "shipping_address", type: "json", required: false },
      { name: "ordered_at", type: "datetime", required: true }
    ]
  }
];

export default function DatabasePage() {
  const [schemas, setSchemas] = useState(SAMPLE_SCHEMAS);
  const [selectedSchema, setSelectedSchema] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [newSchema, setNewSchema] = useState({
    name: "",
    description: "",
    fields: []
  });
  const [newField, setNewField] = useState({
    name: "",
    type: "string",
    required: false,
    unique: false,
    indexed: false,
    default: "",
    enum: [],
    ref: ""
  });

  const addField = () => {
    if (!newField.name) {
      toast.error("Field name is required");
      return;
    }
    if (isEditing && selectedSchema) {
      const updated = schemas.map(s => 
        s.id === selectedSchema.id 
          ? { ...s, fields: [...s.fields, { ...newField }] }
          : s
      );
      setSchemas(updated);
      setSelectedSchema({ ...selectedSchema, fields: [...selectedSchema.fields, { ...newField }] });
    } else {
      setNewSchema({ ...newSchema, fields: [...newSchema.fields, { ...newField }] });
    }
    setNewField({ name: "", type: "string", required: false, unique: false, indexed: false, default: "", enum: [], ref: "" });
    toast.success("Field added");
  };

  const removeField = (fieldName) => {
    if (isEditing && selectedSchema) {
      const updated = schemas.map(s => 
        s.id === selectedSchema.id 
          ? { ...s, fields: s.fields.filter(f => f.name !== fieldName) }
          : s
      );
      setSchemas(updated);
      setSelectedSchema({ ...selectedSchema, fields: selectedSchema.fields.filter(f => f.name !== fieldName) });
    } else {
      setNewSchema({ ...newSchema, fields: newSchema.fields.filter(f => f.name !== fieldName) });
    }
    toast.success("Field removed");
  };

  const createSchema = () => {
    if (!newSchema.name) {
      toast.error("Schema name is required");
      return;
    }
    const schema = {
      ...newSchema,
      id: newSchema.name.toLowerCase().replace(/\s+/g, '_')
    };
    setSchemas([...schemas, schema]);
    setNewSchema({ name: "", description: "", fields: [] });
    setIsCreating(false);
    toast.success("Schema created successfully");
  };

  const deleteSchema = (id) => {
    setSchemas(schemas.filter(s => s.id !== id));
    if (selectedSchema?.id === id) setSelectedSchema(null);
    toast.success("Schema deleted");
  };

  const generateSchemaWithAI = async () => {
    setGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a database schema for a ${newSchema.name || 'general'} entity with description: ${newSchema.description || 'standard entity'}.

Return JSON:
{
  "fields": [
    {
      "name": "<field_name>",
      "type": "<string|number|boolean|date|datetime|email|url|text|json|array|reference>",
      "required": <true|false>,
      "unique": <true|false>,
      "indexed": <true|false>,
      "description": "<field description>"
    }
  ]
}`,
        response_json_schema: {
          type: "object",
          properties: {
            fields: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  type: { type: "string" },
                  required: { type: "boolean" },
                  unique: { type: "boolean" },
                  indexed: { type: "boolean" },
                  description: { type: "string" }
                }
              }
            }
          }
        }
      });
      setNewSchema({ ...newSchema, fields: result.fields || [] });
      toast.success("Schema generated with AI!");
    } catch (error) {
      toast.error("Failed to generate schema");
    } finally {
      setGenerating(false);
    }
  };

  const copySchemaJSON = (schema) => {
    const jsonSchema = {
      name: schema.name,
      type: "object",
      properties: schema.fields.reduce((acc, field) => {
        acc[field.name] = {
          type: field.type === 'text' ? 'string' : field.type,
          ...(field.required && { required: true }),
          ...(field.unique && { unique: true }),
          ...(field.default && { default: field.default }),
          ...(field.enum?.length > 0 && { enum: field.enum }),
          ...(field.ref && { $ref: field.ref })
        };
        return acc;
      }, {}),
      required: schema.fields.filter(f => f.required).map(f => f.name)
    };
    navigator.clipboard.writeText(JSON.stringify(jsonSchema, null, 2));
    setCopied(true);
    toast.success("Schema JSON copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Database</h1>
            <p className="text-slate-500 mt-1">Design and manage your database schemas</p>
          </div>
          <Button onClick={() => setIsCreating(true)} className="bg-violet-600 hover:bg-violet-700">
            <Plus className="w-4 h-4 mr-2" /> New Schema
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Schema List */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Schemas</h2>
            {schemas.map((schema) => (
              <Card 
                key={schema.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedSchema?.id === schema.id && "ring-2 ring-violet-500"
                )}
                onClick={() => { setSelectedSchema(schema); setIsEditing(false); }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                        <Table className="w-5 h-5 text-violet-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{schema.name}</p>
                        <p className="text-xs text-slate-500">{schema.fields.length} fields</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Schema Details / Create Form */}
          <div className="lg:col-span-2">
            {isCreating ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-violet-600" />
                    Create New Schema
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Schema Name</Label>
                      <Input 
                        value={newSchema.name} 
                        onChange={(e) => setNewSchema({ ...newSchema, name: e.target.value })}
                        placeholder="e.g., Products, Orders"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input 
                        value={newSchema.description} 
                        onChange={(e) => setNewSchema({ ...newSchema, description: e.target.value })}
                        placeholder="Brief description"
                      />
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    onClick={generateSchemaWithAI}
                    disabled={generating}
                    className="w-full border-violet-200 text-violet-700 hover:bg-violet-50"
                  >
                    {generating ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
                    ) : (
                      <><Sparkles className="w-4 h-4 mr-2" /> Generate with AI</>
                    )}
                  </Button>

                  {/* Add Field Form */}
                  <div className="p-4 bg-slate-50 rounded-xl space-y-4">
                    <p className="text-sm font-semibold text-slate-700">Add Field</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Field Name</Label>
                        <Input 
                          value={newField.name}
                          onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                          placeholder="field_name"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Type</Label>
                        <Select value={newField.type} onValueChange={(v) => setNewField({ ...newField, type: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {FIELD_TYPES.map((t) => (
                              <SelectItem key={t.value} value={t.value}>
                                <span className="flex items-center gap-2">
                                  <span className="w-5 text-center">{t.icon}</span> {t.label}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Switch checked={newField.required} onCheckedChange={(v) => setNewField({ ...newField, required: v })} />
                        <Label className="text-xs">Required</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={newField.unique} onCheckedChange={(v) => setNewField({ ...newField, unique: v })} />
                        <Label className="text-xs">Unique</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={newField.indexed} onCheckedChange={(v) => setNewField({ ...newField, indexed: v })} />
                        <Label className="text-xs">Indexed</Label>
                      </div>
                    </div>
                    {newField.type === 'reference' && (
                      <div>
                        <Label className="text-xs">Reference Schema</Label>
                        <Select value={newField.ref} onValueChange={(v) => setNewField({ ...newField, ref: v })}>
                          <SelectTrigger><SelectValue placeholder="Select schema" /></SelectTrigger>
                          <SelectContent>
                            {schemas.map((s) => (
                              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <Button onClick={addField} size="sm">
                      <Plus className="w-3 h-3 mr-1" /> Add Field
                    </Button>
                  </div>

                  {/* Fields List */}
                  {newSchema.fields.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-slate-700">Fields ({newSchema.fields.length})</p>
                      {newSchema.fields.map((field) => (
                        <div key={field.name} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">{FIELD_TYPES.find(t => t.value === field.type)?.icon}</Badge>
                            <span className="font-medium text-slate-900">{field.name}</span>
                            <Badge variant="outline" className="text-xs">{field.type}</Badge>
                            {field.required && <Badge className="bg-red-100 text-red-700 text-xs">required</Badge>}
                            {field.unique && <Badge className="bg-blue-100 text-blue-700 text-xs">unique</Badge>}
                            {field.indexed && <Badge className="bg-amber-100 text-amber-700 text-xs">indexed</Badge>}
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => removeField(field.name)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button onClick={createSchema} className="bg-violet-600 hover:bg-violet-700">
                      Create Schema
                    </Button>
                    <Button variant="outline" onClick={() => { setIsCreating(false); setNewSchema({ name: "", description: "", fields: [] }); }}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : selectedSchema ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Table className="w-5 h-5 text-violet-600" />
                      {selectedSchema.name}
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => copySchemaJSON(selectedSchema)}>
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setIsEditing(!isEditing)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteSchema(selectedSchema.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600">{selectedSchema.description}</p>

                  {isEditing && (
                    <div className="p-4 bg-violet-50 rounded-xl space-y-4 border border-violet-200">
                      <p className="text-sm font-semibold text-violet-900">Add New Field</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Field Name</Label>
                          <Input 
                            value={newField.name}
                            onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                            placeholder="field_name"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Type</Label>
                          <Select value={newField.type} onValueChange={(v) => setNewField({ ...newField, type: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {FIELD_TYPES.map((t) => (
                                <SelectItem key={t.value} value={t.value}>{t.icon} {t.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Switch checked={newField.required} onCheckedChange={(v) => setNewField({ ...newField, required: v })} />
                          <Label className="text-xs">Required</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={newField.unique} onCheckedChange={(v) => setNewField({ ...newField, unique: v })} />
                          <Label className="text-xs">Unique</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={newField.indexed} onCheckedChange={(v) => setNewField({ ...newField, indexed: v })} />
                          <Label className="text-xs">Indexed</Label>
                        </div>
                      </div>
                      <Button onClick={addField} size="sm">
                        <Plus className="w-3 h-3 mr-1" /> Add Field
                      </Button>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-700">Fields</p>
                      <Badge variant="outline">{selectedSchema.fields.length} fields</Badge>
                    </div>
                    {selectedSchema.fields.map((field) => (
                      <div key={field.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                            <span className="text-lg">{FIELD_TYPES.find(t => t.value === field.type)?.icon}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900">{field.name}</span>
                              {field.required && <Key className="w-3 h-3 text-red-500" />}
                              {field.ref && <Link2 className="w-3 h-3 text-blue-500" />}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">{field.type}</Badge>
                              {field.unique && <Badge className="bg-blue-100 text-blue-700 text-xs">unique</Badge>}
                              {field.indexed && <Badge className="bg-amber-100 text-amber-700 text-xs">indexed</Badge>}
                              {field.default && <Badge className="bg-slate-100 text-slate-600 text-xs">default: {String(field.default)}</Badge>}
                              {field.enum?.length > 0 && <Badge className="bg-purple-100 text-purple-700 text-xs">enum</Badge>}
                              {field.ref && <Badge className="bg-green-100 text-green-700 text-xs">→ {field.ref}</Badge>}
                            </div>
                          </div>
                        </div>
                        {isEditing && (
                          <Button size="sm" variant="ghost" onClick={() => removeField(field.name)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* JSON Preview */}
                  <div className="mt-6">
                    <p className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <FileJson className="w-4 h-4" /> JSON Schema
                    </p>
                    <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs overflow-auto max-h-60">
                      {JSON.stringify({
                        name: selectedSchema.name,
                        type: "object",
                        properties: selectedSchema.fields.reduce((acc, f) => {
                          acc[f.name] = { type: f.type, ...(f.required && { required: true }) };
                          return acc;
                        }, {}),
                        required: selectedSchema.fields.filter(f => f.required).map(f => f.name)
                      }, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-16">
                  <Database className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-lg font-medium text-slate-600">Select a schema to view details</p>
                  <p className="text-sm text-slate-400">or create a new one to get started</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}