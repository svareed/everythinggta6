export const SITE_URL = "https://www.everythinggta6.com";
export const SITE_NAME = "EverythingGTA6";

export function canonical(path: string) {
  return { canonical: `${SITE_URL}${path}` };
}

export type Crumb = { name: string; url: string };

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}

export function faqSchema(pairs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pairs.map((p) => ({
      "@type": "Question",
      name: p.question,
      acceptedAnswer: { "@type": "Answer", text: p.answer },
    })),
  };
}

export function articleSchema(opts: {
  headline: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    ...(opts.image ? { image: opts.image } : {}),
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
  };
}

export function videoGameSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: "Grand Theft Auto VI",
    alternateName: "GTA 6",
    url: SITE_URL,
    datePublished: "2026-11-19",
    gamePlatform: ["PlayStation 5", "Xbox Series X", "Xbox Series S"],
    publisher: { "@type": "Organization", name: "Rockstar Games" },
    author: { "@type": "Organization", name: "Rockstar Games" },
    genre: ["Action-adventure", "Open world"],
  };
}
