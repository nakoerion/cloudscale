import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Lightbulb, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InteractiveTutorial({ step, onComplete, onDismiss }) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  if (!step) return null;

  const tips = step.tips || [];
  const currentTip = tips[currentTipIndex];

  const handleNext = () => {
    if (currentTipIndex < tips.length - 1) {
      setCurrentTipIndex(currentTipIndex + 1);
    } else {
      onComplete();
    }
  };

  return (
    <AnimatePresence>
      {currentTip && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-6 right-6 z-50 w-96"
        >
          <Card className="border-2 border-violet-300 shadow-2xl">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-violet-100 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{currentTip.title}</h4>
                    <Badge variant="outline" className="text-xs mt-1">
                      Tip {currentTipIndex + 1} of {tips.length}
                    </Badge>
                  </div>
                </div>
                <button
                  onClick={onDismiss}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-slate-600 mb-4">{currentTip.description}</p>

              {currentTip.action && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                  <p className="text-xs font-medium text-blue-900 mb-1">Try it now:</p>
                  <p className="text-xs text-blue-800">{currentTip.action}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {tips.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        i === currentTipIndex ? "w-6 bg-violet-600" : "w-1.5 bg-slate-300"
                      }`}
                    />
                  ))}
                </div>
                <Button size="sm" onClick={handleNext}>
                  {currentTipIndex < tips.length - 1 ? "Next" : "Got it!"}
                  <ArrowRight className="w-3 h-3 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}