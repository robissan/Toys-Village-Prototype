import assert from 'node:assert/strict';
import test from 'node:test';
import {
  acceptToy,
  archiveIfUsed,
  finishSession,
  recordAdultPrompt,
  recordMismatch,
  rememberSession,
  sanitizePersisted,
  startSession,
} from './session';

test('session totals count accepts, mismatches, and adult prompts', () => {
  let sheet = startSession('color', false, Date.parse('2026-10-23T15:00:00Z'));
  sheet = acceptToy(sheet, 'duck');
  sheet = recordMismatch(sheet);
  sheet = recordAdultPrompt(sheet);
  const finished = finishSession(sheet, ['duck'], Date.parse('2026-10-23T15:04:00Z'));
  assert.equal(finished.gameId, 'color');
  assert.equal(finished.endedAt, '2026-10-23T15:04:00.000Z');
  assert.deepEqual(finished.toysAccepted, ['duck']);
  assert.deepEqual(finished.homeAtFinish, ['duck']);
  assert.equal(finished.colorMismatches, 1);
  assert.equal(finished.adultPrompts, 1);
  assert.equal(finished.storyUnderstood, null);
});

test('rememberSession keeps the record on the device log and clears the active one', () => {
  const active = startSession('time', true, 1);
  const finished = finishSession(active, ['bear'], 2);
  const log = rememberSession({ active, completed: [] }, finished);
  assert.equal(log.active, null);
  assert.equal(log.completed.length, 1);
  assert.equal(log.completed[0]?.steadyTempo, true);
});

test('an unused session is dropped instead of stored', () => {
  const active = startSession('time', false, 1);
  const next = archiveIfUsed({ active, completed: [] }, []);
  assert.equal(next.active, null);
  assert.equal(next.completed.length, 0);
});

test('sanitizePersisted drops names and unknown toy ids', () => {
  const clean = sanitizePersisted({
    speechOn: false,
    musicVolume: 0.06,
    steadyTempo: true,
    timeHomeIds: ['duck', 'a-child'],
    colorHomeIds: ['truck'],
    targetColor: 'peach',
    active: {
      gameId: 'time',
      startedAt: '2026-10-23T15:00:00.000Z',
      endedAt: null,
      toysAccepted: ['duck', 'photo'],
      colorMismatches: 2,
      adultPrompts: 1,
      steadyTempo: false,
      storyUnderstood: 'yes',
      homeAtFinish: [],
      childName: 'should-not-survive',
      photo: 'nope',
    },
    completed: [],
  });
  assert.ok(clean);
  assert.equal(clean?.speechOn, false);
  assert.equal(clean?.musicVolume, 0.06);
  assert.deepEqual(clean?.timeHomeIds, ['duck']);
  assert.deepEqual(clean?.active?.toysAccepted, ['duck']);
  assert.equal(JSON.stringify(clean).includes('should-not-survive'), false);
  assert.equal(JSON.stringify(clean).includes('photo'), false);
  assert.equal(JSON.stringify(clean).includes('a-child'), false);
});
