import rawMissions from "@/data/missions.json";

export type Mission = {
  chapter: string;
  name: string;
  slug: string | null;
  optional: boolean;
  img: string | null;
  source_url: string;
  scraped_at: string;
  walkthrough_url?: string;
  mission_type?: string;
  given_by?: string | null;
  playable_as?: string;
  story_number?: number;
  description?: string;
};

const missions = rawMissions as Mission[];

export function getAllMissions(): Mission[] {
  return missions;
}

export function findMission(slug: string): Mission | undefined {
  return missions.find((m) => m.slug === slug);
}
