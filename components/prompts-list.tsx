import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export function PromptsList() {
  // Sample data for prompts
  const prompts = [
    {
      id: 1,
      title: "Creative Story Generator",
      description: "Generates fantasy stories with complex characters and plot twists",
      score: 92,
      category: "Creative Writing",
    },
    {
      id: 2,
      title: "Code Refactoring Assistant",
      description: "Helps refactor and optimize code with best practices",
      score: 88,
      category: "Development",
    },
    {
      id: 3,
      title: "Product Description Writer",
      description: "Creates compelling product descriptions for e-commerce",
      score: 85,
      category: "Marketing",
    },
    {
      id: 4,
      title: "Email Template Generator",
      description: "Professional email templates for various business scenarios",
      score: 79,
      category: "Business",
    },
  ]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Your Prompts</CardTitle>
        <CardDescription>Recent prompts you&apos;ve created</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {prompts.map((prompt) => (
              <div key={prompt.id} className="flex items-start justify-between p-4 rounded-lg border">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{prompt.title}</h3>
                    <Badge variant="outline">{prompt.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{prompt.description}</p>
                </div>
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                  <span className="text-sm font-medium text-primary">{prompt.score}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
