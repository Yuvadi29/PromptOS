"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

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
    <div className="cursor-pointer border-2 border-blue-500 text-black">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="rounded-full p-0">
            <Avatar className="w-8 h-8">
              {/* Fix image path here */}
              <AvatarImage src={user?.image || "/default-image.png"} />
              <AvatarFallback>{user?.name?.split(" ")[0]}</AvatarFallback>
            </Avatar>
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
