-- Create profiles table for user management
create table profiles (
  id uuid references auth.users not null primary key,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Allow new users to auto-create profile
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Enable Row Level Security
alter table profiles enable row level security;

-- Create policies for profiles table
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on profiles for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update all profiles"
  on profiles for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Update the trigger to send welcome emails
-- Note: Replace 'your-project.supabase.co' and 'your-service-role-key' with actual values

-- Alternative approach: Call Edge Function from trigger
-- This requires the pg_net extension to be enabled in Supabase

-- For now, you can call the Edge Function from your application code
-- when users successfully sign up, or set up a database webhook

-- Create login_attempts table for rate limiting
create table login_attempts (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  ip text not null,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for efficient rate limiting queries
create index login_attempts_email_created_at_idx on login_attempts(email, created_at);
create index login_attempts_ip_created_at_idx on login_attempts(ip, created_at);

-- Enable Row Level Security
alter table login_attempts enable row level security;

-- Allow service role to manage login attempts (for rate limiting)
create policy "Service role can manage login attempts"
  on login_attempts for all
  using (auth.role() = 'service_role');
