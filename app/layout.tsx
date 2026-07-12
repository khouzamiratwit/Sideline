import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ScoreboardTicker from "@/components/ScoreboardTicker";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Sideline — Sports Discussion",
  description: "Live scores meet real discussion. NBA, World Cup, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body min-h-screen flex flex-col">
        <Navbar />
        <ScoreboardTicker />
        <main className="max-w-4xl mx-auto px-4 py-6 flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
