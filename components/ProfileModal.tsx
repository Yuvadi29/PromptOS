"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useState } from "react";
import Image from "next/image";

interface ProfileModalProps {
  user: {
    name?: string;
    email?: string;
    image?: string;
  };
}

export default function ProfileModal({ user }: ProfileModalProps) {
  const [open, setOpen] = useState(false); // Handle modal open/close

  return (
    <div className="cursor-pointer text-black">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="rounded-full p-3 flex items-center space-x-3 cursor-pointer">
            <Avatar className="w-10 h-10">
              <Image src={user?.image || "/avatar.png"} alt={user?.name || "User avatar"} width={40} height={40}/>
            </Avatar>
            <span className="text-black font-medium">{user?.name}</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              {user?.name?.split(" ")[0]}'s Dashboard
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="profile" className="w-full mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="py-4">
                <h2 className="text-lg font-semibold mb-2">Profile Info</h2>
                <p className="text-gray-600 text-sm">Name: {user?.name || "N/A"}</p>
                <p className="text-gray-600 text-sm">Email: {user?.email || "N/A"}</p>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="py-4">
                <h2 className="text-lg font-semibold mb-2">Settings</h2>
                <p className="text-gray-600 text-sm">Coming Soon 🚀</p>
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <div className="py-4">
                <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
                <p className="text-gray-600 text-sm">Activity logs will appear here 📜</p>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
