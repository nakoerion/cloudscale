import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Plus, 
  Save, 
  Eye, 
  Code, 
  Smartphone, 
  Monitor,
  Tablet,
  Trash2,
  Settings,
  Layers,
  Type,
  Image as ImageIcon,
  Square,
  Grid3x3,
  ChevronRight,
  ChevronDown,
  List,
  LayoutGrid,
  Palette
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import StyleEditor from "@/components/visual-builder/StyleEditor";
import ResponsivePreview from "@/components/visual-builder/ResponsivePreview";

const COMPONENTS = [
  { id: "header", name: "Header", icon: Layers, category: "layout" },
  { id: "footer", name: "Footer", icon: Layers, category: "layout" },
  { id: "container", name: "Container", icon: Square, category: "layout" },
  { id: "grid", name: "Grid", icon: Grid3x3, category: "layout" },
  { id: "carousel", name: "Carousel", icon: LayoutGrid, category: "advanced" },
  { id: "accordion", name: "Accordion", icon: List, category: "advanced" },
  { id: "tabs", name: "Tabs", icon: Square, category: "advanced" },
  { id: "text", name: "Text", icon: Type, category: "content" },
  { id: "heading", name: "Heading", icon: Type, category: "content" },
  { id: "image", name: "Image", icon: ImageIcon, category: "content" },
  { id: "button", name: "Button", icon: Square, category: "form" },
  { id: "input", name: "Input", icon: Square, category: "form" },
  { id: "form", name: "Form", icon: Square, category: "form" }
];

