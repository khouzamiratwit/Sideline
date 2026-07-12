import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-court-line bg-court-panel mt-10">
      <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
        <div>
          <div className="font-display font-extrabold text-lg text-chalk mb-1">SIDELINE</div>
          <p className="text-chalk-dim text-xs">
            The conversation around every game.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-chalk-dim text-xs font-semibold mb-1">EXPLORE</span>
          <Link href="/" className="text-chalk-dim hover:text-signal-orange">Home</Link>
          <Link href="/games" className="text-chalk-dim hover:text-signal-orange">Games</Link>
          <Link href="/leagues" className="text-chalk-dim hover:text-signal-orange">Leagues</Link>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-chalk-dim text-xs font-semibold mb-1">COMMUNITY</span>
          <Link href="/" className="text-chalk-dim hover:text-signal-orange">Trending</Link>
          <Link href="/" className="text-chalk-dim hover:text-signal-orange">Latest Discussions</Link>
          <Link href="/" className="text-chalk-dim hover:text-signal-orange">Top Users</Link>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-chalk-dim text-xs font-semibold mb-1">COMPANY</span>
          <Link href="/" className="text-chalk-dim hover:text-signal-orange">About</Link>
          <Link href="/" className="text-chalk-dim hover:text-signal-orange">Contact</Link>
          <Link href="/" className="text-chalk-dim hover:text-signal-orange">Privacy Policy</Link>
        </div>
      </div>
      <div className="border-t border-court-line text-center text-xs text-chalk-dim py-3">
        © 2026 Sideline. All rights reserved.
      </div>
    </footer>
  );
}
