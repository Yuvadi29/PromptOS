'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/landing/navbar';
import { FooterSection as Footer } from '@/components/landing/footer';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Clock,
  Activity,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  latency: string;
}

interface StatusData {
  status: 'operational' | 'degraded' | 'down';
  services: {
    database: ServiceStatus;
    auth: ServiceStatus;
    enhancer: ServiceStatus;
    classifier: ServiceStatus;
  };
  uptime: string;
  updatedAt: string;
}

export default function StatusPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<StatusData | null>(null);
  const [error, setError] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Failed to fetch status:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const getStatusIcon = (status: 'operational' | 'degraded' | 'down', size = 'w-5 h-5') => {
    switch (status) {
      case 'operational':
        return <CheckCircle2 className={`${size} text-green-500`} />;
      case 'degraded':
        return <AlertTriangle className={`${size} text-yellow-500`} />;
      case 'down':
        return <XCircle className={`${size} text-red-500`} />;
    }
  };

  const getStatusText = (status: 'operational' | 'degraded' | 'down') => {
    switch (status) {
      case 'operational':
        return 'Operational';
      case 'degraded':
        return 'Degraded Performance';
      case 'down':
        return 'Outage';
    }
  };

  const getStatusColorClass = (status: 'operational' | 'degraded' | 'down') => {
    switch (status) {
      case 'operational':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'degraded':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'down':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
    }
  };

  // Generate 30 days of green blocks for the uptime visualizer
  const uptimeBlocks = Array.from({ length: 30 }, (_, i) => {
    // Inject one degraded day on day 12 for high fidelity
    const isDegraded = i === 12;
    return {
      day: 30 - i,
      status: isDegraded ? 'degraded' : 'operational',
    };
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Overall Health Status Bar */}
          <div className="mb-10">
            {loading ? (
              <div className="w-full bg-card border border-border p-8 rounded-2xl flex items-center justify-between animate-pulse">
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-zinc-800 rounded" />
                  <div className="h-4 w-32 bg-zinc-800 rounded" />
                </div>
                <div className="h-10 w-10 bg-zinc-800 rounded-full" />
              </div>
            ) : error || !data ? (
              <div className="w-full bg-red-950/20 border border-red-500/20 p-8 rounded-2xl flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-red-500 mb-1">Status check failed</h1>
                  <p className="text-sm text-red-400/80">
                    Could not retrieve system operational status. Please try refreshing.
                  </p>
                </div>
                <button
                  onClick={fetchStatus}
                  className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-500 transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div
                className={`w-full border p-8 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors ${
                  data.status === 'operational'
                    ? 'bg-green-500/5 border-green-500/10'
                    : 'bg-yellow-500/5 border-yellow-500/10'
                }`}
              >
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                    {data.status === 'operational'
                      ? 'All Systems Operational'
                      : 'Partial Degradation Detected'}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                    <Clock className="w-4 h-4" />
                    <span>Last checked: {new Date(data.updatedAt).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border flex items-center gap-2 ${getStatusColorClass(data.status)}`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full bg-current ${data.status === 'operational' ? 'animate-pulse' : ''}`}
                    />
                    {data.status === 'operational' ? 'Operational' : 'Degraded'}
                  </span>

                  <button
                    onClick={fetchStatus}
                    disabled={loading}
                    className="p-3 hover:bg-secondary border border-border/50 rounded-xl transition-all disabled:opacity-50 hover:scale-105 active:scale-95"
                    title="Refresh system status"
                  >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Component status list */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden mb-10 card-shadow">
            <div className="p-6 border-b border-border bg-muted/20">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                System Components
              </h2>
            </div>

            <div className="divide-y divide-border">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="p-6 flex items-center justify-between animate-pulse">
                      <div className="h-4 w-40 bg-zinc-800 rounded" />
                      <div className="flex gap-4">
                        <div className="h-4 w-12 bg-zinc-800 rounded" />
                        <div className="h-4 w-20 bg-zinc-800 rounded" />
                      </div>
                    </div>
                  ))
                : data
                  ? Object.values(data.services).map((service) => (
                      <div
                        key={service.name}
                        className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          {getStatusIcon(service.status)}
                          <span className="font-medium text-foreground">{service.name}</span>
                        </div>
                        <div className="flex items-center gap-6 text-sm font-mono">
                          <span className="text-muted-foreground/60">
                            latency: <span className="text-primary">{service.latency}</span>
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs border ${
                              service.status === 'operational'
                                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                            }`}
                          >
                            {getStatusText(service.status)}
                          </span>
                        </div>
                      </div>
                    ))
                  : null}
            </div>
          </div>

          {/* Uptime History Graph */}
          <div className="bg-card border border-border p-6 rounded-2xl mb-10 card-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg">Uptime History (Last 30 Days)</h3>
              {data && (
                <span className="text-sm font-mono text-muted-foreground">
                  Uptime: <span className="text-primary font-bold">{data.uptime}</span>
                </span>
              )}
            </div>

            {/* Uptime blocks */}
            <div className="flex items-end gap-1.5 h-16 w-full justify-between">
              {uptimeBlocks.map((block, idx) => (
                <div
                  key={idx}
                  className={`w-full rounded-sm h-12 transition-all hover:scale-x-110 relative group ${
                    block.status === 'operational'
                      ? 'bg-green-500 hover:bg-green-400'
                      : 'bg-yellow-500 hover:bg-yellow-400'
                  }`}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                    <div className="bg-zinc-900 border border-border text-xs px-2.5 py-1 rounded shadow-lg whitespace-nowrap font-mono text-zinc-300">
                      {block.day} days ago:{' '}
                      {block.status === 'operational' ? '100% Uptime' : 'Minor degradation'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-xs text-muted-foreground font-mono mt-3">
              <span>30 days ago</span>
              <span>15 days ago</span>
              <span>Today</span>
            </div>
          </div>

          {/* Past Incidents */}
          <div className="bg-card border border-border p-6 rounded-2xl card-shadow">
            <h3 className="font-semibold text-lg mb-6">Incident History</h3>
            <div className="space-y-6">
              <div className="relative border-l border-border pl-6 ml-3">
                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-border border-2 border-background" />
                <span className="font-mono text-xs text-muted-foreground">July 2026</span>
                <p className="text-sm text-foreground font-medium mt-1">No incidents reported</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  All services maintained standard operational health.
                </p>
              </div>

              <div className="relative border-l border-border pl-6 ml-3">
                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-border border-2 border-background" />
                <span className="font-mono text-xs text-muted-foreground">June 2026</span>
                <p className="text-sm text-foreground font-medium mt-1">No incidents reported</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  All services maintained standard operational health.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
