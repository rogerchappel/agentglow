# AgentGlow

A design-led visual presence SDK for agent-mode interfaces.

AgentGlow is **not** chat UI, and it is not a basic audio waveform. It is the layer that makes an agent feel operationally present: listening, thinking, speaking, running tools, waiting for approval, blocked, interrupted, or done — with themeable visuals, accessibility semantics, and audio-reactive inputs.

## Install

```sh
pnpm add @agentglow/core @agentglow/react
```

This repository currently ships a local-first monorepo implementation for `@agentglow/core` and `@agentglow/react`.

## Quickstart

```tsx
import { AgentGlow } from '@agentglow/react';

export function AssistantPresence() {
  return (
    <AgentGlow
      state="speaking"
      preset="orb"
      theme={{ palette: { accent: '#8B5CF6' }, mood: 'focused' }}
      input={{ speechLevel: 0.62 }}
      agent={{ name: 'Neo', persona: 'calm-operator' }}
      ariaLabel="Neo is speaking"
    />
  );
}
```

## Core controller

```ts
import { createAgentGlowController, renderAgentGlowToSvg } from '@agentglow/core';

const glow = createAgentGlowController({ preset: 'console-pulse' });
glow.send({ type: 'presence.tool.started', toolName: 'github.createPullRequest' });
glow.setInput({ progress: 0.35, activityLevel: 0.8 });

const frame = renderAgentGlowToSvg(glow.getSnapshot());
```

## Canonical states

`idle`, `listening`, `thinking`, `speaking`, `tool-running`, `waiting`, `blocked`, `error`, `success`, and `interrupted`.

## Presets

- `orb` — layered premium presence core.
- `waveform-halo` — audio-forward ring for listening/speaking.
- `constellation` — distributed reasoning field.
- `console-pulse` — operational/tool-running display.
- `minimal-dot-field` — quiet, brandable fallback.

## Demo and examples

- Demo playground: [`demo/playground.html`](demo/playground.html)
- CrewCmd / AgentPulse mapping: [`examples/crewcmd`](examples/crewcmd)
- Recipes: [`docs/RECIPES.md`](docs/RECIPES.md)

## Accessibility and performance

AgentGlow exposes accessible labels, optional polite live-region text, reduced-motion fallbacks, contrast-aware theme normalization, local-only core behavior, and 60fps/30fps renderer targets.

See [`docs/ACCESSIBILITY.md`](docs/ACCESSIBILITY.md) and [`docs/PERFORMANCE.md`](docs/PERFORMANCE.md).

## API docs

See [`docs/API.md`](docs/API.md) and [`docs/architecture.md`](docs/architecture.md).

## Roadmap

- WebGL/canvas renderer adapters behind the same snapshot contract.
- Visual regression screenshots for every preset/state pair.
- Published package build pipeline and typed declaration output.
- More framework wrappers once the React contract is dogfooded.

## Verify

```sh
npm test
npm run check
npm run build
bash scripts/validate.sh
```

## License

MIT
