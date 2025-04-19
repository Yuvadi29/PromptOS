import React from 'react'

const FeatureCard = ({
    icon,
    title,
    desc
}: {
    icon: React.ReactNode;
    title: string;
    desc: string;
}) => {
    return (
        <div className="p-6 rounded-lg shadow-sm border bg-white hover:shadow-md transition">
            {icon}
            <h3 className="mt-4 font-semibold text-lg">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{desc}</p>
        </div>
    )
}

export default FeatureCard