import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Phase II Todo - Manage Your Tasks Efficiently",
  description:
    "Full-stack todo application with user authentication and task management. Sign up to start organizing your tasks today.",
};

export default function LandingPage() {
  return (
    <div
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white"
      suppressHydrationWarning
    >
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">Phase II Todo</div>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Organize Your Tasks,
            <br />
            <span className="text-blue-600">Boost Your Productivity</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            A simple and powerful todo app built with modern web technologies.
            Create, manage, and complete your tasks with ease.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4" suppressHydrationWarning>
              ✅
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Task Management
            </h3>
            <p className="text-gray-600">
              Create, edit, and delete tasks with an intuitive interface. Mark
              tasks as complete to track your progress.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4" suppressHydrationWarning>
              🔒
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Secure Authentication
            </h3>
            <p className="text-gray-600">
              Your tasks are private and protected with secure JWT-based
              authentication. Access from any device.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4" suppressHydrationWarning>
              ⚡
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Fast & Responsive
            </h3>
            <p className="text-gray-600">
              Built with Next.js 16, React 19, and Tailwind CSS for a smooth and
              responsive user experience.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p>© 2025 Phase II Todo. Built for Panaversity Hackathon.</p>
        </div>
      </footer>
    </div>
  );
}
