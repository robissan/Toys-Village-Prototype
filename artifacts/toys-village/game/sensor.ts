import { TOY_RESIDENTS, type ToyColor } from '../gameData';
import { applyPlacement, judgeScan, nextTarget } from './rules';

export type PlacementEvent = { type: 'placement'; toyId: string; inBox: boolean };
export type ScanEvent = { type: 'scan'; toyId: string; color: ToyColor };
export type SensorEvent = PlacementEvent | ScanEvent;

export interface BoardState {
  timeHomeIds: string[];
  colorHomeIds: string[];
  targetColor: ToyColor;
}

export interface InputResult {
  boards: BoardState;
  acceptedToyId: string | null;
  mismatch: boolean;
  nextColor: ToyColor | null;
}

/** The only input adapter. Screens ask it for placement and scan events. */
export const SimulatedSensor = {
  placement(toyId: string, inBox: boolean): PlacementEvent {
    return { type: 'placement', toyId, inBox };
  },
  scan(toyId: string, color: ToyColor): ScanEvent {
    return { type: 'scan', toyId, color };
  },
};

function unchanged(boards: BoardState): InputResult {
  return { boards, acceptedToyId: null, mismatch: false, nextColor: null };
}

export function applyInput(
  boards: BoardState,
  event: SensorEvent,
  random: () => number = Math.random,
): InputResult {
  if (event.type === 'placement') {
    if (!event.inBox) return unchanged(boards);
    const timeHomeIds = applyPlacement(boards.timeHomeIds, event.toyId);
    const added = timeHomeIds.length !== boards.timeHomeIds.length;
    return {
      boards: { ...boards, timeHomeIds },
      acceptedToyId: added ? event.toyId : null,
      mismatch: false,
      nextColor: null,
    };
  }

  if (judgeScan({ color: event.color }, boards.targetColor) === 'reject') {
    return { boards, acceptedToyId: null, mismatch: true, nextColor: null };
  }

  const colorHomeIds = applyPlacement(boards.colorHomeIds, event.toyId);
  const added = colorHomeIds.length !== boards.colorHomeIds.length;
  if (!added) return unchanged(boards);
  const remaining = TOY_RESIDENTS.filter((toy) => !colorHomeIds.includes(toy.id));
  const next = nextTarget(remaining, random);
  return {
    boards: {
      ...boards,
      colorHomeIds,
      targetColor: next ? next.color : boards.targetColor,
    },
    acceptedToyId: event.toyId,
    mismatch: false,
    nextColor: next ? next.color : null,
  };
}
