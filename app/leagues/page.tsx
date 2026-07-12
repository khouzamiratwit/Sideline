import LeagueCards from "@/components/LeagueCards";

export default function LeaguesIndexPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-display font-extrabold text-3xl text-chalk">LEAGUES</h1>
        <p className="text-chalk-dim text-sm mt-1">
          Pick a league to see its scores, threads, and community.
        </p>
      </div>
      <LeagueCards hideHeader />
    </div>
  );
}
