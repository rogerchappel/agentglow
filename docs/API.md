# AgentGlow API

AgentGlow has a framework-agnostic core and a React-facing wrapper contract.

## Core

```ts
import { createAgentGlowController } from '@agentglow/core';

const glow = createAgentGlowController({ preset: 'orb' });
glow.setState('thinking', { runId: 'run_123', message: 'Planning next step' });
glow.setInput({ activityLevel: 0.64 });
const snapshot = glow.getSnapshot();
```

### Controller methods

- `setState(state, meta?)` validates one of the canonical states and stores safe metadata.
- `send(event)` maps presence events such as `presence.tool.started` or `presence.wait.started` into states.
- `setInput(input)` updates smoothed `speechLevel`, `inputLevel`, `frequencyBands`, `activityLevel`, and `progress`.
- `setTheme(theme)` normalizes palette, contrast, motion, density, glow, radius, and preset shape.
- `getSnapshot()` returns a deterministic renderer-ready object.
- `subscribe(listener)` emits snapshots for host UI updates and returns an unsubscribe function.
- `destroy()` clears listeners.

## React

```tsx
import { AgentGlow } from '@agentglow/react';

<AgentGlow
  state="speaking"
  preset="orb"
  theme={{ palette: { accent: '#8B5CF6' }, mood: 'focused' }}
  input={{ speechLevel: 0.62 }}
  agent={{ name: 'Neo', persona: 'calm-operator' }}
  ariaLabel="Neo is speaking"
/>
```

The V1 React package exposes stable props and returns an SVG-backed element description for easy host integration while renderer internals mature. Props mirror the core contract: `state`, `event`, `input`, `theme`, `preset`, `agent`, `quality`, `reducedMotion`, `ariaLabel`, `liveRegion`, `onSnapshot`, and `onRendererWarning`.

## Presets

V1 preset IDs are `orb`, `waveform-halo`, `constellation`, `console-pulse`, and `minimal-dot-field`. All presets consume the same snapshot shape and must not invent business states.

## Fixture and Timeline Utilities

### `createAgentGlowTimeline(events, options?)`

Replays a local list of `AgentGlowEvent` objects through a controller and returns `{ initial, steps, final }`. This is useful for tests, demos, incident replays, and CLI fixture rendering because it does not need a browser host.

### `mapAgentGlowEventToState(event)`

Returns the visual state implied by an event, or `undefined` for pure audio input events. Apps can use this to inspect routing before mutating a controller.

### `readAgentGlowAnalyserFrame(analyser, options?)`

Accepts an analyser-like object and converts byte-frequency/time-domain data into an `AgentGlowInput` frame. This keeps the microphone boundary explicit: the adapter reads data from an analyser you provide, but it does not request permissions itself.

## CLI

```sh
node bin/agentglow-render.mjs \
  --fixture tests/fixtures/presence-run.json \
  --out /tmp/agentglow.svg
```

The CLI renders the final snapshot from a local fixture to SVG and prints a JSON smoke result. It is intended for CI, examples, and quick verification of state/theme fixtures.

### `createAgentGlowCssVars(theme?, prefix?)`

Returns normalized theme tokens as CSS custom properties. This is useful for design-system wrappers that want AgentGlow's renderer, docs, and surrounding chrome to share one palette.

```ts
const vars = createAgentGlowCssVars({ palette: { accent: '#8B5CF6' } });
// { '--agentglow-accent': '#8B5CF6', ... }
```
