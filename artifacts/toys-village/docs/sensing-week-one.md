# Week-one sensing comparison

No sensing hardware is selected, and none should be built from this note. The app accepts only `SimulatedSensor` events: a placement (`toyId`, `inBox`) or a scan (`toyId`, `color`). Camera recognition is not chosen.

These are expectations to measure on a bench, not lab results.

## RFID tags in the toy, reader in the box

- **Cost.** Tags themselves are inexpensive. The reader, sealing each tag inside a toy, and a box that can tell one toy from a pile are the real cost.
- **Reliability.** Identity can be strong when one toy enters the box. A handful of tags at once can collide or be missed. RFID does not see color, so it does not answer the Color Game by itself.
- **Child safety.** A loose tag is a choking hazard. Tags have to be sealed inside the toy. The reader stays in the box, not on the child. No microphone and no camera.
- **Latency.** A successful read is often quick once the toy is in range. The range has to be short, or a toy still on the floor is counted as home.

## Weight or pressure in the box base

- **Cost.** Load cells or a pressure pad in one box are often simpler than a reader plus six sealed tags. A small controller in the base is still required.
- **Reliability.** The box can tell that something arrived or left. It cannot name the toy unless each toy has a distinct weight and only one moves at a time. Two toys at once, or a child leaning on the box, look like a placement. It does not see color.
- **Child safety.** Sensors stay in the box. Nothing extra is inside the toy, and there is no radio in the toy. No camera.
- **Latency.** The reading needs a short settle so a bump is not a placement. That wait should stay short enough that the song does not feel late.

## Phone camera

- **Cost.** No extra box hardware if a phone is already in the room. The engineering cost is lighting, hands in the way, and false matches.
- **Reliability.** Color and identity depend on light and on how much of the toy is covered. The draft 90% detection target is not meaningful until that is measured with real toys. Misses feel like the game saying no.
- **Child safety.** A camera aimed at play also sees the child. This prototype does not store photos. A camera permission in a children's app is the wrong default.
- **Latency.** A capture can be fast, and a miss becomes another try. That is a poor fit for a tidy-up beat.

## Decision

Camera is not chosen. Do not add a camera scan, image picker, or camera permission from this note.

No other approach is selected for a build either. If a later bench test happens, compare sealed RFID and in-box weight only: cost, missed reads, false reads, child safety, and time from placement to event. Until that test exists, play stays on `SimulatedSensor`.
