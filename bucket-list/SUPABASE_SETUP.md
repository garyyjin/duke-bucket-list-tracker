# Supabase Setup Instructions

## Step 1: Create Environment Variables File

Create a `.env.local` file in the root of your project with the following content:

```env
NEXT_PUBLIC_SUPABASE_URL=https://fbvggugvopdujmxdepuf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZidmdndWd2b3BkdWpteGRlcHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MzYyOTQsImV4cCI6MjA4MDIxMjI5NH0.79f7NwT2TmmMnvoR4ImaBs4Fc4uIVkoNXQt9r1YqQdU
```

**Important:** The `.env.local` file is already in `.gitignore`, so it won't be committed to your repository.

## Step 2: Set Up Database Schema in Supabase

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to the **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy the entire contents of `supabase-schema.sql` file
5. Paste it into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)

This will create:
- All necessary tables (users, traditions, user_completions, user_ratings, user_difficulty_ratings)
- Indexes for performance
- Row Level Security (RLS) policies
- Default traditions (the 5 default Duke traditions)

## Step 3: Verify Tables Were Created

1. Go to **Table Editor** in the Supabase dashboard
2. You should see these tables:
   - `users`
   - `traditions`
   - `user_completions`
   - `user_ratings`
   - `user_difficulty_ratings`

3. Check the `traditions` table - it should have 5 default traditions already inserted

## Step 4: Test the Application

1. Make sure your `.env.local` file is created with the correct values
2. Restart your Next.js development server:
   ```bash
   npm run dev
   ```
3. Open http://localhost:3000 in your browser
4. Try logging in with a username
5. Test completing a tradition
6. Test rating a tradition (after completing it)
7. Test adding a custom tradition

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure `.env.local` exists in the project root
- Make sure the variable names are exactly `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart your dev server after creating/modifying `.env.local`

### Database connection errors
- Verify your Supabase project is active
- Check that the URL and anon key are correct
- Make sure you've run the SQL schema in Supabase

### "Table doesn't exist" errors
- Go back to Step 2 and make sure you ran the SQL schema
- Check the Table Editor to verify tables exist

### RLS (Row Level Security) errors
- The schema includes permissive RLS policies for development
- If you get permission errors, check the RLS policies in Supabase under **Authentication** > **Policies**

## Next Steps (Optional)

### Enable Real-time Updates
If you want real-time updates when other users interact with traditions:

1. In Supabase dashboard, go to **Database** > **Replication**
2. Enable replication for the tables you want to watch
3. Update the code to use Supabase real-time subscriptions

### Add Authentication
Currently, the app uses simple username-based login. To add proper authentication:

1. Enable Supabase Auth in your project settings
2. Update the login flow to use Supabase Auth
3. Use `supabase.auth.getUser()` instead of username lookup

### Customize RLS Policies
The current policies allow all operations. For production, you should:

1. Restrict who can create traditions
2. Ensure users can only modify their own data
3. Add proper authentication checks

