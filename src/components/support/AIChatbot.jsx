import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, User, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function AIChatbot() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your AI support assistant. How can I help you today?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input, timestamp: new Date() };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // First, search FAQs
      const faqs = await base44.entities.FAQ.list();
      
      // Use AI to generate response based on FAQs and user question
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a helpful customer support assistant. Answer the user's question based on the available FAQs.

User Question: ${input}

Available FAQs:
${faqs.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n')}

Provide a helpful, accurate response. If the question isn't covered in the FAQs, suggest creating a support ticket.`,
        response_json_schema: {
          type: "object",
          properties: {
            response: { type: "string" },
            suggested_faq_ids: { type: "array", items: { type: "string" } },
            suggest_ticket: { type: "boolean" }
          }
        }
      });

      const botMessage = {
        role: "assistant",
        content: response.response,
        suggestedFaqs: response.suggested_faq_ids,
        suggestTicket: response.suggest_ticket,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      toast.error("Failed to get response");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-purple-600" />
          AI Support Assistant
          <Badge className="ml-auto bg-emerald-100 text-emerald-700">Online</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, i) => (
          <div key={i} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            {message.role === "assistant" && (
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-purple-600" />
              </div>
            )}
            <div className={`max-w-[70%] ${message.role === "user" ? "order-first" : ""}`}>
              <div className={`rounded-2xl p-4 ${
                message.role === "user" 
                  ? "bg-purple-600 text-white" 
                  : "bg-slate-100 text-slate-900"
              }`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              {message.suggestTicket && (
                <Button size="sm" variant="outline" className="mt-2">
                  Create Support Ticket
                </Button>
              )}
            </div>
            {message.role === "user" && (
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-slate-600" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-purple-600" />
            </div>
            <div className="bg-slate-100 rounded-2xl p-4">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your question..."
            disabled={loading}
          />
          <Button onClick={handleSend} disabled={loading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Powered by AI
        </p>
      </div>
    </Card>
  );
}