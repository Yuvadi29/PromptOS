'use client';

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter } from './ui/sidebar';
import { CircleGaugeIcon, GitCompareIcon, HomeIcon, LibraryIcon, LogOutIcon, Settings2Icon, Sparkles } from 'lucide-react';
import Link from 'next/link';
import ProfileModal from './ProfileModal';
import { signOut, useSession } from 'next-auth/react';
import { redirect, usePathname } from 'next/navigation';

// Menu Items
const items = [
  {
    title: "Prompt Enhancer",
    url: "/enhance",
    icon: Settings2Icon,
  },
  {
    title: "LLM Output Comparison",
    url: "/compare-llm",
    icon: GitCompareIcon,
  },
  {
    title: "Prompt Library",
    url: "/prompt-library",
    icon: LibraryIcon,
  },
  {
    title: "Prompt Scoring",
    url: "/prompt-scoring",
    icon: CircleGaugeIcon,
  },
  {
    title: 'Dashboard',
    url: "/dashboard",
    icon: HomeIcon,
  }
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
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut();
    redirect('/');
  };

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">PromptOS</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4 px-2">
            Platform
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`
                        w-full justify-start gap-3 rounded-xl px-3 py-6 transition-all duration-200
                        ${isActive
                          ? 'bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary'
                          : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                        }
                      `}
                    >
                      <Link href={item.url} className="flex items-center">
                        <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border flex flex-col">
        <div className="space-y-4">
          <Link href="/profile">
            <ProfileModal user={{
              name: user?.name ?? '',
              email: user?.email ?? '',
              image: user?.image ?? ''
            }} />
          </Link>

          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOutIcon className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default SideBar;
