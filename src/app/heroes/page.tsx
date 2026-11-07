
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";

type Hero = {
  id: number;
  name: string;
  class_name: string;
  player_selectable: boolean;
  disabled: boolean;
  in_development: boolean;
  images: {
    icon_hero_card_webp?: string;
    icon_hero_card?: string;
  };
};

export default function HeroesPage() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHeroes() {
      try {
        const response = await fetch("/api/heroes");

        if (!response.ok) {
          throw new Error("Failed to load heroes");
        }

        const data: Hero[] = await response.json();

        const playable = data.filter(
          (hero) => hero.player_selectable && !hero.disabled
        );

        setHeroes(playable);
      } catch {
        setError("Unable to load heroes. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadHeroes();
  }, []);

  const filteredHeroes = heroes.filter((hero) =>
  `${hero.name} ${hero.class_name} ${hero.id}`
    .toLowerCase()
    .includes(search.trim().toLowerCase())
);

  return (
    <main className="min-h-screen bg-[#08080B] text-white">

      <header className="border-b border-white/10 px-6 py-5 md:px-16">
        <Link href="/" className="text-lg font-black tracking-wider">
          DEADLOCK <span className="text-purple-400">CODEX</span>
        </Link>
      </header>

      <section className="px-6 pb-8 pt-12 md:px-16 md:pt-16">
        <p className="text-xs font-bold tracking-[0.3em] text-purple-400">
          DATABASE / ROSTER
        </p>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase md:text-6xl">
              Heroes
            </h1>
            <p className="mt-3 text-sm text-gray-500">
              Explore heroes, abilities, builds and strategies.
            </p>
          </div>

          <p className="text-sm text-gray-400">
            <span className="text-2xl font-bold text-white">
              {heroes.length}
            </span>{" "}
            Heroes
          </p>
        </div>
      </section>

      <section className="px-6 pb-8 md:px-16">
        <div className="relative max-w-xl">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search heroes..."
            className="w-full rounded-xl border border-white/10 bg-[#131318] py-4 pl-12 pr-5 text-sm outline-none focus:border-purple-500/60"
          />
        </div>
      </section>

      <section className="px-6 pb-20 md:px-16">
        <div className="mb-5 flex justify-between">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
            All Heroes
          </h2>
          <p className="text-xs text-gray-600">
            {filteredHeroes.length} heroes
          </p>
        </div>

        {loading && (
          <p className="py-16 text-center text-gray-400">
            Loading Deadlock heroes...
          </p>
        )}

        {error && (
          <p className="py-16 text-center text-red-400">{error}</p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filteredHeroes.map((hero) => (
              <Link
                key={hero.id}
                href={`/heroes/${hero.id}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10 bg-[#17171C] transition hover:-translate-y-1 hover:border-purple-500/70"
              >
                <img
                  src={
                    hero.images.icon_hero_card_webp ||
                    hero.images.icon_hero_card
                  }
                  alt={hero.name}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3">
                  <h3 className="text-sm font-black uppercase sm:text-base">
                    {hero.name}
                  </h3>
                  <ArrowUpRight
                    size={17}
                    className="text-purple-400 opacity-0 transition group-hover:opacity-100"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && !error && filteredHeroes.length === 0 && (
          <p className="py-16 text-center text-gray-500">
            No heroes found.
          </p>
        )}
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-xs text-gray-600">
        DEADLOCK CODEX · HERO DATABASE
      </footer>
    </main>
  );
}
