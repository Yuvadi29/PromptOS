"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Mail, Calendar, User, Search, Hash } from "lucide-react";
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
      <Card className="p-6 bg-[#0F0F12] border-white/5 h-full min-h-[500px] flex flex-col items-center justify-center animate-pulse rounded-2xl shadow-2xl">
        <div className="h-10 w-10 bg-white/10 rounded-full mb-4"></div>
        <div className="h-4 w-32 bg-white/5 rounded"></div>
      </Card>
    );
  }

  return (
    <Card className="bg-[#0F0F12] border-white/5 rounded-2xl shadow-2xl overflow-hidden h-full min-h-[500px] flex flex-col group relative">
      <div className="absolute inset-0 bg-gradient-to-bl from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Widget Header */}
      <div className="p-6 border-b border-white/5 bg-black/20 backdrop-blur-md relative z-10">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
               <User className="h-5 w-5 text-indigo-400" />
             </div>
             <div>
               <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-400 leading-tight">
                 User Registry
               </h2>
               <p className="text-xs text-gray-400 font-mono">Total Directory: <span className="text-indigo-400">{users.length} Active</span></p>
             </div>
          </div>
        </div>
        
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Query users by name or email..."
            className="pl-10 h-9 bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus:border-indigo-500/50 focus:bg-white/5 focus:ring-0 transition-all text-sm rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Beautiful Card Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative z-10 bg-black/10">
        {filteredUsers.length === 0 ? (
           <div className="col-span-full h-full min-h-[300px] flex items-center justify-center text-gray-600 text-sm">No matches found in registry.</div>
        ) : (
           filteredUsers.map((user, idx) => (
             <div 
               key={user.id}
               className="group relative flex flex-col p-5 rounded-2xl bg-black/40 border border-white/5 hover:border-indigo-500/30 overflow-hidden transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] justify-between h-[160px]"
             >
                <div className="absolute top-0 right-0 p-16 rounded-full bg-indigo-500/5 blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center flex-shrink-0 text-lg font-bold text-white shadow-inner group-hover:scale-105 transition-transform">
                       {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-5 w-5 text-gray-400" />}
                     </div>
                     <div className="flex flex-col overflow-hidden">
                       <h3 className="font-bold text-white/90 text-md group-hover:text-indigo-300 transition-colors truncate">
                         {user.name || "Anonymous User"}
                       </h3>
                       <div className="flex items-center text-xs text-gray-400 truncate mt-0.5">
                         <Mail className="h-3 w-3 mr-1 opacity-50 text-indigo-400" />
                         <span className="truncate">{user.email}</span>
                       </div>
                     </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5 relative z-10">
                   <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-full border border-white/5 text-[10px] text-gray-400 font-mono">
                     <Hash className="h-3 w-3 text-indigo-400" /> ID-{user.id.substring(0,6)}
                   </div>
                   <div className="flex items-center text-[10px] text-gray-500 font-mono whitespace-nowrap">
                     <Calendar className="h-3 w-3 mr-1.5 text-indigo-400/50 group-hover:text-indigo-400 transition-colors" />
                     {new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                   </div>
                </div>
             </div>
          ))
        )}
      </div>
    </Card>
  );
}
