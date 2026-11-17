"use client";

import { useEffect, useRef } from "react";

// Comment threads via giscus (GitHub Discussions) -- one thread per page
// path. Requires the giscus GitHub App to be installed on
// svareed/everythinggta6 (https://github.com/apps/giscus); until that's
// done, giscus shows its own "not installed" notice here instead of a
// broken page.
export default function Comments() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.querySelector("script")) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", "svareed/everythinggta6");
    script.setAttribute("data-repo-id", "R_kgDOVxTLyQ");
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDOVxTLyc4DLXhE");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "dark_dimmed");
    script.setAttribute("data-lang", "en");
    el.appendChild(script);
  }, []);

  return (
    <section className="section" style={{ paddingBlock: "8px 48px" }}>
      <div className="section-head">
        <h2>Discussion</h2>
      </div>
      <div ref={ref} />
    </section>
  );
}
