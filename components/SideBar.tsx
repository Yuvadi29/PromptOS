'use client';

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from './ui/sidebar';
import { GitCompareIcon, HomeIcon, LibraryIcon, LogOutIcon, Settings2Icon } from 'lucide-react';
import Link from 'next/link';
import ProfileModal from './ProfileModal';
import { signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';

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
  }, 
  {
    title: 'Dashboard',
    url: "/dashboard",
    icon: HomeIcon
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

  const handleSignOut = async () => {
    await signOut();
    redirect('/');
  };

  return (
    <Sidebar className="relative">
      {/* Trigger positioned at top-right corner */}
      {/* <SidebarTrigger className='absolute top-2 -right-9 rounded-full p-2'/> */}

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
        <>
        <div className="flex space-x-3 cursor-pointer" onClick={handleSignOut}>
        <LogOutIcon className='mb-4 ml-5' />
        <p className='font-medium ml-4'>Logout</p>
        </div>
        <ProfileModal user={{
          name: user?.name ?? '',
          email: user?.email ?? '',
          image: user?.image ?? ''
        }} />
        </>
      </div>
    </Sidebar>
  );
}

export default SideBar;
