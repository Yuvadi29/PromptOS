import { Separator } from "@/components/ui/separator"

export function UserStats() {
  return (
    <div className="w-full space-y-4">
      <Separator />

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold">42</p>
          <p className="text-sm text-muted-foreground">Prompts</p>
        </div>
        <div>
          <p className="text-2xl font-bold">128</p>
          <p className="text-sm text-muted-foreground">Followers</p>
        </div>
        <div>
          <p className="text-2xl font-bold">56</p>
          <p className="text-sm text-muted-foreground">Following</p>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Bio</h3>
        <p className="text-sm text-muted-foreground">
          AI enthusiast and prompt engineer. Creating innovative prompts for various AI models and sharing knowledge
          with the community.
        </p>
      </div>
    </div>
  )
}
