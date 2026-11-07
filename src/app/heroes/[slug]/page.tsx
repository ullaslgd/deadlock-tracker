
import { notFound } from "next/navigation";

export const instant = false;

const API_URL = "https://api.deadlock-api.com/v1/assets/heroes";

interface StatValue {
  value?: number;
  display_stat_name?: string;
}

interface PopularItem {
  item_id: number;
  class_name: string;
  pick_pct: number;
  winrate_pct: number;
}

interface Hero {
  id: number;
  name: string;
  class_name: string;
  player_selectable: boolean;
  disabled: boolean;
  in_development?: boolean;
  development_state?: string;
  tags?: string[];
  hero_type?: string;
  gender?: string;
  complexity?: number;

  description?: {
    lore?: string;
  };

  images?: {
    icon_hero_card?: string;
    icon_hero_card_webp?: string;
    background_image?: string;
    background_image_webp?: string;
    top_bar_vertical_image?: string;
  };

  starting_stats?: Record<string, StatValue>;

  level_info?: Record<
    string,
    {
      required_gold?: number;
      use_standard_upgrade?: boolean;
      bonus_currencies?: string[];
    }
  >;

  popular_items?: {
    early_game?: PopularItem[];
    mid_game?: PopularItem[];
    late_game?: PopularItem[];
    timestamp?: number;
  };

  items?: Record<string, string>;
}

async function getHeroes(): Promise<Hero[]> {
  const response = await fetch(API_URL, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Deadlock heroes");
  }

  return response.json();
}

function formatName(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/^E/, "");
}

function formatValue(value: number) {
  return Number.isInteger(value)
    ? value.toLocaleString()
    : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-purple-500/40">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-white">{value}</p>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-7">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-purple-400">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
        {title}
      </h2>
    </div>
  );
}

