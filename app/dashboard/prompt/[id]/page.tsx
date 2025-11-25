// 'use client';
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import supabase from "@/lib/supabase";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";

// export default function PromptSessionPage() {
//   const { id } = useParams();
//   const [prompt, setPrompt] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPrompt = async () => {
//       const { data, error } = await supabase
//         .from("prompts")
//         .select("prompt_value")
//         .eq("id", id)
//         .single();

//       if (data) {
//         setPrompt(data.prompt_value);
//       }
//       setLoading(false);
//     };
//     fetchPrompt();
//   }, [id]);

//   const handleSave = async () => {
//     const { error } = await supabase
//       .from("prompts")
//       .update({ prompt_value: prompt })
//       .eq("id", id);

//     if (!error) {
//       alert("Prompt updated!");
//     }
//   };

//   if (loading) return <div className="p-6">Loading...</div>;

//   return (
//     <div className="p-6 space-y-4 max-w-3xl mx-auto">
//       <h1 className="text-2xl font-bold">Edit Prompt Session</h1>
//       <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={10} />
//       <Button onClick={handleSave}>Save Changes</Button>
//     </div>
//   );
// }

'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabaseAdmin } from "@/lib/supabase";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";

export default function PromptSessionPage() {
  const { id } = useParams();
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPrompt = async () => {
      const { data, error } = await supabaseAdmin
        .from("prompts")
        .select("original_prompt, prompt_value")
        .eq("id", id)
        .single();

      if (data) {
        setOriginalPrompt(data.original_prompt);
        setEnhancedPrompt(data.prompt_value);
      }
      setLoading(false);
    };

    fetchPrompt();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabaseAdmin
      .from("prompts")
      .update({ prompt_value: enhancedPrompt })
      .eq("id", id);

    if (!error) {
      alert("Enhanced prompt updated!");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight">Prompt Editor</h1>
      <p className="text-muted-foreground text-sm">
        Review and enhance your AI prompt below.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Original Prompt</CardTitle>
          <CardDescription>This is the unedited version entered by the user.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea value={originalPrompt} readOnly rows={6} className="bg-muted cursor-not-allowed" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Enhanced Prompt</CardTitle>
          <CardDescription>Edit and save your optimized prompt here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={enhancedPrompt}
            onChange={(e) => setEnhancedPrompt(e.target.value)}
            rows={10}
          />
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
