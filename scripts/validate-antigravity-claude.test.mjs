import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const catalog = JSON.parse(await readFile(new URL('models.json', root), 'utf8'));
const evidence = JSON.parse(
  await readFile(new URL('scripts/fixtures/antigravity-claude-4-6-availability.json', root), 'utf8'),
);

for (const [id, observed] of Object.entries(evidence.models)) {
  test(`Antigravity retains the still-available upstream model ${id}`, () => {
    const matches = catalog.antigravity.filter((model) => model.id === id);
    assert.equal(matches.length, 1, `${id}: expected one exact upstream ID, not a renamed 5.5 model`);
    const model = matches[0];
    assert.equal(model.name, id);
    assert.equal(model.type, 'antigravity');
    assert.equal(model.owned_by, 'antigravity');
    assert.equal(model.display_name, observed.displayName);
    assert.equal(model.context_length, observed.maxTokens);
    assert.equal(model.max_completion_tokens, observed.maxOutputTokens);
    assert.ok(model.thinking);
    assert.ok(model.supportedInputModalities.includes('image'));
  });
}

test('Restoring Claude 4.6 does not remove the existing paid-plan Claude 5.5 IDs', () => {
  for (const id of ['claude-opus-5-5-high', 'claude-sonnet-5-5-high']) {
    assert.equal(catalog.antigravity.filter((model) => model.id === id).length, 1);
  }
});
