"use client";

import { useState } from "react";
import { TraditionCard } from "@/components/tradition-card";
import { AddCustomTradition } from "@/components/add-custom-tradition";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Users, Plus, Target, Star } from "lucide-react";

interface Tradition {
  id: string;
  name: string;
  description: string;
  averageRating: number;
  totalRatings: number;
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
      completions: 0,
    },
    {
      id: "2",
      name: "Go in the Tunnels",
      description: "Explore the underground tunnel system that connects various buildings across Duke's campus. A staple of Duke lore.",
      averageRating: 0,
      totalRatings: 0,
      completions: 0,
    },
    {
      id: "3",
      name: "Sex in the Stacks",
      description: "Have intimate relations among the bookshelves at Perkins Library. An infamously whispered about Duke tradition.",
      averageRating: 0,
      totalRatings: 0,
      completions: 0,
    },
    {
      id: "4",
      name: "Sex in the Gardens",
      description: "Have intimate relations in the Sarah P. Duke Gardens. Another whispered unofficial graduation requirement.",
      averageRating: 0,
      totalRatings: 0,
      completions: 0,
    },
    {
      id: "5",
      name: "Drive Around Backward Around C1 Loop",
      description: "Drive or ride around the C1 campus bus route in reverse - a quirky tradition some Duke students attempt.",
      averageRating: 0,
      totalRatings: 0,
      completions: 0,
    },
  ]);

  const [completedTraditions, setCompletedTraditions] = useState<Set<string>>(new Set());
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [nextId, setNextId] = useState(6);

  const handleComplete = (id: string) => {
    const newCompleted = new Set(completedTraditions);
    if (completedTraditions.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedTraditions(newCompleted);
  };

  const handleRate = (id: string, rating: number) => {
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

  const handleAddCustom = (name: string, description: string) => {
    const newTradition: Tradition = {
      id: `custom-${nextId}`,
      name,
      description,
      averageRating: 0,
      totalRatings: 0,
      completions: 0,
    };
    setTraditions([...traditions, newTradition]);
    setNextId(nextId + 1);
  };

  const progressPercentage = (completedTraditions.size / traditions.length) * 100;

  const topRated = [...traditions].sort((a, b) => b.averageRating - a.averageRating).slice(0, 3);
  const mostCompleted = [...traditions].sort((a, b) => b.completions - a.completions).slice(0, 3);

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
            <div className="hidden md:flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm opacity-90">Your Progress</div>
                <div className="text-2xl font-bold">{completedTraditions.size} / {traditions.length}</div>
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
                {completedTraditions.size} of {traditions.length} ({progressPercentage.toFixed(0)}%
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
              {traditions.map((tradition) => (
                <TraditionCard
                  key={tradition.id}
                  tradition={tradition}
                  userRating={userRatings[tradition.id] || null}
                  isCompleted={completedTraditions.has(tradition.id)}
                  onComplete={handleComplete}
                  onRate={handleRate}
                />
              ))}
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
          </div>
        </div>
      </div>

      {/* Add Custom Tradition Dialog */}
      <AddCustomTradition
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={handleAddCustom}
      />
    </div>
  );
}
