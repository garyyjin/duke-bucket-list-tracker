// Database types matching Supabase schema
export interface User {
  id: string;
  username: string;
  created_at: string;
}

export interface Tradition {
  id: string;
  name: string;
  description: string;
  created_by: string | null;
  created_at: string;
}

export interface UserCompletion {
  id: string;
  user_id: string;
  tradition_id: string;
  completed_at: string;
}

export interface UserRating {
  id: string;
  user_id: string;
  tradition_id: string;
  rating: number;
  created_at: string;
}

export interface UserDifficultyRating {
  id: string;
  user_id: string;
  tradition_id: string;
  difficulty: number;
  created_at: string;
}

// Frontend types with computed fields
export interface TraditionWithStats extends Tradition {
  averageRating: number;
  totalRatings: number;
  averageDifficulty: number;
  totalDifficultyRatings: number;
  completions: number;
}

