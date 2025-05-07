import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "../components/ui/scroll-area"
import { CalendarIcon, MessageSquare, ThumbsUp, Eye } from "lucide-react"

export function ActivityOverview() {
  // Sample activity data
  const activities = [
    {
      id: 1,
      type: "prompt_created",
      title: "Created a new prompt",
      description: "Email Template Generator",
      time: "2 hours ago",
      icon: <CalendarIcon className="h-4 w-4" />,
    },
    {
      id: 2,
      type: "comment",
      title: "Received a comment",
      description: "Great prompt! I used it for my project.",
      time: "Yesterday",
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      id: 3,
      type: "like",
      title: "Prompt liked",
      description: "Code Refactoring Assistant",
      time: "2 days ago",
      icon: <ThumbsUp className="h-4 w-4" />,
    },
    {
      id: 4,
      type: "view",
      title: "Prompt viewed",
      description: "Creative Story Generator",
      time: "3 days ago",
      icon: <Eye className="h-4 w-4" />,
    },
  ]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>Your recent activity</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[220px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">{activity.icon}</div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
