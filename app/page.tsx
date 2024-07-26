import { poppins } from "@/lib/fonts";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-full bg-gradient-to-r from-slate-200 to-slate-300">
      <section className="text-center py-16 px-6">
        <h1
          className={`${poppins.className} text-5xl font-bold text-gray-900 mb-4`}
        >
          Welcome to the Alumni Portal
        </h1>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          Join your organizations, connect with fellow alumni, share updates,
          create events, and stay actively engaged.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <button className="relative inline-flex items-center px-8 py-4 font-semibold text-white bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Get Started
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
