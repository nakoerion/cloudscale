import { Button } from "@/components/ui/button";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

const DEVICE_SIZES = {
  desktop: { width: "100%", height: "100%", icon: Monitor, label: "Desktop" },
  tablet: { width: "768px", height: "1024px", icon: Tablet, label: "Tablet" },
  mobile: { width: "375px", height: "667px", icon: Smartphone, label: "Mobile" }
};

export default function ResponsivePreview({ device, onDeviceChange, children, globalStyles }) {
  const currentDevice = DEVICE_SIZES[device];

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="flex items-center justify-center gap-2 p-4 bg-white border-b border-slate-200">
        {Object.entries(DEVICE_SIZES).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <Button
              key={key}
              variant={device === key ? "default" : "ghost"}
              size="sm"
              onClick={() => onDeviceChange(key)}
              className={cn(
                device === key && "bg-violet-600 hover:bg-violet-700"
              )}
            >
              <Icon className="w-4 h-4 mr-2" />
              {config.label}
            </Button>
          );
        })}
      </div>

      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <div
          className="bg-white shadow-2xl transition-all duration-300 overflow-auto"
          style={{
            width: currentDevice.width,
            height: currentDevice.height,
            maxWidth: "100%",
            maxHeight: "100%",
            ...globalStyles
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}