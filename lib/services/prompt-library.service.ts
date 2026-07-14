import { supabaseAdmin } from '@/lib/supabase';
import { logActivityAndCalculateStreak } from '@/lib/streaks';

export interface CreatePromptInput {
  userId: string;
  title: string;
  description: string;
  promptText: string;
  niche: string;
}

export async function createPrompt({
  userId,
  title,
  description,
  promptText,
  niche,
}: CreatePromptInput) {
  if (!userId || !title || !description || !promptText || !niche) {
    throw new Error('Missing Data');
  }

  // Save to db
  const { error } = await supabaseAdmin.from('prompt_library').insert({
    created_by: userId,
    prompt_title: title,
    prompt_description: description,
    promptText: promptText,
    niche: niche,
  });

  if (error) {
    throw new Error(error.message);
  }

  // Update streak & log action
  await logActivityAndCalculateStreak(userId, 'prompt_library_added', { prompt: title });

  return { message: 'Prompt Added to Library Saved Successfully' };
}

export async function getPrompts() {
  const { data, error } = await supabaseAdmin
    .from('prompt_library')
    .select(
      `
        *,
        users (
            name,
            username,
            image
        )
    `
    )
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export interface ToggleBookmarkInput {
  userId: string;
  promptId: number;
}

export async function toggleBookmark({ userId, promptId }: ToggleBookmarkInput) {
  if (!promptId) {
    throw new Error('Missing promptId');
  }

  // Check if bookmark already exists
  const { data: existing } = await supabaseAdmin
    .from('prompt_bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('prompt_id', promptId)
    .maybeSingle();

  if (existing) {
    // Remove bookmark
    const { error } = await supabaseAdmin.from('prompt_bookmarks').delete().eq('id', existing.id);

    if (error) {
      throw new Error(error.message);
    }

    return { bookmarked: false, message: 'Bookmark removed' };
  }

  // Add bookmark
  const { error } = await supabaseAdmin
    .from('prompt_bookmarks')
    .insert({ user_id: userId, prompt_id: promptId });

  if (error) {
    throw new Error(error.message);
  }

  return { bookmarked: true, message: 'Bookmark added' };
}

export interface GetBookmarksInput {
  userId: string;
  populated?: boolean;
}

export async function getBookmarks({ userId, populated }: GetBookmarksInput) {
  if (populated) {
    const { data, error } = await supabaseAdmin
      .from('prompt_bookmarks')
      .select(
        `
          id,
          created_at,
          prompt_library (
              id,
              prompt_title,
              prompt_description,
              "promptText",
              niche,
              likes,
              dislikes,
              created_by,
              users (
                  name,
                  username,
                  image
              )
          )
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  const { data, error } = await supabaseAdmin
    .from('prompt_bookmarks')
    .select('prompt_id')
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((row: any) => row.prompt_id);
}
