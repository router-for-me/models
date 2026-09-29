import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const catalog = JSON.parse(await readFile(new URL('models.json', root), 'utf8'));
const client = JSON.parse(await readFile(new URL('codex_client_models.json', root), 'utf8'));

test('GPT-6.1 Sol has exact paid-tier registrations and a complete Codex template', () => {
  for (const tier of ['codex-team', 'codex-plus', 'codex-pro']) {
    const entries = catalog[tier].filter((model) => model.id === 'gpt-6.1-sol');
    assert.equal(entries.length, 1, `${tier}: exact model registration`);
    assert.equal(entries[0].context_length, 272000);
    assert.equal(entries[0].max_completion_tokens, 128000);
    assert.deepEqual(entries[0].thinking.levels, ['low', 'medium', 'high', 'xhigh', 'max']);
    assert.equal(entries[0].native_capabilities.web_search, true);
  }
  assert.equal(catalog['codex-free'].some((model) => model.id === 'gpt-6.1-sol'), false);
  const templates = client.models.filter((model) => model.slug === 'gpt-6.1-sol');
  assert.equal(templates.length, 1);
  const [model] = templates;
  assert.equal(model.context_window, 272000);
  assert.equal(model.max_context_window, 872000);
  assert.equal(model.default_reasoning_level, 'low');
  assert.equal(model.tool_mode, 'code_mode_only');
  assert.equal(model.multi_agent_version, 'v2');
  assert.equal(model.node_repl_auto_review_required, true);
  assert.equal(model.supports_search_tool, true);
  assert.equal(typeof model.base_instructions, 'string');
  assert.ok(model.base_instructions.length > 0);
});
