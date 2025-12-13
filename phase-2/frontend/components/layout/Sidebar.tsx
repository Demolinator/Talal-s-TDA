/**
 * Sidebar Component - Responsive Navigation
 *
 * Responsive Behavior:
 * - Mobile (320px-1023px): Hidden (navigation in Header hamburger menu)
 * - Desktop (1024px+): Visible, fixed-width sidebar with navigation links
 *
 * Accessibility:
 * - Semantic HTML (nav, aside)
 * - ARIA labels for screen readers
 * - Keyboard navigation support
 * - Active link indication
 */

"use client";

import React from "react";

interface SidebarProps {
  activeRoute?: string;
}

export function Sidebar({ activeRoute = "/dashboard" }: SidebarProps) {
  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <DashboardIcon className="h-5 w-5" />,
    },
    {
      href: "/dashboard/tasks",
      label: "All Tasks",
      icon: <TasksIcon className="h-5 w-5" />,
    },
    {
      href: "/dashboard/tasks?filter=completed",
      label: "Completed",
      icon: <CheckIcon className="h-5 w-5" />,
    },
    {
      href: "/dashboard/tasks?filter=incomplete",
      label: "Incomplete",
      icon: <ClockIcon className="h-5 w-5" />,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: <UserIcon className="h-5 w-5" />,
    },
  ];

  return (
    <aside
      className="hidden lg:block lg:w-64 xl:w-72 bg-gray-50 border-r border-gray-200 h-screen sticky top-0 overflow-y-auto"
      aria-label="Sidebar navigation"
    >
      <nav className="p-4 lg:p-6 space-y-2" role="navigation">
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your tasks</p>
        </div>

        {navItems.map((item) => {
          const isActive = activeRoute === item.href || activeRoute?.startsWith(item.href);

          return (
            <a
              key={item.href}
              href={item.href}
              className={`
                group flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium
                transition-all duration-200 min-h-[44px]
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }
              `}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={`
                  flex-shrink-0 transition-colors
                  ${isActive ? "text-white" : "text-gray-400 group-hover:text-blue-600"}
                `}
              >
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <span className="flex-shrink-0 w-2 h-2 bg-white rounded-full" aria-hidden="true" />
              )}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function TasksIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

