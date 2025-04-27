import Link from "next/link";
import { Button } from "./ui/button";

export const DashboardCard = ({ title, desc, href }: { title: string; desc: string; href: string }) => {
    return (
      <Link
        href={href}
        className="rounded-xl border border-gray-200 hover:shadow-md transition p-6 bg-white"
      >
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{desc}</p>
        <Button className="mt-4 cursor-pointer" variant="outline">Open</Button>
      </Link>
    )
  }