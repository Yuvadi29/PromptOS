"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Activity, ShieldCheck, Database, KeyRound, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/admin/dashboard");
  }, [router]);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (userid === process.env.NEXT_PUBLIC_ADMIN_USER && password === process.env.NEXT_PUBLIC_ADMIN_PASS) {
        router.push("/admin/dashboard");
      } else {
        setIsLoading(false);
        alert("Access Denied: Invalid credentials");
      }
    }, 600);
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-orange-500/30 overflow-hidden">

      {/* Left Pane - Immersive Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-[55%] relative flex-col p-12 border-r border-white/5 bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] overflow-hidden">
        {/* Animated Ambient Gradient Background */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500/15 via-transparent to-transparent pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3], x: [0, -50, 0], y: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none mix-blend-screen"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay z-0" />

        <div className="relative z-10 flex flex-col h-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full shrink-0"
          >
            <h2 className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/40 mb-6 leading-[1.05] tracking-tighter w-[120%]">
              PromptOS <br /> Admin Control Center
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6 font-light max-w-lg">
              Full spectrum orchestration over the global interaction matrix. Active session logging, semantic analysis, and latency mitigation deployed.
            </p>

            {/* Expansive Cybernetic Telemetry / Terminal Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="bg-black/30 border border-white/5 rounded-xl p-5 font-mono text-xs text-gray-500 relative overflow-hidden backdrop-blur-sm max-w-lg w-full mb-8 h-[180px] shadow-2xl flex flex-col justify-between"
            >
              <motion.div
                animate={{ y: ["-10%", "110%"] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-10 bg-gradient-to-b from-transparent via-orange-500/10 to-transparent pointer-events-none"
              />
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
                <span className="text-[10px] uppercase text-orange-500/80 tracking-widest font-bold flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                  Terminal Link | Boot Sequence
                </span>
                <span className="text-[10px] text-gray-600">v4.9.0-rc</span>
              </div>
              <div className="space-y-3 opacity-90 z-10 relative flex-1 overflow-hidden">
                <div className="flex w-full items-center gap-3">
                  <span className="text-gray-600 w-32 shrink-0">&gt; establish_wss</span>
                  <motion.div animate={{ width: ["0%", "100%", "100%", "100%"] }} transition={{ duration: 3, repeat: Infinity, times: [0, 0.4, 0.8, 1] }} className="h-[2px] bg-emerald-500/50 relative overflow-hidden flex-1" />
                  <span className="text-emerald-500/80 w-16 text-right shrink-0">200 OK</span>
                </div>
                <div className="flex w-full items-center gap-3">
                  <span className="text-gray-600 w-32 shrink-0">&gt; verify_auth_node</span>
                  <motion.div animate={{ width: ["0%", "0%", "100%", "100%"] }} transition={{ duration: 3, repeat: Infinity, times: [0, 0.3, 0.6, 1] }} className="h-[2px] bg-orange-500/50 relative overflow-hidden flex-1" />
                  <span className="text-orange-500/80 w-16 text-right shrink-0">WAIT</span>
                </div>
                <div className="flex w-full items-center gap-3">
                  <span className="text-gray-600 w-32 shrink-0">&gt; sync_neural_ops</span>
                  <motion.div animate={{ width: ["0%", "0%", "0%", "100%"] }} transition={{ duration: 3, repeat: Infinity, times: [0, 0.4, 0.7, 1] }} className="h-[2px] bg-blue-500/50 relative overflow-hidden flex-1" />
                  <motion.span animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 3, repeat: Infinity, times: [0, 0.8, 0.9, 1] }} className="text-blue-500/80 w-16 text-right shrink-0">
                    SYNCED
                  </motion.span>
                </div>
                <div className="flex w-full items-center gap-3">
                  <span className="text-gray-600 w-32 shrink-0">&gt; mount_cluster</span>
                  <motion.div animate={{ width: ["0%", "0%", "10%", "100%"] }} transition={{ duration: 4, repeat: Infinity, times: [0, 0.5, 0.9, 1] }} className="h-[2px] bg-rose-500/50 relative overflow-hidden flex-1" />
                  <span className="text-rose-500/80 w-16 text-right shrink-0 text-[9px] truncate">OVERRIDE</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* MIDDLE FILL: Animated Metric Bars + Activity Feed */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="flex-1 flex flex-col gap-4 py-6 max-w-lg w-full"
          >
            {/* Metric progress bars */}
            <div className="bg-black/20 border border-white/5 rounded-2xl p-5 space-y-4">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest font-mono">// Infra Health</p>
              {[
                { label: "CPU Utilization", value: 68, color: "bg-orange-500" },
                { label: "Memory Pressure", value: 42, color: "bg-blue-500" },
                { label: "Network I/O", value: 81, color: "bg-emerald-500" },
                { label: "Vector DB Load", value: 29, color: "bg-violet-500" },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] text-gray-500 font-mono">{m.label}</span>
                    <span className="text-[10px] text-gray-400 font-mono font-bold">{m.value}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${m.value}%` }}
                      transition={{ delay: 1.2, duration: 1.2, ease: "easeOut" }}
                      className={`h-full ${m.color} rounded-full opacity-70`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Scrolling security event ticker */}
            <div className="bg-black/20 border border-white/5 rounded-2xl p-4 overflow-hidden relative flex-1">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest font-mono mb-3">// Security Audit Log</p>
              <div className="space-y-2">
                {[
                  { time: "23:02:41", event: "Admin session heartbeat", ok: true },
                  { time: "23:02:38", event: "WAF blocked 3 suspicious reqs", ok: false },
                  { time: "23:02:31", event: "DB replica sync confirmed", ok: true },
                  { time: "23:02:20", event: "Rate limiter: 0 violations", ok: true },
                  { time: "23:02:10", event: "TLS cert valid — 89d remain", ok: true },
                ].map((e, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 + i * 0.08 }}
                    className="flex items-center gap-3 text-[10px] font-mono"
                  >
                    <span className="text-white/20 w-14 shrink-0">{e.time}</span>
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${e.ok ? "bg-emerald-500" : "bg-rose-500"}`} />
                    <span className={e.ok ? "text-gray-500" : "text-rose-500/70"}>{e.event}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col justify-end shrink-0">
            {/* Massive Floating Live Status Layout */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="relative z-10 grid grid-cols-2 gap-5 w-full pr-12 xl:pr-32"
            >
              <motion.div whileHover={{ scale: 1.02 }} className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden group h-32 flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity translate-y-[-50%] translate-x-[50%]" />
                <Activity className="h-7 w-7 text-emerald-400 mb-3" />
                <p className="text-md font-bold text-white/90">System Status</p>
                <p className="text-xs text-emerald-500 font-mono mt-1.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Global Operational
                </p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden group h-32 flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity translate-y-[-50%] translate-x-[50%]" />
                <ShieldCheck className="h-7 w-7 text-orange-400 mb-3" />
                <p className="text-md font-bold text-white/90">Security Force</p>
                <p className="text-xs text-orange-500 font-mono mt-1.5">Zero Threats Detected</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden group h-32 flex flex-col justify-center">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay z-0" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity translate-y-[-50%] translate-x-[50%]" />
                <Database className="h-7 w-7 text-blue-400 mb-3" />
                <p className="text-md font-bold text-white/90">Database Latency</p>
                <p className="text-xs text-blue-500 font-mono mt-1.5 tracking-tight flex justify-between pr-4 w-full"><span>Read ~12ms</span> <span>Write ~24ms</span></p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden group h-32 flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity translate-y-[-50%] translate-x-[50%]" />
                <div className="flex items-center justify-between w-full pr-4 mb-3">
                  <div className="flex h-7 w-7 relative items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-7 w-7 bg-rose-500 items-center justify-center text-[10px] font-black text-white">●</span>
                  </div>
                  <div className="text-[10px] text-rose-500/50 font-mono font-black tracking-widest text-right">LVE</div>
                </div>
                <p className="text-md font-bold text-white/90">Active Sessions</p>
                <p className="text-xs text-rose-500 font-mono mt-1.5 flex justify-between pr-4"><span>WebSockets</span> <span>Active</span></p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Pane - Full Screen Auth Form Layout */}
      <div className="w-full lg:w-[45%] flex flex-col relative bg-[#050505] min-h-screen">
        {/* Subdued immersive background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-900/10 via-transparent to-transparent z-0 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        {/* HUD Frame Overlays */}
        <div className="absolute top-8 right-8 text-[10px] font-mono font-bold text-white/10 tracking-widest select-none pointer-events-none">AUTH_NODE_01</div>
        <div className="absolute bottom-8 right-8 text-[10px] font-mono font-bold text-white/10 tracking-widest select-none pointer-events-none">SYS.LOCAL : 127.0.0.1</div>

        {/* TOP STRIP — Animated uptime counters */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative z-10 flex items-center justify-between px-8 pt-8 pb-4 border-b border-white/5 shrink-0"
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[10px] font-bold text-orange-500/60 font-mono uppercase tracking-widest">PromptOS / Admin</span>
          </div>
          <div className="flex items-center gap-6">
            {[
              { label: "Requests", value: "1.2k/s", color: "text-emerald-500" },
              { label: "P99 Latency", value: "41ms", color: "text-blue-500" },
              { label: "Error Rate", value: "0.01%", color: "text-rose-500" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className={`text-sm font-black font-mono ${stat.color}`}>{stat.value}</p>
                <p className="text-[9px] text-gray-600 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="flex-1 flex items-center justify-center relative z-10 w-full px-8 py-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[460px]"
          >
            <div className="text-center mb-10 lg:hidden">
              <div className="inline-flex h-12 w-12 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 items-center justify-center mb-4 shadow-[0_0_30px_rgba(249,115,22,0.3)]">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="font-bold text-2xl tracking-tight text-white mb-1">PromptOS</h1>
            </div>

            <Card className="p-10 bg-[#111111]/80 backdrop-blur-2xl border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.5)] rounded-[32px] relative overflow-hidden group hover:border-orange-500/20 transition-colors duration-500">
              <div className="absolute top-0 right-0 p-40 rounded-full bg-orange-500/10 blur-[100px] pointer-events-none group-hover:bg-orange-500/20 transition-colors duration-700" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.15)] flex-shrink-0">
                    <KeyRound className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Security Gateway</h2>
                    <p className="text-sm text-gray-400 font-mono mt-1 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Secure Socket 256-bit
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 flex justify-between">
                      <span>Admin Identity</span>
                      <span className="text-orange-500/50 font-mono">REQ</span>
                    </label>
                    <Input
                      placeholder="Enter personnel ID"
                      value={userid}
                      onChange={(e) => setUserid(e.target.value)}
                      className="h-14 bg-[#0a0a0a] border-white/10 text-white placeholder:text-gray-600 focus:border-orange-500/60 focus:ring-orange-500/20 transition-all rounded-xl px-4 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 flex justify-between">
                      <span>Encrypted Passcode</span>
                      <span className="text-orange-500/50 font-mono">REQ</span>
                    </label>
                    <Input
                      placeholder="Enter secure passcode"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleLogin();
                      }}
                      className="h-14 bg-[#0a0a0a] border-white/10 text-white placeholder:text-gray-600 focus:border-orange-500/60 focus:ring-orange-500/20 transition-all mb-4 rounded-xl px-4 text-sm font-mono tracking-widest"
                    />
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-[0_0_30px_rgba(249,115,22,0.25)] hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] transition-all duration-300 h-14 text-sm font-bold tracking-wide rounded-xl border border-orange-400/20 mt-4 overflow-hidden relative"
                    onClick={handleLogin}
                    disabled={isLoading || !userid || !password}
                  >
                    {/* Button Glaze Sweep */}
                    <motion.div
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[30deg]"
                    />

                    {isLoading ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                        <span className="font-mono">AUTHORIZING...</span>
                      </motion.div>
                    ) : (
                      <span className="flex items-center justify-between w-full px-2">
                        <span>AUTHORIZE SESSION</span>
                        <span className="font-mono opacity-50">&rarr;</span>
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </Card>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              className="text-center text-[10px] text-gray-500/50 mt-6 font-mono uppercase tracking-widest px-8 leading-relaxed"
            >
              Protected by advanced hashing. Unauthorized access is logged.
            </motion.p>

            {/* Extra fill: security badges row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-6 grid grid-cols-3 gap-3"
            >
              {[
                { label: "AES-256", sub: "Encryption", color: "border-orange-500/20 text-orange-400" },
                { label: "MFA Ready", sub: "Auth Layer", color: "border-blue-500/20   text-blue-400" },
                { label: "Zero-Trust", sub: "Architecture", color: "border-emerald-500/20 text-emerald-400" },
              ].map((b) => (
                <div key={b.label} className={`p-3 rounded-xl bg-white/[0.02] border ${b.color} text-center`}>
                  <p className={`text-[11px] font-black font-mono ${b.color.split(" ")[1]}`}>{b.label}</p>
                  <p className="text-[9px] text-gray-600 uppercase tracking-widest mt-0.5">{b.sub}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* BOTTOM STRIP — Animated live log feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="relative z-10 border-t border-white/5 px-8 py-4 shrink-0 font-mono text-[10px] space-y-1.5 overflow-hidden"
        >
          <p className="text-orange-500/50 uppercase tracking-widest font-bold mb-2">// Live Event Stream</p>
          {[
            { ts: "22:59:41", msg: "auth.gateway  — TLS handshake complete", color: "text-emerald-500/50" },
            { ts: "22:59:39", msg: "session.store — JWT issued for node_01", color: "text-blue-500/50" },
            { ts: "22:59:37", msg: "rate.limiter  — 0 violations in last 60s", color: "text-gray-600" },
            { ts: "22:59:34", msg: "db.replica    — heartbeat OK (12ms)", color: "text-gray-600" },
          ].map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 + i * 0.1 }}
              className="flex items-center gap-3"
            >
              <span className="text-white/20 shrink-0">{log.ts}</span>
              <span className={log.color}>{log.msg}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
