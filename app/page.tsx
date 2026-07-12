import Hero from "@/components/Hero";
import FeaturedGames from "@/components/FeaturedGames";
import LeagueCards from "@/components/LeagueCards";
import TrendingDiscussions from "@/components/TrendingDiscussions";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <FeaturedGames />
      <LeagueCards />
      <TrendingDiscussions />
    </div>
  );
}
