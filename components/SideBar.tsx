'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from './ui/sidebar';
import {
  CircleGaugeIcon,
  GitCompareIcon,
  HomeIcon,
  LibraryIcon,
  LogOutIcon,
  Settings2Icon,
  Command,
} from 'lucide-react';
import Link from 'next/link';
import ProfileModal from './ProfileModal';
import { signOut } from 'next-auth/react';
import { redirect, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

// Menu Items
const items = [
  {
    title: 'Prompt Enhancer',
    url: '/enhance',
    icon: Settings2Icon,
  },
  {
    title: 'LLM Comparison',
    url: '/compare-llm',
    icon: GitCompareIcon,
  },
  {
    title: 'Prompt Library',
    url: '/prompt-library',
    icon: LibraryIcon,
  },
  {
    title: 'Prompt Scoring',
    url: '/prompt-scoring',
    icon: CircleGaugeIcon,
  },
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: HomeIcon,
  },
];

type User = {
  name?: string;
  email?: string;
  image?: string;
};

type SideBarProps = {
  user?: User;
};

const SideBar = ({ user }: SideBarProps) => {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const handleSignOut = async () => {
    await signOut();
    redirect('/');
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-white/5 bg-black text-white selection:bg-white/20 transition-all duration-500"
    >
      <SidebarHeader className={cn('p-8', isCollapsed && 'p-4')}>
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group transition-all duration-500">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:border-white/20 group-hover:bg-white/[0.05]">
                <Command className="w-5 h-5 text-white/80 transition-all duration-500 group-hover:text-white" />
              </div>
              <div className="absolute -inset-1 bg-white/5 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-xl font-display tracking-tight text-white leading-none">
                  PromptOS
                </span>
              </div>
            )}
          </Link>

          <SidebarTrigger
            className={cn(
              'text-orange-400 hover:text-white hover:bg-white/5 transition-all',
              isCollapsed && 'mx-auto'
            )}
          />
        </div>
      </SidebarHeader>

      {!isCollapsed && (
        <>
          <SidebarContent className="px-6 mt-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em] mb-8 px-2 transition-opacity">
                Workspace Logic
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-4">
                  {items.map((item) => {
                    const isActive = pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          tooltip={item.title}
                          className={cn(
                            'w-full justify-start gap-4 rounded-xl px-4 py-7 transition-all duration-500 border border-transparent',
                            isActive
                              ? 'bg-white/[0.03] text-white border-orange-400/50 '
                              : 'text-white/40 hover:text-white hover:bg-white/[0.02] '
                          )}
                        >
                          <Link href={item.url} className="flex items-center w-full">
                            <div
                              className={cn(
                                'p-2 rounded-lg transition-all duration-500 shrink-0',
                                isActive
                                  ? 'bg-white/5 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]'
                                  : 'text-white/40'
                              )}
                            >
                              <item.icon className="h-4 w-4" />
                            </div>
                            <span className="font-mono text-[11px] uppercase tracking-widest whitespace-nowrap">
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-6 border-t border-white/5 flex flex-col gap-6">
            <div className="px-2">
              <Link href="/profile">
                <div className="group relative">
                  <ProfileModal
                    user={{
                      name: user?.name ?? '',
                      email: user?.email ?? '',
                      image: user?.image ?? '',
                    }}
                    compact={false}
                  />
                  <div className="absolute inset-0 rounded-xl border border-white/0 group-hover:border-white/5 transition-colors pointer-events-none" />
                </div>
              </Link>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 rounded-xl px-4 py-4 text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 transition-all duration-500 hover:text-red-400 hover:bg-red-400/5 group w-full"
              title="Terminate Session"
            >
              <LogOutIcon className="h-3 w-3 transition-transform duration-500 group-hover:-translate-x-1" />
              <span>Terminate Session</span>
            </button>
          </SidebarFooter>
        </>
      )}
    </Sidebar>
  );
};

export default SideBar;
