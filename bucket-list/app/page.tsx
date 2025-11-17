"use client";

import { useState } from "react";
import { TraditionCard } from "@/components/tradition-card";
import { AddCustomTradition } from "@/components/add-custom-tradition";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Users, Plus, Target, Star, LogIn, LogOut, AlertTriangle } from "lucide-react";
import { LoginDialog } from "@/components/login-dialog";

interface Tradition {
  id: string;
  name: string;
  description: string;
  averageRating: number;
  totalRatings: number;
  averageDifficulty: number;
  totalDifficultyRatings: number;
  completions: number;
}

export default function Home() {
  // Mock data - in real app, this would come from Supabase
  const [traditions, setTraditions] = useState<Tradition[]>([
    {
      id: "1",
      name: "Climb Baldwin",
      description: "Climb up the exterior of the Baldwin Auditorium building, a legendary unofficial requirement that many Duke students attempt.",
      averageRating: 0,
      totalRatings: 0,
      averageDifficulty: 0,
      totalDifficultyRatings: 0,
      completions: 0,
    },
    {
      id: "2",
      name: "Go in the Tunnels",
      description: "Explore the underground tunnel system that connects various buildings across Duke's campus. A staple of Duke lore.",
      averageRating: 0,
      totalRatings: 0,
      averageDifficulty: 0,
      totalDifficultyRatings: 0,
      completions: 0,
    },
    {
      id: "3",
      name: "Sex in the Stacks",
      description: "Have intimate relations among the bookshelves at Perkins Library. An infamously whispered about Duke tradition.",
      averageRating: 0,
      totalRatings: 0,
      averageDifficulty: 0,
      totalDifficultyRatings: 0,
      completions: 0,
    },
    {
      id: "4",
      name: "Sex in the Gardens",
      description: "Have intimate relations in the Sarah P. Duke Gardens. Another whispered unofficial graduation requirement.",
      averageRating: 0,
      totalRatings: 0,
      averageDifficulty: 0,
      totalDifficultyRatings: 0,
      completions: 0,
    },
    {
      id: "5",
      name: "Drive Around Backward Around C1 Loop",
      description: "Drive or ride around the C1 campus bus route in reverse - a quirky tradition some Duke students attempt.",
      averageRating: 0,
      totalRatings: 0,
      averageDifficulty: 0,
      totalDifficultyRatings: 0,
      completions: 0,
    },
  ]);

  const [completedTraditions, setCompletedTraditions] = useState<Set<string>>(new Set());
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [nextId, setNextId] = useState(6);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  // Track which traditions each user has rated: { userId: { traditionId: rating } }
  const [userTraditionRatings, setUserTraditionRatings] = useState<Record<string, Record<string, number>>>({});
  // Track which traditions each user has rated for difficulty: { userId: { traditionId: difficulty } }
  const [userTraditionDifficultyRatings, setUserTraditionDifficultyRatings] = useState<Record<string, Record<string, number>>>({});
  // Track which traditions each user has completed: { userId: Set<traditionId> }
  const [userCompletedTraditions, setUserCompletedTraditions] = useState<Record<string, Set<string>>>({});

  const handleComplete = (id: string) => {
    // Require login to mark traditions as completed
    if (!currentUser) {
      setShowLoginDialog(true);
      return;
    }

    // Get user's completed traditions
    const userCompleted = userCompletedTraditions[currentUser] || new Set<string>();
    const wasCompleted = userCompleted.has(id);
    
    // Update user's completed traditions
    const newUserCompleted = new Set(userCompleted);
    if (wasCompleted) {
      newUserCompleted.delete(id);
    } else {
      newUserCompleted.add(id);
    }
    setUserCompletedTraditions(prev => ({
      ...prev,
      [currentUser]: newUserCompleted,
    }));

    // Also update global completed set for backward compatibility
    const newCompleted = new Set(completedTraditions);
    if (wasCompleted) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedTraditions(newCompleted);

    // Update the completions count for the tradition
    setTraditions((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            completions: wasCompleted ? Math.max(0, t.completions - 1) : t.completions + 1,
          };
        }
        return t;
      })
    );
  };

  const handleLogin = (username: string) => {
    setCurrentUser(username);
    // Initialize user's rating record if it doesn't exist
    if (!userTraditionRatings[username]) {
      setUserTraditionRatings(prev => ({ ...prev, [username]: {} }));
    }
    // Initialize user's difficulty rating record if it doesn't exist
    if (!userTraditionDifficultyRatings[username]) {
      setUserTraditionDifficultyRatings(prev => ({ ...prev, [username]: {} }));
    }
    // Initialize user's completed traditions if it doesn't exist
    if (!userCompletedTraditions[username]) {
      setUserCompletedTraditions(prev => ({ ...prev, [username]: new Set<string>() }));
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleRate = (id: string, rating: number) => {
    if (!currentUser) return;
    
    // Check if user has completed this tradition
    const userCompleted = userCompletedTraditions[currentUser] || new Set<string>();
    if (!userCompleted.has(id)) {
      // User hasn't completed this tradition, don't allow rating
      return;
    }
    
    // Check if user has already rated this tradition
    const userRatingsForUser = userTraditionRatings[currentUser] || {};
    if (userRatingsForUser[id] !== undefined) {
      // User has already rated, don't allow duplicate rating
      return;
    }

    // Store the rating for this user
    setUserTraditionRatings(prev => ({
      ...prev,
      [currentUser]: {
        ...prev[currentUser],
        [id]: rating,
      },
    }));

    // Update userRatings for display
    setUserRatings({ ...userRatings, [id]: rating });
    
    // Update community rating
    setTraditions((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          // If this is the first rating
          if (t.totalRatings === 0) {
            return {
              ...t,
              averageRating: rating,
              totalRatings: 1,
            };
          }
          // Update average with new rating
          const newTotal = t.totalRatings + 1;
          const newAverage = (t.averageRating * t.totalRatings + rating) / newTotal;
          return {
            ...t,
            averageRating: newAverage,
            totalRatings: newTotal,
          };
        }
        return t;
      })
    );
  };

  const handleDifficultyRate = (id: string, difficulty: number) => {
    if (!currentUser) return;
    
    // Check if user has completed this tradition
    const userCompleted = userCompletedTraditions[currentUser] || new Set<string>();
    if (!userCompleted.has(id)) {
      // User hasn't completed this tradition, don't allow rating
      return;
    }
    
    // Check if user has already rated difficulty for this tradition
    const userDifficultyRatingsForUser = userTraditionDifficultyRatings[currentUser] || {};
    if (userDifficultyRatingsForUser[id] !== undefined) {
      // User has already rated difficulty, don't allow duplicate rating
      return;
    }

    // Store the difficulty rating for this user
    setUserTraditionDifficultyRatings(prev => ({
      ...prev,
      [currentUser]: {
        ...prev[currentUser],
        [id]: difficulty,
      },
    }));
    
    // Update community difficulty rating
    setTraditions((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          // If this is the first difficulty rating
          if (t.totalDifficultyRatings === 0) {
            return {
              ...t,
              averageDifficulty: difficulty,
              totalDifficultyRatings: 1,
            };
          }
          // Update average with new difficulty rating
          const newTotal = t.totalDifficultyRatings + 1;
          const newAverage = (t.averageDifficulty * t.totalDifficultyRatings + difficulty) / newTotal;
          return {
            ...t,
            averageDifficulty: newAverage,
            totalDifficultyRatings: newTotal,
          };
        }
        return t;
      })
    );
  };

  const handleAddCustom = (name: string, description: string) => {
    const newTradition: Tradition = {
      id: `custom-${nextId}`,
      name,
      description,
      averageRating: 0,
      totalRatings: 0,
      averageDifficulty: 0,
      totalDifficultyRatings: 0,
      completions: 0,
    };
    setTraditions([...traditions, newTradition]);
    setNextId(nextId + 1);
  };

  const userCompletedCount = currentUser 
    ? (userCompletedTraditions[currentUser]?.size ?? 0)
    : 0;
  const progressPercentage = currentUser 
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
                    <span className="text-sm opacity-90">Logged in as: {currentUser}</span>
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
              {traditions.map((tradition) => {
                const userRatingForTradition = currentUser 
                  ? (userTraditionRatings[currentUser]?.[tradition.id] ?? null)
                  : null;
                const hasRated = currentUser 
                  ? (userTraditionRatings[currentUser]?.[tradition.id] !== undefined)
                  : false;
                const userDifficultyRating = currentUser
                  ? (userTraditionDifficultyRatings[currentUser]?.[tradition.id] ?? null)
                  : null;
                const hasRatedDifficulty = currentUser
                  ? (userTraditionDifficultyRatings[currentUser]?.[tradition.id] !== undefined)
                  : false;
                const userCompleted = currentUser
                  ? (userCompletedTraditions[currentUser]?.has(tradition.id) ?? false)
                  : false;
                
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
              })}
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
