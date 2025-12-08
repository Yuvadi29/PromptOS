"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, History } from "lucide-react";

type VersionStat = {
  prompt_version_id: string;
  prompt_id: string;
  version_number: number;
  created_at: string;
  source: string;
  reason: string | null;
  runs: number;
  avg_score: number;
  thumbs_up: number;
  thumbs_down: number;
};

export default function VersionHistoryDrawer({
  promptId,
  open,
  onClose,
  onRevertSuccess,
}: {
  promptId: string | number;
  open: boolean;
  onClose: () => void;
  onRevertSuccess?: (newVersionId: string) => void;
}) {
  const [versions, setVersions] = useState<VersionStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [reverting, setReverting] = useState<string | null>(null);

  useEffect(() => {
    if (open) fetchVersions();
  }, [open, promptId]);

  async function fetchVersions() {
    setLoading(true);
    try {
      const res = await fetch(`/api/prompt/${promptId}/versions`);
      const data = await res.json();
      setVersions(data || []);
    } catch (err) {
      console.error("Error fetching versions →", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRevert(versionId: string) {
    const confirmed = confirm(
      "This will create a NEW version that reverts to the selected version.\nDo you want to continue?"
    );
    if (!confirmed) return;

    setReverting(versionId);

    try {
      const res = await fetch(
        `/api/prompt/${promptId}/versions/${versionId}/revert`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
        }
      );
      const data = await res.json();

      if (res.ok) {
        alert("Reverted — new version created.");
        await fetchVersions();
        onRevertSuccess?.(data.new_version?.id);
      } else {
        alert(data.error || "Revert failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while reverting.");
    } finally {
      setReverting(null);
    }
  }

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[420px] 
      bg-[#000000] border-l border-[#1E2633] shadow-2xl 
      transform transition-transform duration-300 z-[1000]
      ${open ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-orange-400/65">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-200">Version History</h2>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-slate-400 hover:bg-[#1A2230] cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Close
        </Button>
      </div>

      {/* BODY */}
      <div className="overflow-y-auto h-[calc(100%-64px)] p-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : versions.length === 0 ? (
          <p className="text-sm text-slate-500 mt-6 text-center">
            No versions found for this prompt.
          </p>
        ) : (
          <div className="space-y-4">
            {versions.map((v) => (
              <div
                key={v.prompt_version_id}
                className="border border-[#1E2633] p-4 rounded-lg hover:border-orange-400 transition"
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="text-slate-300">
                    <p className="font-medium text-primary">
                      Version{" "}
                      <span className="text-primary">
                        v{v.version_number}
                      </span>
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(v.created_at).toLocaleString()}
                    </p>
                    {v.reason && (
                      <p className="text-xs text-slate-500 mt-1 italic">
                        {v.reason}
                      </p>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded bg-[#161D29]">
                    <p className="text-[11px] uppercase text-slate-500">
                      Runs
                    </p>
                    <p className="font-semibold text-slate-200">{v.runs}</p>
                  </div>
                  <div className="p-2 rounded bg-[#161D29]">
                    <p className="text-[11px] uppercase text-slate-500">
                      Score
                    </p>
                    <p className="font-semibold text-slate-200">
                      {v.avg_score ?? 0}
                    </p>
                  </div>
                  <div className="p-2 rounded bg-[#161D29]">
                    <p className="text-[11px] uppercase text-slate-500">
                      Thumbs
                    </p>
                    <p className="font-semibold text-slate-200">
                      👍 {v.thumbs_up} / 👎 {v.thumbs_down}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("openCompare", {
                          detail: v.prompt_version_id,
                        })
                      )
                    }
                    className="border-[#2A3240] text-slate-300 hover:bg-[#1C2431] cursor-pointer"
                  >
                    Compare
                  </Button>

                  <Button
                    size="sm"
                    disabled={reverting === v.prompt_version_id}
                    onClick={() => handleRevert(v.prompt_version_id)}
                    className="bg-[#000000] text-slate-200 hover:bg-orange-500 cursor-pointer"
                  >
                    {reverting === v.prompt_version_id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Revert"
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
