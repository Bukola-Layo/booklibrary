import type { Metadata } from "next";
import { Black_Ops_One, Roboto } from "next/font/google";
import "./globals.css";
import "./hero.css";

const blackOps = Black_Ops_One({ weight: "400", subsets: ["latin"], variable: "--font-black-ops" });
const roboto = Roboto({ weight: ["400", "500", "600", "700"], subsets: ["latin"], variable: "--font-roboto" });

export const metadata: Metadata = {
  title: "The Personal Curation",
  description: "A curated shelf of editions, field notes and essential reads.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${blackOps.variable} ${roboto.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
