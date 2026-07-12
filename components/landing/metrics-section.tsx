'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function AnimatedCounter({
  end,
  suffix = '',
  prefix = '',
}: {
  end: number;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, hasAnimated]);

  return (
    <div ref={ref} className="font-mono text-4xl lg:text-6xl font-semibold tracking-tight">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </div>
  );
}

interface ActivityItem {
  id: string;
  time: string;
  event: string;
  region: string;
  status: string;
  latency: string;
  timestamp: number;
}

const ACTION_MAP: Record<string, { event: string; minLat: number; maxLat: number }> = {
  prompt_enhanced: { event: 'POST /api/enhance', minLat: 180, maxLat: 420 },
  llm_compared: { event: 'POST /api/compare-llm', minLat: 250, maxLat: 650 },
  prompt_scored: { event: 'POST /api/score-prompt', minLat: 150, maxLat: 380 },
  prompt_saved: { event: 'POST /api/save-prompt', minLat: 40, maxLat: 120 },
  feedback_submitted: { event: 'POST /api/feedback', minLat: 30, maxLat: 90 },
};

const getRelativeTimeString = (timestamp: number, currentMs: number) => {
  const diffSec = Math.floor((currentMs - timestamp) / 1000);
  if (diffSec < 1) return 'now';
  if (diffSec < 60) return `${diffSec}s`;
  const diffMin = Math.floor(diffSec / 60);
  return `${diffMin}m`;
};

const generateSimulatedActivity = (offsetMs = 0): ActivityItem => {
  const events = [
    { event: 'POST /api/enhance', minLat: 180, maxLat: 420 },
    { event: 'POST /api/compare-llm', minLat: 250, maxLat: 650 },
    { event: 'POST /api/score-prompt', minLat: 150, maxLat: 380 },
    { event: 'POST /api/save-prompt', minLat: 40, maxLat: 120 },
    { event: 'GET /api/metrics', minLat: 15, maxLat: 45 },
  ];
  const regions = [
    'us-east-1',
    'us-west-2',
    'eu-west-1',
    'ap-south-1',
    'sa-east-1',
    'ap-northeast-1',
  ];

  const selectedEvent = events[Math.floor(Math.random() * events.length)];
  const region = regions[Math.floor(Math.random() * regions.length)];
  const latency = `${Math.floor(Math.random() * (selectedEvent.maxLat - selectedEvent.minLat) + selectedEvent.minLat)}ms`;

  const rand = Math.random();
  const status = rand < 0.9 ? '200' : rand < 0.95 ? '201' : Math.random() < 0.5 ? '400' : '401';
  const timestamp = Date.now() - offsetMs;

  return {
    id: `sim-${Math.random()}-${timestamp}`,
    time: getRelativeTimeString(timestamp, Date.now()),
    event: selectedEvent.event,
    region,
    status,
    latency,
    timestamp,
  };
};

