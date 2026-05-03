# @agentglow/core

Local-first AgentGlow engine for state, theme, audio reactivity, timeline replay, and SVG rendering.

```ts
import { createAgentGlowController, renderAgentGlowToSvg } from '@agentglow/core';

const glow = createAgentGlowController({ preset: 'orb' });
glow.send({ type: 'presence.tool.started', toolName: 'git.status' });
const frame = renderAgentGlowToSvg(glow.getSnapshot());
```

The core package performs no network calls and never requests microphone access unless `createMicrophoneAgentGlowInput()` is called by user-initiated UI code.
