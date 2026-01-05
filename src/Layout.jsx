import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import AIOnboardingAssistant from "@/components/onboarding/AIOnboardingAssistant";
import {
  LayoutDashboard,
  Cloud,
  GitBranch,
  Zap,
  Shield,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Bell,
  Search,
  Layers,
  Paintbrush,
  Workflow,
  Server,
  Activity
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, href: "Dashboard" },
  { name: "Application Builder", icon: Layers, href: "ApplicationBuilder" },
  { name: "Cloud Providers", icon: Cloud, href: "CloudProviders" },
  { name: "Workflow Automation", icon: Workflow, href: "WorkflowAutomation" },
  { name: "Infrastructure", icon: Server, href: "Infrastructure" },
  { name: "Analytics", icon: Activity, href: "Analytics" },
  { name: "Monitoring", icon: Activity, href: "Monitoring" },
  { name: "DevOps", icon: GitBranch, href: "DevOps" },
  { name: "Security", icon: Shield, href: "SecurityDashboard" },
  { name: "Integrations", icon: Zap, href: "Integrations" },
  { name: "Support", icon: Shield, href: "Support" },
  { name: "Billing", icon: Shield, href: "Billing" },
  { name: "Role Management", icon: Shield, href: "RoleManagement" },
  { name: "SLA Contracts", icon: Shield, href: "SLAContracts" }
];

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: onboardingProgress } = useQuery({
    queryKey: ["onboarding-progress", user?.email],
    queryFn: async () => {
      const results = await base44.entities.OnboardingProgress.filter({ 
        user_email: user.email 
      });
      return results[0];
    },
    enabled: !!user?.email
  });

  useEffect(() => {
    if (user && !onboardingProgress && currentPageName === "Dashboard") {
      setTimeout(() => setShowOnboarding(true), 1000);
    }
  }, [user, onboardingProgress, currentPageName]);

  const isFullWidthPage = currentPageName === "ProjectDetails";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-100"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900">CloudForge</span>
            </div>
          </div>
          {user && (
            <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-medium">
              {user.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-900">CloudForge</h1>
                <p className="text-xs text-slate-500">No-Code Platform</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = currentPageName === item.href;
              return (
                <Link
                  key={item.name}
                  to={createPageUrl(item.href)}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-violet-50 text-violet-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5",
                    isActive ? "text-violet-600" : "text-slate-400"
                  )} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          {user && (
            <div className="p-4 border-t border-slate-100">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-xl flex items-center justify-center text-violet-600 font-semibold">
                      {user.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {user.full_name || "User"}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => base44.auth.logout()}
                    className="text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "transition-all lg:ml-64",
        "pt-16 lg:pt-0"
      )}>
        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects, integrations..."
              className="w-80 pl-10 pr-4 py-2 text-sm bg-slate-50 border-0 rounded-lg focus:ring-2 focus:ring-violet-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <Badge className="bg-emerald-100 text-emerald-700">
              ✓ All Systems Operational
            </Badge>
          </div>
        </header>

        {/* Page Content */}
        <main>
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <OnboardingWizard 
        open={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
      />
      <AIOnboardingAssistant user={user} currentPage={currentPageName} />
      </div>
      );
      }