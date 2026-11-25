#!/usr/bin/env node
// Enforces the project's SEO rules (see CLAUDE.md "SEO Schema") on every
// src/app/**/page.tsx: a canonical tag and a BreadcrumbList. Runs as
// `prebuild` so a new page that forgets either one fails the build instead
// of silently shipping without it.
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const APP_DIR = path.join(ROOT, "src/app");

function findPageFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findPageFiles(full, out);
    } else if (entry.name === "page.tsx") {
      out.push(full);
    }
  }
  return out;
}

const homeFile = path.join(APP_DIR, "page.tsx");
const layoutFile = path.join(APP_DIR, "layout.tsx");
const pageFiles = findPageFiles(APP_DIR);

const problems = [];

for (const file of pageFiles) {
  const rel = path.relative(ROOT, file);
  const content = fs.readFileSync(file, "utf8");

  // Home has no metadata export of its own -- its canonical lives on the
  // root layout, checked separately below.
  if (file !== homeFile && !content.includes("canonical(")) {
    problems.push(
      `${rel}: missing alternates.canonical -- import { canonical } from "@/lib/seo" and add alternates: canonical("/your-path") to its metadata`
    );
  }

  if (!content.includes("breadcrumbSchema(")) {
    problems.push(
      `${rel}: missing <JsonLd data={breadcrumbSchema([...])} /> -- every page needs at least a BreadcrumbList (see CLAUDE.md "SEO Schema")`
    );
  }
}

const layoutContent = fs.readFileSync(layoutFile, "utf8");
if (!layoutContent.includes("canonical(")) {
  problems.push(`src/app/layout.tsx: missing alternates.canonical for the home page`);
}

if (problems.length > 0) {
  console.error(`\nSEO check failed -- ${problems.length} issue(s):\n`);
  for (const p of problems) console.error(`  - ${p}`);
  console.error(`\nSee CLAUDE.md "SEO Schema" section.\n`);
  process.exit(1);
}

console.log(`SEO check passed: ${pageFiles.length} pages all have canonical + breadcrumb schema.`);
