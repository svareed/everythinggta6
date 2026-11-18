"use client";

import Script from "next/script";

export default function LiveFeed() {
  return (
    <div className="live-feed">
      <a
        className="twitter-timeline"
        data-height="600"
        data-theme="dark"
        data-chrome="noheader nofooter noborders transparent"
        href="https://twitter.com/search?q=%23GTA6&src=typed_query&f=live"
      >
        Live posts tagged #GTA6
      </a>
      <Script src="https://platform.twitter.com/widgets.js" strategy="lazyOnload" />
    </div>
  );
}
