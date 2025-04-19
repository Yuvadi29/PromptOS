'use client'

import { useState } from "react";

export default function Dashboard() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("/api/prompt", {
      method: "POST",
      body: JSON.stringify({ input }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setOutput(data.result);
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <textarea
        className="w-full border rounded p-2"
        rows={4}
        placeholder="Enter your prompt here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleSubmit} className="mt-2 px-4 py-2 bg-black text-white rounded">
        Generate
      </button>

      {output && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">Result:</h2>
          <p>{output}</p>
        </div>
      )}
    </div>
  );
}
