import type { Metadata } from 'next';
import Navbar from '@/app/components/Navbar';
import Sidebar from '@/app/components/Sidebar';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Whop Notes - Modern Note Taking',
  description: 'A beautiful cloud note-taking app with Whop authentication',
  keywords: 'notes, whop, productivity, cloud storage',
  authors: [{ name: 'Whop Notes Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Whop Notes',
    description: 'Modern note-taking app with macOS design',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-gray-50">
        <div className="flex h-full">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="p-6 flex-1 overflow-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
