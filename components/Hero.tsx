import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex flex-col sm:flex-row items-center gap-8 py-8">
      <div className="flex-1">
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-chalk leading-[1.05]">
          JOIN THE CONVERSATION
          <br />
          AROUND EVERY GAME
        </h1>
        <p className="text-chalk-dim mt-4 max-w-md">
          Real fans. Real opinions. All in one place. Discuss games, share
          takes, and connect with the sports community.
        </p>
        <Link
          href="/post/new"
          className="inline-block mt-6 bg-signal-orange text-court-bg font-semibold px-5 py-2.5 rounded-card hover:opacity-90 transition-opacity"
        >
          Join the Conversation
        </Link>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <div className="absolute w-20 h-20 rounded-full border-2 border-signal-orange/40 -translate-x-10 -translate-y-6" />
          <div className="absolute w-16 h-16 rounded-full border-2 border-signal-blue/40 translate-x-8 translate-y-10" />
          <svg width="56" height="56" viewBox="0 0 24 24" className="text-chalk-dim">
            <path
              fill="currentColor"
              d="M20 2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3l3 3v-3h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"
              opacity="0.15"
            />
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              d="M20 2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3l3 3v-3h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
