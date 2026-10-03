# Model capability metadata

`models.json` may describe native, upstream model capabilities with an optional
per-model object:

```json
"native_capabilities": {
  "web_search": true
}
```

## Three-state semantics

`native_capabilities.web_search` is deliberately three-state:

- `true`: model-level evidence or an explicit, recorded maintainer declaration
  identifies the exact provider/model pair as supporting native web search.
- `false`: reliable model-level evidence explicitly says the exact model cannot
  invoke that tool.
- absent: unknown. Absence must not be interpreted as `false`.

This is model metadata, not a provider-wide default. Do not infer support from a
provider name, model-family substring, nearby model, input modalities, or a
newer synthetic/future-looking model ID. Maintainer declarations are explicit
catalog snapshots, not wildcard rules or claims of live verification. Native support also does not guarantee
that every proxy, API protocol, account, plan, region, or request path exposes
or successfully executes the capability.

## Evidence and exact mappings

### OpenAI Codex catalog

The repository's [`codex_client_models.json`](./codex_client_models.json) is the
model-level Codex client template. An exact slug match with
`supports_search_tool: true` is the evidence for the following catalog entries:

| Catalog section | `web_search: true` model IDs |
| --- | --- |
| `codex-free` | `gpt-5.5`, `gpt-daybreak-blue-latest`, `gpt-5.6-terra`, `gpt-5.6-luna`, `codex-auto-review` |
| `codex-team` | `gpt-5.5`, `gpt-6-astra`, `gpt-5.6-sol`, `gpt-daybreak-blue-latest`, `gpt-5.6-terra`, `gpt-5.6-luna`, `codex-auto-review` |
| `codex-plus` | `gpt-5.3-codex-spark`, `gpt-5.5`, `gpt-6-astra`, `gpt-5.6-sol`, `gpt-daybreak-blue-latest`, `gpt-5.6-terra`, `gpt-5.6-luna`, `codex-auto-review` |
| `codex-pro` | `gpt-5.3-codex-spark`, `gpt-5.5`, `gpt-6-astra`, `gpt-5.6-sol`, `gpt-daybreak-blue-latest`, `gpt-5.6-terra`, `gpt-5.6-luna`, `codex-auto-review` |

`gpt-reserve` appears in the client template but not in `models.json`, so no
catalog entry is created for it. No model currently has an evidence-backed
`web_search: false` mapping.

### Official documented model examples

The exact assertions and provenance are recorded in
[`native-capabilities-evidence.json`](./native-capabilities-evidence.json):

| Catalog section | Exact model ID | Declaration | Evidence |
| --- | --- | --- | --- |
| `claude` | `claude-opus-5` | `true` | Anthropic's [Web search tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool) documentation includes native search requests with this exact model, including `web_search_20250305`. |
| `xai` | `grok-4.6` | `true` | The [Grok 4.6 model page](https://docs.x.ai/developers/grok-4-6.md) lists web search; the [official Responses examples](https://docs.x.ai/developers/tools/advanced-usage.md) use this exact ID with `web_search`. |

These documentation excerpts were retrieved through Context7's indexes of the
first-party sites (`/websites/platform_claude_en` and `/websites/x_ai`). They are
not live upstream test results. Direct HTTP retrieval can redirect to unrelated
landing pages; such pages were not used as proof of model support.

Other Claude, xAI, and Kimi IDs remain unknown: these exact examples are not
blanket provider/family declarations. Missing evidence is never converted into
a false capability claim.

### Gemini maintainer declaration

[`gemini-native-search-declaration.json`](./gemini-native-search-declaration.json)
records the maintainer's explicit decision to mark all 61 existing Gemini
entries as `native_capabilities.web_search: true`, including image models and
aliases:

| Catalog section | Declared Gemini entries |
| --- | ---: |
| `gemini` | 14 |
| `vertex` | 16 |
| `gemini-cli` | 7 |
| `aistudio` | 16 |
| `antigravity` | 8 |

The declaration enumerates exact provider/model pairs. It is **not** official
model-by-model documentation or a live upstream test result, and it does not
apply to future IDs or non-Gemini models in these sections.

Clients must send Gemini search requests through the Gemini
`generateContent` protocol with `tools: [{"googleSearch": {}}]`. Sending a
Responses `web_search` tool through protocol conversion can discard that tool.
The native capability declaration does not assert support for the Responses
path, nor guarantee availability for every account, region, or proxy route.
Clients should verify returned grounding evidence rather than accept ordinary
text as proof of search execution.

To synchronize the explicitly declared entries into the catalog:

```sh
node scripts/apply-gemini-search-declaration.mjs
```

The synchronizer preserves other model metadata and does not discover or
implicitly enable additional models.

## Validation

Run:

```sh
node scripts/validate-native-capabilities.mjs
node --test scripts/validate-native-capabilities.test.mjs
```

The validator checks the schema and requires every Codex plan annotation to be
an exact ID match for boolean `supports_search_tool` metadata in the local
Codex client template. Other annotations must match the exact provider/model
pair in the official evidence file or the explicit Gemini maintainer declaration.
It never infers support by prefix and rejects missing or contradictory annotations,
duplicate declarations, and declarations without a matching catalog entry.

CPA must additionally check every registration's actual request path, including
aliases, prefixes, and mixed account/provider mappings. A Responses-path
capability flag must not be mistaken for Gemini-native search support. A catalog
with no capability fields remains unknown; it must not silently establish a
provider-level default.
