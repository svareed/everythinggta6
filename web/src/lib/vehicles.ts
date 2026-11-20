import rawVehicles from "@/data/vehicles.json";

export type Vehicle = {
  name: string;
  manufacturer: string | null;
  class: string;
  based_on: string | null;
  ratings: Record<string, number> | null;
  img: string | null;
  detail_url: string;
  source_url: string;
  scraped_at: string;
};

const vehicles = rawVehicles as Vehicle[];

export function vehicleSlug(v: Pick<Vehicle, "detail_url">): string {
  return v.detail_url.split("/").filter(Boolean).pop() ?? "";
}

export function getAllVehicles(): Vehicle[] {
  return vehicles;
}

export function findVehicle(slug: string): Vehicle | undefined {
  return vehicles.find((v) => vehicleSlug(v) === slug);
}

export function getVehicleClasses(): string[] {
  const seen = new Set<string>();
  const order: string[] = [];
  for (const v of vehicles) {
    if (!seen.has(v.class)) {
      seen.add(v.class);
      order.push(v.class);
    }
  }
  return order;
}
