const base = import.meta.env.BASE_URL;

export default function ToysVillageCover() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-[var(--slide-bg)] text-[var(--slide-text)] font-body">
      <div className="absolute left-[6vw] top-[6vh] flex items-center gap-[1vw] text-[1.5vw] font-semibold">
        <img
          src={`${base}toys-village-icon.png`}
          crossOrigin="anonymous"
          alt=""
          className="h-[3.2vw] w-[3.2vw] rounded-[0.8vw]"
        />
        <span>Toy’s Village</span>
      </div>

      <div className="flex h-full w-full items-center px-[6vw] pt-[10vh]">
        <div className="flex h-full w-full items-center">
          <div className="flex flex-1 flex-col justify-center pr-[4vw]">
            <h1 className="m-0 text-[8vw] font-extrabold leading-[1.05] tracking-[-0.04em] text-[var(--slide-primary)]">
              <span className="block">Toy’s</span>
              <span className="block">Village</span>
            </h1>
            <p className="mt-[4vh] max-w-[40vw] text-[2vw] leading-[1.4] text-[var(--slide-muted)]">
              The tidy-up is part of the story.
            </p>
            <p className="mt-[1.2vh] max-w-[40vw] text-[2vw] leading-[1.45] text-[var(--slide-muted)]">
              <span className="block">A supervised mobile prototype</span>
              <span className="block">for audio-led toy returns.</span>
            </p>
          </div>

          <div className="flex w-[35vw] flex-col justify-center gap-[3vh]">
            <div className="flex items-center justify-between rounded-[1.5vw] bg-[var(--slide-blue)] px-[3vw] py-[3vh] shadow-[0_1vh_2vh_rgba(0,0,0,0.02)]">
              <div className="text-[5vw] font-extrabold tracking-[-0.05em] text-[var(--slide-primary)]">
                2
              </div>
              <div className="text-right text-[1.5vw] font-bold tracking-[0.1em] text-[var(--slide-muted)]">
                game modes
              </div>
            </div>
            <div className="flex items-center justify-between rounded-[1.5vw] bg-[var(--slide-green)] px-[3vw] py-[3vh] shadow-[0_1vh_2vh_rgba(0,0,0,0.02)]">
              <div className="text-[5vw] font-extrabold tracking-[-0.05em] text-[var(--slide-primary)]">
                6
              </div>
              <div className="max-w-[16vw] text-right text-[1.5vw] font-bold tracking-[0.1em] text-[var(--slide-muted)]">
                sample toy residents
              </div>
            </div>
            <div className="flex items-center justify-between rounded-[1.5vw] bg-[var(--slide-orange)] px-[3vw] py-[3vh] shadow-[0_1vh_2vh_rgba(0,0,0,0.02)]">
              <div className="text-[5vw] font-extrabold tracking-[-0.05em] text-[var(--slide-primary)]">
                0
              </div>
              <div className="max-w-[16vw] text-right text-[1.5vw] font-bold tracking-[0.1em] text-[var(--slide-muted)]">
                physical sensors connected
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
