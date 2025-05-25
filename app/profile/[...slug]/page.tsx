// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Label } from "@/components/ui/label"
// import { PromptsList } from "@/components/prompts-list"
// import { ActivityOverview } from "@/components/activity-overview"
// import { AnalyticsCard } from "@/components/analytics-card"
// import { UserStats } from "@/components/user-stats"

// export default function UserProfile({ params }: { params: { slug: string[] } }) {
//   const [username, setUsername] = useState("alexjohnson")
//   const [newUsername, setNewUsername] = useState("")
//   const [isDialogOpen, setIsDialogOpen] = useState(false)

//   const handleUpdateUsername = () => {
//     if (newUsername.trim()) {
//       setUsername(newUsername.trim())
//       setNewUsername("")
//       setIsDialogOpen(false)
//     }
//   }

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//       {/* Left Column - User Details */}
//       <div className="lg:col-span-1">
//         <Card className="h-full">
//           <CardHeader className="pb-4">
//             <CardTitle className="text-2xl font-bold">Profile</CardTitle>
//             <CardDescription>Manage your profile information</CardDescription>
//           </CardHeader>
//           <CardContent className="flex flex-col items-center space-y-6">
//             <Avatar className="h-32 w-32">
//               <AvatarImage src="/placeholder.svg?height=128&width=128" alt="User avatar" />
//               <AvatarFallback className="text-4xl">AJ</AvatarFallback>
//             </Avatar>

//             <div className="space-y-1 text-center">
//               <h2 className="text-2xl font-semibold">{username}</h2>
//               <p className="text-muted-foreground">Member since January 2023</p>
//             </div>

//             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//               <DialogTrigger asChild>
//                 <Button variant="outline">Edit Username</Button>
//               </DialogTrigger>
//               <DialogContent>
//                 <DialogHeader>
//                   <DialogTitle>Update Username</DialogTitle>
//                   <DialogDescription>
//                     Enter a new username below. This will be visible to other users.
//                   </DialogDescription>
//                 </DialogHeader>
//                 <div className="py-4">
//                   <Label htmlFor="username">Username</Label>
//                   <Input
//                     id="username"
//                     value={newUsername}
//                     onChange={(e) => setNewUsername(e.target.value)}
//                     placeholder={username}
//                     className="mt-2"
//                   />
//                 </div>
//                 <DialogFooter>
//                   <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
//                     Cancel
//                   </Button>
//                   <Button onClick={handleUpdateUsername}>Save Changes</Button>
//                 </DialogFooter>
//               </DialogContent>
//             </Dialog>

//             <UserStats />
//           </CardContent>
//         </Card>
//       </div>

//       {/* Right Column - Bento Layout */}
//       <div className="lg:col-span-2">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="md:col-span-2">
//             <PromptsList />
//           </div>
//           <div className="md:col-span-1">
//             <ActivityOverview />
//           </div>
//           <div className="md:col-span-1">
//             <AnalyticsCard />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
