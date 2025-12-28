import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smile, Frown, Meh, AlertCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export default function SentimentAnalysis({ tickets }) {
  const sentimentCounts = {
    positive: tickets.filter(t => t.sentiment === "positive").length,
    neutral: tickets.filter(t => t.sentiment === "neutral").length,
    negative: tickets.filter(t => t.sentiment === "negative").length,
    frustrated: tickets.filter(t => t.sentiment === "frustrated").length
  };

  const chartData = [
    { name: "Positive", value: sentimentCounts.positive, color: "#10b981" },
    { name: "Neutral", value: sentimentCounts.neutral, color: "#6366f1" },
    { name: "Negative", value: sentimentCounts.negative, color: "#f59e0b" },
    { name: "Frustrated", value: sentimentCounts.frustrated, color: "#ef4444" }
  ];

  const avgSentiment = tickets.reduce((acc, t) => acc + (t.sentiment_score || 0), 0) / (tickets.length || 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smile className="w-5 h-5 text-emerald-600" />
          Sentiment Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <p className="text-sm text-slate-600 mb-2">Average Sentiment Score</p>
          <div className="flex items-center gap-3">
            <p className="text-3xl font-bold text-slate-900">{avgSentiment.toFixed(2)}</p>
            <Badge className={avgSentiment > 0.3 ? "bg-emerald-100 text-emerald-700" : avgSentiment < -0.3 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}>
              {avgSentiment > 0 ? "Positive" : avgSentiment < 0 ? "Negative" : "Neutral"}
            </Badge>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {[
            { label: "Positive", count: sentimentCounts.positive, icon: Smile, color: "emerald" },
            { label: "Neutral", count: sentimentCounts.neutral, icon: Meh, color: "blue" },
            { label: "Negative", count: sentimentCounts.negative, icon: Frown, color: "amber" },
            { label: "Frustrated", count: sentimentCounts.frustrated, icon: AlertCircle, color: "red" }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className={`p-3 bg-${item.color}-50 border border-${item.color}-200 rounded-lg`}>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 text-${item.color}-600`} />
                  <span className="text-sm font-medium text-slate-900">{item.label}</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">{item.count}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}