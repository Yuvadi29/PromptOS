'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Step, EventData } from 'react-joyride';

const Joyride = dynamic(() => import('react-joyride').then((mod) => mod.Joyride), { ssr: false });

interface ProfileTourProps {
  run: boolean;
  setRun: (run: boolean) => void;
}

export function ProfileTour({ run, setRun }: ProfileTourProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const steps: Step[] = [
    {
      target: '#tour-sidebar',
      content:
        'This is your Profile Hub. Edit your bio, manage social links, and check out your Top Niche and Prompt Vault summaries.',
      // disableBeacon: true,
      placement: 'right',
    },
    {
      target: '#tour-recent-actions',
      content:
        'These cards highlight your most recent activities on the platform, from enhancing prompts to scoring them.',
      placement: 'bottom',
    },
    {
      target: '#tour-action-overview',
      content:
        'A holistic view of your actions. Keep an eye on how your activity distributes across Enhancements, Comparisons, and Library Additions.',
      placement: 'right',
    },
    {
      target: '#tour-streak-calendar',
      content:
        'Never break the chain! Track your daily activity streaks here. Try to beat your Best Streak.',
      placement: 'left',
    },
    {
      target: '#tour-heatmap',
      content:
        'Your year at a glance. Just like GitHub, this heatmap visualizes your consistency over time.',
      placement: 'top',
    },
    {
      target: '#tour-recent-submissions',
      content:
        'A detailed log of all your recent submissions with quick links to view each specific prompt or comparison.',
      placement: 'top',
    },
  ];

  if (!mounted) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      options={{
        buttons: ['skip', 'primary'],
        arrowColor: 'var(--card)',
        backgroundColor: 'var(--card)',
        overlayColor: 'rgba(0, 0, 0, 0.7)',
        primaryColor: 'var(--primary)',
        textColor: 'var(--foreground)',
        zIndex: 1000,
      }}
      styles={{
        buttonPrimary: {
          backgroundColor: 'var(--primary)',
          color: 'var(--primary-foreground)',
          borderRadius: 'var(--radius)',
          padding: '8px 16px',
          fontWeight: '600',
          fontSize: '14px',
        },
        buttonSkip: {
          color: 'var(--muted-foreground)',
          fontSize: '14px',
        },
        tooltipContainer: {
          textAlign: 'left',
        },
      }}
      onEvent={(data: EventData) => {
        const { status, action } = data;
        const finishedStatuses = ['finished', 'skipped'];
        if (finishedStatuses.includes(status) || action === 'close') {
          setRun(false);
        }
      }}
      locale={{
        last: 'Finish',
        skip: 'Skip',
        next: 'Next',
      }}
    />
  );
}
