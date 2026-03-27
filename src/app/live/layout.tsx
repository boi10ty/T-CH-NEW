import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Business Support',
};

export default function LiveLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
