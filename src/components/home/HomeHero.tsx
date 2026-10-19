

export default function HomeHero() {
  return (
    <section aria-label="Hero promotion" className="px-4 py-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#0c2340] sm:rounded-[2.5rem]">
        {/* Background Image/Illustration (using placeholder logic to keep it simple, or our asset) */}
        <div className="absolute inset-0 z-0 flex items-center justify-end">
          {/* We will just use a generic gradient and shape here to simulate the right side art */}
          <div className="w-1/2 h-full bg-gradient-to-l from-blue-500/20 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex min-h-[280px] items-center px-8 sm:min-h-[360px] md:px-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
              Play Thousands
              <br />
              <span className="text-[#38bdf8]">of Free Online Games</span>
            </h1>

            <p className="mt-4 max-w-lg text-lg text-slate-300">
              Action, Adventure, Puzzle, Racing and more.
              <br />
              Play instantly in your browser!
            </p>

            <div className="mt-8">
              <a
                href="#explore-games"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-base font-bold text-white transition-colors hover:bg-blue-700"
              >
                <span>Explore Games</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Carousel Indicators (Dots) */}
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 z-10">
          <button className="h-2 w-8 rounded-full bg-white"></button>
          <button className="h-2 w-2 rounded-full bg-white/40"></button>
          <button className="h-2 w-2 rounded-full bg-white/40"></button>
        </div>
      </div>
    </section>
  );
}
