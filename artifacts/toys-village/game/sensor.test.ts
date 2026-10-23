import assert from 'node:assert/strict';
import test from 'node:test';
import { TOY_RESIDENTS } from '../gameData';
import { SimulatedSensor, applyInput, type BoardState } from './sensor';

const board = (): BoardState => ({
  timeHomeIds: ['duck'],
  colorHomeIds: [],
  targetColor: 'sunshine',
});

test('taking a toy back out does not remove it from the song', () => {
  const event = SimulatedSensor.placement('duck', false);
  const result = applyInput(board(), event);
  assert.deepEqual(result.boards.timeHomeIds, ['duck']);
  assert.equal(result.acceptedToyId, null);
});

test('a placement into the box accepts the toy once', () => {
  const event = SimulatedSensor.placement('train', true);
  const result = applyInput(board(), event);
  assert.deepEqual(result.boards.timeHomeIds, ['duck', 'train']);
  assert.equal(result.acceptedToyId, 'train');
  const again = applyInput(result.boards, SimulatedSensor.placement('train', true));
  assert.equal(again.acceptedToyId, null);
});

test('a scan of the wrong color is a mismatch and does not accept the toy', () => {
  const event = SimulatedSensor.scan('train', 'lagoon');
  const result = applyInput(board(), event);
  assert.equal(result.mismatch, true);
  assert.equal(result.acceptedToyId, null);
  assert.deepEqual(result.boards.colorHomeIds, []);
  assert.equal(result.boards.targetColor, 'sunshine');
});

test('a matching scan accepts the toy and can choose a later resident next', () => {
  const event = SimulatedSensor.scan('duck', 'sunshine');
  const result = applyInput(board(), event, () => 0.99);
  assert.equal(result.acceptedToyId, 'duck');
  assert.equal(result.mismatch, false);
  assert.deepEqual(result.boards.colorHomeIds, ['duck']);
  assert.equal(result.nextColor, TOY_RESIDENTS[TOY_RESIDENTS.length - 1]?.color);
  assert.notEqual(result.nextColor, TOY_RESIDENTS[1]?.color);
});
