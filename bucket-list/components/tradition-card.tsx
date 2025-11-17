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
    averageDifficulty: number;
    totalDifficultyRatings: number;
    completions: number;
    image?: string;
  };
  userRating: number | null;
  userDifficultyRating: number | null;
  isCompleted: boolean;
  isLoggedIn: boolean;
  hasRated: boolean;
  hasRatedDifficulty: boolean;
  hasCompleted: boolean;
  onComplete: (id: string) => void;
  onRate: (id: string, rating: number) => void;
  onDifficultyRate: (id: string, difficulty: number) => void;
}

export function TraditionCard({
  tradition,
  userRating,
  userDifficultyRating,
  isCompleted,
  isLoggedIn,
  hasRated,
  hasRatedDifficulty,
  hasCompleted,
  onComplete,
  onRate,
  onDifficultyRate,
}: TraditionCardProps) {
  const [pendingRating, setPendingRating] = useState<number | null>(null);
  const [pendingDifficultyRating, setPendingDifficultyRating] = useState<number | null>(null);

  const handleRatingClick = (rating: number) => {
    if (!isLoggedIn || hasRated || !hasCompleted) return;
    setPendingRating(rating);
  };

  const handleSubmitRating = () => {
    if (pendingRating !== null && isLoggedIn && !hasRated && hasCompleted) {
      onRate(tradition.id, pendingRating);
      setPendingRating(null);
    }
  };

  const handleDifficultyRatingClick = (difficulty: number) => {
    if (!isLoggedIn || hasRatedDifficulty || !hasCompleted) return;
    setPendingDifficultyRating(difficulty);
  };

  const handleSubmitDifficultyRating = () => {
    if (pendingDifficultyRating !== null && isLoggedIn && !hasRatedDifficulty && hasCompleted) {
      onDifficultyRate(tradition.id, pendingDifficultyRating);
      setPendingDifficultyRating(null);
    }
  };

  const displayRating = userRating || pendingRating;
  const displayDifficultyRating = userDifficultyRating || pendingDifficultyRating;

  const renderStars = (forUser = false, forDifficulty = false) => {
    let ratingValue: number;
    let canInteract: boolean;
    let onClickHandler: (rating: number) => void;

    if (forDifficulty) {
      ratingValue = forUser ? (displayDifficultyRating || 0) : (tradition.averageDifficulty || 0);
      canInteract = forUser && isLoggedIn && !hasRatedDifficulty && hasCompleted;
      onClickHandler = handleDifficultyRatingClick;
    } else {
      ratingValue = forUser ? (displayRating || 0) : (tradition.averageRating || 0);
      canInteract = forUser && isLoggedIn && !hasRated && hasCompleted;
      onClickHandler = handleRatingClick;
    }
    
    const starColor = forDifficulty ? "fill-orange-500 text-orange-500" : "fill-yellow-400 text-yellow-400";
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <button
            key={star}
            onClick={() => canInteract && onClickHandler(star)}
            className={`transition-colors ${canInteract ? "hover:opacity-80 cursor-pointer" : "cursor-default"}`}
            type="button"
            disabled={!canInteract}
          >
            <Star
              className={`w-4 h-4 ${
                star <= ratingValue
                  ? starColor
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
          {!isLoggedIn ? (
            <p className="text-sm text-muted-foreground italic">Please log in to rate this tradition</p>
          ) : !hasCompleted ? (
            <p className="text-sm text-muted-foreground italic">Complete this tradition first to rate it</p>
          ) : hasRated ? (
            <div className="flex items-center gap-2 flex-wrap">
              {renderStars(true)}
              {userRating && (
                <span className="text-sm text-primary font-medium">{userRating}/10</span>
              )}
              <span className="text-xs text-muted-foreground">(Already rated)</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                {renderStars(true)}
                {pendingRating && (
                  <span className="text-sm text-primary font-medium">{pendingRating}/10</span>
                )}
              </div>
              {pendingRating !== null && (
                <Button
                  onClick={handleSubmitRating}
                  size="sm"
                  className="mt-2"
                >
                  Submit Rating
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Community Average Difficulty */}
        <div className="flex items-center justify-between py-2 border-b">
          <span className="text-sm text-muted-foreground">Community Difficulty</span>
          <div className="flex items-center gap-2">
            {tradition.totalDifficultyRatings === 0 ? (
              <span className="text-sm text-muted-foreground italic">No ratings yet</span>
            ) : (
              <>
                {renderStars(false, true)}
                <span className="text-sm font-medium">
                  ({tradition.averageDifficulty.toFixed(1)})
                </span>
                <span className="text-xs text-muted-foreground">({tradition.totalDifficultyRatings} ratings)</span>
              </>
            )}
          </div>
        </div>

        {/* Your Difficulty Rating */}
        <div className="py-2">
          <span className="text-sm font-medium mb-2 block">Your Difficulty Rating</span>
          {!isLoggedIn ? (
            <p className="text-sm text-muted-foreground italic">Please log in to rate difficulty</p>
          ) : !hasCompleted ? (
            <p className="text-sm text-muted-foreground italic">Complete this tradition first to rate difficulty</p>
          ) : hasRatedDifficulty ? (
            <div className="flex items-center gap-2 flex-wrap">
              {renderStars(true, true)}
              {userDifficultyRating && (
                <span className="text-sm text-orange-500 font-medium">{userDifficultyRating}/10</span>
              )}
              <span className="text-xs text-muted-foreground">(Already rated)</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                {renderStars(true, true)}
                {pendingDifficultyRating && (
                  <span className="text-sm text-orange-500 font-medium">{pendingDifficultyRating}/10</span>
                )}
              </div>
              {pendingDifficultyRating !== null && (
                <Button
                  onClick={handleSubmitDifficultyRating}
                  size="sm"
                  className="mt-2"
                >
                  Submit Difficulty Rating
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Complete Button */}
        <div className="flex justify-end pt-2">
          {!isLoggedIn ? (
            <div className="text-sm text-muted-foreground italic">
              Please log in to mark this tradition as completed
            </div>
          ) : (
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
          )}
        </div>
      </CardContent>
    </Card>
  );
}

