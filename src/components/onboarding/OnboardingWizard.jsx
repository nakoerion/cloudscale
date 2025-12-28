import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, CheckCircle2, Lightbulb, X } from "lucide-react";
import { toast } from "sonner";

const ONBOARDING_STEPS = [
  {
    id: "welcome",
    title: "Welcome to CloudForge!",
    description: "Let's get you started with building your application",
    icon: "👋"
  },
  {
    id: "describe",
    title: "Describe Your App",
    description: "Our AI will analyze your idea and suggest the best approach",
    icon: "💡"
  },
  {
    id: "builder",
    title: "Application Builder",
    description: "Generate code or use our visual builder to create your app",
    icon: "🎨"
  },
  {
    id: "testing",
    title: "Testing & Validation",
    description: "Automatically test your application before deployment",
    icon: "✅"
  },
  {
    id: "devops",
    title: "DevOps Setup",
    description: "Configure CI/CD pipelines and cloud infrastructure",
    icon: "🚀"
  },
  {
    id: "deploy",
    title: "Deploy & Monitor",
    description: "Launch your app and monitor its performance",
    icon: "📊"
  }
];

export default function OnboardingWizard({ open, onClose }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [aiTips, setAiTips] = useState([]);
  const [loadingTips, setLoadingTips] = useState(false);

  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => base44.auth.me()
  });

  const { data: progress } = useQuery({
    queryKey: ["onboarding-progress", user?.email],
    queryFn: async () => {
      const results = await base44.entities.OnboardingProgress.filter({ 
        user_email: user.email 
      });
      return results[0];
    },
    enabled: !!user?.email && open
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (data) => {
      if (progress?.id) {
        return await base44.entities.OnboardingProgress.update(progress.id, data);
      } else {
        return await base44.entities.OnboardingProgress.create({
          user_email: user.email,
          ...data
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding-progress"] });
    }
  });

  useEffect(() => {
    if (progress && open) {
      const stepIndex = ONBOARDING_STEPS.findIndex(s => s.id === progress.current_step);
      if (stepIndex !== -1) setCurrentStepIndex(stepIndex);
      if (progress.personalized_tips) {
        setAiTips(progress.personalized_tips);
      }
    }
  }, [progress, open]);

  const generatePersonalizedTips = async () => {
    if (!progress?.app_description) return;
    
    setLoadingTips(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Based on this app description: "${progress.app_description}"
        
        Generate 5 personalized tips to help the user succeed with their application.
        Focus on:
        - Best practices for their app type
        - Features they should prioritize
        - Common pitfalls to avoid
        - Recommended integrations
        - Performance optimization tips`,
        response_json_schema: {
          type: "object",
          properties: {
            tips: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  icon: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      setAiTips(response.tips);
      updateProgressMutation.mutate({
        personalized_tips: response.tips
      });
    } catch (error) {
      console.error("Failed to generate tips:", error);
    } finally {
      setLoadingTips(false);
    }
  };

  const handleNext = () => {
    const currentStep = ONBOARDING_STEPS[currentStepIndex];
    const completedSteps = [...(progress?.completed_steps || []), currentStep.id];
    
    if (currentStepIndex < ONBOARDING_STEPS.length - 1) {
      const nextStep = ONBOARDING_STEPS[currentStepIndex + 1];
      setCurrentStepIndex(currentStepIndex + 1);
      updateProgressMutation.mutate({
        current_step: nextStep.id,
        completed_steps: completedSteps
      });
    } else {
      updateProgressMutation.mutate({
        completed_steps: completedSteps,
        is_completed: true
      });
      toast.success("Onboarding completed! 🎉");
      onClose();
    }
  };

  const handleSkip = () => {
    updateProgressMutation.mutate({ skipped: true });
    onClose();
  };

  const currentStep = ONBOARDING_STEPS[currentStepIndex];
  const progressPercent = ((currentStepIndex + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button
            onClick={handleSkip}
            className="absolute top-0 right-0 p-2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">
                Step {currentStepIndex + 1} of {ONBOARDING_STEPS.length}
              </span>
              <span className="text-sm text-slate-500">{Math.round(progressPercent)}% Complete</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          {/* Steps Navigation */}
          <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
            {ONBOARDING_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all ${
                    index < currentStepIndex ? "bg-emerald-100" :
                    index === currentStepIndex ? "bg-violet-100 ring-4 ring-violet-200" :
                    "bg-slate-100"
                  }`}>
                    {index < currentStepIndex ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span className="text-xs text-slate-600 mt-1 text-center max-w-[80px]">
                    {step.title.split(" ")[0]}
                  </span>
                </div>
                {index < ONBOARDING_STEPS.length - 1 && (
                  <div className={`w-12 h-1 mx-2 rounded ${
                    index < currentStepIndex ? "bg-emerald-400" : "bg-slate-200"
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Current Step Content */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-5xl">{currentStep.icon}</div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{currentStep.title}</h2>
                <p className="text-slate-600">{currentStep.description}</p>
              </div>
            </div>

            {/* Step-specific content */}
            {currentStep.id === "welcome" && (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-violet-600 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-violet-900 mb-2">AI-Powered Platform</h4>
                      <p className="text-sm text-violet-800">
                        CloudForge uses advanced AI to help you build, test, and deploy applications without writing code.
                        From idea to production in minutes!
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: "🎨", title: "Visual Builder", desc: "Drag & drop interface" },
                    { icon: "🤖", title: "AI Code Gen", desc: "Automatic code creation" },
                    { icon: "☁️", title: "Cloud Deploy", desc: "One-click deployment" }
                  ].map((feature, i) => (
                    <div key={i} className="p-3 bg-white border border-slate-200 rounded-lg text-center">
                      <div className="text-3xl mb-2">{feature.icon}</div>
                      <h5 className="font-semibold text-slate-900 text-sm mb-1">{feature.title}</h5>
                      <p className="text-xs text-slate-600">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep.id === "describe" && (
              <div className="space-y-4">
                <p className="text-slate-700">
                  Start by describing your application idea. Our AI will analyze it and provide:
                </p>
                <div className="space-y-2">
                  {[
                    "Recommended app type and template",
                    "Suggested features and tech stack",
                    "Best practices for your use case",
                    "Estimated development time"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
                {!aiTips.length && progress?.app_description && (
                  <Button onClick={generatePersonalizedTips} disabled={loadingTips}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {loadingTips ? "Generating Tips..." : "Get AI Tips for Your App"}
                  </Button>
                )}
              </div>
            )}

            {/* AI Personalized Tips */}
            {aiTips.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Personalized Tips for Your App</h4>
                </div>
                <div className="space-y-2">
                  {aiTips.map((tip, i) => (
                    <div key={i} className="p-3 bg-white rounded-lg">
                      <div className="flex items-start gap-2">
                        <span className="text-xl">{tip.icon}</span>
                        <div>
                          <h5 className="font-medium text-slate-900 text-sm">{tip.title}</h5>
                          <p className="text-xs text-slate-600 mt-1">{tip.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button variant="outline" onClick={handleSkip}>
              Skip Tutorial
            </Button>
            <div className="flex gap-3">
              {currentStepIndex > 0 && (
                <Button variant="outline" onClick={() => setCurrentStepIndex(currentStepIndex - 1)}>
                  Back
                </Button>
              )}
              <Button onClick={handleNext} className="bg-violet-600 hover:bg-violet-700">
                {currentStepIndex === ONBOARDING_STEPS.length - 1 ? "Finish" : "Next"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}