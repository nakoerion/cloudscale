import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Ticket, TrendingUp, Bot, Plus } from "lucide-react";
import AIChatbot from "@/components/support/AIChatbot";
import TicketList from "@/components/support/TicketList";
import CreateTicketModal from "@/components/support/CreateTicketModal";
import SentimentAnalysis from "@/components/support/SentimentAnalysis";
import RecurringIssues from "@/components/support/RecurringIssues";

export default function Support() {
  const [activeTab, setActiveTab] = useState("chatbot");
  const [showCreateTicket, setShowCreateTicket] = useState(false);

  const { data: tickets = [] } = useQuery({
    queryKey: ["support-tickets"],
    queryFn: () => base44.entities.SupportTicket.list("-created_date", 50)
  });

  const openTickets = tickets.filter(t => t.status === "open" || t.status === "in_progress").length;
  const urgentTickets = tickets.filter(t => t.priority === "urgent").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <Bot className="w-8 h-8 text-purple-600" />
              AI-Powered Support
            </h1>
            <p className="text-slate-500 mt-1">Intelligent customer support automation</p>
          </div>
          <Button onClick={() => setShowCreateTicket(true)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" /> New Ticket
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <Ticket className="w-10 h-10 text-blue-600 bg-blue-50 p-2 rounded-xl" />
              <Badge className="bg-blue-100 text-blue-700">{openTickets}</Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900">{tickets.length}</p>
            <p className="text-sm text-slate-500">Total Tickets</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-10 h-10 text-red-600 bg-red-50 p-2 rounded-xl" />
              <Badge className="bg-red-100 text-red-700">Urgent</Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900">{urgentTickets}</p>
            <p className="text-sm text-slate-500">High Priority</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <MessageSquare className="w-10 h-10 text-emerald-600 bg-emerald-50 p-2 rounded-xl" />
              <Badge className="bg-emerald-100 text-emerald-700">+24%</Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900">2.3 hrs</p>
            <p className="text-sm text-slate-500">Avg Response</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <Bot className="w-10 h-10 text-purple-600 bg-purple-50 p-2 rounded-xl" />
              <Badge className="bg-purple-100 text-purple-700">68%</Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900">AI Resolved</p>
            <p className="text-sm text-slate-500">Auto Resolution</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white border border-slate-200 p-1 rounded-xl mb-6">
            <TabsTrigger value="chatbot" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 rounded-lg">
              <Bot className="w-4 h-4 mr-2" /> AI Chatbot
            </TabsTrigger>
            <TabsTrigger value="tickets" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 rounded-lg">
              <Ticket className="w-4 h-4 mr-2" /> Tickets
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 rounded-lg">
              <TrendingUp className="w-4 h-4 mr-2" /> Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chatbot">
            <AIChatbot />
          </TabsContent>

          <TabsContent value="tickets">
            <TicketList tickets={tickets} />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SentimentAnalysis tickets={tickets} />
              <RecurringIssues tickets={tickets} />
            </div>
          </TabsContent>
        </Tabs>

        <CreateTicketModal 
          open={showCreateTicket} 
          onClose={() => setShowCreateTicket(false)} 
        />
      </div>
    </div>
  );
}