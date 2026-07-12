'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { supabaseAdmin } from '@/lib/supabase';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Save, History, Clock } from 'lucide-react';
import VersionHistoryDrawer from '@/components/VersionHistoryDrawer';
import CompareModal from '@/components/CompareModal';

interface PromptVersion {
  version_number: number;
  source: string;
  content: string;
  prompt_id: string;
  created_at?: string;
}

export default function PromptSessionPage() {
  const { id } = useParams();

  const [currentVersion, setCurrentVersion] = useState<PromptVersion | null>(null);
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [promptMeta, setPromptMeta] = useState<{
    created_at: string;
    last_modified?: string;
  } | null>(null);

  const fetchLatestVersion = useCallback(async () => {
    // 1. Fetch base prompt details (created_at)
    const { data: promptData } = await supabaseAdmin
      .from('prompts')
      .select('created_at')
      .eq('id', id)
      .single();

    // 2. Fetch all versions to determine newest and oldest
    const { data: versions } = await supabaseAdmin
      .from('prompt_versions')
      .select('*')
      .eq('prompt_id', id)
      .order('version_number', { ascending: false });

    let latestModDate = promptData?.created_at;

    if (versions && versions.length > 0) {
      const latest = versions[0];
      setCurrentVersion(latest);
      setEnhancedPrompt(latest.content);
      latestModDate = latest.created_at;
    } else {
      // Fallback: If no versions exist yet, load the original prompt
      const { data: originalPrompt } = await supabaseAdmin
        .from('prompts')
        .select('prompt_value')
        .eq('id', id)
        .single();

      if (originalPrompt) {
        const fallbackVersion = {
          version_number: 1,
          source: 'Original Generation',
          content: originalPrompt.prompt_value,
          prompt_id: (Array.isArray(id) ? id[0] : id) as string,
        };
        setCurrentVersion(fallbackVersion);
        setEnhancedPrompt(originalPrompt.prompt_value);
      }
    }

    if (promptData) {
      setPromptMeta({
        created_at: promptData.created_at,
        last_modified: latestModDate,
      });
    }

    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchLatestVersion();
    }
  }, [id, fetchLatestVersion]);

  // Create a new version instead of updating prompts table
  const handleSave = async () => {
    setSaving(true);

    const { data, error } = await supabaseAdmin
      .from('prompt_versions')
      .insert([
        {
          prompt_id: id,
          content: enhancedPrompt,
          source: 'user',
          reason: 'User edited prompt in editor',
        },
      ])
      .select()
      .single();

    if (!error) {
      alert(`New version created: v${data.version_number}`);
      // Refresh prompt meta and version info
      await fetchLatestVersion();
    } else {
      console.error(error);
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
          <h1 className="text-3xl font-bold tracking-tight text-white font-heading">
            Prompt Editor
          </h1>
          <p className="text-muted-foreground text-sm">
            Edit your optimized prompt and manage versions.
          </p>
        </div>

        {/* Version History Button */}
        <Button
          variant="outline"
          onClick={() => setDrawerOpen(true)}
          className="cursor-pointer border-zinc-800 hover:bg-zinc-900 text-zinc-200"
        >
          <History className="h-4 w-4 mr-2" />
          Version History
        </Button>
      </div>

      {/* Version and Date Metadata Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/40 border border-white/5">
        {currentVersion && (
          <p className="text-sm text-zinc-300">
            Current Version:{' '}
            <strong className="text-emerald-400">v{currentVersion.version_number}</strong> —{' '}
            <span className="text-zinc-400">{currentVersion.source}</span>
          </p>
        )}

        {promptMeta && (
          <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-zinc-600" />
              Created:{' '}
              <strong className="text-zinc-400">
                {new Date(promptMeta.created_at).toLocaleDateString()}
              </strong>
            </span>
            {promptMeta.last_modified && (
              <span className="flex items-center gap-1 border-l border-white/5 pl-4">
                Last Modified:{' '}
                <strong className="text-zinc-400">
                  {new Date(promptMeta.last_modified).toLocaleDateString()}
                </strong>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Prompt Editor */}
      <Card className="bg-zinc-900/20 border-white/5 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-white text-lg">Enhanced Prompt</CardTitle>
          <CardDescription className="text-zinc-400">
            This is the version you are currently editing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={enhancedPrompt}
            onChange={(e) => setEnhancedPrompt(e.target.value)}
            rows={12}
            className="bg-zinc-950 border-white/5 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500/30"
          />

          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold cursor-pointer"
          >
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
          onClose={async () => {
            setDrawerOpen(false);
            // Refresh in case they reverted
            await fetchLatestVersion();
          }}
          onRevertSuccess={async () => {
            await fetchLatestVersion();
          }}
        />
      )}

      {id && (
        <CompareModal
          promptId={Array.isArray(id) ? id[0] : id}
          currentVersionContent={enhancedPrompt}
        />
      )}
    </div>
  );
}
