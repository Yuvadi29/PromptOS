import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import _ from 'lodash';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

// Minimalist lexicon of English filler words to exclude from NLP category clustering
const stopWords = new Set([
  "about", "above", "after", "again", "against", "all", "and", "any", "are", "because", 
  "been", "before", "being", "below", "between", "both", "but", "could", "did", "does",
  "doing", "down", "during", "each", "few", "for", "from", "further", "had", "has",
  "have", "having", "here", "how", "into", "more", "most", "once", "only", "other",
  "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "should", "some",
  "such", "than", "that", "the", "their", "theirs", "them", "themselves", "then", "there",
  "these", "they", "this", "those", "through", "too", "under", "until", "very", "was",
  "were", "what", "when", "where", "which", "while", "who", "whom", "why", "with", "would",
  "you", "your", "yours", "yourself", "yourselves", "generate", "create", "write", "make",
  "tell", "give", "help", "please", "can", "will", "just", "like", "want", "need", "prompt", "code", "using"
]);

export async function GET() {
  try {
    // Fetch a solid sample of recent prompts to build the corpus
    const { data: prompts, error } = await supabase
      .from("prompts")
      .select("prompt_value")
      .order("created_at", { ascending: false })
      .limit(150);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!prompts || prompts.length === 0) {
      return NextResponse.json([]);
    }

    // --- NLP Term Frequency Analysis ---
    // 1. Compile the corpus
    const corpus = prompts.map(p => p.prompt_value).join(" ").toLowerCase();
    
    // 2. Tokenize (extract words with 4+ letters)
    const tokens = corpus.match(/\b[a-z]{4,}\b/g) || [];
    
    // 3. Filter stop words & normalize
    const meaningfulTokens = tokens.filter(word => !stopWords.has(word));
    
    // 4. Cluster and count frequencies
    const frequencyMap = _.countBy(meaningfulTokens);
    
    // 5. Sort to find the dominant trends
    const trendingCategories = Object.entries(frequencyMap)
      .map(([word, freq]) => ({
        domain: _.capitalize(word),
        count: freq
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6); // Take top 6 categories matching our UI constraints

    // 6. Ensure we have data even if parsing failed
    if (trendingCategories.length === 0) {
         trendingCategories.push({ domain: "General Processing", count: 1 });
    }

    return NextResponse.json(trendingCategories);
  } catch (error) {
    console.error("Critical error in trending NLP:", error);
    return NextResponse.json([{ domain: "NLP Processing Error", count: 1 }], { status: 500 });
  }
}
