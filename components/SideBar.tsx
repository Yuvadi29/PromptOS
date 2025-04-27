import React from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import { GitCompareIcon, LibraryIcon, Settings2Icon } from 'lucide-react'
import Link from 'next/link'

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
]

const SideBar = () => {
    return (
        <Sidebar>
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel style={{fontSize: "16px"}}>
                        Enhance Your Prompts Here
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items?.map((item) => (
                                <SidebarMenuItem key={item?.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item?.url}>
                                            <item.icon />
                                            <span className='font-medium'>{item?.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

export default SideBar