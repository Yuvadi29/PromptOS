-- user_activity_log table definition
CREATE TABLE IF NOT EXISTS "public"."user_activity_log" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "user_id" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    "action" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- set up RLS
ALTER TABLE "public"."user_activity_log" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own activity logs" ON "public"."user_activity_log"
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own activity logs" ON "public"."user_activity_log"
FOR SELECT USING (auth.uid() = user_id);

-- index for querying activities by date/user quickly
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_id_created_at 
ON public.user_activity_log(user_id, created_at DESC);
