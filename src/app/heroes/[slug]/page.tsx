
import { notFound } from "next/navigation";
import { ChevronsUpDown, ExternalLink, Trophy } from "lucide-react";

export const instant = false;

const API_URL = "https://api.deadlock-api.com/v1/assets/heroes";

const LEADERBOARD_REGIONS = [
  { label: "Europe", value: "Europe" },
  { label: "Asia", value: "Asia" },
  { label: "North America", value: "NAmerica" },
  { label: "South America", value: "SAmerica" },
  { label: "Oceania", value: "Oceania" },
] as const;

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

interface GameItem {
  id: number;
  class_name: string;
  name: string;
  image?: string;
  image_webp?: string;
  shop_image?: string;
  shop_image_webp?: string;
  cost?: number;
  item_slot_type?: string;
  item_tier?: number;
}

interface LeaderboardEntry {
  account_name?: string | null;
  possible_account_ids?: number[];
  rank?: number | null;
}

interface Leaderboard {
  entries: LeaderboardEntry[];
}

interface SteamProfile {
  account_id: number;
  personaname: string;
  profileurl: string;
  avatarmedium: string;
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

async function getHero(heroId: number): Promise<Hero | null> {
  const response = await fetch(`${API_URL}/${heroId}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch Deadlock hero");
  }

  return response.json();
}

async function getItems(): Promise<GameItem[]> {
  const response = await fetch(
    "https://api.deadlock-api.com/v1/assets/items",
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch items");
  }

  const items = await response.json();

  return Array.isArray(items) ? items : [];
}

async function getHeroLeaderboard(
  region: (typeof LEADERBOARD_REGIONS)[number]["value"],
  heroId: number
): Promise<Leaderboard | null> {
  try {
    const response = await fetch(
      `https://api.deadlock-api.com/v1/leaderboard/${region}/${heroId}`,
      { next: { revalidate: 3600 } }
    );

    return response.ok ? response.json() : null;
  } catch {
    return null;
  }
}

