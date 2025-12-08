"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { diffLines } from "diff";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CompareModal({
  promptId,
  currentVersionContent,
}: {
  promptId: string | number;
  currentVersionContent: string;
}) {
  const [open, setOpen] = useState(false);
  const [diff, setDiff] = useState<any[]>([]);
  const [compareContent, setCompareContent] = useState("");
  const [versionId, setVersionId] = useState<string | null>(null);

  useEffect(() => {
    function handler(e: any) {
      const versionId = e.detail;
      setVersionId(versionId);
      openCompare(versionId);
    }
    window.addEventListener("openCompare", handler);

    return () => window.removeEventListener("openCompare", handler);
  });

  async function openCompare(id: string) {
    setOpen(true);

    // Fetch ALL versions (already includes content in your schema)
    const allVersionsRes = await fetch(`/api/prompt/${promptId}/versions`);
    const allVersions = await allVersionsRes.json();
    const match = allVersions.find((v: any) => v.prompt_version_id === id);

    if (!match) return;

    // Fetch the single version's content
    const versionContentRes = await fetch(
      `/api/prompt/${promptId}/versions/${id}`
    );
    const contentData = await versionContentRes.json();

    const selectedContent =
      contentData?.content || match?.content || "No content";

    setCompareContent(selectedContent);

    // Compute diff
    const computed = diffLines(currentVersionContent, selectedContent);
    setDiff(computed);
  }

  function close() {
    setOpen(false);
    setVersionId(null);
    setDiff([]);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ───── Overlay with dark fade & blur ───── */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />

          {/* ───── Modal Container ───── */}
          <motion.div
            className="fixed top-1/2 left-1/2 z-[1200] w-[90vw] max-w-5xl 
              bg-[#0B0B0C] border border-[#FF6A00]/30 rounded-xl shadow-[0_0_30px_rgba(255,106,0,0.15)]
              p-6"
            initial={{ opacity: 0, scale: 0.85, x: "-50%", y: "-50%" }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
          >
            {/* ───── Header ───── */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-orange-400">
                Compare with Version {versionId}
              </h2>

              <Button
                onClick={close}
                variant="ghost"
                className="text-orange-400 hover:bg-orange-500/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* ───── Content Grid ───── */}
            <div className="grid grid-cols-2 gap-4 text-sm overflow-auto max-h-[70vh]">

              {/* LEFT: Current Version */}
              <div className="bg-[#131313] border border-[#2A2A2A] rounded-lg p-4 overflow-auto">
                <h3 className="text-orange-300 mb-2 text-xs uppercase tracking-wider">
                  Current Version
                </h3>

                <pre className="whitespace-pre-wrap text-gray-300 text-xs leading-relaxed">
                  {currentVersionContent}
                </pre>
              </div>

              {/* RIGHT: Diff Preview */}
              <div className="bg-[#131313] border border-[#2A2A2A] rounded-lg p-4 overflow-auto">
                <h3 className="text-orange-300 mb-2 text-xs uppercase tracking-wider">
                  Comparing Version
                </h3>

                <pre className="whitespace-pre-wrap text-xs leading-relaxed">
                  {diff.map((part, index) => (
                    <span
                      key={index}
                      className={
                        part.added
                          ? "bg-[#1F3315] text-[#7CFF4F]" // green-on-dark for additions
                          : part.removed
                          ? "bg-[#3A0D0D] text-[#FF4F4F]" // red-on-dark for removals
                          : "text-gray-300"
                      }
                    >
                      {part.value}
                    </span>
                  ))}
                </pre>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
