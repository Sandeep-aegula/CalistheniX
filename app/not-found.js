// app/not-found.js

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-8">
      <h1 className="text-6xl font-bold text-yellow-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        href="/"
        className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-full shadow-md hover:bg-yellow-300 font-semibold transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
