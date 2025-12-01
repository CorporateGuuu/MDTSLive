# Saved Cart Feature - Environment Variables

The Saved Cart feature requires the following Supabase environment variables to be configured:

## Required Environment Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Setup Instructions

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the project to be fully initialized

2. **Get Your Project URL and API Key**
   - In your Supabase dashboard, go to Settings > API
   - Copy the "Project URL" and "anon public" key

3. **Configure Environment Variables**
   - Create or update your `.env.local` file:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Run Database Migration**
   - The saved carts feature uses a database table that needs to be created
   - Run the migration file: `migrations/010_saved_carts.sql`
   - This can be done via the Supabase SQL Editor or command line

## Database Schema

The saved carts feature creates a `saved_carts` table with the following structure:

```sql
CREATE TABLE saved_carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name VARCHAR(255) NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  total DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

## Features Enabled

With proper environment variable configuration, the following features become available:

- ✅ **Persistent Saved Carts**: Carts are saved to Supabase and persist across sessions
- ✅ **Real-time Updates**: Changes are immediately saved to the database
- ✅ **Multi-cart Support**: Users can save multiple carts with different names
- ✅ **Quantity Management**: Item quantities are updated in real-time
- ✅ **Cart Deletion**: Full cart deletion with confirmation dialogs

## Security

- All saved cart operations use Row Level Security (RLS) policies
- Users can only access their own saved carts
- All database operations are authenticated through Supabase Auth

## Fallback Behavior

If Supabase environment variables are not configured:
- The application will still work but saved carts will only exist in local state
- Data will be lost when the user refreshes or closes the browser
- A warning will be shown in the console about missing Supabase configuration
