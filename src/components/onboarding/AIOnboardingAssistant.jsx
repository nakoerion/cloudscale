import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { 
  Sparkles, 
  X, 
  ChevronRight, 
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function AIOnboardingAssistant({ user, currentPage }) {
  const [visible, setVisible] = useState(false);
  const [tips, setTips] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    if (user) {
      loadProgress();
    }
  }, [user]);

  useEffect(() => {
    if (user && currentPage) {
      generateContextualTips();
    }
  }, [currentPage, user]);

  const loadProgress = async () => {
    try {
      const results = await base44.entities.OnboardingProgress.filter({ 
        user_email: user.email 
      });
      if (results.length > 0) {
        setProgress(results[0]);
        // Show assistant if onboarding not completed
        if (!results[0].is_completed && !results[0].skipped) {
          setVisible(true);
        }
      } else {
        // New user - create progress and show assistant
        const newProgress = await base44.entities.OnboardingProgress.create({
          user_email: user.email,
          current_step: "welcome",
          completed_steps: []
        });
        setProgress(newProgress);
        setVisible(true);
      }
    } catch (error) {
      console.error("Failed to load progress:", error);
    }
  };

  const generateContextualTips = async () => {
    if (!progress || loading) return;
    
    setLoading(true);
    try {
      const prompt = `Generate onboarding tips for a user on the "${currentPage}" page.

User Context:
- Email: ${user.email}
- Role: ${user.role || 'user'}
- Current Onboarding Step: ${progress?.current_step || 'welcome'}
- Completed Steps: ${progress?.completed_steps?.length || 0}

Provide personalized guidance in this JSON format:
{
  "primary_tip": {
    "title": "<concise title>",
    "description": "<helpful tip relevant to current page>",
    "action": "<suggested action>",
    "action_url": "<page name if applicable>"
  },
  "next_steps": [
    {
      "title": "<step title>",
      "description": "<brief description>",
      "priority": "<high|medium|low>",
      "page": "<target page name>"
    }
  ],
  "quick_tips": ["<tip 1>", "<tip 2>", "<tip 3>"]
}

Focus on:
- Creating projects
- Setting up pipelines
- Connecting cloud providers
- Managing infrastructure
- Advanced features they haven't explored yet`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            primary_tip: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                action: { type: "string" },
                action_url: { type: "string" }
              }
            },
            next_steps: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  priority: { type: "string" },
                  page: { type: "string" }
                }
              }
            },
            quick_tips: { type: "array", items: { type: "string" } }
          }
        }
      });

      setTips(result);
    } catch (error) {
      console.error("Failed to generate tips:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStepComplete = async (step) => {
    if (!progress) return;
    
    const completed = [...(progress.completed_steps || []), step];
    await base44.entities.OnboardingProgress.update(progress.id, {
      completed_steps: completed,
      current_step: getNextStep(completed)
    });
    
    setProgress(prev => ({
      ...prev,
      completed_steps: completed
    }));
    
    toast.success("Great progress! 🎉");
    generateContextualTips();
  };

  const getNextStep = (completed) => {
    const steps = ['welcome', 'create_project', 'setup_pipeline', 'deploy', 'explore_features'];
    const nextStep = steps.find(s => !completed.includes(s));
    return nextStep || 'completed';
  };

  const handleDismiss = async () => {
    setVisible(false);
    if (progress) {
      await base44.entities.OnboardingProgress.update(progress.id, {
        skipped: true
      });
    }
  };

  if (!visible || !user) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 right-6 z-50 max-w-md"
      >
        <Card className="border-2 border-violet-200 shadow-2xl bg-gradient-to-br from-white to-violet-50/50">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">AI Assistant</h3>
                  <p className="text-xs text-slate-500">Here to help you get started</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-3 border-violet-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : tips ? (
              <div className="space-y-4">
                {/* Primary Tip */}
                {tips.primary_tip && (
                  <div className="p-4 bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-xl">
                    <div className="flex items-start gap-2 mb-2">
                      <Lightbulb className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">
                          {tips.primary_tip.title}
                        </h4>
                        <p className="text-sm text-slate-600 mb-3">
                          {tips.primary_tip.description}
                        </p>
                        {tips.primary_tip.action_url && (
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                            onClick={() => {
                              window.location.href = `#/${tips.primary_tip.action_url}`;
                              handleStepComplete(progress?.current_step);
                            }}
                          >
                            {tips.primary_tip.action}
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Next Steps */}
                {tips.next_steps?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Recommended Next Steps
                    </p>
                    <div className="space-y-2">
                      {tips.next_steps.slice(0, 2).map((step, i) => (
                        <div
                          key={i}
                          className="p-3 bg-white border border-slate-200 rounded-lg hover:border-violet-300 transition-colors cursor-pointer"
                          onClick={() => window.location.href = `#/${step.page}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-slate-900">{step.title}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>
                            </div>
                            <Badge className={
                              step.priority === 'high' ? 'bg-red-100 text-red-700' :
                              step.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                              'bg-blue-100 text-blue-700'
                            }>
                              {step.priority}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Tips */}
                {tips.quick_tips?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-2">Quick Tips</p>
                    <div className="space-y-1.5">
                      {tips.quick_tips.slice(0, 3).map((tip, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-slate-600">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Progress */}
                {progress && (
                  <div className="pt-3 border-t border-slate-200">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Progress: {progress.completed_steps?.length || 0}/5 steps</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs"
                        onClick={handleDismiss}
                      >
                        Hide assistant
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}