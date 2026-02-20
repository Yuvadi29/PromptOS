CREATE TABLE IF NOT EXISTS "public"."user_streaks" (
    "user_id" UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    "current_streak" INTEGER DEFAULT 0 NOT NULL,
    "last_active_date" DATE
);

-- Enable RLS
ALTER TABLE "public"."user_streaks" ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see and update their own streak
CREATE POLICY "Users can view own streak" ON "public"."user_streaks"
    FOR SELECT USING (auth.uid() IN (
        SELECT auth_users.id FROM auth.users as auth_users 
        JOIN public.users ON users.email = auth_users.email 
        WHERE users.id = user_streaks.user_id
    ));
    
-- Note: Service role (supabaseAdmin) can bypass RLS, which is what our backend uses.
