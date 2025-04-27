import React from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';
import { GitCompareIcon, LibraryIcon, Settings2Icon } from 'lucide-react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ProfileModal from './ProfileModal';

// Menu Items
const items = [
  {
    title: "Prompt Enhancer",
    url: "/enhance",
    icon: Settings2Icon
  },
  {
    title: "LLM Output Comparison",
    url: "/compare-llm",
    icon: GitCompareIcon
  },
  {
    title: "Prompt Library",
    url: "/prompt-library",
    icon: LibraryIcon
  }
];

const SideBar = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  const user = session?.user;

  return (
    <Sidebar className="flex flex-col h-screen ">
      {/* Top Section */}
      <div className='flex-1 overflow-y-auto'>
        <SidebarHeader />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel style={{ fontSize: "16px" }}>
              Enhance Your Prompts Here
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon className="mr-2" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200">
        <ProfileModal user={{
          name: user?.name ?? '',
          email: user?.email ?? '',
          image: user?.image ?? ''
        }} />
      </div>
    </Sidebar>
  );
}

export default SideBar;
