
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

async function DashboardContent() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-[#090909] text-white p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">
          Deadlock Codex
        </h1>

        <div className="mt-8 rounded-xl border border-white/10 bg-[#171717] p-6">
          <h2 className="text-xl font-semibold">
            Welcome, {user.personaName}!
          </h2>

          <p className="mt-3 text-gray-400">
            Steam ID: {user.steamId64}
          </p>

          <a
            href={user.profileUrl ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-blue-400"
          >
            View Steam Profile
          </a>

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="mt-6 rounded-lg bg-white px-5 py-2 text-black"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#090909] text-white p-8">
          Loading Deadlock Codex...
        </main>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
