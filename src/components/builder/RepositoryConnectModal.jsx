import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Github, GitBranch, CheckCircle2, AlertCircle, Gitlab } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function RepositoryConnectModal({ open, onClose, onConnect, projectName }) {
  const [provider, setProvider] = useState("github");
  const [repoUrl, setRepoUrl] = useState("");
  const [branch, setBranch] = useState("main");
  const [accessToken, setAccessToken] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (!repoUrl || !accessToken) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsConnecting(true);
    
    // Simulate connection
    setTimeout(() => {
      onConnect({
        provider,
        repository_url: repoUrl,
        branch,
        connected: true
      });
      setIsConnecting(false);
      toast.success("Repository connected successfully");
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Github className="w-6 h-6 text-slate-700" />
            Connect Repository
          </DialogTitle>
        </DialogHeader>

        <Tabs value={provider} onValueChange={setProvider} className="mt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="github" className="flex items-center gap-2">
              <Github className="w-4 h-4" /> GitHub
            </TabsTrigger>
            <TabsTrigger value="gitlab" className="flex items-center gap-2">
              <Gitlab className="w-4 h-4" /> GitLab
            </TabsTrigger>
            <TabsTrigger value="bitbucket" className="flex items-center gap-2">
              <GitBranch className="w-4 h-4" /> Bitbucket
            </TabsTrigger>
          </TabsList>

          <TabsContent value={provider} className="space-y-6 mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Auto-Deploy on Push</h4>
                  <p className="text-sm text-blue-700">
                    We'll automatically build and deploy your application when you push to the {branch} branch.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="repoUrl">Repository URL *</Label>
                <Input
                  id="repoUrl"
                  placeholder={`https://${provider}.com/username/${projectName.toLowerCase().replace(/\s+/g, '-')}`}
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="branch">Default Branch</Label>
                <Input
                  id="branch"
                  placeholder="main"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="token">Access Token *</Label>
                <Input
                  id="token"
                  type="password"
                  placeholder="Enter your personal access token"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className="mt-2"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {provider === "github" && "Generate at: github.com/settings/tokens"}
                  {provider === "gitlab" && "Generate at: gitlab.com/-/profile/personal_access_tokens"}
                  {provider === "bitbucket" && "Generate at: bitbucket.org/account/settings/app-passwords"}
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">Required Permissions</h4>
                  <p className="text-sm text-amber-700">
                    Token needs: repo access, workflow permissions, and webhook creation
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Skip for Now
          </Button>
          <Button 
            onClick={handleConnect}
            disabled={isConnecting}
            className="bg-violet-600 hover:bg-violet-700"
          >
            {isConnecting ? (
              <>Connecting...</>
            ) : (
              <>
                <Github className="w-4 h-4 mr-2" /> Connect Repository
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}