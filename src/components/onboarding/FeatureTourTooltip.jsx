import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FeatureTourTooltip({ 
  feature, 
  position = "bottom",
  onNext,
  onDismiss,
  step,
  totalSteps
}) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const positionClasses = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2"
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`absolute ${positionClasses[position]} z-50 w-80`}
      >
        <div className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl shadow-2xl p-4 text-white">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold mb-1">{feature.title}</h4>
              <p className="text-xs text-violet-100">
                Step {step} of {totalSteps}
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setVisible(false);
                onDismiss?.();
              }}
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-sm text-violet-50 mb-4">
            {feature.description}
          </p>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                setVisible(false);
                onNext?.();
              }}
              className="bg-white text-violet-700 hover:bg-violet-50"
            >
              {step === totalSteps ? "Finish" : "Next"}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setVisible(false);
                onDismiss?.();
              }}
              className="text-white hover:bg-white/20"
            >
              Skip tour
            </Button>
          </div>

          {/* Arrow */}
          <div className={`absolute w-3 h-3 bg-violet-600 transform rotate-45 ${
            position === 'bottom' ? '-top-1.5 left-1/2 -translate-x-1/2' :
            position === 'top' ? '-bottom-1.5 left-1/2 -translate-x-1/2' :
            position === 'right' ? '-left-1.5 top-1/2 -translate-y-1/2' :
            '-right-1.5 top-1/2 -translate-y-1/2'
          }`} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}