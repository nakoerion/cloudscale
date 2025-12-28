import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Globe, Shield, Gauge, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function CDNSettings() {
  const [settings, setSettings] = useState({
    enabled: true,
    autoMinify: true,
    brotliCompression: true,
    httpCache: true,
    alwaysOnline: true
  });

  const [regions] = useState([
    { name: "North America", status: "active", latency: "12ms" },
    { name: "Europe", status: "active", latency: "18ms" },
    { name: "Asia Pacific", status: "active", latency: "25ms" },
    { name: "South America", status: "degraded", latency: "45ms" },
    { name: "Middle East", status: "active", latency: "22ms" }
  ]);

  const updateSetting = (key, value) => {
    setSettings({...settings, [key]: value});
    toast.success(`CDN setting updated`);
  };

  const purgeCache = () => {
    toast.success("CDN cache purged successfully");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-violet-600" />
            CDN Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-slate-900">Global CDN</p>
                <p className="text-sm text-slate-500">Content delivery network enabled</p>
              </div>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) => updateSetting('enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Gauge className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="font-medium text-slate-900">Auto Minify</p>
                <p className="text-sm text-slate-500">Optimize HTML, CSS, and JS</p>
              </div>
            </div>
            <Switch
              checked={settings.autoMinify}
              onCheckedChange={(checked) => updateSetting('autoMinify', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-amber-600" />
              <div>
                <p className="font-medium text-slate-900">Brotli Compression</p>
                <p className="text-sm text-slate-500">Enhanced file compression</p>
              </div>
            </div>
            <Switch
              checked={settings.brotliCompression}
              onCheckedChange={(checked) => updateSetting('brotliCompression', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="font-medium text-slate-900">HTTP Cache</p>
                <p className="text-sm text-slate-500">Cache static resources</p>
              </div>
            </div>
            <Switch
              checked={settings.httpCache}
              onCheckedChange={(checked) => updateSetting('httpCache', checked)}
            />
          </div>

          <Button onClick={purgeCache} variant="outline" className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Purge CDN Cache
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            Edge Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {regions.map((region, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="font-medium text-slate-900">{region.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600">{region.latency}</span>
                  <Badge className={
                    region.status === "active" ? "bg-emerald-100 text-emerald-700" :
                    "bg-amber-100 text-amber-700"
                  }>
                    {region.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}