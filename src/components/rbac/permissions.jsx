import { base44 } from "@/api/base44Client";

/**
 * RBAC Permission Utility
 * Manages role-based access control throughout the application
 */

// Default role definitions
export const DEFAULT_ROLES = {
  ADMIN: {
    name: "Admin",
    description: "Full system access with all permissions",
    permissions: {
      projects: { view: true, create: true, edit: true, delete: true, deploy: true },
      templates: { view: true, create: true, edit: true, delete: true, publish: true },
      infrastructure: { view: true, manage: true },
      integrations: { view: true, install: true, configure: true },
      users: { view: true, invite: true, manage_roles: true },
      analytics: { view: true, export: true },
      billing: { view: true, manage: true }
    },
    is_system_role: true
  },
  EDITOR: {
    name: "Editor",
    description: "Can create and edit content but not manage infrastructure",
    permissions: {
      projects: { view: true, create: true, edit: true, delete: false, deploy: false },
      templates: { view: true, create: true, edit: true, delete: false, publish: false },
      infrastructure: { view: true, manage: false },
      integrations: { view: true, install: false, configure: false },
      users: { view: true, invite: false, manage_roles: false },
      analytics: { view: true, export: false },
      billing: { view: false, manage: false }
    },
    is_system_role: true
  },
  VIEWER: {
    name: "Viewer",
    description: "Read-only access to most resources",
    permissions: {
      projects: { view: true, create: false, edit: false, delete: false, deploy: false },
      templates: { view: true, create: false, edit: false, delete: false, publish: false },
      infrastructure: { view: true, manage: false },
      integrations: { view: true, install: false, configure: false },
      users: { view: true, invite: false, manage_roles: false },
      analytics: { view: true, export: false },
      billing: { view: false, manage: false }
    },
    is_system_role: true
  }
};

/**
 * Check if user has a specific permission
 * @param {Object} user - User object with role_id
 * @param {String} resource - Resource type (e.g., 'projects', 'users')
 * @param {String} action - Action type (e.g., 'view', 'create', 'delete')
 * @returns {Promise<Boolean>}
 */
export async function hasPermission(user, resource, action) {
  if (!user) return false;
  
  // Super admin (built-in user role='admin') has all permissions
  if (user.role === 'admin') return true;

  try {
    // Get user's role assignments
    const assignments = await base44.entities.UserRoleAssignment.filter({
      user_email: user.email
    });

    if (!assignments || assignments.length === 0) return false;

    // Check each role assignment
    for (const assignment of assignments) {
      const role = await base44.entities.Role.filter({ id: assignment.role_id });
      
      if (role && role[0]) {
        const permissions = role[0].permissions;
        if (permissions?.[resource]?.[action]) {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.error('Permission check error:', error);
    return false;
  }
}

/**
 * Check multiple permissions at once
 * @param {Object} user - User object
 * @param {Array} checks - Array of {resource, action} objects
 * @returns {Promise<Object>} - Object with check results
 */
export async function hasPermissions(user, checks) {
  const results = {};
  
  for (const check of checks) {
    const key = `${check.resource}.${check.action}`;
    results[key] = await hasPermission(user, check.resource, check.action);
  }
  
  return results;
}

/**
 * Get all permissions for a user
 * @param {Object} user - User object
 * @returns {Promise<Object>} - Combined permissions object
 */
export async function getUserPermissions(user) {
  if (!user) return {};
  
  // Super admin has all permissions
  if (user.role === 'admin') {
    return DEFAULT_ROLES.ADMIN.permissions;
  }

  try {
    const assignments = await base44.entities.UserRoleAssignment.filter({
      user_email: user.email
    });

    if (!assignments || assignments.length === 0) return {};

    // Merge permissions from all roles
    const mergedPermissions = {};
    
    for (const assignment of assignments) {
      const role = await base44.entities.Role.filter({ id: assignment.role_id });
      
      if (role && role[0]) {
        const permissions = role[0].permissions;
        
        // Merge permissions (OR logic - if any role grants permission, user has it)
        for (const resource in permissions) {
          if (!mergedPermissions[resource]) {
            mergedPermissions[resource] = {};
          }
          for (const action in permissions[resource]) {
            mergedPermissions[resource][action] = 
              mergedPermissions[resource][action] || permissions[resource][action];
          }
        }
      }
    }

    return mergedPermissions;
  } catch (error) {
    console.error('Get permissions error:', error);
    return {};
  }
}

/**
 * Initialize default roles in the system
 * @returns {Promise<void>}
 */
export async function initializeDefaultRoles() {
  try {
    const existingRoles = await base44.entities.Role.list();
    
    for (const [key, roleData] of Object.entries(DEFAULT_ROLES)) {
      // Check if role already exists
      const exists = existingRoles.find(r => r.name === roleData.name);
      
      if (!exists) {
        await base44.entities.Role.create(roleData);
      }
    }
  } catch (error) {
    console.error('Failed to initialize default roles:', error);
  }
}

/**
 * Assign a role to a user
 * @param {String} userEmail - User's email
 * @param {String} roleId - Role ID
 * @param {String} assignedBy - Email of user assigning the role
 * @returns {Promise<Object>}
 */
export async function assignRole(userEmail, roleId, assignedBy) {
  return await base44.entities.UserRoleAssignment.create({
    user_email: userEmail,
    role_id: roleId,
    assigned_by: assignedBy,
    scope: 'global'
  });
}

/**
 * Remove a role from a user
 * @param {String} userEmail - User's email
 * @param {String} roleId - Role ID
 * @returns {Promise<void>}
 */
export async function removeRole(userEmail, roleId) {
  const assignments = await base44.entities.UserRoleAssignment.filter({
    user_email: userEmail,
    role_id: roleId
  });
  
  for (const assignment of assignments) {
    await base44.entities.UserRoleAssignment.delete(assignment.id);
  }
}