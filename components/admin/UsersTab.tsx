"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export default function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">👥 All Users {users?.length}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card
            key={user.id}
            className="p-4 bg-gray-900 border border-gray-800 hover:shadow-lg transition"
          >
            <p className="font-semibold text-white">{user.name || "No Name"}</p>
            <p className="text-sm text-gray-400">{user.email}</p>
            <p className="text-xs text-gray-500 mt-2">
              Joined: {new Date(user.created_at).toLocaleDateString()}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
