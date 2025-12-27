import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Cloud, 
  GitBranch, 
  MoreVertical, 
  ExternalLink,
  Settings,
  Activity
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { cn } from "@/lib/utils";

const cloudIcons = {
  aws: "🔶",
  azure: "🔷",
  gcp: "🔴",
  alibaba: "🟠",
  ibm: "🔵",
  oracle: "🔴",
  none: "☁️",
  "multi-cloud": "🌐"
};

const statusColors = {
  draft: "bg-slate-100 text-slate-700",
  development: "bg-blue-100 text-blue-700",
  staging: "bg-amber-100 text-amber-700",
  production: "bg-emerald-100 text-emerald-700",
  archived: "bg-slate-100 text-slate-500"
};

const typeColors = {
  "no-code": "bg-violet-100 text-violet-700",
  "low-code": "bg-indigo-100 text-indigo-700",
  "full-code": "bg-slate-100 text-slate-700",
  "hybrid": "bg-gradient-to-r from-violet-100 to-indigo-100 text-violet-700"
};

export default function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Thumbnail/Header */}
      <div className="h-32 bg-gradient-to-br from-slate-900 via-slate-800 to-violet-900 relative">
        {project.thumbnail ? (
          <img 
            src={project.thumbnail} 
            alt={project.name}
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl font-bold text-white/10">
              {project.name?.charAt(0)?.toUpperCase()}
            </div>
          </div>
        )}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90 backdrop-blur">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(project)}>
                <Settings className="w-4 h-4 mr-2" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={() => onDelete?.(project)}>
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <Badge className={cn("text-xs font-medium", statusColors[project.status])}>
            {project.status}
          </Badge>
          <Badge className={cn("text-xs font-medium", typeColors[project.type])}>
            {project.type}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg text-slate-900">{project.name}</h3>
            <p className="text-sm text-slate-500 line-clamp-2 mt-1">
              {project.description || "No description"}
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        {project.tech_stack?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tech_stack.slice(0, 4).map((tech, i) => (
              <span key={i} className="text-xs px-2 py-1 bg-slate-50 text-slate-600 rounded-lg">
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 4 && (
              <span className="text-xs px-2 py-1 bg-slate-50 text-slate-500 rounded-lg">
                +{project.tech_stack.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <span>{cloudIcons[project.cloud_provider] || "☁️"}</span>
              <span className="capitalize">{project.cloud_provider || "None"}</span>
            </span>
            {project.repository_url && (
              <span className="flex items-center gap-1">
                <GitBranch className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
          <Link to={createPageUrl("ProjectDetails") + `?id=${project.id}`}>
            <Button size="sm" variant="ghost" className="text-violet-600 hover:text-violet-700 hover:bg-violet-50">
              Open <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>

        {/* Metrics */}
        {project.metrics && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-lg font-semibold text-slate-900">{project.metrics.uptime?.toFixed(1)}%</p>
              <p className="text-xs text-slate-500">Uptime</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-slate-900">{project.metrics.requests_today || 0}</p>
              <p className="text-xs text-slate-500">Requests</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-slate-900">{project.metrics.avg_response_time || 0}ms</p>
              <p className="text-xs text-slate-500">Latency</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}