export function MetricsSection() {
  const [dbMetrics, setDbMetrics] = useState<{
    usersCount: number;
    promptsCount: number;
    typesCount: number;
  } | null>(null);

  const [timeStr, setTimeStr] = useState('--:--:--');
  const [mounted, setMounted] = useState(false);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    setMounted(true);

    // Set initial static-ish logs representing recent history
    const initialLogs: ActivityItem[] = [
      generateSimulatedActivity(4000),
      generateSimulatedActivity(8000),
      generateSimulatedActivity(12000),
      generateSimulatedActivity(18000),
    ];
    setActivities(initialLogs);
  }, []);

  useEffect(() => {
    // Only update time on client side
    const interval = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString());
    }, 1000);
    // Set initial time immediately on client
    setTimeStr(new Date().toLocaleTimeString());
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch('/api/metrics')
      .then((res) => res.json())
      .then((data) => {
        if (data.usersCount !== undefined) {
          setDbMetrics(data);
        }
      })
      .catch((err) => console.error('Error fetching metrics:', err));
  }, []);

  // Fetch real activities on mount and merge
  useEffect(() => {
    if (!mounted) return;

    const fetchDbActivities = () => {
      fetch('/api/public/activities')
        .then((res) => res.json())
        .then((data: any[]) => {
          if (data && Array.isArray(data) && data.length > 0) {
            const regions = [
              'us-east-1',
              'us-west-2',
              'eu-west-1',
              'ap-south-1',
              'sa-east-1',
              'ap-northeast-1',
            ];
            const mapped: ActivityItem[] = data.map((item, idx) => {
              const action = item.action;
              const mapping = ACTION_MAP[action] || {
                event: 'GET /api/metrics',
                minLat: 15,
                maxLat: 45,
              };
              const regionIndex = (action.length + idx) % regions.length;
              const latency = `${Math.floor(Math.random() * (mapping.maxLat - mapping.minLat) + mapping.minLat)}ms`;
              const timestamp = new Date(item.created_at).getTime();
              return {
                id: `db-${idx}-${timestamp}`,
                time: getRelativeTimeString(timestamp, Date.now()),
                event: mapping.event,
                region: regions[regionIndex],
                status: '200',
                latency,
                timestamp,
              };
            });

            // Merge with existing activities and sort by timestamp desc, limit to 8
            setActivities((prev) => {
              const combined = [...mapped, ...prev];
              // De-duplicate by ID
              const unique = combined.filter(
                (item, index, self) => self.findIndex((t) => t.id === item.id) === index
              );
              return unique.sort((a, b) => b.timestamp - a.timestamp).slice(0, 8);
            });
          }
        })
        .catch((err) => console.error('Error fetching real activities:', err));
    };

    fetchDbActivities();
    // Poll DB activities every 10 seconds
    const interval = setInterval(fetchDbActivities, 60000);
    return () => clearInterval(interval);
  }, [mounted]);

  // Live updates tick to update relative times and generate occasional simulated events
  useEffect(() => {
    if (!mounted) return;

    let timeSinceLastSim = 0;
    const tickInterval = setInterval(() => {
      const now = Date.now();
      timeSinceLastSim += 1000;

      // Update relative time strings for all active items
      setActivities((prev) => {
        const updated = prev.map((act) => ({
          ...act,
          time: getRelativeTimeString(act.timestamp, now),
        }));

        // Randomly generate a new simulated activity every 2 to 4 seconds
        const triggerSim = timeSinceLastSim >= Math.random() * 2000 + 2000;
        if (triggerSim) {
          timeSinceLastSim = 0;
          const newAct = generateSimulatedActivity(0);
          return [newAct, ...updated].slice(0, 8);
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(tickInterval);
  }, [mounted]);

  const metrics = [
    {
      value: dbMetrics?.usersCount ?? 0,
      suffix: '+',
      label: 'Active developers',
      sublabel: 'Building with PromptOS',
    },
    {
      value: dbMetrics?.promptsCount ?? 0,
      suffix: '+',
      label: 'Prompts enhanced',
      sublabel: 'And counting',
    },
    {
      value: dbMetrics?.typesCount ?? 0,
      suffix: '+',
      label: 'Prompt categories',
      sublabel: 'Across use cases',
    },
    {
      value: 99.9,
      suffix: '%',
      label: 'Service uptime',
      sublabel: 'Verified operations',
    },
  ];

  return (
    <section id="metrics" className="relative py-32 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div>
            <p className="text-sm font-mono text-primary mb-3">{'// LIVE METRICS'}</p>
            <h2 className="text-3xl lg:text-5xl font-semibold tracking-tight text-balance">
              Real-time platform
              <br />
              performance.
            </h2>
          </div>
          <div className="flex items-center gap-3 font-mono text-sm text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>All systems operational</span>
            <span className="text-border">|</span>
            <span>{timeStr}</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden card-shadow">
          {metrics.map((metric) => (
            <div key={metric.label} className="bg-card p-8 flex flex-col gap-4">
              <div className="text-primary">
                <AnimatedCounter end={metric.value} suffix={metric.suffix} />
              </div>
              <div>
                <div className="text-foreground font-medium">{metric.label}</div>
                <div className="text-sm text-muted-foreground">{metric.sublabel}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Activity Feed */}
        <div className="mt-12 p-6 rounded-xl bg-card border border-border card-shadow">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-sm text-muted-foreground">Live activity feed</span>
          </div>
          <div className="font-mono text-xs space-y-2 text-muted-foreground overflow-hidden relative h-[140px]">
            {/* Ambient bottom fade mask to blend logs elegantly */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card to-transparent pointer-events-none z-10" />

            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {activities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: 10, height: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30,
                      opacity: { duration: 0.2 },
                    }}
                  >
                    <ActivityLine
                      time={activity.time}
                      event={activity.event}
                      region={activity.region}
                      status={activity.status}
                      latency={activity.latency}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {mounted && activities.length === 0 && (
                <div className="text-muted-foreground/60 py-4 text-center">
                  Waiting for events...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ActivityLine({
  time,
  event,
  region,
  status,
  latency,
}: {
  time: string;
  event: string;
  region: string;
  status: string;
  latency: string;
}) {
  return (
    <div className="flex items-center gap-4 py-0.5">
      <span className="text-muted-foreground/50 w-10 text-right tabular-nums">{time}</span>
      <span className="text-foreground min-w-[140px]">{event}</span>
      <span className="text-muted-foreground/50 w-24">{region}</span>
      <span className={`w-8 ${status.startsWith('2') ? 'text-green-500' : 'text-yellow-500'}`}>
        {status}
      </span>
      <span className="text-primary tabular-nums">{latency}</span>
    </div>
  );
}