async function getSteamProfiles(
  accountIds: number[]
): Promise<Record<number, SteamProfile>> {
  if (accountIds.length === 0) {
    return {};
  }

  try {
    const response = await fetch(
      `https://api.deadlock-api.com/v1/players/steam?account_ids=${accountIds.join(",")}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      return {};
    }

    const profiles: SteamProfile[] = await response.json();

    return Object.fromEntries(
      profiles.map((profile) => [profile.account_id, profile])
    );
  } catch {
    return {};
  }
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

function getSteamProfileUrl(possibleAccountIds?: number[]) {
  const accountId = possibleAccountIds?.[0];

  if (accountId === undefined || !Number.isInteger(accountId)) {
    return null;
  }

  const steamId64 = BigInt("76561197960265728") + BigInt(accountId);

  return `https://steamcommunity.com/profiles/${steamId64}`;
}

function getRankBadgeUrl(rank?: number | null) {
  if (rank == null) {
    return null;
  }

  const tier = Math.floor(rank / 10);
  const subrank = rank % 10;

  if (tier < 1 || subrank < 1 || subrank > 6) {
    return null;
  }

  return `https://api.deadlock-api.com/v1/assets/ranks/${tier}/${subrank}/image?format=webp`;
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
  gameItems,
}: {
  title: string;
  items: PopularItem[];
  gameItems: GameItem[];
}) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
          {title}
        </h3>
        <ChevronsUpDown
          size={16}
          aria-label="Scrollable item list"
          className="text-purple-400"
        />
      </div>

      <div className="max-h-[470px] space-y-3 overflow-y-auto pr-2">
        {items.map((item) => {
          const gameItem = gameItems.find(
            (entry) => entry.class_name === item.class_name
          );

          const image =
            gameItem?.shop_image_webp ||
            gameItem?.shop_image ||
            gameItem?.image_webp ||
            gameItem?.image;

          return (
            <div
              key={item.item_id}
              className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 transition hover:border-purple-500/40"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-black">
                {image ? (
                  <img
                    src={image}
                    alt={gameItem?.name || item.class_name}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-gray-600">?</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-200">
                  {gameItem?.name || formatName(item.class_name)}
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
          );
        })}
      </div>
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

  const [hero, gameItems] = await Promise.all([
    getHero(heroId),
    getItems(),
  ]);

  if (!hero) {
    notFound();
  }

  const leaderboardResponses = await Promise.all(
    LEADERBOARD_REGIONS.map(({ value }) => getHeroLeaderboard(value, heroId))
  );

  const leaderboardAccountIds = [
    ...new Set(
      leaderboardResponses.flatMap((leaderboard) =>
        leaderboard?.entries.flatMap(
          (entry) => entry.possible_account_ids || []
        ) || []
      )
    ),
  ];
  const steamProfiles = await getSteamProfiles(leaderboardAccountIds);

  const regionalLeaderboards = LEADERBOARD_REGIONS.map((region, index) => ({
    ...region,
    entries: leaderboardResponses[index]?.entries.slice(0, 5) || [],
  })).filter(({ entries }) => entries.length > 0);

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
            title="Popular Items"
          />

          <p className="mb-8 text-sm text-gray-500">
            Popular items and their recorded pick and win rates.
            These are API identifiers converted into readable names.
          </p>

          
          <div className="grid gap-10 lg:grid-cols-3">

  <ItemGroup
    title="Early Game"
    items={popularItems?.early_game || []}
    gameItems={gameItems}
  />

  <ItemGroup
    title="Mid Game"
    items={popularItems?.mid_game || []}
    gameItems={gameItems}
  />

  <ItemGroup
    title="Late Game"
    items={popularItems?.late_game || []}
    gameItems={gameItems}
  />
    </div>
        </section>

        {/* TOP PLAYERS */}

        <section>
          <SectionHeading eyebrow="Ranked Leaderboards" title="Top Players" />

          <p className="mb-8 text-sm text-gray-500">
            The top five ranked players for {hero.name} in each region. Leaderboards refresh hourly.
          </p>

          {regionalLeaderboards.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {regionalLeaderboards.map(({ label, entries }) => (
                <div
                  key={label}
                  className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]"
                >
                  <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
                    <Trophy size={15} className="text-purple-400" />
                    <h3 className="text-sm font-semibold text-gray-200">{label}</h3>
                  </div>

                  <ol className="divide-y divide-white/[0.06]">
                    {entries.map((player, index) => {
                      const steamProfile = player.possible_account_ids
                        ?.map((accountId) => steamProfiles[accountId])
                        .find((profile) => profile !== undefined);
                      const steamProfileUrl =
                        steamProfile?.profileurl ||
                        getSteamProfileUrl(player.possible_account_ids);
                      const rankBadgeUrl = getRankBadgeUrl(player.rank);
                      const playerName =
                        steamProfile?.personaname ||
                        player.account_name ||
                        "Unknown player";

                      return (
                        <li
                          key={`${player.account_name || "unknown"}-${index}`}
                          className="flex items-center gap-3 px-4 py-3"
                        >
                          <span className="w-5 text-xs font-bold text-purple-400">
                            #{index + 1}
                          </span>

                          {steamProfileUrl ? (
                            <a
                              href={steamProfileUrl}
                              target="_blank"
                              rel="noreferrer"
                              title={`Open ${playerName}'s Steam profile`}
                              className="group flex min-w-0 flex-1 items-center gap-1.5 text-sm text-gray-200 transition hover:text-purple-300"
                            >
                              {steamProfile?.avatarmedium ? (
                                <img
                                  src={steamProfile.avatarmedium}
                                  alt=""
                                  className="h-7 w-7 shrink-0 rounded-full"
                                />
                              ) : (
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-500/15 text-xs font-bold text-purple-300">
                                  {playerName.slice(0, 1).toUpperCase()}
                                </span>
                              )}
                              <span className="truncate">{playerName}</span>
                              <ExternalLink
                                size={12}
                                aria-hidden="true"
                                className="shrink-0 opacity-0 transition group-hover:opacity-100"
                              />
                            </a>
                          ) : (
                            <span className="flex min-w-0 flex-1 items-center gap-2 text-sm text-gray-400">
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5 text-xs font-bold text-gray-500">
                                {playerName.slice(0, 1).toUpperCase()}
                              </span>
                              <span className="truncate">{playerName}</span>
                            </span>
                          )}

                          {rankBadgeUrl ? (
                            <img
                              src={rankBadgeUrl}
                              alt={`Rank ${player.rank} badge`}
                              className="h-7 w-7 shrink-0 object-contain"
                            />
                          ) : (
                            <Trophy
                              size={16}
                              aria-label="Rank unavailable"
                              className="shrink-0 text-gray-600"
                            />
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-white/10 bg-white/[0.02] p-5 text-sm text-gray-500">
              Leaderboard data is currently unavailable for this hero.
            </p>
          )}
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
