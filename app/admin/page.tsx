"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLogin() {
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (userid === process.env.NEXT_PUBLIC_ADMIN_USER && password === process.env.NEXT_PUBLIC_ADMIN_PASS) {
      router.push("/admin/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-gray-800 to-black">
      <Card className="p-8 w-[380px] shadow-2xl border border-gray-700 bg-gray-900">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">🔐 Admin Login</h1>
        <Input
          placeholder="User ID"
          value={userid}
          onChange={(e) => setUserid(e.target.value)}
          className="mb-4"
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4"
        />
        <Button className="w-full" onClick={handleLogin}>
          Login
        </Button>
      </Card>
    </div>
  );
}
