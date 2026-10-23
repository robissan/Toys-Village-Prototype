export type ToyColor =
  | 'sunshine'
  | 'lagoon'
  | 'tomato'
  | 'lilac'
  | 'mint'
  | 'peach';

export type InstrumentId =
  | 'chime'
  | 'strings'
  | 'wood'
  | 'bell'
  | 'drum'
  | 'piano';

export interface ToyResident {
  id: string;
  name: string;
  color: ToyColor;
  colorLabel: string;
  instrument: InstrumentId;
  instrumentLabel: string;
}

export const TOY_RESIDENTS: ToyResident[] = [
  {
    id: 'duck',
    name: 'Duck',
    color: 'sunshine',
    colorLabel: 'yellow',
    instrument: 'chime',
    instrumentLabel: 'chime',
  },
  {
    id: 'train',
    name: 'Train',
    color: 'lagoon',
    colorLabel: 'blue',
    instrument: 'strings',
    instrumentLabel: 'soft strings',
  },
  {
    id: 'blocks',
    name: 'Blocks',
    color: 'tomato',
    colorLabel: 'red',
    instrument: 'wood',
    instrumentLabel: 'wooden notes',
  },
  {
    id: 'bear',
    name: 'Bear',
    color: 'lilac',
    colorLabel: 'purple',
    instrument: 'bell',
    instrumentLabel: 'bell',
  },
  {
    id: 'ball',
    name: 'Ball',
    color: 'mint',
    colorLabel: 'green',
    instrument: 'drum',
    instrumentLabel: 'gentle drum',
  },
  {
    id: 'truck',
    name: 'Truck',
    color: 'peach',
    colorLabel: 'orange',
    instrument: 'piano',
    instrumentLabel: 'toy piano',
  },
];

export function labelForColor(color: ToyColor): string {
  return TOY_RESIDENTS.find((toy) => toy.color === color)?.colorLabel ?? 'matching';
}
