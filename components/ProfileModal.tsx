'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ProfileModalProps {
  user: {
    name?: string;
    email?: string;
    image?: string;
  };
  compact?: boolean;
}

export default function ProfileModal({ user, compact }: ProfileModalProps) {
  return (
    <>
      <Button
        variant="ghost"
        className={cn(
          'w-full justify-start gap-3 px-2 hover:bg-white/[0.02] h-auto py-3 cursor-pointer group/profile transition-all duration-500 rounded-xl',
          compact && 'justify-center px-0'
        )}
      >
        <Avatar className="h-9 w-9 border border-white/10 group-hover/profile:border-white/20 transition-colors shrink-0">
          <AvatarImage src={user?.image} alt={user?.name} />
          <AvatarFallback className="bg-white/5 text-white/80 font-mono text-xs">
            {user?.name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        {!compact && (
          <div className="flex flex-col items-start text-left overflow-hidden">
            <span className="text-[11px] font-mono uppercase tracking-wider text-white/90 truncate max-w-[150px]">
              {user?.name || 'User'}
            </span>
            <span className="text-[10px] font-mono text-white/30 truncate max-w-[150px] group-hover/profile:text-white/50 transition-colors">
              {user?.email || 'No email'}
            </span>
          </div>
        )}
      </Button>
    </>
  );
}
