import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { 
  Sparkles, 
  FileText, 
  Megaphone, 
  BookOpen, 
  Loader2, 
  Copy, 
  Check,
  RefreshCw,
  Wand2
} from "lucide-react";
import { toast } from "sonner";

export default function AIContentGenerator({ formData, template }) {
  const [activeTab, setActiveTab] = useState("placeholder");
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [copied, setCopied] = useState(false);
  const [contentOptions, setContentOptions] = useState({
    tone: "professional",
    length: "medium",
    audience: "general"
  });

  const generatePlaceholderContent = async () => {
    setGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate placeholder content for a ${template || formData?.template || 'web'} application called "${formData?.name || 'My App'}".

App Description: ${formData?.description || 'A modern web application'}
Features: ${formData?.features?.join(', ') || 'standard features'}

Generate realistic placeholder content in JSON format:
{
  "hero_section": {
    "headline": "<compelling headline>",
    "subheadline": "<supporting text>",
    "cta_primary": "<primary button text>",
    "cta_secondary": "<secondary button text>"
  },
  "features_section": [
    {
      "title": "<feature title>",
      "description": "<feature description>",
      "icon_suggestion": "<emoji>"
    }
  ],
  "testimonials": [
    {
      "quote": "<testimonial quote>",
      "author": "<name>",
      "role": "<job title>",
      "company": "<company name>"
    }
  ],
  "faq": [
    {
      "question": "<question>",
      "answer": "<answer>"
    }
  ],
  "footer": {
    "tagline": "<company tagline>",
    "copyright": "<copyright text>"
  }
}`,
        response_json_schema: {
          type: "object",
          properties: {
            hero_section: {
              type: "object",
              properties: {
                headline: { type: "string" },
                subheadline: { type: "string" },
                cta_primary: { type: "string" },
                cta_secondary: { type: "string" }
              }
            },
            features_section: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  icon_suggestion: { type: "string" }
                }
              }
            },
            testimonials: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  quote: { type: "string" },
                  author: { type: "string" },
                  role: { type: "string" },
                  company: { type: "string" }
                }
              }
            },
            faq: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  answer: { type: "string" }
                }
              }
            },
            footer: {
              type: "object",
              properties: {
                tagline: { type: "string" },
                copyright: { type: "string" }
              }
            }
          }
        }
      });
      setGeneratedContent({ type: "placeholder", data: result });
      toast.success("Placeholder content generated!");
    } catch (error) {
      toast.error("Failed to generate content");
    } finally {
      setGenerating(false);
    }
  };

  const generateMarketingCopy = async () => {
    setGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate marketing copy for a SaaS application:

App Name: ${formData?.name || 'My App'}
Description: ${formData?.description || 'A modern SaaS application'}
Features: ${formData?.features?.join(', ') || 'standard features'}
Tone: ${contentOptions.tone}
Target Audience: ${contentOptions.audience}
Length: ${contentOptions.length}

Generate compelling marketing copy in JSON format:
{
  "value_proposition": "<main value proposition>",
  "elevator_pitch": "<30-second pitch>",
  "landing_page": {
    "headline": "<attention-grabbing headline>",
    "subheadline": "<supporting message>",
    "body_copy": "<persuasive body text>",
    "social_proof": "<social proof statement>"
  },
  "email_campaigns": {
    "welcome_subject": "<welcome email subject>",
    "welcome_body": "<welcome email body>",
    "feature_announcement_subject": "<feature announcement subject>",
    "feature_announcement_body": "<feature announcement body>"
  },
  "social_media": {
    "twitter_bio": "<Twitter/X bio>",
    "linkedin_description": "<LinkedIn company description>",
    "posts": ["<post 1>", "<post 2>", "<post 3>"]
  },
  "ad_copy": {
    "google_headline": "<Google Ads headline>",
    "google_description": "<Google Ads description>",
    "facebook_primary": "<Facebook ad primary text>",
    "facebook_headline": "<Facebook ad headline>"
  }
}`,
        response_json_schema: {
          type: "object",
          properties: {
            value_proposition: { type: "string" },
            elevator_pitch: { type: "string" },
            landing_page: {
              type: "object",
              properties: {
                headline: { type: "string" },
                subheadline: { type: "string" },
                body_copy: { type: "string" },
                social_proof: { type: "string" }
              }
            },
            email_campaigns: {
              type: "object",
              properties: {
                welcome_subject: { type: "string" },
                welcome_body: { type: "string" },
                feature_announcement_subject: { type: "string" },
                feature_announcement_body: { type: "string" }
              }
            },
            social_media: {
              type: "object",
              properties: {
                twitter_bio: { type: "string" },
                linkedin_description: { type: "string" },
                posts: { type: "array", items: { type: "string" } }
              }
            },
            ad_copy: {
              type: "object",
              properties: {
                google_headline: { type: "string" },
                google_description: { type: "string" },
                facebook_primary: { type: "string" },
                facebook_headline: { type: "string" }
              }
            }
          }
        }
      });
      setGeneratedContent({ type: "marketing", data: result });
      toast.success("Marketing copy generated!");
    } catch (error) {
      toast.error("Failed to generate marketing copy");
    } finally {
      setGenerating(false);
    }
  };

  const generateDocumentation = async () => {
    setGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate initial documentation for an application:

App Name: ${formData?.name || 'My App'}
Description: ${formData?.description || 'A modern web application'}
Type: ${formData?.type || 'web application'}
Features: ${formData?.features?.join(', ') || 'standard features'}
Tech Stack: ${formData?.tech_stack?.join(', ') || 'React, Node.js'}

Generate comprehensive documentation in JSON format:
{
  "readme": {
    "title": "<project title>",
    "description": "<project description>",
    "features_list": ["<feature 1>", "<feature 2>"],
    "quick_start": "<quick start guide>",
    "installation": "<installation steps>",
    "usage": "<basic usage>",
    "contributing": "<contributing guidelines>"
  },
  "api_docs": {
    "overview": "<API overview>",
    "authentication": "<auth description>",
    "endpoints": [
      {
        "method": "<GET|POST|PUT|DELETE>",
        "path": "<endpoint path>",
        "description": "<what it does>",
        "example_response": "<example>"
      }
    ]
  },
  "user_guide": {
    "getting_started": "<getting started guide>",
    "key_features": [
      {
        "feature": "<feature name>",
        "how_to_use": "<instructions>"
      }
    ],
    "troubleshooting": [
      {
        "issue": "<common issue>",
        "solution": "<solution>"
      }
    ]
  },
  "changelog_template": "<initial changelog entry>"
}`,
        response_json_schema: {
          type: "object",
          properties: {
            readme: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                features_list: { type: "array", items: { type: "string" } },
                quick_start: { type: "string" },
                installation: { type: "string" },
                usage: { type: "string" },
                contributing: { type: "string" }
              }
            },
            api_docs: {
              type: "object",
              properties: {
                overview: { type: "string" },
                authentication: { type: "string" },
                endpoints: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      method: { type: "string" },
                      path: { type: "string" },
                      description: { type: "string" },
                      example_response: { type: "string" }
                    }
                  }
                }
              }
            },
            user_guide: {
              type: "object",
              properties: {
                getting_started: { type: "string" },
                key_features: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      feature: { type: "string" },
                      how_to_use: { type: "string" }
                    }
                  }
                },
                troubleshooting: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      issue: { type: "string" },
                      solution: { type: "string" }
                    }
                  }
                }
              }
            },
            changelog_template: { type: "string" }
          }
        }
      });
      setGeneratedContent({ type: "documentation", data: result });
      toast.success("Documentation generated!");
    } catch (error) {
      toast.error("Failed to generate documentation");
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(typeof text === 'object' ? JSON.stringify(text, null, 2) : text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const renderPlaceholderContent = (data) => (
    <div className="space-y-4">
      {/* Hero Section */}
      <div className="p-4 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-200">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-violet-900">Hero Section</p>
          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(data.hero_section)}>
            <Copy className="w-3 h-3" />
          </Button>
        </div>
        <p className="text-lg font-bold text-slate-900 mb-1">{data.hero_section?.headline}</p>
        <p className="text-sm text-slate-600 mb-2">{data.hero_section?.subheadline}</p>
        <div className="flex gap-2">
          <Badge className="bg-violet-600">{data.hero_section?.cta_primary}</Badge>
          <Badge variant="outline">{data.hero_section?.cta_secondary}</Badge>
        </div>
      </div>

      {/* Features */}
      {data.features_section?.length > 0 && (
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <p className="text-sm font-semibold text-slate-900 mb-3">Features</p>
          <div className="grid grid-cols-2 gap-3">
            {data.features_section.map((feature, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-lg">
                <span className="text-xl mb-1 block">{feature.icon_suggestion}</span>
                <p className="text-sm font-medium text-slate-900">{feature.title}</p>
                <p className="text-xs text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Testimonials */}
      {data.testimonials?.length > 0 && (
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <p className="text-sm font-semibold text-slate-900 mb-3">Testimonials</p>
          {data.testimonials.map((testimonial, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded-lg mb-2 last:mb-0">
              <p className="text-sm text-slate-700 italic mb-2">"{testimonial.quote}"</p>
              <p className="text-xs text-slate-600">— {testimonial.author}, {testimonial.role} at {testimonial.company}</p>
            </div>
          ))}
        </div>
      )}

      {/* FAQ */}
      {data.faq?.length > 0 && (
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <p className="text-sm font-semibold text-slate-900 mb-3">FAQ</p>
          {data.faq.map((item, i) => (
            <div key={i} className="mb-3 last:mb-0">
              <p className="text-sm font-medium text-slate-900">{item.question}</p>
              <p className="text-xs text-slate-600">{item.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderMarketingContent = (data) => (
    <div className="space-y-4">
      {/* Value Proposition */}
      <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
        <p className="text-sm font-semibold text-emerald-900 mb-2">Value Proposition</p>
        <p className="text-slate-800">{data.value_proposition}</p>
      </div>

      {/* Elevator Pitch */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-slate-900">Elevator Pitch</p>
          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(data.elevator_pitch)}>
            <Copy className="w-3 h-3" />
          </Button>
        </div>
        <p className="text-sm text-slate-700">{data.elevator_pitch}</p>
      </div>

      {/* Landing Page Copy */}
      {data.landing_page && (
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <p className="text-sm font-semibold text-slate-900 mb-3">Landing Page</p>
          <div className="space-y-2">
            <div className="p-2 bg-slate-50 rounded"><span className="text-xs text-slate-500">Headline:</span> <span className="text-sm font-medium">{data.landing_page.headline}</span></div>
            <div className="p-2 bg-slate-50 rounded"><span className="text-xs text-slate-500">Subheadline:</span> <span className="text-sm">{data.landing_page.subheadline}</span></div>
            <div className="p-2 bg-slate-50 rounded"><span className="text-xs text-slate-500">Body:</span> <span className="text-sm">{data.landing_page.body_copy}</span></div>
          </div>
        </div>
      )}

      {/* Email Campaigns */}
      {data.email_campaigns && (
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <p className="text-sm font-semibold text-slate-900 mb-3">Email Campaigns</p>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs font-semibold text-blue-900 mb-1">Welcome Email</p>
              <p className="text-xs text-blue-800"><strong>Subject:</strong> {data.email_campaigns.welcome_subject}</p>
              <p className="text-xs text-blue-700 mt-1">{data.email_campaigns.welcome_body}</p>
            </div>
          </div>
        </div>
      )}

      {/* Social Media */}
      {data.social_media && (
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <p className="text-sm font-semibold text-slate-900 mb-3">Social Media</p>
          <div className="space-y-2">
            <div className="p-2 bg-slate-50 rounded">
              <span className="text-xs text-slate-500">Twitter Bio:</span>
              <p className="text-sm">{data.social_media.twitter_bio}</p>
            </div>
            {data.social_media.posts?.map((post, i) => (
              <div key={i} className="p-2 bg-slate-50 rounded flex items-start justify-between">
                <p className="text-xs text-slate-700">{post}</p>
                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(post)}>
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ad Copy */}
      {data.ad_copy && (
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <p className="text-sm font-semibold text-slate-900 mb-3">Ad Copy</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-amber-50 rounded-lg">
              <p className="text-xs font-semibold text-amber-900">Google Ads</p>
              <p className="text-sm font-medium">{data.ad_copy.google_headline}</p>
              <p className="text-xs text-amber-700">{data.ad_copy.google_description}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs font-semibold text-blue-900">Facebook Ads</p>
              <p className="text-sm font-medium">{data.ad_copy.facebook_headline}</p>
              <p className="text-xs text-blue-700">{data.ad_copy.facebook_primary}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDocumentation = (data) => (
    <div className="space-y-4">
      {/* README */}
      {data.readme && (
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-900">README.md</p>
            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(data.readme)}>
              <Copy className="w-3 h-3" />
            </Button>
          </div>
          <div className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs overflow-auto max-h-60">
            <p className="text-lg font-bold mb-2"># {data.readme.title}</p>
            <p className="mb-3">{data.readme.description}</p>
            <p className="font-bold mb-1">## Features</p>
            {data.readme.features_list?.map((f, i) => <p key={i}>- {f}</p>)}
            <p className="font-bold mt-3 mb-1">## Quick Start</p>
            <p>{data.readme.quick_start}</p>
            <p className="font-bold mt-3 mb-1">## Installation</p>
            <p>{data.readme.installation}</p>
          </div>
        </div>
      )}

      {/* API Docs */}
      {data.api_docs && (
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <p className="text-sm font-semibold text-slate-900 mb-3">API Documentation</p>
          <p className="text-xs text-slate-600 mb-3">{data.api_docs.overview}</p>
          <div className="space-y-2">
            {data.api_docs.endpoints?.map((endpoint, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={
                    endpoint.method === 'GET' ? 'bg-emerald-100 text-emerald-700' :
                    endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                    endpoint.method === 'PUT' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }>{endpoint.method}</Badge>
                  <code className="text-xs">{endpoint.path}</code>
                </div>
                <p className="text-xs text-slate-600">{endpoint.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Guide */}
      {data.user_guide && (
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <p className="text-sm font-semibold text-slate-900 mb-3">User Guide</p>
          <p className="text-xs text-slate-700 mb-3">{data.user_guide.getting_started}</p>
          {data.user_guide.key_features?.map((feature, i) => (
            <div key={i} className="p-2 bg-slate-50 rounded mb-2">
              <p className="text-xs font-medium text-slate-900">{feature.feature}</p>
              <p className="text-xs text-slate-600">{feature.how_to_use}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Card className="border-2 border-violet-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-violet-600" />
          AI Content Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="placeholder" className="gap-2">
              <FileText className="w-4 h-4" /> Placeholder
            </TabsTrigger>
            <TabsTrigger value="marketing" className="gap-2">
              <Megaphone className="w-4 h-4" /> Marketing
            </TabsTrigger>
            <TabsTrigger value="docs" className="gap-2">
              <BookOpen className="w-4 h-4" /> Documentation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="placeholder" className="space-y-4">
            <p className="text-sm text-slate-600">Generate realistic placeholder content for your website sections.</p>
            <Button onClick={generatePlaceholderContent} disabled={generating} className="w-full bg-gradient-to-r from-violet-600 to-indigo-600">
              {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4 mr-2" /> Generate Placeholder Content</>}
            </Button>
            {generatedContent?.type === "placeholder" && renderPlaceholderContent(generatedContent.data)}
          </TabsContent>

          <TabsContent value="marketing" className="space-y-4">
            <p className="text-sm text-slate-600">Create compelling marketing copy for your SaaS application.</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Tone</Label>
                <Select value={contentOptions.tone} onValueChange={(v) => setContentOptions({...contentOptions, tone: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="playful">Playful</SelectItem>
                    <SelectItem value="authoritative">Authoritative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Length</Label>
                <Select value={contentOptions.length} onValueChange={(v) => setContentOptions({...contentOptions, length: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Audience</Label>
                <Select value={contentOptions.audience} onValueChange={(v) => setContentOptions({...contentOptions, audience: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="startup">Startup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={generateMarketingCopy} disabled={generating} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600">
              {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</> : <><Megaphone className="w-4 h-4 mr-2" /> Generate Marketing Copy</>}
            </Button>
            {generatedContent?.type === "marketing" && renderMarketingContent(generatedContent.data)}
          </TabsContent>

          <TabsContent value="docs" className="space-y-4">
            <p className="text-sm text-slate-600">Generate initial documentation based on your app's features.</p>
            <Button onClick={generateDocumentation} disabled={generating} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
              {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</> : <><BookOpen className="w-4 h-4 mr-2" /> Generate Documentation</>}
            </Button>
            {generatedContent?.type === "documentation" && renderDocumentation(generatedContent.data)}
          </TabsContent>
        </Tabs>

        {generatedContent && (
          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={() => setGeneratedContent(null)}>
              <RefreshCw className="w-3 h-3 mr-2" /> Clear & Regenerate
            </Button>
            <Button size="sm" onClick={() => copyToClipboard(generatedContent.data)}>
              {copied ? <Check className="w-3 h-3 mr-2" /> : <Copy className="w-3 h-3 mr-2" />}
              Copy All
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}