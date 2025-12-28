import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function InvoiceList({ invoices }) {
  const statusColors = {
    paid: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    failed: "bg-red-100 text-red-700"
  };

  return (
    <div className="space-y-3">
      {invoices.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No invoices yet</p>
        </div>
      ) : (
        invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{invoice.invoice_number}</p>
                <p className="text-sm text-slate-500">
                  {format(new Date(invoice.billing_period_start), 'MMM d')} - {format(new Date(invoice.billing_period_end), 'MMM d, yyyy')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-bold text-slate-900">${invoice.amount.toFixed(2)}</p>
                <Badge className={cn("text-xs", statusColors[invoice.status])}>
                  {invoice.status}
                </Badge>
              </div>
              
              {invoice.invoice_pdf && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(invoice.invoice_pdf, '_blank')}
                >
                  <Download className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}