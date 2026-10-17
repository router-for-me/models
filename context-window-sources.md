# Gemini image context window sources

The context limits below come from Google's model documentation. Image-generation
models have smaller windows than the text-output Gemini models with similar names.
The listed values are input context limits; output token limits are separate.

| Catalog section | Model ID | Previous input limit | Documented input limit | Source |
| --- | --- | ---: | ---: | --- |
| `gemini` | `gemini-3.1-flash-image-preview` | 1,048,576 | 131,072 | [Gemini 3 guide](https://ai.google.dev/gemini-api/docs/gemini-3) |
| `gemini` | `gemini-3-pro-image-preview` | 1,048,576 | 65,536 | [Gemini 3 guide](https://ai.google.dev/gemini-api/docs/gemini-3) |
| `vertex` | `gemini-2.5-flash-image` | 1,048,576 | 65,536 | [Google model card](https://ai.google.dev/gemini-api/docs/models/gemini-2.5-flash-image) |
| `vertex` | `gemini-3.1-flash-image` | 1,048,576 | 131,072 | [Google Cloud model card](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-1-flash-image) |
| `vertex` | `gemini-3-pro-image` | 1,048,576 | 65,536 | [Google Cloud model card](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-pro-image) |
| `aistudio` | `gemini-2.5-flash-image` | 1,048,576 | 65,536 | [Google model card](https://ai.google.dev/gemini-api/docs/models/gemini-2.5-flash-image) |
| `antigravity` | `gemini-3.1-flash-image` | missing | 131,072 | [Google Cloud model card](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-1-flash-image) |

Google documents `gemini-3.8-flash` at 1,048,576 tokens in its
[3.8 Flash guide](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/guides/gemini-3-8-flash).
That entry already has the documented value in `models.json`.
