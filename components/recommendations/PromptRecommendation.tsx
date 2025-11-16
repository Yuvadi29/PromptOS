import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import debounce from "lodash/debounce";

interface Props {
  promptId?: string; // filled after enhancement
  userId?: string;
  queryPrompt?: string; // live typing
}

export default function PromptRecommendations({ promptId, userId, queryPrompt }: Props) {
  const [promptRecs, setPromptRecs] = useState<any[]>([]);
  const [userRecs, setUserRecs] = useState<any[]>([]);

  const fetchRecs = debounce(async () => {
    try {
      // Live suggestions while typing
      if (queryPrompt && queryPrompt.trim() && !promptId) {
        const { data } = await supabase.rpc("recommend_prompts", { query_prompt_text: queryPrompt, match_count: 5 });
        setPromptRecs(data || []);
      }

      // Saved-prompt based suggestions
      if (promptId) {
        const { data } = await supabase.rpc("recommend_prompts", { query_prompt_id: promptId, match_count: 5 });
        setPromptRecs(data || []);
      }

      // Personalized for user
      if (userId) {
        const { data } = await supabase.rpc("recommend_for_user", { user_uuid: userId, match_count: 5 });
        setUserRecs(data || []);
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    }
  }, 300);

  useEffect(() => {
    fetchRecs();
    return fetchRecs.cancel;
  }, [promptId, userId, queryPrompt]);

  return (
    <div className="mt-6 space-y-6">
      {promptRecs.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Suggestions</h3>
          <ul className="space-y-3">
            {promptRecs.map((rec) => (
              <li key={rec.id} className="p-3 rounded-xl shadow bg-neutral-900 cursor-pointer hover:bg-neutral-800">
                <p className="text-sm text-gray-300">{rec.prompt}</p>
                {rec.similarity && <span className="text-xs text-gray-500">Similarity: {(rec.similarity * 100).toFixed(1)}%</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {userRecs.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Recommended for you</h3>
          <ul className="space-y-3">
            {userRecs.map((rec) => (
              <li key={rec.id} className="p-3 rounded-xl shadow bg-neutral-900 cursor-pointer hover:bg-neutral-800">
                <p className="text-sm text-gray-300">{rec.prompt}</p>
                {rec.similarity && <span className="text-xs text-gray-500">Similarity: {(rec.similarity * 100).toFixed(1)}%</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
