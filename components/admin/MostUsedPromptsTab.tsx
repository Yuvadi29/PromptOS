"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function MostUsedPromptsTab() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/most-used-prompts")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">🔥 Most Used Prompts</h2>
      <div className="h-96 bg-gray-900 p-4 rounded-xl shadow-lg">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="domain" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#4ade80" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