function ItemGroup({
  title,
  items,
}: {
  title: string;
  items: PopularItem[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
        {title}
      </h3>

      {items.length === 0 ? (
        <p className="text-sm text-gray-600">No data available.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.item_id}
              className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.025] p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-200">
                  {formatName(item.class_name.replace(/^upgrade_/, ""))}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Pick rate {item.pick_pct.toFixed(1)}%
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-purple-300">
                  {item.winrate_pct.toFixed(1)}%
                </p>
                <p className="text-[10px] text-gray-500">Win rate</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function HeroDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const heroId = Number(slug);

  if (!Number.isInteger(heroId)) {
    notFound();
  }

  const heroes = await getHeroes();
  const hero = heroes.find((item) => item.id === heroId);

  if (!hero) {
    notFound();
  }

  const heroRender =
    hero.images?.icon_hero_card ||
    hero.images?.icon_hero_card_webp;

  const background =
    hero.images?.background_image_webp ||
    hero.images?.background_image;

  const stats = Object.entries(hero.starting_stats || {});

  const statGroups = [
    {
      title: "Health & Vitality",
      keys: [
        "max_health",
        "base_health_regen",
        "ooc_health_regen",
        "stamina",
        "stamina_regen_per_second",
        "crit_damage_received_scale",
      ],
    },
    {
      title: "Movement",
      keys: [
        "max_move_speed",
        "sprint_speed",
        "crouch_speed",
        "move_acceleration",
        "ground_dash_distance_in_meters",
        "ground_dash_duration",
        "air_dash_distance_in_meters",
        "air_dash_duration",
      ],
    },
    {
      title: "Weapon & Melee",
      keys: [
        "weapon_power",
        "weapon_power_scale",
        "light_melee_damage",
        "heavy_melee_damage",
        "reload_speed",
        "proc_build_up_rate_scale",
      ],
    },
    {
      title: "Ability & Spirit",
      keys: [
        "ability_resource_max",
        "ability_resource_regen_per_second",
        "tech_duration",
        "tech_range",
      ],
    },
  ];

  const levelEntries = Object.entries(hero.level_info || {}).sort(
    ([a], [b]) => Number(a) - Number(b)
  );

  const popularItems = hero.popular_items;

  return (
    <main className="min-h-screen bg-[#08080b] text-white">

      {/* HERO HEADER */}

      <section className="relative min-h-[650px] overflow-hidden">
        {background && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${background})` }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-[#08080b] via-[#08080b]/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080b] via-transparent to-[#08080b]/40" />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-7">
          <a href="/" className="text-lg font-bold tracking-wider">
            DEADLOCK <span className="text-purple-500">CODEX</span>
          </a>

          <a
            href="/heroes"
            className="text-sm text-gray-400 transition hover:text-white"
          >
            ← All Heroes
          </a>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-8 px-6 pb-16 pt-10 md:grid-cols-2">

          {/* HERO IMAGE */}

          <div className="relative flex h-[450px] items-center justify-center md:h-[540px]">
            {heroRender && (
              <img
                src={heroRender}
                alt={hero.name}
                className="relative z-10 h-full w-full object-contain object-bottom drop-shadow-[0_0_45px_rgba(139,92,246,0.15)]"
              />
            )}
          </div>

          {/* HERO DETAILS */}

          <div className="max-w-xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-purple-400">
              Deadlock Hero
            </p>

            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              {hero.name}
            </h1>

            <p className="mt-4 text-sm text-gray-400">
              {formatName(hero.hero_type || "Hero")} 
              {hero.gender && ` · ${formatName(hero.gender)}`}
              {hero.complexity != null &&
                ` · Complexity ${hero.complexity}`}
            </p>

            {/* TAGS */}

            {hero.tags && hero.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {hero.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs text-purple-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* QUICK STATS */}

            <div className="mt-8 grid grid-cols-2 gap-3">
              <StatCard
                label="Base Health"
                value={
                  hero.starting_stats?.max_health?.value ?? "—"
                }
              />

              <StatCard
                label="Move Speed"
                value={
                  hero.starting_stats?.max_move_speed?.value ?? "—"
                }
              />

              <StatCard
                label="Light Melee"
                value={
                  hero.starting_stats?.light_melee_damage?.value ?? "—"
                }
              />

              <StatCard
                label="Heavy Melee"
                value={
                  hero.starting_stats?.heavy_melee_damage?.value ?? "—"
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* PAGE CONTENT */}

      <div className="mx-auto max-w-7xl space-y-20 px-6 py-16">

        {/* HERO LORE */}

        <section>
          <SectionHeading eyebrow="Background" title="Hero Lore" />

          <div
            className="max-w-4xl text-sm leading-8 text-gray-400"
            dangerouslySetInnerHTML={{
              __html: hero.description?.lore || "Lore coming soon.",
            }}
          />
        </section>

        {/* ALL STARTING STATS */}

        <section>
          <SectionHeading
            eyebrow="Hero Attributes"
            title="Base Statistics"
          />

          <div className="space-y-10">
            {statGroups.map((group) => {
              const groupStats = group.keys
                .map((key) => ({
                  key,
                  stat: hero.starting_stats?.[key],
                }))
                .filter(
                  (entry) => entry.stat?.value !== undefined
                );

              if (groupStats.length === 0) return null;

              return (
                <div key={group.title}>
                  <h3 className="mb-4 text-sm font-semibold text-gray-400">
                    {group.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {groupStats.map(({ key, stat }) => (
                      <StatCard
                        key={key}
                        label={formatName(key)}
                        value={formatValue(stat!.value!)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ADDITIONAL API STATS */}

          <details className="mt-8 rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <summary className="cursor-pointer text-sm font-semibold text-gray-300 hover:text-white">
              View all raw starting statistics
            </summary>

            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
              {stats.map(([key, stat]) => (
                <StatCard
                  key={key}
                  label={formatName(key)}
                  value={
                    stat.value !== undefined
                      ? formatValue(stat.value)
                      : "—"
                  }
                />
              ))}
            </div>
          </details>
        </section>

        {/* POPULAR BUILDS */}

        <section>
          <SectionHeading
            eyebrow="Community Data"
            title="Popular Builds"
          />

          <p className="mb-8 text-sm text-gray-500">
            Popular items and their recorded pick and win rates.
            These are API identifiers converted into readable names.
          </p>

          <div className="grid gap-10 lg:grid-cols-3">
            <ItemGroup
              title="Early Game"
              items={popularItems?.early_game || []}
            />

            <ItemGroup
              title="Mid Game"
              items={popularItems?.mid_game || []}
            />

            <ItemGroup
              title="Late Game"
              items={popularItems?.late_game || []}
            />
          </div>
        </section>

        {/* LEVEL PROGRESSION */}

        <section>
          <SectionHeading
            eyebrow="Progression"
            title="Level Progression"
          />

          <p className="mb-6 text-sm text-gray-500">
            Souls required to reach each level, as provided by the hero API.
          </p>

          <div className="overflow-hidden rounded-xl border border-white/10">
            <div className="grid grid-cols-3 border-b border-white/10 bg-white/[0.04] px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <span>Level</span>
              <span>Required Souls</span>
              <span>Upgrade</span>
            </div>

            <div className="max-h-[480px] overflow-y-auto">
              {levelEntries.map(([level, info]) => (
                <div
                  key={level}
                  className="grid grid-cols-3 border-b border-white/[0.05] px-5 py-3 text-sm last:border-0 hover:bg-white/[0.03]"
                >
                  <span className="font-semibold text-white">
                    Level {level}
                  </span>

                  <span className="text-gray-300">
                    {info.required_gold?.toLocaleString() ?? "—"}
                  </span>

                  <span className="text-gray-500">
                    {info.bonus_currencies
                      ?.map(formatName)
                      .join(", ") || "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HERO API INFORMATION */}

        <section>
          <SectionHeading
            eyebrow="Technical Information"
            title="Hero Information"
          />

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatCard label="Hero ID" value={hero.id} />
            <StatCard
              label="Class Name"
              value={hero.class_name}
            />
            <StatCard
              label="Development"
              value={hero.development_state || "Unknown"}
            />
            <StatCard
              label="Complexity"
              value={hero.complexity ?? "—"}
            />
          </div>

          {hero.items && (
            <details className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <summary className="cursor-pointer text-sm font-semibold text-gray-300 hover:text-white">
                View hero item and ability identifiers
              </summary>

              <div className="mt-5 space-y-3">
                {Object.entries(hero.items).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex flex-wrap justify-between gap-2 border-b border-white/[0.05] pb-3 text-sm"
                  >
                    <span className="text-gray-400">
                      {formatName(key)}
                    </span>
                    <span className="break-all text-purple-300">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </details>
          )}
        </section>

      </div>

      {/* FOOTER */}

      <footer className="border-t border-white/10 px-6 py-8 text-center">
        <p className="text-xs text-gray-600">
          DEADLOCK CODEX · HERO DATABASE
        </p>
      </footer>

    </main>
  );
}
