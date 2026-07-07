'use client';

import { useEffect, useState, useRef } from 'react';

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

export function MetricsSection() {
  const [dbMetrics, setDbMetrics] = useState<{
    usersCount: number;
    promptsCount: number;
    typesCount: number;
  } | null>(null);

  // Stable time string to prevent hydration mismatch
  const [timeStr, setTimeStr] = useState('--:--:--');

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
      value: 100,
      suffix: '%',
      label: 'Open source',
      sublabel: 'MIT licensed',
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
          <div className="font-mono text-xs space-y-2 text-muted-foreground overflow-hidden h-24">
            <ActivityLine
              time="now"
              event="POST /api/enhance"
              region="us-east-1"
              status="200"
              latency="120ms"
            />
            <ActivityLine
              time="1s"
              event="GET /api/metrics"
              region="eu-west-1"
              status="200"
              latency="18ms"
            />
            <ActivityLine
              time="2s"
              event="POST /api/compare"
              region="ap-south-1"
              status="200"
              latency="340ms"
            />
            <ActivityLine
              time="3s"
              event="POST /api/enhance"
              region="us-west-2"
              status="200"
              latency="95ms"
            />
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
    <div className="flex items-center gap-4">
      <span className="text-muted-foreground/50 w-8">{time}</span>
      <span className="text-foreground">{event}</span>
      <span className="text-muted-foreground/50">{region}</span>
      <span className={status.startsWith('2') ? 'text-green-500' : 'text-yellow-500'}>
        {status}
      </span>
      <span className="text-primary">{latency}</span>
    </div>
  );
}
