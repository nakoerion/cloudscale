import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function CreateTicketModal({ open, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const queryClient = useQueryClient();

  const createTicketMutation = useMutation({
    mutationFn: async (data) => {
      // Use AI to categorize and prioritize
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this support ticket and categorize it:

Title: ${data.title}
Description: ${data.description}

Determine:
1. Category (technical, billing, feature_request, bug, account, general)
2. Priority (low, medium, high, urgent)
3. Sentiment (positive, neutral, negative, frustrated)
4. Sentiment score (-1 to 1)
5. Suggested response`,
        response_json_schema: {
          type: "object",
          properties: {
            category: { type: "string" },
            priority: { type: "string" },
            sentiment: { type: "string" },
            sentiment_score: { type: "number" },
            suggested_response: { type: "string" }
          }
        }
      });

      return await base44.entities.SupportTicket.create({
        ...data,
        ...analysis
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      toast.success("Ticket created and analyzed by AI");
      onClose();
      setTitle("");
      setDescription("");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createTicketMutation.mutate({ title, description });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Support Ticket</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief description of the issue"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of your issue..."
              rows={5}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createTicketMutation.isPending}>
              {createTicketMutation.isPending ? "Creating..." : "Create Ticket"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}