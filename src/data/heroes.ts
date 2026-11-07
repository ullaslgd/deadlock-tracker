
export type Hero = {
  name: string;
  slug: string;
  role: string;
  description: string;
  portrait: string;
  banner: string;
  abilities: {
    name: string;
    description: string;
    icon: string;
  }[];
};

export const heroes: Hero[] = [
  {
    name: "Celeste",
    slug: "celeste",
    role: "Spirit / Damage",
    description: "A hero who uses powerful light-based abilities.",
    portrait: "/images/hero-portraits/celeste.jpg",
    banner: "/images/hero-portraits/celeste.jpg",
    abilities: [
      {
        name: "Ability 1",
        description: "Ability information will be added here.",
        icon: "",
      },
      {
        name: "Ability 2",
        description: "Ability information will be added here.",
        icon: "",
      },
      {
        name: "Ability 3",
        description: "Ability information will be added here.",
        icon: "",
      },
      {
        name: "Ultimate",
        description: "Ultimate information will be added here.",
        icon: "",
      },
    ],
  },
  {
    name: "Paige",
    slug: "paige",
    role: "Damage / Support",
    description: "Hero information coming soon.",
    portrait: "/images/hero-portraits/paige.jpg",
    banner: "/images/hero-portraits/paige.jpg",
    abilities: [],
  },
  {
    name: "Graves",
    slug: "graves",
    role: "Hero",
    description: "Hero information coming soon.",
    portrait: "/images/hero-portraits/graves.jpg",
    banner: "/images/hero-portraits/graves.jpg",
    abilities: [],
  },
];

export function getHero(slug: string) {
  return heroes.find((hero) => hero.slug === slug);
}
