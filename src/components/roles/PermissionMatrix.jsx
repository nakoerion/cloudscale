import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const PERMISSION_LABELS = {
  projects: { view: "View", create: "Create", edit: "Edit", delete: "Delete", deploy: "Deploy" },
  templates: { view: "View", create: "Create", edit: "Edit", delete: "Delete", publish: "Publish" },
  infrastructure: { view: "View", manage: "Manage" },
  integrations: { view: "View", install: "Install", configure: "Configure" },
  users: { view: "View", invite: "Invite", manage_roles: "Manage Roles" }
};

export default function PermissionMatrix({ roles }) {
  if (roles.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No roles created yet
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 sticky left-0 bg-slate-50 z-10">
                Permission
              </th>
              {roles.map((role) => (
                <th key={role.id} className="px-6 py-4 text-center text-sm font-semibold text-slate-900">
                  {role.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Object.entries(PERMISSION_LABELS).map(([category, permissions]) => (
              <React.Fragment key={category}>
                <tr className="bg-slate-50">
                  <td colSpan={roles.length + 1} className="px-6 py-3 text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    {category}
                  </td>
                </tr>
                {Object.entries(permissions).map(([permKey, permLabel]) => (
                  <tr key={`${category}-${permKey}`} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-700 sticky left-0 bg-white">
                      {permLabel}
                    </td>
                    {roles.map((role) => {
                      const hasPermission = role.permissions?.[category]?.[permKey] || false;
                      return (
                        <td key={role.id} className="px-6 py-4 text-center">
                          {hasPermission ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 inline-block" />
                          ) : (
                            <XCircle className="w-5 h-5 text-slate-300 inline-block" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Add React import
import React from "react";