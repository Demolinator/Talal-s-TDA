import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold">Todo App - Phase II</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Full-stack todo application with Better Auth authentication
        </p>

        <div className="flex gap-4 mt-8">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </main>
    </div>
  );
}
