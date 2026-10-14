export default function SensingOptions() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-[var(--slide-bg)] text-[var(--slide-text)] font-body">
      <div className="absolute left-[6vw] top-[5vh] text-[1.5vw] font-semibold">
        Toy’s Village
      </div>
      <main className="h-full w-full px-[6vw] pb-[6vh] pt-[12vh]">
        <h2 className="text-[4vw] font-extrabold leading-[1.08] tracking-[-0.04em] text-[var(--slide-primary)]">
          Choose the sensing approach
        </h2>
        <div className="mt-[5vh] grid h-[43vh] grid-cols-3 gap-[4vw]">
          <section className="border-t-[0.8vw] border-[var(--slide-blue)] pt-[2.5vh]">
            <svg viewBox="0 0 120 100" aria-hidden="true" className="mb-[2vh] h-[10vh] w-[10vw]">
              <path d="M42 15H78V85H42Z" fill="none" stroke="#1A1A2E" strokeWidth="6" strokeLinejoin="round" />
              <path d="M51 26H69M51 74H69" stroke="#5A5A6E" strokeWidth="5" strokeLinecap="round" />
              <path d="M28 35C16 45 16 55 28 65M92 35C104 45 104 55 92 65M15 24C-3 42-3 58 15 76M105 24C123 42 123 58 105 76" fill="none" stroke="#7E8994" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <p className="text-[2vw] leading-[1.3] text-[var(--slide-muted)]">
              RFID: evaluate tagged toy/box identification.
            </p>
          </section>
          <section className="border-t-[0.8vw] border-[var(--slide-green)] pt-[2.5vh]">
            <svg viewBox="0 0 120 100" aria-hidden="true" className="mb-[2vh] h-[10vh] w-[10vw]">
              <path d="M18 71H102M28 71V84H92V71M33 64L60 34L87 64Z" fill="none" stroke="#1A1A2E" strokeWidth="6" strokeLinejoin="round" />
              <path d="M43 70V55H58V70M73 52V70M69 52H77" fill="none" stroke="#5A5A6E" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M60 13V24M41 19L47 29M79 19L73 29" stroke="#7E8994" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <p className="text-[2vw] leading-[1.3] text-[var(--slide-muted)]">
              Weight or pressure: infer placement changes at the box base.
            </p>
          </section>
          <section className="border-t-[0.8vw] border-[var(--slide-orange)] pt-[2.5vh]">
            <svg viewBox="0 0 120 100" aria-hidden="true" className="mb-[2vh] h-[10vh] w-[10vw]">
              <rect x="28" y="12" width="64" height="78" rx="9" fill="none" stroke="#1A1A2E" strokeWidth="6" />
              <circle cx="60" cy="49" r="18" fill="none" stroke="#5A5A6E" strokeWidth="5" />
              <path d="M49 49H71M60 38V60" stroke="#7E8994" strokeWidth="4" strokeLinecap="round" />
              <circle cx="60" cy="78" r="3" fill="#1A1A2E" />
            </svg>
            <p className="text-[2vw] leading-[1.3] text-[var(--slide-muted)]">
              Phone camera: explore toy and color recognition.
            </p>
          </section>
        </div>
        <div className="mt-[4vh] border-t border-[var(--slide-blue)] pt-[3vh]">
          <p className="text-[2vw] font-semibold leading-[1.3] text-[var(--slide-primary)]">
            Proposed week-one comparison: cost, reliability, child safety and
            response time.
          </p>
          <p className="mt-[1.5vh] text-[2vw] leading-[1.3] text-[var(--slide-muted)]">
            No sensing approach has been selected.
          </p>
        </div>
      </main>
    </div>
  );
}
