
import Link from "next/link";
import {
  Users,
  Swords,
  Package,
  BookOpen,
  ArrowRight,
  ArrowUpRight,
  Search,
  ChartNoAxesCombined,
  BrainCircuit,
  ScrollText,
  Newspaper,
  FileText,
  Scale,
  Clock,
} from "lucide-react";

const categories = [
  {
    title: "Heroes",
    description: "Discover every hero and their abilities.",
    image: "/images/heroes.jpg",
    href: "/heroes",
  },
  {
    title: "Builds",
    description: "Find powerful builds and strategies.",
    image: "/images/builds.jpg",
    href: "/builds",
  },
  {
    title: "Items",
    description: "Explore weapons, vitality and spirit.",
    image: "/images/items.jpg",
    href: "/items",
  },
  {
    title: "Guides",
    description: "Learn mechanics and master the game.",
    image: "/images/guides.jpg",
    href: "/guides",
  },
];

const newsCategories = [
  {
    title: "Patch Notes",
    description: "Official game updates and patch details.",
    icon: FileText,
  },
  {
    title: "Balance Changes",
    description: "Hero buffs, nerfs and item adjustments.",
    icon: Scale,
  },
  {
    title: "Recent Updates",
    description: "New features and announcements.",
    icon: Clock,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-white/10 bg-black/90 px-6 backdrop-blur-xl md:px-16">

        <Link href="/" className="text-xl font-black tracking-wider">
          DEADLOCK <span className="text-purple-400">CODEX</span>
        </Link>

        <div className="hidden gap-8 text-sm text-gray-400 md:flex">
          <Link href="/heroes" className="hover:text-white">Heroes</Link>
          <Link href="/builds" className="hover:text-white">Builds</Link>
          <Link href="/items" className="hover:text-white">Items</Link>
          <Link href="/guides" className="hover:text-white">Guides</Link>
          <Link href="/news" className="hover:text-white">News</Link>
        </div>

        <Link
          href="/api/auth/steam"
          className="rounded-lg bg-[#183B67] px-5 py-3 text-sm font-semibold transition hover:bg-[#244f85]"
        >
          Sign in with Steam
        </Link>
      </nav>

      {/* HERO BANNER */}
      <section className="relative flex min-h-[580px] items-center overflow-hidden px-6 md:px-16">

        <div className="absolute inset-0 bg-[url('/images/deadlock-bg.jpg')] bg-cover bg-center opacity-50" />

        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black via-black/80 to-transparent" />

        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        <div className="relative z-20 max-w-2xl py-24">

          <p className="mb-5 text-sm font-semibold tracking-[0.35em] text-purple-400">
            THE ULTIMATE DEADLOCK COMPANION
          </p>

          <h1 className="text-5xl font-black leading-tight md:text-7xl">
            MASTER THE
            <br />
            STREETS.
            <br />
            <span className="text-purple-400">MASTER DEADLOCK.</span>
          </h1>

          <p className="mt-7 max-w-lg text-lg leading-8 text-gray-400">
            Explore heroes, discover powerful builds, understand
            every item and learn everything about Deadlock.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/heroes"
              className="flex items-center gap-3 rounded-lg bg-[#183B67] px-7 py-4 font-semibold transition hover:bg-[#244f85]"
            >
              Explore Heroes
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/guides"
              className="rounded-lg border border-white/20 px-7 py-4 font-semibold hover:bg-white/10"
            >
              Explore Guides
            </Link>
          </div>
        </div>
      </section>

      {/* MAIN CATEGORIES */}
      <section className="px-6 py-20 md:px-16">

        <div className="mb-10">
          <p className="text-xs font-bold tracking-[0.3em] text-purple-400">
            EXPLORE THE CODEX
          </p>

          <h2 className="mt-3 text-3xl font-black">
            Everything Deadlock.
          </h2>

          <p className="mt-3 text-gray-500">
            Your complete Deadlock encyclopedia.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {categories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="group relative flex h-64 overflow-hidden rounded-xl border border-white/10 bg-[#111] transition duration-300 hover:-translate-y-1 hover:border-purple-500/60"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `url('${category.image}')`,
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/15 transition group-hover:via-black/50" />

              <div className="relative z-10 mt-auto w-full p-6">
                <h3 className="text-2xl font-black uppercase tracking-wide">
                  {category.title}
                </h3>

                <p className="mt-2 text-sm text-gray-300">
                  {category.description}
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm text-purple-300">
                  Explore <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}

        </div>
      </section>

      {/* PLAYER TRACKER */}
      <section className="px-6 pb-20 md:px-16">

        <div
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#101010] bg-cover bg-center"
          style={{ backgroundImage: "url('/images/tracker.jpg')" }}
        >

          <div className="absolute inset-0 bg-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-purple-950/30" />

          <div className="relative z-10 grid items-center gap-10 p-8 md:grid-cols-2 md:p-12">

            <div>
              <div className="flex items-center gap-3 text-purple-400">
                <ChartNoAxesCombined size={22} />
                <p className="text-xs font-bold tracking-[0.3em]">
                  PLAYER TRACKER
                </p>
              </div>

              <h2 className="mt-5 text-3xl font-black md:text-4xl">
                Know your game.
                <br />
                <span className="text-purple-400">Track your progress.</span>
              </h2>

              <p className="mt-5 max-w-md leading-7 text-gray-300">
                Search Deadlock players and explore their performance,
                match history and hero statistics.
              </p>

              <Link
                href="/players"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300"
              >
                Open Player Tracker
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="rounded-xl border border-white/15 bg-black/75 p-6 backdrop-blur-md">

              <p className="text-sm font-bold">Find a player</p>

              <p className="mt-2 text-xs text-gray-400">
                Enter a SteamID64 or Steam profile URL.
              </p>

              <form action="/players" method="GET" className="mt-6">

                <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4">
                  <Search size={18} className="shrink-0 text-gray-400" />

                  <input
                    type="text"
                    name="steamId"
                    required
                    placeholder="Enter Steam ID..."
                    className="w-full bg-transparent py-4 text-sm text-white outline-none placeholder:text-gray-500"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#183B67] py-4 text-sm font-semibold transition hover:bg-[#244f85]"
                >
                  Search Player
                  <ArrowRight size={17} />
                </button>

              </form>

              <p className="mt-4 text-center text-[10px] text-gray-500">
                PLAYER DATA SUBJECT TO API AVAILABILITY
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* AI COACH */}
      <section className="px-6 pb-20 md:px-16">

        <div
          className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-[#100c16] bg-cover bg-center"
          style={{ backgroundImage: "url('/images/ai-coach.jpg')" }}
        >

          <div className="absolute inset-0 bg-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-purple-950/40" />

          <div className="relative z-10 flex flex-col justify-between gap-8 p-8 md:flex-row md:items-center md:p-12">

            <div className="max-w-xl">
              <div className="flex items-center gap-3 text-purple-400">
                <BrainCircuit size={23} />
                <p className="text-xs font-bold tracking-[0.3em]">
                  CODEX AI
                </p>
              </div>

              <h2 className="mt-5 text-3xl font-black md:text-4xl">
                Play smarter.
                <br />
                <span className="text-purple-400">Not just harder.</span>
              </h2>

              <p className="mt-5 leading-7 text-gray-300">
                Analyze your matches, identify mistakes and
                discover ways to improve your gameplay with
                AI-powered coaching.
              </p>
            </div>

            <Link
              href="/ai-coach"
              className="inline-flex shrink-0 items-center justify-center gap-3 rounded-lg bg-purple-600 px-7 py-4 font-semibold transition hover:bg-purple-500"
            >
              Explore AI Coach
              <ArrowRight size={18} />
            </Link>

          </div>
        </div>
      </section>

      {/* GAME LORE */}
      <section className="px-6 pb-20 md:px-16">

        <div
          className="relative min-h-[350px] overflow-hidden rounded-2xl border border-white/10 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/lore.jpg')" }}
        >

          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20" />

          <div className="relative z-10 max-w-2xl p-8 md:p-14">

            <div className="flex items-center gap-3 text-purple-400">
              <ScrollText size={22} />
              <p className="text-xs font-bold tracking-[0.3em]">
                THE WORLD OF DEADLOCK
              </p>
            </div>

            <h2 className="mt-6 text-3xl font-black md:text-5xl">
              Every hero has a story.
              <br />
              <span className="text-purple-400">Every story has a secret.</span>
            </h2>

            <p className="mt-5 leading-7 text-gray-300">
              Discover the characters, factions, supernatural
              forces and mysterious world behind Deadlock.
            </p>

            <Link
              href="/lore"
              className="mt-8 inline-flex items-center gap-3 rounded-lg border border-white/30 px-6 py-4 font-semibold transition hover:bg-white/10"
            >
              Explore Game Lore
              <ArrowRight size={18} />
            </Link>

          </div>
        </div>
      </section>

      {/* NEWS AND UPDATES */}
      <section className="px-6 pb-24 md:px-16">

        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-purple-400">
              STAY INFORMED
            </p>

            <h2 className="mt-3 text-3xl font-black">
              News & Updates.
            </h2>

            <p className="mt-3 text-gray-500">
              Keep up with everything happening in Deadlock.
            </p>
          </div>

          <Link
            href="/news"
            className="hidden items-center gap-2 text-sm text-purple-400 hover:text-purple-300 sm:flex"
          >
            All news <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">

          {newsCategories.map((news) => {
            const Icon = news.icon;

            return (
              <Link
                href="/news"
                key={news.title}
                className="group relative flex min-h-[190px] flex-col justify-end overflow-hidden rounded-xl border border-white/10 bg-[#111] p-7 transition hover:border-purple-500/50"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-purple-950/30 to-transparent opacity-0 transition group-hover:opacity-100" />

                <div className="relative z-10">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-6 text-lg font-bold">
                    {news.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-400">
                    {news.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm text-purple-400">
                    Read updates
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            );
          })}

        </div>

        <Link
          href="/news"
          className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-white/10 py-4 text-sm font-semibold text-gray-300 transition hover:border-purple-500/40 hover:text-white sm:hidden"
        >
          View all news
          <ArrowRight size={16} />
        </Link>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 py-9 md:px-16">

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

          <div>
            <Link href="/" className="text-xl font-black tracking-wider">
              DEADLOCK <span className="text-purple-400">CODEX</span>
            </Link>

            <p className="mt-2 text-xs text-gray-600">
              Your encyclopedia for everything Deadlock.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-gray-500">
            <Link href="/heroes" className="hover:text-white">Heroes</Link>
            <Link href="/builds" className="hover:text-white">Builds</Link>
            <Link href="/items" className="hover:text-white">Items</Link>
            <Link href="/guides" className="hover:text-white">Guides</Link>
            <Link href="/news" className="hover:text-white">News</Link>
          </div>

        </div>

        <div className="mt-8 border-t border-white/5 pt-6 text-xs text-gray-700">
          DEADLOCK CODEX · COMMUNITY GAME ENCYCLOPEDIA
        </div>

      </footer>

    </main>
  );
}
