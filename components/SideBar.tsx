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
} from './ui/sidebar';
import {
  CircleGaugeIcon,
  GitCompareIcon,
  HomeIcon,
  LibraryIcon,
  LogOutIcon,
  Settings2Icon,
} from 'lucide-react';
import Link from 'next/link';
import ProfileModal from './ProfileModal';
import { signOut } from 'next-auth/react';
import { redirect, usePathname } from 'next/navigation';
import Image from 'next/image';

// Menu Items
const items = [
  {
    title: 'Prompt Enhancer',
    url: '/enhance',
    icon: Settings2Icon,
  },
  {
    title: 'LLM Output Comparison',
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

  const handleSignOut = async () => {
    await signOut();
    redirect('/');
  };

  return (
    <Sidebar className="border-r border-white/5 bg-black/40 backdrop-blur-3xl text-sidebar-foreground shadow-2xl [&_[data-sidebar=sidebar]]:bg-transparent">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

      <SidebarHeader className="p-6 relative z-10">
        <div className="flex items-center gap-2 px-2">
          <div className="flex items-center gap-3 px-2 group cursor-pointer transition-all">
            <Image
              src="/og-image.ico"
              alt="PromptOS Logo"
              width={40}
              height={40}
              className="rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:scale-105 transition-transform duration-300"
              priority
            />
            <span className="text-xl font-bold tracking-tight text-white drop-shadow-md">
              PromptOS
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 relative z-10">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-4 px-2">
            Platform Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`
                        w-full justify-start gap-4 rounded-xl px-4 py-6 transition-all duration-300 relative overflow-hidden group
                        ${
                          isActive
                            ? 'bg-gradient-to-r from-primary/10 to-transparent border-l-2 border-primary text-primary'
                            : 'text-muted-foreground hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                        }
                      `}
                    >
                      <Link href={item.url} className="flex items-center">
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50 pointer-events-none" />
                        )}
                        <item.icon
                          className={`h-5 w-5 z-10 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'text-muted-foreground group-hover:text-white'}`}
                        />
                        <span className="font-semibold z-10 tracking-wide">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/5 flex flex-col relative z-10">
        <div className="space-y-2">
          <Link href="/profile" className="block rounded-xl hover:bg-white/5 transition-colors p-2">
            <ProfileModal
              user={{
                name: user?.name ?? '',
                email: user?.email ?? '',
                image: user?.image ?? '',
              }}
            />
          </Link>

          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground transition-all duration-300 hover:bg-red-500/10 hover:text-red-400 group"
          >
            <LogOutIcon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            <span>Sign Out</span>
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideBar;
