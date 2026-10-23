import assert from 'node:assert/strict';
import test from 'node:test';
import { chooseSpeakingVoice, speechProsody, type ListedVoice } from './voice';

const samantha: ListedVoice = {
  identifier: 'samantha',
  name: 'Samantha',
  language: 'en-US',
  quality: 'Enhanced',
};
const espeak: ListedVoice = {
  identifier: 'espeak-en',
  name: 'English (United States)+espeak',
  language: 'en-US',
  quality: 'Default',
};
const daniel: ListedVoice = {
  identifier: 'daniel',
  name: 'Daniel',
  language: 'en-GB',
  quality: 'Default',
};

test('chooseSpeakingVoice prefers a warm enhanced voice over espeak', () => {
  const choice = chooseSpeakingVoice([espeak, samantha]);
  assert.equal(choice.voice?.name, 'Samantha');
  assert.equal(choice.roboticOnly, false);
});

test('chooseSpeakingVoice marks a robotic-only list and still picks one', () => {
  const choice = chooseSpeakingVoice([
    espeak,
    { ...espeak, identifier: 'espeak-gb', name: 'English (Great Britain)+espeak', language: 'en-GB' },
  ]);
  assert.equal(choice.roboticOnly, true);
  assert.ok(choice.voice);
  assert.match(choice.voice?.name ?? '', /espeak/i);
});

test('chooseSpeakingVoice ignores a non-English voice when English exists', () => {
  const choice = chooseSpeakingVoice([
    { identifier: 'fr', name: 'Amelie Premium', language: 'fr-FR', quality: 'Premium' },
    espeak,
  ]);
  assert.equal(choice.voice?.language, 'en-US');
  assert.equal(choice.roboticOnly, true);
});

test('chooseSpeakingVoice returns no voice when the device lists none', () => {
  const choice = chooseSpeakingVoice([]);
  assert.equal(choice.voice, null);
  assert.equal(choice.roboticOnly, true);
});

test('speech is lower and closer to a natural rate than the old demo voice', () => {
  const warm = speechProsody(false);
  const robotic = speechProsody(true);
  assert.ok(warm.pitch < 1.05);
  assert.ok(warm.pitch <= 1);
  assert.ok(warm.rate > 0.83);
  assert.ok(warm.rate <= 1);
  assert.ok(robotic.pitch < warm.pitch);
  assert.ok(robotic.rate > 0.83);
  assert.ok(robotic.rate <= 1);
  assert.notEqual(warm.pitch, 1.05);
  assert.notEqual(warm.rate, 0.83);
});

test('an adult enhanced voice outranks a plain named voice', () => {
  const choice = chooseSpeakingVoice([daniel, samantha]);
  assert.equal(choice.voice?.name, 'Samantha');
});
