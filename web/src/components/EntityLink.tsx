import Link from "next/link";
import { entityHref, type EntityType } from "@/lib/entity-links";

// Drop-in replacement for writing a name as plain text: links it to the
// matching character/mission/region page when one exists on the site,
// otherwise renders the name as plain text. Use this instead of a
// one-off `someCondition ? <Link>...</Link> : name` in page components.
export default function EntityLink({ type, name }: { type: EntityType; name: string }) {
  const href = entityHref(type, name);
  if (!href) return <>{name}</>;
  return <Link href={href}>{name}</Link>;
}
