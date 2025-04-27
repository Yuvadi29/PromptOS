import type { ReactNode } from "react"

interface UseCaseCardProps {
  icon: ReactNode
  title: string
  description: string
}

export default function UseCaseCard({ icon, title, description }: UseCaseCardProps) {
  return (
    <div className="flex p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="p-3 rounded-full bg-black/5 h-fit mr-4 group-hover:scale-110 transition-transform">{icon}</div>
      <div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  )
}
