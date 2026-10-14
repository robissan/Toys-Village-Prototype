export default function OpenQuestions() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-[var(--slide-bg)] text-[var(--slide-text)] font-body">
      <div className="absolute left-[6vw] top-[5vh] text-[1.5vw] font-semibold">
        Toy’s Village
      </div>
      <main className="h-full w-full px-[6vw] pb-[6vh] pt-[12vh]">
        <h2 className="max-w-[86vw] text-[4vw] font-extrabold leading-[1.08] tracking-[-0.04em] text-[var(--slide-primary)]">
          What is still unproven?
        </h2>
        <div className="mt-[5vh] grid h-[62vh] grid-cols-2 gap-x-[5vw] gap-y-[3vh]">
          <div className="flex items-start gap-[1.5vw] border-b border-[var(--slide-blue)] pb-[2.5vh]">
            <span className="mt-[0.45vh] h-[1.1vw] w-[1.1vw] shrink-0 rounded-full bg-[var(--slide-blue)]" />
            <p className="text-[2.2vw] leading-[1.32] text-[var(--slide-muted)]">
              Can children ages 3–5 understand the village story and spoken
              instructions?
            </p>
          </div>
          <div className="flex items-start gap-[1.5vw] border-b border-[var(--slide-green)] pb-[2.5vh]">
            <span className="mt-[0.45vh] h-[1.1vw] w-[1.1vw] shrink-0 rounded-full bg-[var(--slide-green)]" />
            <p className="text-[2.2vw] leading-[1.32] text-[var(--slide-muted)]">
              Does the rising musical pace encourage rushing or support steady
              tidying?
            </p>
          </div>
          <div className="flex items-start gap-[1.5vw] border-b border-[var(--slide-orange)] pb-[2.5vh]">
            <span className="mt-[0.45vh] h-[1.1vw] w-[1.1vw] shrink-0 rounded-full bg-[var(--slide-orange)]" />
            <p className="text-[2.2vw] leading-[1.32] text-[var(--slide-muted)]">
              Do color mismatches help sorting—or cause frustration?
            </p>
          </div>
          <div className="flex items-start gap-[1.5vw] border-b border-[var(--slide-blue)] pb-[2.5vh]">
            <span className="mt-[0.45vh] h-[1.1vw] w-[1.1vw] shrink-0 rounded-full bg-[var(--slide-blue)]" />
            <p className="text-[2.2vw] leading-[1.32] text-[var(--slide-muted)]">
              The prototype establishes neither sensor accuracy nor safe
              unsupervised use.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
