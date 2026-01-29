"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Mail, Calendar, User, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-40 bg-white/5 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">
          Registered Users <span className="text-white/40 text-sm font-medium ml-2">{users.length} Total</span>
        </h2>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-violet-500/50 focus:ring-violet-500/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user) => (
          <Card
            key={user.id}
            className="group relative p-6 bg-[#0F0F12] border-white/5 hover:border-violet-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 p-24 rounded-full bg-violet-500/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-lg font-bold text-white shadow-inner">
                  {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-6 w-6 text-gray-400" />}
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-violet-300 transition-colors">
                    {user.name || "Anonymous User"}
                  </h3>
                  {user.username && <p className="text-xs text-gray-500">@{user.username}</p>}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3 relative z-10">
              <div className="flex items-center text-sm text-gray-400">
                <Mail className="h-4 w-4 mr-3 text-gray-600 group-hover:text-violet-500 transition-colors" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Calendar className="h-4 w-4 mr-3 text-gray-600 group-hover:text-violet-500 transition-colors" />
                <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
