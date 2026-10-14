export default function WhyPlayful() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-[var(--slide-bg)] text-[var(--slide-text)] font-body">
      <div className="absolute left-[6vw] top-[5vh] text-[1.5vw] font-semibold">
        Toy’s Village
      </div>
      <main className="h-full w-full px-[6vw] pb-[6vh] pt-[12vh]">
        <h2 className="max-w-[80vw] text-[4vw] font-extrabold leading-[1.08] tracking-[-0.04em] text-[var(--slide-primary)]">
          Why make tidy-up playful?
        </h2>
        <div className="mt-[5vh] grid h-[62vh] grid-cols-[0.82fr_1.18fr] gap-[4vw]">
          <div className="flex flex-col justify-center rounded-[1.5vw] bg-[var(--slide-green)] px-[3vw] py-[4vh]">
            <p className="text-[2vw] font-semibold text-[var(--slide-muted)]">
              Amelie
            </p>
            <p className="mt-[1vh] text-[4.5vw] font-extrabold leading-[1.05] tracking-[-0.04em] text-[var(--slide-primary)]">
              <span className="block">“Master of</span>
              <span className="block">Disaster”</span>
            </p>
          </div>
          <ul className="flex list-disc flex-col justify-center gap-[4vh] pl-[2.5vw] text-[2.2vw] leading-[1.32] text-[var(--slide-muted)] marker:text-[var(--slide-primary)]">
            <li>
              Amelie (“Master of Disaster”) is a persona who finds picking up
              toys frustrating.
            </li>
            <li>
              Toy returns become a continuation of imaginative play.
            </li>
            <li>
              The persona came from first-hand conversations; it does not
              represent evidence about all children.
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
