import type { Metadata } from "next";
import { Toaster } from "@/app/components/Toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "Whop Notes App",
  description: "A beautiful notes app built for Whop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}