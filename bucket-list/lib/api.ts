import { supabase } from './supabase';
import type { Tradition, TraditionWithStats, User, UserRating, UserDifficultyRating } from './types';

// User operations
export async function getUserByUsername(username: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error fetching user:', error);
    return null;
  }

  return data;
}

export async function createUser(username: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .insert({ username })
    .select()
    .single();

  if (error) {
    console.error('Error creating user:', error);
    return null;
  }

  return data;
}

export async function getOrCreateUser(username: string): Promise<User | null> {
  let user = await getUserByUsername(username);
  
  if (!user) {
    user = await createUser(username);
  }

  return user;
}

// Tradition operations
export async function getAllTraditions(): Promise<Tradition[]> {
  const { data, error } = await supabase
    .from('traditions')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching traditions:', error);
    return [];
  }

  return data || [];
}

export async function createTradition(name: string, description: string, userId?: string): Promise<Tradition | null> {
  const { data, error } = await supabase
    .from('traditions')
    .insert({
      name,
      description,
      created_by: userId || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating tradition:', error);
    return null;
  }

  return data;
}

// Completion operations
export async function getUserCompletions(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('user_completions')
    .select('tradition_id')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching completions:', error);
    return new Set();
  }

  return new Set(data?.map(c => c.tradition_id) || []);
}

export async function toggleCompletion(userId: string, traditionId: string, isCompleted: boolean): Promise<boolean> {
  if (isCompleted) {
    // Remove completion
    const { error } = await supabase
      .from('user_completions')
      .delete()
      .eq('user_id', userId)
      .eq('tradition_id', traditionId);

    if (error) {
      console.error('Error removing completion:', error);
      return false;
    }
  } else {
    // Add completion
    const { error } = await supabase
      .from('user_completions')
      .insert({
        user_id: userId,
        tradition_id: traditionId,
      });

    if (error) {
      console.error('Error adding completion:', error);
      return false;
    }
  }

  return true;
}

// Rating operations
export async function getUserRatings(userId: string): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('user_ratings')
    .select('tradition_id, rating')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching ratings:', error);
    return {};
  }

  const ratings: Record<string, number> = {};
  data?.forEach(r => {
    ratings[r.tradition_id] = r.rating;
  });

  return ratings;
}

export async function submitRating(userId: string, traditionId: string, rating: number): Promise<boolean> {
  const { error } = await supabase
    .from('user_ratings')
    .upsert({
      user_id: userId,
      tradition_id: traditionId,
      rating,
    }, {
      onConflict: 'user_id,tradition_id',
    });

  if (error) {
    console.error('Error submitting rating:', error);
    return false;
  }

  return true;
}

// Difficulty rating operations
export async function getUserDifficultyRatings(userId: string): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('user_difficulty_ratings')
    .select('tradition_id, difficulty')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching difficulty ratings:', error);
    return {};
  }

  const ratings: Record<string, number> = {};
  data?.forEach(r => {
    ratings[r.tradition_id] = r.difficulty;
  });

  return ratings;
}

export async function submitDifficultyRating(userId: string, traditionId: string, difficulty: number): Promise<boolean> {
  const { error } = await supabase
    .from('user_difficulty_ratings')
    .upsert({
      user_id: userId,
      tradition_id: traditionId,
      difficulty,
    }, {
      onConflict: 'user_id,tradition_id',
    });

  if (error) {
    console.error('Error submitting difficulty rating:', error);
    return false;
  }

  return true;
}

// Get traditions with computed statistics
export async function getTraditionsWithStats(): Promise<TraditionWithStats[]> {
  // Get all traditions
  const traditions = await getAllTraditions();

  // Get all completions
  const { data: completions } = await supabase
    .from('user_completions')
    .select('tradition_id');

  // Get all ratings
  const { data: ratings } = await supabase
    .from('user_ratings')
    .select('tradition_id, rating');

  // Get all difficulty ratings
  const { data: difficultyRatings } = await supabase
    .from('user_difficulty_ratings')
    .select('tradition_id, difficulty');

  // Calculate statistics for each tradition
  const traditionsWithStats: TraditionWithStats[] = traditions.map(tradition => {
    // Count completions
    const traditionCompletions = completions?.filter(c => c.tradition_id === tradition.id) || [];
    const completionsCount = traditionCompletions.length;

    // Calculate average rating
    const traditionRatings = ratings?.filter(r => r.tradition_id === tradition.id) || [];
    const totalRatings = traditionRatings.length;
    const averageRating = totalRatings > 0
      ? traditionRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
      : 0;

    // Calculate average difficulty
    const traditionDifficultyRatings = difficultyRatings?.filter(r => r.tradition_id === tradition.id) || [];
    const totalDifficultyRatings = traditionDifficultyRatings.length;
    const averageDifficulty = totalDifficultyRatings > 0
      ? traditionDifficultyRatings.reduce((sum, r) => sum + r.difficulty, 0) / totalDifficultyRatings
      : 0;

    return {
      ...tradition,
      averageRating,
      totalRatings,
      averageDifficulty,
      totalDifficultyRatings,
      completions: completionsCount,
    };
  });

  return traditionsWithStats;
}

