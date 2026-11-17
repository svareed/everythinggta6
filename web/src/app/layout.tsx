import type { Metadata } from "next";
import { Anton, Inter, JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

const anton = Anton({ variable: "--font-anton", weight: "400", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const bodySerif = Source_Serif_4({ variable: "--font-serif", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vice City Dispatch — The GTA6 Hub",
  description:
    "News, leaks, guides, characters, map, vehicles and trailer breakdowns for Grand Theft Auto VI, counting down to the November 19, 2026 launch.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${inter.variable} ${bodySerif.variable} ${mono.variable}`}
    >
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
