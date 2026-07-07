'use client';

import { useEffect, useState } from 'react';
import { format, getDay } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Activity } from 'lucide-react';

export function ActivityGraph() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedActions, setSelectedActions] = useState<any[]>([]);

  // Default to the year requested
  const [selectedYear, setSelectedYear] = useState(2026);

  useEffect(() => {
    fetch('/api/user/activities')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setActivities(data);
        }
      })
      .catch((err) => console.error('Error fetching activities', err))
      .finally(() => setLoading(false));
  }, []);

  const activityMap = new Map<string, any[]>();
  activities.forEach((log) => {
    const dateStr = format(new Date(log.created_at), 'yyyy-MM-dd');
    if (!activityMap.has(dateStr)) activityMap.set(dateStr, []);
    activityMap.get(dateStr)?.push(log);
  });

  // Generate exactly one year's worth of dates
  const startDate = new Date(selectedYear, 0, 1);
  const endDate = new Date(selectedYear, 11, 31);

  // We get the days manually
  const daysInYear: Date[] = [];
  let currentDay = startDate;
  while (currentDay <= endDate) {
    daysInYear.push(new Date(currentDay));
    currentDay.setDate(currentDay.getDate() + 1);
  }

  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  daysInYear.forEach((day) => {
    if (getDay(day) === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  });
  if (currentWeek.length > 0) weeks.push(currentWeek);

  // Deepened, richer UI colors per user request
  const getColor = (count: number) => {
    if (count === 0) return 'bg-zinc-900 border border-white/[0.05]';
    if (count <= 2) return 'bg-primary/20 border border-primary/30';
    if (count <= 5) return 'bg-primary/40 border border-primary/50';
    if (count <= 8) return 'bg-primary/70 border border-primary/80';
    return 'bg-primary border border-primary shadow-sm';
  };

  const handleSquareClick = (day: Date, actions: any[]) => {
    setSelectedDate(day);
    setSelectedActions(actions);
  };

  if (loading) {
    return (
      <div className="text-zinc-500 text-center py-20 animate-pulse">Loading Activity Graph...</div>
    );
  }

  return (
    <div className="w-full flex justify-center overflow-hidden relative">
      <div className="flex flex-col gap-4 relative z-10 w-full max-w-5xl px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
          <div className="flex bg-zinc-900 border border-white/[0.05] rounded-lg p-1 ml-auto">
            {[2025, 2026, 2027].map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  selectedYear === year
                    ? 'bg-primary/20 text-primary'
                    : 'text-muted-foreground hover:text-zinc-300 hover:bg-white/[0.05]'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        <div
          className="flex gap-1 overflow-x-auto p-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {weeks.map((week, i) => (
            <div key={i} className="flex flex-col gap-1">
              {/* Empty days for the first week to align Sunday to top */}
              {i === 0 &&
                Array.from({ length: 7 - week.length }).map((_, j) => (
                  <div key={`pad-${j}`} className="w-3 h-3 sm:w-4 sm:h-4" />
                ))}
              {week.map((day) => {
                const dayStr = format(day, 'yyyy-MM-dd');
                const acts = activityMap.get(dayStr) || [];
                const count = acts.length;
                return (
                  <div
                    key={dayStr}
                    onClick={() => handleSquareClick(day, acts)}
                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-[2px] cursor-pointer hover:ring-2 hover:ring-white transition-all ${getColor(count)}`}
                    title={`${format(day, 'MMM d, yyyy')}: ${count} actions`}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 text-xs text-zinc-500 mt-2 pr-4">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-[2px] bg-zinc-900 border border-white/[0.05]" />
            <div className="w-3 h-3 rounded-[2px] bg-primary/20 border border-primary/30" />
            <div className="w-3 h-3 rounded-[2px] bg-primary/40 border border-primary/50" />
            <div className="w-3 h-3 rounded-[2px] bg-primary/70 border border-primary/80" />
            <div className="w-3 h-3 rounded-[2px] bg-primary border border-primary" />
          </div>
          <span>More</span>
        </div>
      </div>

      <Dialog open={!!selectedDate} onOpenChange={(open) => !open && setSelectedDate(null)}>
        <DialogContent className="bg-background border-border text-foreground max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Activity on {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              You performed {selectedActions.length} action{selectedActions.length !== 1 ? 's' : ''}{' '}
              on this day.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 mt-4 max-h-[60vh] overflow-y-auto pr-2">
            {selectedActions.length > 0 ? (
              selectedActions.map((act, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col gap-1"
                >
                  <span className="font-semibold text-primary capitalize">
                    {act.action.replace(/_/g, ' ')}
                  </span>
                  {act.metadata?.prompt && (
                    <p className="text-sm text-zinc-300 line-clamp-3 my-1">
                      &quot;{act.metadata.prompt}&quot;
                    </p>
                  )}
                  <span className="text-xs text-zinc-500">
                    {format(new Date(act.created_at), 'h:mm a')}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-zinc-500">
                You took a well-deserved rest on this day! 🌴
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
