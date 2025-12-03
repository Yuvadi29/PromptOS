import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "API Documentation | PromptOS",
    description: "Comprehensive API documentation for PromptOS endpoints",
};

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
