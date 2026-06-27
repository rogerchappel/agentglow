# AgentGlow

A design-led visual presence SDK for agent-mode interfaces — the quiet glow that tells users whether their agent is listening, thinking, speaking, working, waiting, blocked, or celebrating.

AgentGlow is **not** chat UI, and it is not a basic audio waveform. It is the layer that makes an agent feel operationally present: listening, thinking, speaking, running tools, waiting for approval, blocked, interrupted, or done — with themeable visuals, accessibility semantics, and audio-reactive inputs.

## Install

```sh
npm install agentglow
# optional local fixture renderer
npx agentglow-render --fixture tests/fixtures/presence-run.json --out frame.svg
```

The v0.1 package ships the local-first monorepo runtime as `agentglow`, `agentglow/core`, and `agentglow/react`. Published exports point at built JavaScript plus declaration files, while the TypeScript sources remain included for auditability.

## Quickstart

```tsx
import { AgentGlow } from 'agentglow/react';

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
import { createAgentGlowController, renderAgentGlowToSvg } from 'agentglow/core';

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

## Personality

AgentGlow is meant to feel premium without becoming theatrical: calm when idle, focused under load, bright when speaking, precise during tool use, and unmistakably blocked when it needs human help. It gives your product a visual heartbeat without pretending to be the whole assistant.

## Demo and examples

- Demo playground: [`demo/playground.html`](demo/playground.html)
- CLI fixture smoke: `node bin/agentglow-render.mjs --fixture tests/fixtures/presence-run.json --out frame.svg`
- CrewCmd / AgentPulse mapping: [`examples/crewcmd`](examples/crewcmd)
- Recipes: [`docs/RECIPES.md`](docs/RECIPES.md)

## Accessibility and performance

AgentGlow exposes accessible labels, optional polite live-region text, reduced-motion fallbacks, contrast-aware theme normalization, local-only core behavior, and 60fps/30fps renderer targets.

See [`docs/ACCESSIBILITY.md`](docs/ACCESSIBILITY.md) and [`docs/PERFORMANCE.md`](docs/PERFORMANCE.md).

## API docs

See [`docs/API.md`](docs/API.md) and [`docs/architecture.md`](docs/architecture.md).

## Limitations

- AgentGlow renders presence state; it does not provide chat orchestration, speech recognition, tool execution, or model routing.
- Treat the current SVG/runtime contracts as v0.1 surfaces until the visual regression suite and framework adapters are broader.
- Audio-reactive inputs should be normalized by the host app; AgentGlow does not capture microphone audio or request device permissions.

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
npm run pack:smoke
node bin/agentglow-render.mjs --fixture tests/fixtures/presence-run.json --out /tmp/agentglow.svg
bash scripts/validate.sh
```

## License

MIT
