import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import moment from "moment";

export default function TemplateReviews({ templateId, template }) {
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["template-reviews", templateId],
    queryFn: () => base44.entities.TemplateReview.filter({ template_id: templateId }),
    enabled: !!templateId
  });

  const submitReviewMutation = useMutation({
    mutationFn: async (reviewData) => {
      const user = await base44.auth.me();
      const newReview = await base44.entities.TemplateReview.create({
        template_id: templateId,
        reviewer_email: user.email,
        reviewer_name: user.full_name || user.email.split('@')[0],
        rating: reviewData.rating,
        review_text: reviewData.review_text
      });

      // Update template average rating
      const allReviews = [...reviews, newReview];
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      await base44.entities.CommunityTemplate.update(templateId, {
        average_rating: avgRating,
        review_count: allReviews.length
      });

      return newReview;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["template-reviews", templateId] });
      queryClient.invalidateQueries({ queryKey: ["community-templates"] });
      setIsWritingReview(false);
      setRating(0);
      setReviewText("");
      toast.success("Review submitted successfully!");
    }
  });

  const helpfulMutation = useMutation({
    mutationFn: async (reviewId) => {
      const review = reviews.find(r => r.id === reviewId);
      await base44.entities.TemplateReview.update(reviewId, {
        helpful_count: (review.helpful_count || 0) + 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["template-reviews", templateId] });
    }
  });

  const handleSubmitReview = () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }
    submitReviewMutation.mutate({ rating, review_text: reviewText });
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="flex items-center gap-6 pb-6 border-b">
        <div className="text-center">
          <div className="text-4xl font-bold text-slate-900">
            {(template?.average_rating || 0).toFixed(1)}
          </div>
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "w-4 h-4",
                  star <= Math.round(template?.average_rating || 0)
                    ? "text-amber-500 fill-amber-500"
                    : "text-slate-300"
                )}
              />
            ))}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {template?.review_count || 0} reviews
          </p>
        </div>

        <Button
          onClick={() => setIsWritingReview(!isWritingReview)}
          variant="outline"
          className="ml-auto"
        >
          Write a Review
        </Button>
      </div>

      {/* Write Review Form */}
      {isWritingReview && (
        <div className="bg-slate-50 rounded-xl p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-900 block mb-2">
              Your Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "w-8 h-8",
                      star <= rating
                        ? "text-amber-500 fill-amber-500"
                        : "text-slate-300"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-900 block mb-2">
              Your Review
            </label>
            <Textarea
              placeholder="Share your experience with this template..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsWritingReview(false);
                setRating(0);
                setReviewText("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={submitReviewMutation.isPending}
              className="bg-violet-600 hover:bg-violet-700"
            >
              {submitReviewMutation.isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No reviews yet. Be the first to review this template!
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback className="bg-violet-100 text-violet-600">
                    {review.reviewer_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {review.reviewer_name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {moment(review.created_date).fromNow()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "w-4 h-4",
                            star <= review.rating
                              ? "text-amber-500 fill-amber-500"
                              : "text-slate-300"
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-slate-700 mb-3">{review.review_text}</p>

                  <button
                    onClick={() => helpfulMutation.mutate(review.id)}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-violet-600 transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Helpful ({review.helpful_count || 0})</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}