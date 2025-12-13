import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionCheck } from "@/components/SessionCheck";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Phase II Todo",
    default: "Phase II Todo - Manage Your Tasks Efficiently",
  },
  description:
    "Full-stack todo application with user authentication, task management, and responsive design. Built with Next.js 16, React 19, FastAPI, and PostgreSQL.",
  keywords: [
    "todo",
    "task management",
    "productivity",
    "next.js",
    "react",
    "fastapi",
  ],
  authors: [{ name: "Phase II Todo Team" }],
  creator: "Phase II Todo",
  publisher: "Phase II Todo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* Session persistence check wrapper */}
        <SessionCheck>{children}</SessionCheck>
        {/* Toast notifications */}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
