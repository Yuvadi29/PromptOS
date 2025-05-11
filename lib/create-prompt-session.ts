import supabase from "./supabase";

export async function createPromptSession(userId: string, title: string) {
    const { data, error } = await supabase
        .from("prompt_sessions")
        .insert([{ user_id: userId, title }])
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function createPromptWithSession(userId: string, promptValue: string) {
    const session = await createPromptSession(userId, promptValue.slice(0, 50));
    const { data, error } = await supabase
        .from("prompts")
        .insert([{ prompt_value: promptValue, created_by: userId, session_id: session?.id }])
        .select()
        .single();

    if (error) throw error;
    return { session, prompt: data };
};