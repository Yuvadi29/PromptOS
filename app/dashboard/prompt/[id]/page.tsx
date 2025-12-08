'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabaseAdmin } from "@/lib/supabase"; // Make sure this is client-allowed or switch to supabase browser client
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Save, History } from "lucide-react";
import VersionHistoryDrawer from "@/components/VersionHistoryDrawer";
import CompareModal from "@/components/CompareModal";

interface PromptVersion {
  version_number: number;
  source: string;
  content: string;
  prompt_id: string;
}

export default function PromptSessionPage() {
  const { id } = useParams();

  const [currentVersion, setCurrentVersion] = useState<PromptVersion | null>(null);
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch latest version (highest version_number)
  useEffect(() => {
    const fetchLatestVersion = async () => {
      // Load latest version from prompt_versions
      const { data: versions, error } = await supabaseAdmin
        .from("prompt_versions")
        .select("*")
        .eq("prompt_id", id)
        .order("version_number", { ascending: false })
        .limit(1);

      if (versions && versions.length > 0) {
        const latest = versions[0];
        setCurrentVersion(latest);
        setEnhancedPrompt(latest.content);
      }

      setLoading(false);
    };

    fetchLatestVersion();
  }, [id]);

  // Create a new version instead of updating prompts table
  const handleSave = async () => {
    setSaving(true);

    const { data, error } = await supabaseAdmin
      .from("prompt_versions")
      .insert([
        {
          prompt_id: id,
          content: enhancedPrompt,
          source: "user",
          reason: "User edited prompt in editor"
        }
      ])
      .select()
      .single();

    if (!error) {
      alert(`New version created: v${data.version_number}`);
      setCurrentVersion(data);
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

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prompt Editor</h1>
          <p className="text-muted-foreground text-sm">
            Edit your optimized prompt and manage versions.
          </p>
        </div>

        {/* Version History Button */}
        <Button variant="outline" onClick={() => setDrawerOpen(true)} className="cursor-pointer">
          <History className="h-4 w-4 mr-2" />
          Version History
        </Button>
      </div>

      {/* Version Badge (shows current version) */}
      {currentVersion && (
        <p className="text-sm text-muted-foreground">
          Current Version: <strong>v{currentVersion.version_number}</strong> — {currentVersion.source}
        </p>
      )}

      {/* Enhanced Prompt Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Prompt</CardTitle>
          <CardDescription>This is the version you are currently editing.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={enhancedPrompt}
            onChange={(e) => setEnhancedPrompt(e.target.value)}
            rows={12}
          />

          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving New Version...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save as New Version
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Drawer UI */}
      {id && (
        <VersionHistoryDrawer
          promptId={Array.isArray(id) ? id[0] : id}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onRevertSuccess={(newVersionId) => {
            console.log("Reverted to version:", newVersionId);
          }}
        />
      )}

      {id && <CompareModal promptId={Array.isArray(id) ? id[0] : id} currentVersionContent={enhancedPrompt} />}
    </div>
  );
}
