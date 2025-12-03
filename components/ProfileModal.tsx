"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileModalProps {
  user: {
    name?: string;
    email?: string;
    image?: string;
  };
}

export default function ProfileModal({ user }: ProfileModalProps) {

  return (
    <>
      <Button variant="ghost" className="w-full justify-start gap-3 px-2 hover:bg-sidebar-accent h-auto py-3 cursor-pointer ">
        <Avatar className="h-8 w-8 border border-border">
          <AvatarImage src={user?.image} alt={user?.name} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {user?.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start text-left">
          <span className="text-sm font-semibold text-sidebar-foreground truncate max-w-[150px]">
            {user?.name || "User"}
          </span>
          <span className="text-xs text-muted-foreground truncate max-w-[150px]">
            {user?.email || "No email"}
          </span>
        </div>
      </Button>


    </>
  );
}
