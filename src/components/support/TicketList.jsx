import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, Tag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function TicketList({ tickets }) {
  const getPriorityColor = (priority) => {
    switch(priority) {
      case "urgent": return "bg-red-100 text-red-700";
      case "high": return "bg-amber-100 text-amber-700";
      case "medium": return "bg-blue-100 text-blue-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "resolved": return "bg-emerald-100 text-emerald-700";
      case "in_progress": return "bg-blue-100 text-blue-700";
      case "open": return "bg-amber-100 text-amber-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getSentimentEmoji = (sentiment) => {
    switch(sentiment) {
      case "positive": return "😊";
      case "neutral": return "😐";
      case "negative": return "😟";
      case "frustrated": return "😤";
      default: return "😐";
    }
  };

  return (
    <div className="space-y-4">
      {tickets.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-slate-500">No support tickets yet</p>
          </CardContent>
        </Card>
      ) : (
        tickets.map((ticket) => (
          <Card key={ticket.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-slate-900">{ticket.title}</h3>
                    {ticket.sentiment && (
                      <span className="text-xl">{getSentimentEmoji(ticket.sentiment)}</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{ticket.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status.replace("_", " ")}
                    </Badge>
                    {ticket.category && (
                      <Badge variant="outline">
                        <Tag className="w-3 h-3 mr-1" />
                        {ticket.category}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t text-sm text-slate-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDistanceToNow(new Date(ticket.created_date), { addSuffix: true })}
                  </span>
                  {ticket.assigned_to && (
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {ticket.assigned_to}
                    </span>
                  )}
                </div>
                <Button size="sm" variant="outline">View Details</Button>
              </div>
              {ticket.ai_suggested_response && (
                <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-xs font-semibold text-purple-900 mb-1">AI Suggested Response:</p>
                  <p className="text-xs text-purple-800">{ticket.ai_suggested_response}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}