export default function VisualBuilder() {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [viewMode, setViewMode] = useState("desktop");
  const [showCode, setShowCode] = useState(false);
  const [showStyleEditor, setShowStyleEditor] = useState(false);
  const [globalStyles, setGlobalStyles] = useState({
    primaryColor: "#8b5cf6",
    secondaryColor: "#6366f1",
    backgroundColor: "#ffffff",
    textColor: "#1e293b",
    fontFamily: "Inter, sans-serif",
    borderRadius: "8px",
    logo: ""
  });

  const addElement = (component) => {
    const newElement = {
      id: `${component.id}-${Date.now()}`,
      type: component.id,
      name: component.name,
      props: getDefaultProps(component.id)
    };
    setElements([...elements, newElement]);
  };

  const getDefaultProps = (type) => {
    const defaults = {
      header: { text: "Header", bgColor: "bg-slate-900", textColor: "text-white", height: "h-16" },
      footer: { text: "Footer", bgColor: "bg-slate-800", textColor: "text-white", height: "h-20" },
      container: { padding: "p-6", maxWidth: "max-w-7xl" },
      grid: { cols: "grid-cols-3", gap: "gap-4" },
      carousel: { 
        items: [
          { image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800", title: "Slide 1" },
          { image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800", title: "Slide 2" },
          { image: "https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=800", title: "Slide 3" }
        ],
        autoplay: true,
        interval: 3000
      },
      accordion: {
        items: [
          { title: "What is this?", content: "This is accordion content." },
          { title: "How does it work?", content: "Click to expand and collapse sections." },
          { title: "Can I customize it?", content: "Yes, fully customizable!" }
        ]
      },
      tabs: {
        tabs: [
          { label: "Tab 1", content: "Content for tab 1" },
          { label: "Tab 2", content: "Content for tab 2" },
          { label: "Tab 3", content: "Content for tab 3" }
        ]
      },
      text: { content: "Sample text", size: "text-base", color: "text-slate-900" },
      heading: { content: "Heading", size: "text-3xl", weight: "font-bold" },
      image: { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400", alt: "Image", rounded: "rounded-lg" },
      button: { text: "Click me", variant: "primary", size: "md" },
      input: { placeholder: "Enter text...", type: "text", label: "Input Label" },
      form: { title: "Contact Form", fields: ["name", "email", "message"] }
    };
    return defaults[type] || {};
  };

  const updateElementProp = (elementId, propKey, propValue) => {
    setElements(elements.map(el => 
      el.id === elementId 
        ? { ...el, props: { ...el.props, [propKey]: propValue } }
        : el
    ));
  };

  const deleteElement = (elementId) => {
    setElements(elements.filter(el => el.id !== elementId));
    if (selectedElement?.id === elementId) setSelectedElement(null);
  };

  const generateCode = () => {
    let code = "export default function Page() {\n  return (\n    <div className=\"min-h-screen\">\n";
    elements.forEach(el => {
      const props = el.props;
      switch(el.type) {
        case "header":
          code += `      <header className="${props.bgColor} ${props.textColor} ${props.height} flex items-center justify-center">\n`;
          code += `        <h1 className="text-2xl font-bold">${props.text}</h1>\n`;
          code += `      </header>\n`;
          break;
        case "text":
          code += `      <p className="${props.size} ${props.color}">${props.content}</p>\n`;
          break;
        case "button":
          code += `      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">${props.text}</button>\n`;
          break;
      }
    });
    code += "    </div>\n  );\n}";
    return code;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-900">Visual Page Builder</h1>
            <Badge className="bg-violet-100 text-violet-700">No-Code</Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("mobile")}
                className={cn("p-2 rounded", viewMode === "mobile" && "bg-white shadow")}
                title="Mobile (375px)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("tablet")}
                className={cn("p-2 rounded", viewMode === "tablet" && "bg-white shadow")}
                title="Tablet (768px)"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("desktop")}
                className={cn("p-2 rounded", viewMode === "desktop" && "bg-white shadow")}
                title="Desktop (1280px)"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>
            <div className="text-sm text-slate-500">
              {viewMode === "mobile" && "375px"}
              {viewMode === "tablet" && "768px"}
              {viewMode === "desktop" && "1280px"}
            </div>
            <Button variant="outline" onClick={() => setShowStyleEditor(true)}>
              <Palette className="w-4 h-4 mr-2" /> Styles
            </Button>
            <Button variant="outline" onClick={() => setShowCode(!showCode)}>
              <Code className="w-4 h-4 mr-2" /> {showCode ? "Designer" : "Code"}
            </Button>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" /> Preview
            </Button>
            <Button className="bg-violet-600 hover:bg-violet-700">
              <Save className="w-4 h-4 mr-2" /> Save
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Component Library */}
        <div className="w-64 bg-white border-r border-slate-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Components</h2>
            <Tabs defaultValue="layout">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="layout">Layout</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-2 w-full mt-2">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="form">Form</TabsTrigger>
              </TabsList>
              {["layout", "advanced", "content", "form"].map(category => (
                <TabsContent key={category} value={category} className="space-y-2 mt-4">
                  {COMPONENTS.filter(c => c.category === category).map(component => {
                    const Icon = component.icon;
                    return (
                      <button
                        key={component.id}
                        onClick={() => addElement(component)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-violet-500 hover:bg-violet-50 transition-all text-left"
                      >
                        <Icon className="w-5 h-5 text-slate-400" />
                        <span className="text-sm font-medium text-slate-900">{component.name}</span>
                      </button>
                    );
                  })}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-hidden bg-slate-100">
          {showCode ? (
            <div className="p-8 h-full overflow-y-auto">
              <div className="bg-slate-900 rounded-xl p-6 max-w-4xl mx-auto">
                <pre className="text-sm text-slate-100 overflow-x-auto">
                  <code>{generateCode()}</code>
                </pre>
              </div>
            </div>
          ) : (
            <ResponsivePreview 
              device={viewMode} 
              onDeviceChange={setViewMode}
              globalStyles={{
                backgroundColor: globalStyles.backgroundColor,
                color: globalStyles.textColor,
                fontFamily: globalStyles.fontFamily
              }}
            >
              {elements.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <Layers className="w-16 h-16 text-slate-300 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Start Building</h3>
                  <p className="text-slate-500">Drag components from the left panel to begin</p>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {elements.map((element) => (
                    <div
                      key={element.id}
                      onClick={() => setSelectedElement(element)}
                      className={cn(
                        "relative group border-2 rounded-lg transition-all",
                        selectedElement?.id === element.id
                          ? "border-violet-500 bg-violet-50"
                          : "border-transparent hover:border-slate-300"
                      )}
                    >
                      {renderElement(element, globalStyles)}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteElement(element.id);
                        }}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </ResponsivePreview>
          )}
        </div>

        {/* Properties Panel */}
        {selectedElement && !showCode && (
          <div className="w-80 bg-white border-l border-slate-200 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Properties</h2>
                <Settings className="w-5 h-5 text-slate-400" />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Component Type
                  </label>
                  <Badge variant="outline">{selectedElement.name}</Badge>
                </div>

                {Object.entries(selectedElement.props).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-sm font-medium text-slate-700 mb-2 block capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <Input
                      value={value}
                      onChange={(e) => updateElementProp(selectedElement.id, key, e.target.value)}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <StyleEditor
        open={showStyleEditor}
        onClose={() => setShowStyleEditor(false)}
        globalStyles={globalStyles}
        onSave={setGlobalStyles}
      />
    </div>
  );
}

function renderElement(element, globalStyles = {}) {
  const { type, props } = element;

  switch(type) {
    case "header":
      return (
        <div className={cn(props.bgColor, props.textColor, props.height, "flex items-center justify-center px-6")}>
          <h1 className="text-2xl font-bold">{props.text}</h1>
        </div>
      );
    case "footer":
      return (
        <div className={cn(props.bgColor, props.textColor, props.height, "flex items-center justify-center px-6")}>
          <p className="text-sm">{props.text}</p>
        </div>
      );
    case "carousel":
      return <CarouselPreview items={props.items} />;
    case "accordion":
      return <AccordionPreview items={props.items} />;
    case "tabs":
      return <TabsPreview tabs={props.tabs} />;
    case "text":
      return <p className={cn(props.size, props.color, "p-4")}>{props.content}</p>;
    case "heading":
      return <h2 className={cn(props.size, props.weight, "p-4")}>{props.content}</h2>;
    case "button":
      return (
        <div className="p-4">
          <button 
            className="px-6 py-3 text-white rounded-lg font-medium hover:opacity-90"
            style={{ 
              backgroundColor: globalStyles.primaryColor || "#8b5cf6",
              borderRadius: globalStyles.borderRadius || "8px"
            }}
          >
            {props.text}
          </button>
        </div>
      );
    case "input":
      return (
        <div className="p-4 space-y-2">
          {props.label && <label className="text-sm font-medium text-slate-700">{props.label}</label>}
          <input
            type={props.type}
            placeholder={props.placeholder}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg"
          />
        </div>
      );
    case "image":
      return (
        <div className="p-4">
          <img src={props.src} alt={props.alt} className={cn(props.rounded, "w-full")} />
        </div>
      );
    default:
      return <div className="p-4 bg-slate-100 rounded">Component: {type}</div>;
  }
}

function CarouselPreview({ items }) {
  const [current, setCurrent] = useState(0);

  return (
    <div className="p-4">
      <div className="relative rounded-xl overflow-hidden">
        <img 
          src={items[current]?.image} 
          alt={items[current]?.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-white text-xl font-bold">{items[current]?.title}</h3>
        </div>
        <button
          onClick={() => setCurrent((current - 1 + items.length) % items.length)}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <button
          onClick={() => setCurrent((current + 1) % items.length)}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn("w-2 h-2 rounded-full", i === current ? "bg-white" : "bg-white/50")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AccordionPreview({ items }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="p-4 space-y-2">
      {items.map((item, i) => (
        <div key={i} className="border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <span className="font-medium text-slate-900">{item.title}</span>
            <ChevronDown className={cn("w-5 h-5 transition-transform", open === i && "rotate-180")} />
          </button>
          {open === i && (
            <div className="p-4 bg-white">
              <p className="text-slate-600">{item.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function TabsPreview({ tabs }) {
  const [active, setActive] = useState(0);

  return (
    <div className="p-4">
      <div className="flex gap-2 border-b border-slate-200 mb-4">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              "px-4 py-2 font-medium transition-colors border-b-2",
              active === i
                ? "border-violet-600 text-violet-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4 bg-slate-50 rounded-lg">
        <p className="text-slate-700">{tabs[active]?.content}</p>
      </div>
    </div>
  );
}