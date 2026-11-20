export type Region = {
  slug: string;
  sector: string;
  name: string;
  status: string;
  body: string;
  getThere: string | null;
  img: string | null; // trailer-still fallback, used when onOfficialMap is false
  onOfficialMap: boolean;
  mystery?: boolean;
};

// The official map poster Rockstar released on launch day (2026-11-19),
// mirrored locally from RockstarINTEL's coverage — see maps.py and the
// citation on /guides/map-of-leonida. Confirms every region below except
// the still-unconfirmed seventh one.
export const OFFICIAL_MAP_IMG = "/images/maps/Leonida_Map_Poster.jpg";
export const OFFICIAL_MAP_SOURCE = "https://rockstarintel.com/full-gta-vi-map-officially-revealed/";

export const REGIONS: Region[] = [
  {
    slug: "vice-city",
    sector: "SECTOR 01",
    name: "Vice City",
    status: "Confirmed",
    body: "The neon core — downtown towers, beachfront strips, nightlife. On the official map it sits in Vice-Dale County, with Vice Beach across the water to the east.",
    getThere:
      "Vice City sits on the official map around Interstate 397 and Route 97, right next to Vice City International Airport (VCIA). Vice Beach is the separate peninsula just east of it, across the bay.",
    img: "nightclub-crowd",
    onOfficialMap: true,
  },
  {
    slug: "port-gellhorn",
    sector: "SECTOR 02",
    name: "Port Gellhorn",
    status: "Confirmed",
    body: "Rusted, working-class counterpoint to Vice City's gloss. Sits on Leonida's west coast, in Kelly County.",
    getThere:
      "On the official map, Port Gellhorn is the west-coast town reached via Route 404, across the water (Draper Bay) from Draper Island. Gellhorn and the Gellhorn Raceway sit just south of it on the same stretch of coast.",
    img: "red-shootout",
    onOfficialMap: true,
  },
  {
    slug: "the-keys",
    sector: "SECTOR 03",
    name: "The Keys",
    status: "Confirmed",
    body: "Island-hopping territory — boats matter more than cars here. The official map doesn't print the words \"Leonida Keys,\" but the island chain south of Mariana County (Key Lento, Southwind, Mile Zero Air Station, Riquezas Keys) is exactly that stretch.",
    getThere:
      "Head south from Mariana County/Hamlet along Route 1A, which island-hops the whole chain down to Key Lento, then on to Southwind and Mile Zero Air Station at the southern tip.",
    img: "dock-seaplane",
    onOfficialMap: true,
  },
  {
    slug: "ambrosia",
    sector: "SECTOR 04",
    name: "Ambrosia",
    status: "Confirmed",
    body: "A town in Leonard County, inland from the coast near Lake Leonida.",
    getThere:
      "On the official map, Ambrosia sits just off Route 35, near the Ambrosia Raceway Park and Thrillbilly Mud Club landmarks, a short drive north of Vice-Dale County.",
    img: "skyscraper-climb",
    onOfficialMap: true,
  },
  {
    slug: "grassrivers",
    sector: "SECTOR 05",
    name: "Grassrivers",
    status: "Confirmed",
    body: 'Everglades-style wetland county in Leonida\'s southwest, where Bigfoot (the "Skunk Ape") roams — see our launch-day discoveries.',
    getThere:
      "On the official map, Grassrivers sits southwest of Kelly County, near Watson Bay and Pelican Valley, reachable via Route 82 past Breakwater Quarry.",
    img: null,
    onOfficialMap: true,
  },
  {
    slug: "mount-kalaga-national-park",
    sector: "SECTOR 06",
    name: "Mount Kalaga National Park",
    status: "Confirmed",
    body: "A protected wilderness area inside Lummox County, in Leonida's north.",
    getThere:
      "On the official map, it's the forested high ground in the middle of Lummox County, reached via Route 628 or Interstate 297 heading north from Kelly County.",
    img: null,
    onOfficialMap: true,
  },
  {
    slug: "rumored-region",
    sector: "SECTOR ??",
    name: "??? Rumored Region",
    status: "Unconfirmed",
    body: "Dataminers kept pointing at a fourth zone before launch. The official map released on launch day shows Lummox, Leonard, Kelly, Vice-Dale, Mariana, and Hamlet, with nothing matching this rumor — we're leaving it listed as unconfirmed/likely debunked rather than deleting the history.",
    getThere: null,
    img: "crystal-shop",
    onOfficialMap: false,
    mystery: true,
  },
];

export function findRegion(slug: string): Region | undefined {
  return REGIONS.find((r) => r.slug === slug);
}
