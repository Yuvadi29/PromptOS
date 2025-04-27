import type { ReactNode } from "react"

interface MetricCardProps {
  title: string
  description: string
  icon?: ReactNode
}

export default function MetricCard({ title, description, icon }: MetricCardProps) {
  return (
    <div className="flex flex-col p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group">
      {icon && <div className="mb-4 group-hover:scale-110 transition-transform">{icon}</div>}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  )
}
