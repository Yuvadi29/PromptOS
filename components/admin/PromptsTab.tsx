"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function PromptsTab() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // prevent hydration mismatch
    fetch("/api/admin/prompts-by-user")
      .then((res) => res.json())
      .then(setPrompts);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-gray-400 text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-8 text-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
        Prompts by User
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {prompts?.map((row) => (
          <Card
            key={row.user_id}
            className="relative p-6 rounded-2xl border border-white/20 shadow-xl bg-white/10 backdrop-blur-lg transition-transform hover:scale-105 hover:shadow-2xl"
            style={{
              boxShadow:
                "0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 1.5px 4px 0 rgba(0,0,0,0.10)",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white/30 shadow-lg mb-2">
                <Image
                  src={row?.user_image || "/avatar-placeholder.png"}
                  alt={row?.user_name || "User"}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="font-semibold text-white text-lg text-center">
                {row.user_name || "Unknown User"}
              </p>
              <p className="text-xs text-gray-300 text-center break-all">
                {row.user_email}
              </p>
              <div className="flex flex-col items-center mt-4">
                <span className="text-3xl font-extrabold text-green-300 drop-shadow">
                  {row.prompt_count}
                </span>
                <span className="text-xs text-gray-400 tracking-wide uppercase">
                  Prompts
                </span>
              </div>
            </div>
            <div className="absolute inset-0 rounded-2xl pointer-events-none" />
          </Card>
        ))}
      </div>
    </div>
  );
}
