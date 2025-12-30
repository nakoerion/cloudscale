import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { getUserPermissions, hasPermission } from "@/components/rbac/permissions";

/**
 * usePermissions - React hook for checking user permissions
 * 
 * @returns {Object} { permissions, hasAccess, loading }
 */
export function usePermissions() {
  const [permissions, setPermissions] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPermissions() {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        
        if (currentUser) {
          const userPerms = await getUserPermissions(currentUser);
          setPermissions(userPerms);
        }
      } catch (error) {
        console.error('Failed to load permissions:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPermissions();
  }, []);

  const hasAccess = async (resource, action) => {
    if (!user) return false;
    return await hasPermission(user, resource, action);
  };

  return { permissions, hasAccess, loading, user };
}

/**
 * usePermission - Check a specific permission
 * 
 * @param {String} resource - Resource type
 * @param {String} action - Action type
 * @returns {Object} { hasAccess, loading }
 */
export function usePermission(resource, action) {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkPermission() {
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

    checkPermission();
  }, [resource, action]);

  return { hasAccess, loading };
}