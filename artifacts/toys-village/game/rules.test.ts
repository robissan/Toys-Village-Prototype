import assert from 'node:assert/strict';
import test from 'node:test';
import { TOY_RESIDENTS } from '../gameData';
import { pictureFor } from './shapes';
import { applyPlacement, judgeScan, nextTarget, rateFor, tempoFor } from './rules';

test('tempoFor stays gentle, then rises, then caps', () => {
  assert.equal(tempoFor(0), 0.92);
  assert.equal(tempoFor(1), 0.92);
  assert.ok(Math.abs(tempoFor(2) - (0.92 + 0.052)) < 1e-9);
  assert.equal(tempoFor(6), Math.min(1.18, 0.92 + 5 * 0.052));
  assert.equal(tempoFor(30), 1.18);
  assert.ok(tempoFor(30) <= 1.18);
});

test('rateFor locks steady tempo at 1 and otherwise uses tempoFor', () => {
  assert.equal(rateFor(6, true), 1);
  assert.equal(rateFor(1, true), 1);
  assert.equal(rateFor(4, false), tempoFor(4));
});

test('applyPlacement adds a toy once and does not take it back out', () => {
  assert.deepEqual(applyPlacement([], 'duck'), ['duck']);
  assert.deepEqual(applyPlacement(['duck'], 'train'), ['duck', 'train']);
  assert.deepEqual(applyPlacement(['duck', 'train'], 'duck'), ['duck', 'train']);
  const home = applyPlacement(['duck'], 'bear');
  assert.deepEqual(home, ['duck', 'bear']);
  assert.ok(home.includes('duck'));
});

test('judgeScan accepts only the target color', () => {
  assert.equal(judgeScan({ color: 'sunshine' }, 'sunshine'), 'accept');
  assert.equal(judgeScan({ color: 'lagoon' }, 'sunshine'), 'reject');
  assert.equal(judgeScan({ color: 'peach' }, 'peach'), 'accept');
});

test('nextTarget follows the roll instead of the first remaining toy', () => {
  const toys = ['duck', 'train', 'truck'];
  assert.equal(nextTarget(toys, () => 0), 'duck');
  assert.equal(nextTarget(toys, () => 0.99), 'truck');
  assert.equal(nextTarget([], () => 0.5), null);
  const residents = TOY_RESIDENTS.map((toy) => toy.id);
  assert.equal(nextTarget(residents, () => 0.99), 'truck');
  assert.notEqual(nextTarget(residents, () => 0.99), residents[0]);
});

test('train and truck use different pictures', () => {
  const pictures = TOY_RESIDENTS.map((toy) => pictureFor(toy.id));
  assert.equal(pictures.length, new Set(pictures).size);
  assert.notEqual(pictureFor('train'), pictureFor('truck'));
  assert.equal(pictureFor('train'), 'locomotive');
  assert.equal(pictureFor('truck'), 'pickup');
});
