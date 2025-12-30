import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { hasPermission } from "@/utils/permissions";
import { AlertTriangle } from "lucide-react";

/**
 * ProtectedFeature - Conditionally render content based on user permissions
 * 
 * @param {String} resource - Resource type (e.g., 'projects', 'users')
 * @param {String} action - Action type (e.g., 'view', 'create', 'delete')
 * @param {ReactNode} children - Content to render if user has permission
 * @param {ReactNode} fallback - Content to render if user lacks permission (optional)
 */
export default function ProtectedFeature({ 
  resource, 
  action, 
  children, 
  fallback = null,
  showMessage = false 
}) {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkAccess() {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        
        if (currentUser) {
          const access = await hasPermission(currentUser, resource, action);
          setHasAccess(access);
        }
      } catch (error) {
        console.error('Permission check failed:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [resource, action]);

  if (loading) {
    return null; // Or a loading spinner
  }

  if (!hasAccess) {
    if (showMessage) {
      return (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2 text-amber-900">
            <AlertTriangle className="w-5 h-5" />
            <p className="text-sm font-medium">
              You don't have permission to {action} {resource}
            </p>
          </div>
        </div>
      );
    }
    return fallback;
  }

  return <>{children}</>;
}