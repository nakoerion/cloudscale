import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Palette, Type, Image } from "lucide-react";

export default function StyleEditor({ open, onClose, globalStyles, onSave }) {
  const [styles, setStyles] = useState(globalStyles || {
    primaryColor: "#8b5cf6",
    secondaryColor: "#6366f1",
    backgroundColor: "#ffffff",
    textColor: "#1e293b",
    fontFamily: "Inter, sans-serif",
    borderRadius: "8px",
    logo: ""
  });

  const handleSave = () => {
    onSave(styles);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-violet-600" />
            Global Style Editor
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="colors" className="mt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="colors">
              <Palette className="w-4 h-4 mr-2" /> Colors
            </TabsTrigger>
            <TabsTrigger value="typography">
              <Type className="w-4 h-4 mr-2" /> Typography
            </TabsTrigger>
            <TabsTrigger value="branding">
              <Image className="w-4 h-4 mr-2" /> Branding
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="primary">Primary Color</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="primary"
                  type="color"
                  value={styles.primaryColor}
                  onChange={(e) => setStyles({...styles, primaryColor: e.target.value})}
                  className="w-20 h-10"
                />
                <Input
                  value={styles.primaryColor}
                  onChange={(e) => setStyles({...styles, primaryColor: e.target.value})}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="secondary">Secondary Color</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="secondary"
                  type="color"
                  value={styles.secondaryColor}
                  onChange={(e) => setStyles({...styles, secondaryColor: e.target.value})}
                  className="w-20 h-10"
                />
                <Input
                  value={styles.secondaryColor}
                  onChange={(e) => setStyles({...styles, secondaryColor: e.target.value})}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bg">Background Color</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="bg"
                  type="color"
                  value={styles.backgroundColor}
                  onChange={(e) => setStyles({...styles, backgroundColor: e.target.value})}
                  className="w-20 h-10"
                />
                <Input
                  value={styles.backgroundColor}
                  onChange={(e) => setStyles({...styles, backgroundColor: e.target.value})}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="text">Text Color</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="text"
                  type="color"
                  value={styles.textColor}
                  onChange={(e) => setStyles({...styles, textColor: e.target.value})}
                  className="w-20 h-10"
                />
                <Input
                  value={styles.textColor}
                  onChange={(e) => setStyles({...styles, textColor: e.target.value})}
                  className="flex-1"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="typography" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="font">Font Family</Label>
              <Input
                id="font"
                value={styles.fontFamily}
                onChange={(e) => setStyles({...styles, fontFamily: e.target.value})}
                placeholder="Inter, sans-serif"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="radius">Border Radius (px)</Label>
              <Input
                id="radius"
                value={styles.borderRadius}
                onChange={(e) => setStyles({...styles, borderRadius: e.target.value})}
                placeholder="8px"
                className="mt-2"
              />
            </div>
          </TabsContent>

          <TabsContent value="branding" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                value={styles.logo}
                onChange={(e) => setStyles({...styles, logo: e.target.value})}
                placeholder="https://..."
                className="mt-2"
              />
            </div>
            {styles.logo && (
              <div className="border border-slate-200 rounded-lg p-4">
                <p className="text-sm text-slate-500 mb-2">Preview:</p>
                <img src={styles.logo} alt="Logo" className="h-12 object-contain" />
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} className="bg-violet-600 hover:bg-violet-700">
            Apply Styles
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}