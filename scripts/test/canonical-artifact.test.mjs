import assert from 'node:assert/strict';
import test from 'node:test';
import { canonicalizeText } from '../prepare-coreweaver-io-artifact.mjs';

test('canonical artifact rewrites only the legacy public origin', () => {
  const source = '<link rel="canonical" href="https://coreweaverlabs.com/working-session"><a href="mailto:hello@coreweaverlabs.com">Contact</a>';
  const result = canonicalizeText(source);
  assert.match(result, /https:\/\/coreweaver\.io\/working-session/);
  assert.match(result, /mailto:hello@coreweaverlabs\.com/);
  assert.doesNotMatch(result, /https:\/\/coreweaverlabs\.com/);
});
