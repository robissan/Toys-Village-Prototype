/** Picture ids for the six residents. Train and truck must not share one. */
export const TOY_PICTURE = {
  duck: 'duck',
  train: 'locomotive',
  blocks: 'blocks',
  bear: 'bear',
  ball: 'striped-ball',
  truck: 'pickup',
} as const;

export type ToyPicture = (typeof TOY_PICTURE)[keyof typeof TOY_PICTURE];

export function pictureFor(toyId: string): ToyPicture | null {
  if (toyId in TOY_PICTURE) {
    return TOY_PICTURE[toyId as keyof typeof TOY_PICTURE];
  }
  return null;
}
