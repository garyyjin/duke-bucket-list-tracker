"use client";

import { useState, useEffect } from "react";
import { TraditionCard } from "@/components/tradition-card";
import { AddCustomTradition } from "@/components/add-custom-tradition";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Users, Plus, Target, Star, LogIn, LogOut, AlertTriangle } from "lucide-react";
import { LoginDialog } from "@/components/login-dialog";
import type { TraditionWithStats, User } from "@/lib/types";
import {
  getTraditionsWithStats,
  getOrCreateUser,
  getUserCompletions,
  getUserRatings,
  getUserDifficultyRatings,
  toggleCompletion,
  submitRating,
  submitDifficultyRating,
  createTradition,
} from "@/lib/api";

export default function Home() {
  const [traditions, setTraditions] = useState<TraditionWithStats[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  // Track which traditions the current user has rated
  const [userTraditionRatings, setUserTraditionRatings] = useState<Record<string, number>>({});
  // Track which traditions the current user has rated for difficulty
  const [userTraditionDifficultyRatings, setUserTraditionDifficultyRatings] = useState<Record<string, number>>({});
  // Track which traditions the current user has completed
  const [userCompletedTraditions, setUserCompletedTraditions] = useState<Set<string>>(new Set());

  // Load traditions on mount
  useEffect(() => {
    loadTraditions();
  }, []);

  // Load user data when user logs in
  useEffect(() => {
    if (currentUser) {
      loadUserData();
    } else {
      // Clear user data on logout
      setUserTraditionRatings({});
      setUserTraditionDifficultyRatings({});
      setUserCompletedTraditions(new Set());
    }
  }, [currentUser]);

  const loadTraditions = async () => {
    setLoading(true);
    try {
      const data = await getTraditionsWithStats();
      setTraditions(data);
    } catch (error) {
      console.error('Error loading traditions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    if (!currentUser) return;

    try {
      const [completions, ratings, difficultyRatings] = await Promise.all([
        getUserCompletions(currentUser.id),
        getUserRatings(currentUser.id),
        getUserDifficultyRatings(currentUser.id),
      ]);

      setUserCompletedTraditions(completions);
      setUserTraditionRatings(ratings);
      setUserTraditionDifficultyRatings(difficultyRatings);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleComplete = async (id: string) => {
    // Require login to mark traditions as completed
    if (!currentUser) {
      setShowLoginDialog(true);
      return;
    }

    const wasCompleted = userCompletedTraditions.has(id);
    
    // Optimistically update UI
    const newCompleted = new Set(userCompletedTraditions);
    if (wasCompleted) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setUserCompletedTraditions(newCompleted);

    // Update backend
    const success = await toggleCompletion(currentUser.id, id, wasCompleted);
    
    if (!success) {
      // Revert on error
      setUserCompletedTraditions(userCompletedTraditions);
      alert('Failed to update completion. Please try again.');
      return;
    }

    // Reload traditions to get updated stats
    await loadTraditions();
  };

  const handleLogin = async (username: string) => {
    try {
      const user = await getOrCreateUser(username);
      if (user) {
        setCurrentUser(user);
        setCurrentUsername(username);
      } else {
        alert('Failed to login. Please try again.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Failed to login. Please try again.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUsername(null);
  };

  const handleRate = async (id: string, rating: number) => {
    if (!currentUser) return;
    
    // Check if user has completed this tradition
    if (!userCompletedTraditions.has(id)) {
      // User hasn't completed this tradition, don't allow rating
      return;
    }
    
    // Check if user has already rated this tradition
    if (userTraditionRatings[id] !== undefined) {
      // User has already rated, don't allow duplicate rating
      return;
    }

    // Optimistically update UI
    setUserTraditionRatings(prev => ({ ...prev, [id]: rating }));

    // Update backend
    const success = await submitRating(currentUser.id, id, rating);
    
    if (!success) {
      // Revert on error
      const { [id]: _, ...rest } = userTraditionRatings;
      setUserTraditionRatings(rest);
      alert('Failed to submit rating. Please try again.');
      return;
    }

    // Reload traditions to get updated stats
    await loadTraditions();
  };

  const handleDifficultyRate = async (id: string, difficulty: number) => {
    if (!currentUser) return;
    
    // Check if user has completed this tradition
    if (!userCompletedTraditions.has(id)) {
      // User hasn't completed this tradition, don't allow rating
      return;
    }
    
    // Check if user has already rated difficulty for this tradition
    if (userTraditionDifficultyRatings[id] !== undefined) {
      // User has already rated difficulty, don't allow duplicate rating
      return;
    }

    // Optimistically update UI
    setUserTraditionDifficultyRatings(prev => ({ ...prev, [id]: difficulty }));

    // Update backend
    const success = await submitDifficultyRating(currentUser.id, id, difficulty);
    
    if (!success) {
      // Revert on error
      const { [id]: _, ...rest } = userTraditionDifficultyRatings;
      setUserTraditionDifficultyRatings(rest);
      alert('Failed to submit difficulty rating. Please try again.');
      return;
    }

    // Reload traditions to get updated stats
    await loadTraditions();
  };

  const handleAddCustom = async (name: string, description: string) => {
    try {
      const userId = currentUser?.id;
      const newTradition = await createTradition(name, description, userId);
      
      if (newTradition) {
        // Reload traditions to get the new one with stats
        await loadTraditions();
      } else {
        alert('Failed to create tradition. Please try again.');
      }
    } catch (error) {
      console.error('Error creating tradition:', error);
      alert('Failed to create tradition. Please try again.');
    }
  };

  const userCompletedCount = userCompletedTraditions.size;
  const progressPercentage = traditions.length > 0 
    ? (userCompletedCount / traditions.length) * 100
    : 0;

  const topRated = [...traditions].sort((a, b) => b.averageRating - a.averageRating).slice(0, 5);
  const mostCompleted = [...traditions].sort((a, b) => b.completions - a.completions).slice(0, 5);
  const mostDifficult = [...traditions]
    .filter(t => t.totalDifficultyRatings > 0)
    .sort((a, b) => b.averageDifficulty - a.averageDifficulty)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Duke Bucket List</h1>
              <p className="text-primary-foreground/90 mt-1">Track Your Duke Traditions</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Mobile login button */}
              <div className="md:hidden">
                {currentUser ? (
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-primary-foreground/10 hover:bg-primary-foreground/20"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowLoginDialog(true)}
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-primary-foreground/10 hover:bg-primary-foreground/20"
                  >
                    <LogIn className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {/* Desktop login section */}
              <div className="hidden md:flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm opacity-90">Your Progress</div>
                  <div className="text-2xl font-bold">{currentUser ? userCompletedCount : 0} / {traditions.length}</div>
                </div>
                {currentUser ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm opacity-90">Logged in as: {currentUsername}</span>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-primary-foreground/10 hover:bg-primary-foreground/20"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setShowLoginDialog(true)}
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-primary-foreground/10 hover:bg-primary-foreground/20"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Section */}
        <Card className="mb-8 p-6">
          <div className="flex items-center gap-4 mb-4">
            <Target className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Your Progress</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Completed traditions</span>
              <span className="font-semibold">
                {currentUser ? userCompletedCount : 0} of {traditions.length} ({progressPercentage.toFixed(0)}%
              )
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Duke Traditions</h2>
              <Button onClick={() => setShowAddDialog(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Custom Tradition
              </Button>
            </div>

            <div className="grid gap-6">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading traditions...</div>
              ) : traditions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No traditions found.</div>
              ) : (
                traditions.map((tradition) => {
                  const userRatingForTradition = userTraditionRatings[tradition.id] ?? null;
                  const hasRated = userTraditionRatings[tradition.id] !== undefined;
                  const userDifficultyRating = userTraditionDifficultyRatings[tradition.id] ?? null;
                  const hasRatedDifficulty = userTraditionDifficultyRatings[tradition.id] !== undefined;
                  const userCompleted = userCompletedTraditions.has(tradition.id);
                
                return (
                  <TraditionCard
                    key={tradition.id}
                    tradition={tradition}
                    userRating={userRatingForTradition}
                    userDifficultyRating={userDifficultyRating}
                    isCompleted={userCompleted}
                    isLoggedIn={!!currentUser}
                    hasRated={hasRated}
                    hasRatedDifficulty={hasRatedDifficulty}
                    hasCompleted={userCompleted}
                    onComplete={handleComplete}
                    onRate={handleRate}
                    onDifficultyRate={handleDifficultyRate}
                  />
                );
                })
              )}
            </div>
          </div>

          {/* Sidebar - Community Insights */}
          <div className="space-y-6">
            {/* Top Rated */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-bold">Top Rated</h3>
              </div>
              <div className="space-y-3">
                {topRated.map((tradition, index) => (
                  <div key={tradition.id} className="flex items-start gap-3 p-2 rounded hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{tradition.name}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {tradition.averageRating.toFixed(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Most Completed */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-bold">Most Completed</h3>
              </div>
              <div className="space-y-3">
                {mostCompleted.map((tradition, index) => (
                  <div key={tradition.id} className="flex items-start gap-3 p-2 rounded hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{tradition.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {tradition.completions} completions
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Most Difficult */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-bold">Most Difficult</h3>
              </div>
              <div className="space-y-3">
                {mostDifficult.length > 0 ? (
                  mostDifficult.map((tradition, index) => (
                    <div key={tradition.id} className="flex items-start gap-3 p-2 rounded hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-destructive text-destructive-foreground font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{tradition.name}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <AlertTriangle className="w-3 h-3 fill-orange-500 text-orange-500" />
                          {tradition.averageDifficulty.toFixed(1)}/10
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">No difficulty ratings yet</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Custom Tradition Dialog */}
      <AddCustomTradition
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={handleAddCustom}
      />

      {/* Login Dialog */}
      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onLogin={handleLogin}
      />
    </div>
  );
}
