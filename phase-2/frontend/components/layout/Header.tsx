"use client";

/**
 * Dashboard Header Component - Responsive Navigation
 *
 * Responsive Behavior:
 * - Mobile (320px-767px): Hamburger menu icon, collapsible navigation drawer
 * - Tablet/Desktop (768px+): Full horizontal navigation bar with user name and logout
 *
 * Accessibility:
 * - Semantic HTML (header, nav)
 * - ARIA labels for screen readers
 * - Keyboard navigation support (Escape to close mobile menu)
 */

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface HeaderProps {
  userName: string;
}

export function Header({ userName }: HeaderProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      // POST /api/auth/logout - clears HttpOnly cookie
      await api.post("/api/auth/logout");

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
        {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <a href="/dashboard" className="flex items-center">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
          Phase II Todo
              </h1>
            </a>
        </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8" aria-label="Main navigation">
            <a
              href="/dashboard"
              className="text-base lg:text-lg text-gray-700 hover:text-blue-600 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
            >
              Dashboard
            </a>
            <a
              href="/dashboard/tasks"
              className="text-base lg:text-lg text-gray-700 hover:text-blue-600 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
            >
              Tasks
            </a>
            <span className="text-sm lg:text-base text-gray-500 border-l border-gray-300 pl-6 lg:pl-8">
              Welcome, <span className="font-semibold text-gray-700">{userName}</span>
          </span>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
              className="py-2 px-4 lg:px-6 bg-red-600 text-white text-sm lg:text-base font-medium rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              aria-label="Logout"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </nav>

          {/* Mobile Menu Button - Visible only on mobile */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] min-w-[44px]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer - Visible only on mobile when open */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <nav
            id="mobile-menu"
            className="fixed top-16 left-0 right-0 bottom-0 bg-white z-50 md:hidden overflow-y-auto"
            aria-label="Mobile navigation"
            role="dialog"
            aria-modal="true"
          >
            <div className="px-4 py-6 space-y-1">
              <div className="px-4 py-3 mb-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-gray-600">Welcome,</p>
                <p className="text-lg font-semibold text-gray-900">{userName}</p>
              </div>
              <a
                href="/dashboard"
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors min-h-[44px] flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </a>
              <a
                href="/dashboard/tasks"
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors min-h-[44px] flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tasks
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                disabled={isLoggingOut}
                className="w-full mt-4 py-3 px-4 bg-red-600 text-white text-base font-medium rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                aria-label="Logout"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
