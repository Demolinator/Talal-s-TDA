import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personal task management dashboard.",
};

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Your Dashboard
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Start managing your tasks efficiently. Create, edit, and track your
          progress all in one place.
        </p>

        {/* Quick Actions */}
        <div className="flex gap-4">
          <Link
            href="/dashboard/tasks"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            View All Tasks
          </Link>
          <Link
            href="/dashboard/tasks"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
          >
            Create New Task
          </Link>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Getting Started Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            🚀 Getting Started
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Create your first task to get organized</li>
            <li>• Mark tasks as complete when done</li>
            <li>• Edit or delete tasks anytime</li>
            <li>• Access your tasks from any device</li>
          </ul>
        </div>

        {/* Features Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            ✨ Features
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Secure authentication and authorization</li>
            <li>• Private tasks only you can see</li>
            <li>• Fast and responsive interface</li>
            <li>• Built with modern web technologies</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
