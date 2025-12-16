import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionCheck } from "@/components/SessionCheck";
import { HydrationSafetyWrapper } from "@/components/HydrationSafetyWrapper";
import { ExtensionBlocker } from "@/components/ExtensionBlocker";
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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
      <head>
        {/* Inline extension cleanup script - runs before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const ATTRS = ['bis_skin_checked', 'bis_register', '__processed_3156a7e1-e5c3-47de-ae90-2e1521714a72__'];
                function cleanup() {
                  ATTRS.forEach(attr => {
                    document.querySelectorAll('[' + attr + ']').forEach(el => {
                      try { el.removeAttribute(attr); } catch(e) {}
                    });
                  });
                }
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', cleanup);
                } else {
                  cleanup();
                }
                setTimeout(cleanup, 0);
                setTimeout(cleanup, 10);
                setTimeout(cleanup, 100);
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {/* Extension blocker - runs immediately to prevent hydration issues */}
        <ExtensionBlocker />
        {/* Comprehensive hydration safety wrapper */}
        <HydrationSafetyWrapper>
          {/* Session persistence check wrapper */}
          <SessionCheck>{children}</SessionCheck>
          {/* Toast notifications */}
          <Toaster position="top-right" richColors closeButton />
        </HydrationSafetyWrapper>
      </body>
    </html>
  );
}
