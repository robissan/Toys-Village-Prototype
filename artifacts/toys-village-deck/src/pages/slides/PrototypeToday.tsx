export default function PrototypeToday() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-[var(--slide-bg)] text-[var(--slide-text)] font-body">
      <div className="absolute left-[6vw] top-[5vh] text-[1.5vw] font-semibold">
        Toy’s Village
      </div>
      <main className="h-full w-full px-[6vw] pb-[6vh] pt-[12vh]">
        <h2 className="max-w-[88vw] text-[4vw] font-extrabold leading-[1.08] tracking-[-0.04em] text-[var(--slide-primary)]">
          What works in the prototype today
        </h2>
        <div className="mt-[4vh] grid h-[66vh] grid-cols-[0.88fr_1.12fr] items-center gap-[4vw]">
          <div className="flex h-[54vh] items-center justify-center">
            <svg
              viewBox="0 0 620 620"
              role="img"
              aria-label="Illustration of six preset toy residents and simulated tap inputs"
              className="h-full w-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="110" y="28" width="400" height="560" rx="52" fill="#E0E7ED" />
              <rect x="133" y="58" width="354" height="495" rx="32" fill="#F0F2F5" />
              <rect x="228" y="572" width="164" height="10" rx="5" fill="#1A1A2E" />
              <circle cx="222" cy="178" r="43" fill="#E1EDE4" />
              <circle cx="310" cy="178" r="43" fill="#F0E4D8" />
              <circle cx="398" cy="178" r="43" fill="#DDE8F0" />
              <circle cx="222" cy="326" r="43" fill="#F0E4D8" />
              <circle cx="310" cy="326" r="43" fill="#E0E7ED" />
              <circle cx="398" cy="326" r="43" fill="#E1EDE4" />
              <path d="M206 186L222 157L238 186V204H206Z" fill="#6D8A70" />
              <path d="M294 186L310 157L326 186V204H294Z" fill="#A17F61" />
              <path d="M382 186L398 157L414 186V204H382Z" fill="#66829B" />
              <path d="M206 334L222 305L238 334V352H206Z" fill="#A17F61" />
              <path d="M294 334L310 305L326 334V352H294Z" fill="#66829B" />
              <path d="M382 334L398 305L414 334V352H382Z" fill="#6D8A70" />
              <path
                d="M183 453H436"
                stroke="#B6BEC8"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M210 477C230 477 230 437 250 437S270 497 290 497S310 447 330 447S350 477 370 477S390 457 410 457"
                fill="none"
                stroke="#5A5A6E"
                strokeWidth="9"
                strokeLinecap="round"
              />
              <circle cx="461" cy="445" r="34" fill="#F0E4D8" />
              <path d="M448 445H474M461 432V458" stroke="#1A1A2E" strokeWidth="7" strokeLinecap="round" />
            </svg>
          </div>
          <ul className="flex list-disc flex-col gap-[3.2vh] pl-[2.5vw] text-[2vw] leading-[1.34] text-[var(--slide-muted)] marker:text-[var(--slide-primary)]">
            <li>
              Six sample residents have preset colors and instrument
              associations.
            </li>
            <li>
              Tapping cards simulates toy in/out detection; toy selection
              simulates color scans.
            </li>
            <li>
              Spoken prompts and local instrument samples provide audio
              feedback.
            </li>
            <li>
              No camera, RFID, weight sensor, or session-data logging is
              connected.
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
