import rawCharacters from "@/data/characters.json";

export type Character = {
  sector: string;
  name: string;
  role: string;
  body: string;
  image: string | null;
  imageCaption: string | null;
};

const characters = rawCharacters as Character[];

export function characterSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getAllCharacters(): Character[] {
  return characters;
}

export function findCharacter(slug: string): Character | undefined {
  return characters.find((c) => characterSlug(c.name) === slug);
}

// Real, per-character screenshots from GTA BOOM's cast roundup wherever one
// exists. The two with no confirmed photo yet (Lori, DWNPLY) fall back to
// one of our own trailer stills each, used once, with an honest caption
// instead of a false character match.
const FALLBACK_IMG: Record<string, { file: string; caption: string }> = {
  Lori: { file: "biplane-beach-stunt", caption: "No confirmed photo yet — Keys coastline, from the trailers" },
  DWNPLY: { file: "nightclub-crowd", caption: "No confirmed photo yet — Vice City nightlife, from the trailers" },
};

export function imageFor(c: Pick<Character, "name" | "image" | "imageCaption">) {
  if (c.image) return { src: c.image, caption: c.imageCaption ?? "", external: true };
  const fb = FALLBACK_IMG[c.name];
  return { src: `/images/trailer-stills/${fb.file}.jpg`, caption: fb.caption, external: false };
}
