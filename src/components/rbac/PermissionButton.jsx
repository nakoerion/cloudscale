import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { base44 } from "@/api/base44Client";
import { hasPermission } from "@/utils/permissions";
import { Lock } from "lucide-react";

/**
 * PermissionButton - Button that is disabled if user lacks permission
 * Shows tooltip explaining why button is disabled
 */
export default function PermissionButton({ 
  resource, 
  action, 
  children,
  onClick,
  ...buttonProps 
}) {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      try {
        const user = await base44.auth.me();
        if (user) {
          const access = await hasPermission(user, resource, action);
          setHasAccess(access);
        }
      } catch (error) {
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [resource, action]);

  if (!hasAccess) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button 
                {...buttonProps} 
                disabled 
                className="opacity-50 cursor-not-allowed"
              >
                <Lock className="w-4 h-4 mr-2" />
                {children}
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>You don't have permission to {action} {resource}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button {...buttonProps} onClick={onClick} disabled={loading}>
      {children}
    </Button>
  );
}