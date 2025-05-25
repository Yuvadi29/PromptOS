'use client';

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';
import { CircleGaugeIcon, GitCompareIcon, HomeIcon, LibraryIcon, LogOutIcon, Settings2Icon } from 'lucide-react';
import Link from 'next/link';
import ProfileModal from './ProfileModal';
import { signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';

// Menu Items
const items = [
  {
    title: "Prompt Enhancer",
    url: "/enhance",
    icon: Settings2Icon,
    color: 'text-purple-600'
  },
  {
    title: "LLM Output Comparison",
    url: "/compare-llm",
    icon: GitCompareIcon,
    color: 'text-blue-600'
  },
  {
    title: "Prompt Library",
    url: "/prompt-library",
    icon: LibraryIcon,
    color: 'text-green-600'
  }, 
  {
    title: "Prompt Scoring",
    url: "/prompt-scoring",
    icon: CircleGaugeIcon,
    color: 'text-orange-600'
  },
  {
    title: 'Dashboard',
    url: "/dashboard",
    icon: HomeIcon,
    color: 'text-red-600'
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
                        <item.icon className={`mr-2 ${item.color} stroke-3`} />
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
