export default function TwoGames() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-[var(--slide-bg)] text-[var(--slide-text)] font-body">
      <div className="absolute left-[6vw] top-[5vh] text-[1.5vw] font-semibold">
        Toy’s Village
      </div>
      <main className="h-full w-full px-[6vw] pb-[7vh] pt-[12vh]">
        <h2 className="max-w-[84vw] text-[4vw] font-extrabold leading-[1.08] tracking-[-0.04em] text-[var(--slide-primary)]">
          Two games, one physical tidy-up
        </h2>
        <div className="mt-[5vh] grid grid-cols-2 gap-[5vw]">
          <section className="relative pl-[2vw]">
            <div className="absolute bottom-[1vh] left-0 top-[1vh] w-[0.8vw] rounded-full bg-[var(--slide-blue)]" />
            <ul className="flex list-disc flex-col gap-[4vh] pl-[2vw] text-[2.1vw] leading-[1.35] text-[var(--slide-muted)] marker:text-[var(--slide-primary)]">
              <li>
                Time Game: begin in silence; each returning toy adds its
                assigned instrument.
              </li>
              <li>
                The beat speeds up gently; a full set triggers an item count
                and celebration.
              </li>
            </ul>
          </section>
          <section className="relative pl-[2vw]">
            <div className="absolute bottom-[1vh] left-0 top-[1vh] w-[0.8vw] rounded-full bg-[var(--slide-green)]" />
            <ul className="flex list-disc flex-col gap-[4vh] pl-[2vw] text-[2.1vw] leading-[1.35] text-[var(--slide-muted)] marker:text-[var(--slide-primary)]">
              <li>
                Color Game: hear a color, scan a toy, then accept a match or
                offer a gentle retry prompt.
              </li>
            </ul>
          </section>
        </div>
        <p className="mt-[7vh] border-t border-[var(--slide-orange)] pt-[4vh] text-[2.3vw] font-semibold leading-[1.3] text-[var(--slide-primary)]">
          Both keep physical toy-handling at the center.
        </p>
      </main>
    </div>
  );
}
