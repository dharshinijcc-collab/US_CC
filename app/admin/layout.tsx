import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard — CrestCode',
  robots: { index: false, follow: false },
};

// Isolated layout — strips out the global Header/Footer
// so the admin dashboard renders as its own standalone app
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
