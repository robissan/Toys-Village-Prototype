export default function MeasureExperience() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-[var(--slide-bg)] text-[var(--slide-text)] font-body">
      <div className="absolute left-[6vw] top-[5vh] text-[1.5vw] font-semibold">
        Toy’s Village
      </div>
      <main className="h-full w-full px-[6vw] pb-[6vh] pt-[12vh]">
        <h2 className="max-w-[88vw] text-[4vw] font-extrabold leading-[1.08] tracking-[-0.04em] text-[var(--slide-primary)]">
          Measure the experience—not assumptions
        </h2>
        <div className="mt-[4vh] grid h-[66vh] grid-cols-2 gap-x-[5vw] gap-y-[2.5vh]">
          <ul className="flex list-disc flex-col gap-[2.6vh] pl-[2.4vw] text-[2vw] leading-[1.3] text-[var(--slide-muted)] marker:text-[var(--slide-primary)]">
            <li>
              Proposed baseline: 3 sessions measuring toy completion, adult
              prompts and comprehension.
            </li>
            <li>
              Draft targets: at least 70% of designated toys returned; no more
              than 2 adult prompts per session.
            </li>
            <li>
              Draft target: at least 80% of prompts followed without
              explanation.
            </li>
          </ul>
          <ul className="flex list-disc flex-col gap-[2.6vh] pl-[2.4vw] text-[2vw] leading-[1.3] text-[var(--slide-muted)] marker:text-[var(--slide-primary)]">
            <li>
              Technical goal: at least 90% toy-detection accuracy across 6+
              consented child sessions.
            </li>
            <li>
              Compare color scans with an agreed test set, including ambiguous
              colors.
            </li>
            <li>
              Targets are proposed, not measured; keep routine logs free of
              identifying child information.
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
