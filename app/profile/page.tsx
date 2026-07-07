'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  MapPin,
  Briefcase,
  Link as LinkIcon,
  Edit2,
  Share2,
  Zap,
  Github,
  Twitter,
  Linkedin,
  Trophy,
  TerminalSquare,
  Info,
  ChevronLeft,
  ChevronRight,
  Eye,
  GitCompare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { format, getDaysInMonth, startOfMonth, getDay, isSameDay } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { CircularProgress } from '@/components/profile/CircularProgress';
import { ProfileTour } from '@/components/profile/ProfileTour';
import Image from 'next/image';

// Lazy-load heat map
const ActivityGraph = dynamic(
  () =>
    import('@/components/profile/ActivityGraph').then((mod) => ({ default: mod.ActivityGraph })),
  { ssr: false }
);

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const user = session?.user;

  const [stats, setStats] = useState<any>({
    user: {},
    totalPrompts: 0,
    activityBreakdown: [],
    currentStreak: 0,
    recentActivity: [],
  });

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [runTour, setRunTour] = useState(false);

  const [editForm, setEditForm] = useState({
    bio: '',
    location: '',
    job_title: '',
    github: '',
    twitter: '',
    linkedin: '',
    website: '',
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated' || !user?.email) {
      setLoading(false);
      return;
    }

    const cachedStats = sessionStorage.getItem('profile_stats');
    if (cachedStats) {
      try {
        const parsed = JSON.parse(cachedStats);
        setStats(parsed);
        setEditForm({
          bio: parsed.user?.bio || '',
          location: parsed.user?.location || '',
          job_title: parsed.user?.job_title || '',
          github: parsed.user?.social_links?.github || '',
          twitter: parsed.user?.social_links?.twitter || '',
          linkedin: parsed.user?.social_links?.linkedin || '',
          website: parsed.user?.social_links?.website || '',
        });
        setLoading(false);
      } catch (e) {
        console.error('Failed to parse cached profile stats', e);
      }
    }

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/user/profile-stats');
        const data = await res.json();
        if (data && !data.error) {
          setStats(data);
          sessionStorage.setItem('profile_stats', JSON.stringify(data));
          setEditForm({
            bio: data.user?.bio || '',
            location: data.user?.location || '',
            job_title: data.user?.job_title || '',
            github: data.user?.social_links?.github || '',
            twitter: data.user?.social_links?.twitter || '',
            linkedin: data.user?.social_links?.linkedin || '',
            website: data.user?.social_links?.website || '',
          });
        }
      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [status, user?.email]);

  const handleSaveProfile = async () => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio: editForm.bio,
          location: editForm.location,
          job_title: editForm.job_title,
          social_links: {
            github: editForm.github,
            twitter: editForm.twitter,
            linkedin: editForm.linkedin,
            website: editForm.website,
          },
        }),
      });

      if (!res.ok) throw new Error();

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      const nextStats = {
        ...stats,
        user: {
          ...stats.user,
          bio: editForm.bio,
          location: editForm.location,
          job_title: editForm.job_title,
          social_links: {
            github: editForm.github,
            twitter: editForm.twitter,
            linkedin: editForm.linkedin,
            website: editForm.website,
          },
        },
      };
      setStats(nextStats);
      sessionStorage.setItem('profile_stats', JSON.stringify(nextStats));
    } catch {
      toast.error('Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 flex items-center justify-center text-muted-foreground animate-pulse">
          Loading Profile...
        </div>
      </div>
    );
  }

  // Prepare Calendar Days
  const today = new Date();
  const daysInMonth = getDaysInMonth(today);
  const firstDay = startOfMonth(today);
  const startingDayOfWeek = getDay(firstDay);
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const dayNumber = i - startingDayOfWeek + 1;
    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      return new Date(today.getFullYear(), today.getMonth(), dayNumber);
    }
    return null;
  });

  // Overview Stats
  const getBreakdownVal = (key: string) =>
    stats.activityBreakdown.find((b: any) => b.subject === key)?.A || 0;
  const enhancements = getBreakdownVal('Enhancement');
  const library = getBreakdownVal('Prompt Library');
  const comparisons = getBreakdownVal('LLM Comparison');
  const totalActions = enhancements + library + comparisons + getBreakdownVal('Scoring');

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 flex flex-col">
      <ProfileTour run={runTour} setRun={setRunTour} />
      <div className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-12">
        <div className="flex flex-col lg:flex-row border border-white/[0.03] rounded-sm bg-black/20 backdrop-blur-sm relative">
          {/* ── LEFT SIDEBAR ── */}
          <div
            id="tour-sidebar"
            className="w-full lg:w-[320px] shrink-0 border-r border-dashed border-white/[0.08] flex flex-col"
          >
            <div className="p-6">
              {/* Avatar */}
              <div className="w-[150px] h-[150px] bg-zinc-900 border border-white/[0.1] flex items-center justify-center text-muted-foreground rounded-sm overflow-hidden mb-5 relative group">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    width={0}
                    height={0}
                    sizes="100vw"
                  />
                ) : (
                  <span className="text-xl">150 x 150</span>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                  <Edit2 className="w-5 h-5 text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tight">{user?.name}</h2>
              <p className="text-sm text-muted-foreground mb-4">
                @{stats.user?.name?.toLowerCase().replace(/\s+/g, '')}
              </p>

              <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-medium whitespace-pre-wrap">
                {stats.user?.bio ||
                  'Passionate about Development, Creating Projects using AI. 🚀 Diving Deeper into the world of AI and Web. 💻 Side Hustling in Content Creation... I believe in the power of contributing to the community via Open Source Projects.'}
              </p>

              <div className="flex gap-3 mb-8">
                <Button
                  className="h-8 px-5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="w-3 h-3 mr-1.5" /> Edit
                </Button>
                <Button
                  variant="outline"
                  className="h-8 px-4 rounded-full border-white/[0.1] bg-transparent hover:bg-white/[0.05] text-zinc-300 text-xs"
                >
                  <Share2 className="w-3 h-3 mr-1.5" /> Share
                </Button>
              </div>

              {/* Details List */}
              <div className="space-y-4 text-sm font-medium mb-8">
                <div className="flex items-center gap-3 text-zinc-300">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>{stats.user?.location || 'Bengaluru'}</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-300">
                  <Briefcase className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>{stats.user?.job_title || 'R&D Engineer'}</span>
                </div>

                {stats.user?.social_links?.website && (
                  <div className="flex items-center gap-3 text-zinc-300">
                    <LinkIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                    <a
                      href={stats.user.social_links.website}
                      target="_blank"
                      className="hover:text-primary transition-colors"
                    >
                      {stats.user.social_links.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                {stats.user?.social_links?.github && (
                  <div className="flex items-center gap-3 text-zinc-300">
                    <Github className="w-4 h-4 text-muted-foreground shrink-0" />
                    <a
                      href={stats.user.social_links.github}
                      target="_blank"
                      className="hover:text-primary transition-colors"
                    >
                      GitHub
                    </a>
                  </div>
                )}
                {stats.user?.social_links?.twitter && (
                  <div className="flex items-center gap-3 text-zinc-300">
                    <Twitter className="w-4 h-4 text-muted-foreground shrink-0" />
                    <a
                      href={stats.user.social_links.twitter}
                      target="_blank"
                      className="hover:text-primary transition-colors"
                    >
                      Twitter
                    </a>
                  </div>
                )}
                {stats.user?.social_links?.linkedin && (
                  <div className="flex items-center gap-3 text-zinc-300">
                    <Linkedin className="w-4 h-4 text-muted-foreground shrink-0" />
                    <a
                      href={stats.user.social_links.linkedin}
                      target="_blank"
                      className="hover:text-primary transition-colors"
                    >
                      LinkedIn
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Achievements Widget */}
            <div className="border-t border-dashed border-white/[0.08] p-6">
              <h3 className="text-white font-semibold mb-6 text-sm">Achievements</h3>
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-sm font-medium text-zinc-400 mb-2">No badges yet</p>
                <p className="text-[11px] text-zinc-600 leading-relaxed max-w-[200px]">
                  Complete monthly streaks or climb up the challenge leaderboard to earn badges.
                </p>
              </div>
            </div>

            {/* Prompt Vault Widget */}
            <div className="border-t border-dashed border-white/[0.08] p-6">
              <h3 className="text-white font-semibold mb-4 text-sm">Prompt Vault</h3>
              <div className="flex gap-4 mb-4">
                <div className="flex-1 bg-black/40 border border-white/[0.05] rounded-lg p-3 text-center">
                  <div className="text-xs text-muted-foreground mb-1">Total Prompts</div>
                  <div className="text-base font-semibold text-zinc-200 flex items-center justify-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-chart-1" /> {stats.totalPrompts}
                  </div>
                </div>
                <div className="flex-1 bg-black/40 border border-white/[0.05] rounded-lg p-3 text-center">
                  <div className="text-xs text-muted-foreground mb-1">Comparisons</div>
                  <div className="text-base font-semibold text-zinc-200 flex items-center justify-center gap-1.5">
                    <GitCompare className="w-3.5 h-3.5 text-chart-2" /> {stats.totalComparisons}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href="/dashboard/all-prompts" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full h-8 bg-zinc-900 border-white/[0.1] text-xs font-medium text-zinc-300"
                  >
                    View All Prompts
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="flex-1 h-8 bg-zinc-900 border-white/[0.1] text-xs font-medium text-zinc-300"
                >
                  Claim Badge
                </Button>
              </div>
            </div>

            {/* Languages Widget */}
            <div className="border-t border-dashed border-white/[0.08] p-6">
              <h3 className="text-white font-semibold mb-4 text-sm">Top Niche</h3>
              <div className="flex items-center justify-between text-sm">
                <span className="px-3 py-1 bg-zinc-900 border border-white/[0.1] rounded-full text-zinc-300 text-xs font-medium">
                  {stats.mostUsedNiche || 'General'}
                </span>
                <span className="text-muted-foreground text-xs">
                  {stats.totalPrompts} prompts created
                </span>
              </div>
            </div>

            {/* Help text */}
            <div className="border-t border-dashed border-white/[0.08] p-6 text-xs text-muted-foreground">
              <span
                onClick={() => setRunTour(true)}
                className="text-primary font-medium cursor-pointer hover:underline"
              >
                Click here
              </span>{' '}
              for a page tour to learn more about the features.
            </div>
          </div>

          {/* ── MAIN CONTENT ── */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* 1. Recent Actions Grid */}
            <div
              id="tour-recent-actions"
              className="p-6 pb-8 border-b border-dashed border-white/[0.08]"
            >
              <h3 className="text-zinc-200 font-semibold mb-5 text-sm">Recent Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.recentActivity.slice(0, 4).map((act: any, i: number) => (
                  <div
                    key={i}
                    className="relative h-28 bg-gradient-to-br from-zinc-900 to-black border border-white/[0.05] rounded-xl p-4 flex flex-col justify-between overflow-hidden group hover:border-white/[0.1] transition-colors cursor-pointer"
                  >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/[0.03] to-transparent pointer-events-none" />
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-semibold text-zinc-100 line-clamp-2 pr-4">
                          {act.label}
                        </h4>
                        <span className="text-[10px] text-primary font-bold tracking-wide">
                          NEW
                        </span>
                      </div>
                    </div>
                    <div className="relative z-10 flex items-center justify-between mt-auto pt-2">
                      <span className="text-[10px] text-muted-foreground">By PromptOS</span>
                      <TerminalSquare className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                ))}
                {stats.recentActivity.length === 0 && (
                  <div className="col-span-full py-8 text-center text-zinc-500 text-sm bg-black/40 border border-white/[0.05] rounded-xl">
                    No recent actions available.
                  </div>
                )}
              </div>
            </div>

            {/* 2. Overview & Streaks row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 border-b border-dashed border-white/[0.08]">
              {/* Action Overview */}
              <div
                id="tour-action-overview"
                className="lg:col-span-3 p-6 lg:border-r border-dashed border-white/[0.08]"
              >
                <h3 className="text-zinc-200 font-semibold mb-6 text-sm">Action Overview</h3>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 h-[220px]">
                  <div className="flex-1 flex flex-col gap-5 pt-2 w-full max-w-[200px]">
                    <div>
                      <div className="text-[11px] font-semibold text-accent mb-1">Enhancements</div>
                      <div className="text-sm text-zinc-200 font-medium">
                        {enhancements}
                        <span className="text-muted-foreground font-normal">
                          {' '}
                          / {totalActions || 1}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-chart-2 mb-1">Comparisons</div>
                      <div className="text-sm text-zinc-200 font-medium">
                        {comparisons}
                        <span className="text-muted-foreground font-normal">
                          {' '}
                          / {totalActions || 1}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-destructive mb-1">
                        Library Additions
                      </div>
                      <div className="text-sm text-zinc-200 font-medium">
                        {library}
                        <span className="text-muted-foreground font-normal">
                          {' '}
                          / {totalActions || 1}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex items-center justify-center">
                    <CircularProgress
                      value={totalActions}
                      max={Math.max(totalActions * 2, 100)}
                      label="Actions"
                      size={170}
                      strokeWidth={8}
                    />
                  </div>
                </div>
              </div>

              {/* Streak Calendar */}
              <div id="tour-streak-calendar" className="lg:col-span-2 p-6 flex flex-col relative">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-0.5">
                      {format(today, 'yyyy')}
                    </div>
                    <div className="text-base font-bold text-zinc-200">{format(today, 'MMMM')}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.05]"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div className="w-8 h-8 bg-zinc-900 border border-white/[0.1] rounded-lg flex items-center justify-center relative">
                      <Trophy className="w-4 h-4 text-accent" />
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent rounded-full border-2 border-background" />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.05]"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                    <div key={d}>{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 flex-1">
                  {calendarDays.map((day, i) => {
                    if (!day) return <div key={`empty-${i}`} className="p-1" />;
                    const isToday = isSameDay(day, today);
                    const isActiveDay =
                      isToday ||
                      (stats.currentStreak > 0 &&
                        today.getDate() - day.getDate() < stats.currentStreak &&
                        today.getDate() >= day.getDate());

                    return (
                      <div
                        key={i}
                        className={`flex items-center justify-center text-xs font-medium h-7 rounded-[4px]
                                                ${isActiveDay ? 'text-zinc-200 font-bold' : 'text-muted-foreground hover:bg-white/[0.03]'}
                                            `}
                      >
                        {format(day, 'd')}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Current{' '}
                    {stats.currentStreak}
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Best{' '}
                    {stats.currentStreak}
                  </div>
                </div>
                <div className="mt-3">
                  <Button className="w-full h-8 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-full border border-primary/20">
                    🔥 Restore Your Streak
                  </Button>
                  <Info className="w-3.5 h-3.5 text-muted-foreground absolute bottom-8 right-6" />
                </div>
              </div>
            </div>

            {/* 3. Heatmap */}
            <div id="tour-heatmap" className="p-6 border-b border-dashed border-white/[0.08]">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-zinc-200 font-semibold text-sm">
                  42 Submissions in {format(today, 'yyyy')}
                </h3>
              </div>
              <div className="scale-[0.95] origin-top-left -ml-2">
                <ActivityGraph />
              </div>
            </div>

            {/* 4. Recent Submissions Table */}
            <div id="tour-recent-submissions" className="p-6 flex-1 bg-black/20">
              <h3 className="text-zinc-200 font-semibold mb-6 text-sm">Recent Submissions</h3>
              <div className="w-full max-w-4xl">
                <div className="grid grid-cols-12 gap-4 text-[10px] font-bold text-muted-foreground tracking-widest mb-4 pb-2 border-b border-white/[0.05]">
                  <div className="col-span-7">PROBLEM</div>
                  <div className="col-span-3 text-left">LANGUAGE</div>
                  <div className="col-span-2 text-right pr-2">VIEW</div>
                </div>

                <div className="space-y-1 text-sm font-medium">
                  {stats.recentActivity.map((act: any, i: number) => (
                    <div
                      key={i}
                      className="grid grid-cols-12 gap-4 items-center py-3 border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02] transition-colors -mx-4 px-4 rounded-lg"
                    >
                      <div className="col-span-7">
                        <span className="text-zinc-200 block truncate pr-4">
                          {act.metadata?.prompt || act.label}
                        </span>
                        <span className="text-[11px] text-muted-foreground mt-0.5 block">
                          {format(new Date(act.createdAt), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <div className="col-span-3">
                        <span className="text-zinc-300">Prompt</span>
                      </div>
                      <div className="col-span-2 flex justify-end pr-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-zinc-500 hover:text-zinc-300"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {stats.recentActivity.length === 0 && (
                    <div className="py-6 text-zinc-500 text-sm">No recent activity.</div>
                  )}
                  {stats.recentActivity.length > 0 && (
                    <div className="flex justify-center mt-6 pt-2">
                      <Button
                        variant="outline"
                        className="h-8 bg-zinc-900 border-white/[0.1] text-xs font-medium text-zinc-300"
                      >
                        Load More
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="bg-card border-border text-foreground max-w-md shadow-2xl">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Bio</label>
              <Textarea
                className="bg-background border-border focus:border-primary/50 text-sm min-h-[80px]"
                value={editForm.bio}
                onChange={(e) => setEditForm((prev) => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about yourself"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Location</label>
                <Input
                  className="bg-background border-border focus:border-primary/50 text-sm"
                  value={editForm.location}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Job Title</label>
                <Input
                  className="bg-background border-border focus:border-primary/50 text-sm"
                  value={editForm.job_title}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, job_title: e.target.value }))}
                  placeholder="e.g. AI Engineer"
                />
              </div>
            </div>
            <div className="space-y-2 pt-2 border-t border-border">
              <label className="text-xs text-muted-foreground">Social Links</label>
              <div className="space-y-2">
                <Input
                  className="bg-background border-border focus:border-primary/50 text-sm"
                  value={editForm.website}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, website: e.target.value }))}
                  placeholder="Website URL"
                />
                <Input
                  className="bg-background border-border focus:border-primary/50 text-sm"
                  value={editForm.github}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, github: e.target.value }))}
                  placeholder="GitHub URL"
                />
                <Input
                  className="bg-background border-border focus:border-primary/50 text-sm"
                  value={editForm.twitter}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, twitter: e.target.value }))}
                  placeholder="Twitter URL"
                />
                <Input
                  className="bg-background border-border focus:border-primary/50 text-sm"
                  value={editForm.linkedin}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, linkedin: e.target.value }))}
                  placeholder="LinkedIn URL"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-border bg-transparent"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
              onClick={handleSaveProfile}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
