export default function VillageMetaphor() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-[var(--slide-bg)] text-[var(--slide-text)] font-body">
      <div className="absolute left-[6vw] top-[5vh] text-[1.5vw] font-semibold">
        Toy’s Village
      </div>
      <main className="h-full w-full px-[6vw] pb-[6vh] pt-[12vh]">
        <h2 className="text-[4vw] font-extrabold leading-[1.08] tracking-[-0.04em] text-[var(--slide-primary)]">
          A village of little homes
        </h2>
        <div className="mt-[4vh] grid h-[66vh] grid-cols-[0.9fr_1.1fr] items-center gap-[3vw]">
          <ul className="flex list-disc flex-col gap-[3.5vh] pl-[2.5vw] text-[2.1vw] leading-[1.35] text-[var(--slide-muted)] marker:text-[var(--slide-primary)]">
            <li>
              Toy boxes become houses; toys are residents who go home to sleep.
            </li>
            <li>Spoken guidance keeps attention on physical play.</li>
            <li>
              Responsibility and less adult prompting are goals to test—not
              established outcomes.
            </li>
          </ul>
          <div className="flex h-full items-center justify-center">
            <svg
              viewBox="0 0 800 520"
              role="img"
              aria-label="Simple diagram of colorful toy residents returning to matching village homes"
              className="h-[58vh] w-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M78 440H722"
                stroke="#D1D7DE"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="190" cy="74" r="32" fill="#E0E7ED" />
              <circle cx="400" cy="74" r="32" fill="#E1EDE4" />
              <circle cx="610" cy="74" r="32" fill="#F0E4D8" />
              <circle cx="177" cy="67" r="4" fill="#1A1A2E" />
              <circle cx="203" cy="67" r="4" fill="#1A1A2E" />
              <path
                d="M180 83Q190 91 200 83"
                fill="none"
                stroke="#1A1A2E"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="387" cy="67" r="4" fill="#1A1A2E" />
              <circle cx="413" cy="67" r="4" fill="#1A1A2E" />
              <path
                d="M390 83Q400 91 410 83"
                fill="none"
                stroke="#1A1A2E"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="597" cy="67" r="4" fill="#1A1A2E" />
              <circle cx="623" cy="67" r="4" fill="#1A1A2E" />
              <path
                d="M600 83Q610 91 620 83"
                fill="none"
                stroke="#1A1A2E"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M190 122V183M400 122V183M610 122V183"
                stroke="#7E8994"
                strokeWidth="5"
                strokeDasharray="9 12"
                strokeLinecap="round"
              />
              <path
                d="M178 171L190 185L202 171M388 171L400 185L412 171M598 171L610 185L622 171"
                fill="none"
                stroke="#7E8994"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M80 285L190 190L300 285V430H80Z" fill="#E0E7ED" />
              <path d="M290 285L400 190L510 285V430H290Z" fill="#E1EDE4" />
              <path d="M500 285L610 190L720 285V430H500Z" fill="#F0E4D8" />
              <path d="M114 292L190 225L266 292" fill="none" stroke="#1A1A2E" strokeWidth="9" strokeLinejoin="round" />
              <path d="M324 292L400 225L476 292" fill="none" stroke="#1A1A2E" strokeWidth="9" strokeLinejoin="round" />
              <path d="M534 292L610 225L686 292" fill="none" stroke="#1A1A2E" strokeWidth="9" strokeLinejoin="round" />
              <rect x="151" y="329" width="78" height="101" rx="6" fill="#F0F2F5" />
              <rect x="361" y="329" width="78" height="101" rx="6" fill="#F0F2F5" />
              <rect x="571" y="329" width="78" height="101" rx="6" fill="#F0F2F5" />
              <circle cx="214" cy="379" r="5" fill="#1A1A2E" />
              <circle cx="424" cy="379" r="5" fill="#1A1A2E" />
              <circle cx="634" cy="379" r="5" fill="#1A1A2E" />
            </svg>
          </div>
        </div>
      </main>
    </div>
  );
}
