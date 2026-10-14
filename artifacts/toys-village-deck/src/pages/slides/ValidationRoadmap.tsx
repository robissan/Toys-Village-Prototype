export default function ValidationRoadmap() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-[var(--slide-bg)] text-[var(--slide-text)] font-body">
      <div className="absolute left-[6vw] top-[5vh] text-[1.5vw] font-semibold">
        Toy’s Village
      </div>
      <main className="h-full w-full px-[6vw] pb-[5vh] pt-[12vh]">
        <h2 className="max-w-[88vw] text-[4vw] font-extrabold leading-[1.08] tracking-[-0.04em] text-[var(--slide-primary)]">
          From prototype to a go/no-go
        </h2>
        <div className="mt-[4vh] grid grid-cols-3 gap-[2.5vw]">
          <section className="min-h-[36vh] rounded-[1.5vw] bg-[var(--slide-blue)] px-[2.2vw] py-[3vh]">
            <div className="mb-[2.2vh] h-[0.7vh] w-[4vw] rounded-full bg-[var(--slide-primary)]" />
            <p className="text-[2vw] font-medium leading-[1.3] text-[var(--slide-primary)]">
              Phase 1 (proposed, 2 weeks): define box-full, scan behavior,
              feedback and safety; compare sensors.
            </p>
          </section>
          <section className="min-h-[36vh] rounded-[1.5vw] bg-[var(--slide-green)] px-[2.2vw] py-[3vh]">
            <div className="mb-[2.2vh] h-[0.7vh] w-[4vw] rounded-full bg-[var(--slide-primary)]" />
            <p className="text-[2vw] font-medium leading-[1.3] text-[var(--slide-primary)]">
              Phase 2: build a focused physical–digital prototype; duration is
              unestimated.
            </p>
          </section>
          <section className="min-h-[36vh] rounded-[1.5vw] bg-[var(--slide-orange)] px-[2.2vw] py-[3vh]">
            <div className="mb-[2.2vh] h-[0.7vh] w-[4vw] rounded-full bg-[var(--slide-primary)]" />
            <p className="text-[2vw] font-medium leading-[1.3] text-[var(--slide-primary)]">
              Phase 3: run supervised, caregiver-consented sessions and
              recommend whether to continue.
            </p>
          </section>
        </div>
        <div className="mt-[4vh] grid grid-cols-[1fr_0.8fr] items-start gap-[4vw] border-t border-[var(--slide-blue)] pt-[3vh]">
          <p className="text-[2vw] font-semibold leading-[1.3] text-[var(--slide-primary)]">
            Proposed goal: evaluate the concept within a 6-week prototype
            effort.
          </p>
          <p className="text-[2vw] leading-[1.3] text-[var(--slide-muted)]">
            Later phase dates and ownership remain unknown.
          </p>
        </div>
      </main>
    </div>
  );
}
