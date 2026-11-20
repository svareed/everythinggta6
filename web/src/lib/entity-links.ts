// Reusable "does this name point at a real page on this site" lookups, so
// any new page can auto-link a mentioned character/mission/region by name
// instead of hand-writing a one-off Link per page. Add a new entity type
// here (vehicles, outlets, etc.) as the site grows, rather than
// re-implementing this pattern inline in a page component.
import { characterSlug, findCharacter } from "@/lib/characters";
import { findMission, getAllMissions } from "@/lib/missions";
import { findRegion, REGIONS } from "@/lib/maps";

export type EntityType = "character" | "mission" | "region";

export function entityHref(type: EntityType, name: string): string | undefined {
  switch (type) {
    case "character": {
      const slug = characterSlug(name);
      return findCharacter(slug) ? `/characters/${slug}` : undefined;
    }
    case "mission": {
      const match = getAllMissions().find((m) => m.name.toLowerCase() === name.toLowerCase());
      return match?.slug ? `/missions/${match.slug}` : undefined;
    }
    case "region": {
      const match = REGIONS.find((r) => r.name.toLowerCase() === name.toLowerCase());
      return match ? `/maps/${match.slug}` : undefined;
    }
    default:
      return undefined;
  }
}

export function characterHref(name: string): string | undefined {
  return entityHref("character", name);
}

export function missionHref(slugOrName: string): string | undefined {
  const bySlug = findMission(slugOrName);
  if (bySlug?.slug) return `/missions/${bySlug.slug}`;
  return entityHref("mission", slugOrName);
}

export function regionHref(name: string): string | undefined {
  const bySlug = findRegion(name);
  if (bySlug) return `/maps/${bySlug.slug}`;
  return entityHref("region", name);
}
