"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";

interface TraditionCardProps {
  tradition: {
    id: string;
    name: string;
    description: string;
    averageRating: number;
    totalRatings: number;
    completions: number;
    image?: string;
  };
  userRating: number | null;
  isCompleted: boolean;
  onComplete: (id: string) => void;
  onRate: (id: string, rating: number) => void;
}

export function TraditionCard({
  tradition,
  userRating,
  isCompleted,
  onComplete,
  onRate,
}: TraditionCardProps) {
  const [selectedRating, setSelectedRating] = useState(userRating);

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    onRate(tradition.id, rating);
  };

  const renderStars = (forUser = false) => {
    const ratingValue = forUser ? (selectedRating || 0) : (tradition.averageRating || 0);
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <button
            key={star}
            onClick={() => forUser && handleRatingClick(star)}
            className={`transition-colors ${forUser ? "hover:opacity-80" : ""}`}
            type="button"
            disabled={!forUser}
          >
            <Star
              className={`w-4 h-4 ${
                star <= ratingValue
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-300 text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Card className={`transition-all hover:shadow-lg ${isCompleted ? "border-primary border-2" : ""}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {tradition.name}
              {isCompleted && (
                <CheckCircle2 className="w-5 h-5 text-primary" fill="currentColor" />
              )}
            </CardTitle>
            <CardDescription className="mt-2">{tradition.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Community Average Rating */}
        <div className="flex items-center justify-between py-2 border-b">
          <span className="text-sm text-muted-foreground">Community Rating</span>
          <div className="flex items-center gap-2">
            {tradition.totalRatings === 0 ? (
              <span className="text-sm text-muted-foreground italic">No ratings yet</span>
            ) : (
              <>
                {renderStars(false)}
                <span className="text-sm font-medium">
                  ({tradition.averageRating.toFixed(1)})
                </span>
                <span className="text-xs text-muted-foreground">({tradition.totalRatings} ratings)</span>
              </>
            )}
          </div>
        </div>

        {/* Your Rating */}
        <div className="py-2">
          <span className="text-sm font-medium mb-2 block">Your Rating</span>
          <div className="flex items-center gap-2 flex-wrap">
            {renderStars(true)}
            {selectedRating && (
              <span className="text-sm text-primary font-medium">{selectedRating}/10</span>
            )}
          </div>
        </div>

        {/* Complete Button */}
        <div className="flex justify-end pt-2">
          <Button
            onClick={() => onComplete(tradition.id)}
            variant={isCompleted ? "secondary" : "default"}
            className="gap-2"
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Completed
              </>
            ) : (
              <>
                <Circle className="w-4 h-4" />
                Mark as Completed
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

