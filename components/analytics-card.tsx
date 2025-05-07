import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "@/components/ui/chart"

export function AnalyticsCard() {
  // Sample data for prompt scores over time
  const data = [
    { name: "Jan", score: 65 },
    { name: "Feb", score: 72 },
    { name: "Mar", score: 78 },
    { name: "Apr", score: 74 },
    { name: "May", score: 82 },
    { name: "Jun", score: 88 },
    { name: "Jul", score: 92 },
  ]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
        <CardDescription>Your prompt performance over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
