import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  accentColor?: "purple" | "blue" | "green" | "orange"
}

export default function FeatureCard({ icon, title, description, accentColor = "purple" }: FeatureCardProps) {
  const accentColorMap = {
    purple: "before:bg-purple-600/10 hover:border-purple-600/30",
    blue: "before:bg-blue-500/10 hover:border-blue-500/30",
    green: "before:bg-green-500/10 hover:border-green-500/30",
    orange: "before:bg-orange-500/10 hover:border-orange-500/30",
  }

  const iconColorMap = {
    purple: "text-purple-600",
    blue: "text-blue-500",
    green: "text-green-500",
    orange: "text-orange-500",
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center text-center p-6 bg-white border border-gray-100 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md relative before:absolute before:inset-0 before:rounded-xl before:z-0 before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        accentColorMap[accentColor],
      )}
    >
      <div className={cn("p-3 rounded-full bg-black/5 mb-4 relative z-10", iconColorMap[accentColor])}>{icon}</div>
      <h3 className="text-xl font-bold mb-2 relative z-10">{title}</h3>
      <p className="text-gray-500 relative z-10">{description}</p>
    </div>
  )
}
