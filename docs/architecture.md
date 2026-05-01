# AgentGlow Presence Architecture

AgentGlow is a visual presence SDK, not a chat kit and not a generic waveform. Its job is to translate an agent's operational state into a polished, brandable, accessible surface that can sit inside CrewCmd-class command centers, desktop shells, mobile assistants, or embedded copilots.

This document is the Wave 1 contract for future implementation. Code in later waves should treat these names and boundaries as canonical unless a follow-up architecture change is reviewed explicitly.

## Product Principles

1. **State first, audio second.** Audio can enrich the display, but the agent's operational state must be understandable without sound, microphone access, or animation.
2. **One presence, many renderers.** Core state and theme normalization are framework-agnostic. Renderers consume snapshots and never invent business state.
3. **Premium by default.** Presets should convey depth, glow, intent, and motion language without forcing a single CrewCmd aesthetic.
4. **Accessible under constraint.** Reduced motion, semantic labels, and contrast-aware tokens are part of the contract, not optional polish.
5. **Local and deterministic.** Core must not make network calls. Given the same inputs, snapshots should be deterministic enough for tests and visual regression.

## Package Architecture

```txt
agentglow/
  packages/
    core/                  # @agentglow/core: states, events, themes, snapshots, controller contracts
      src/
        index.ts
        types.ts
    react/                 # @agentglow/react: React bindings and component prop contracts
      src/
        index.ts
  docs/
    architecture.md        # this contract
    acceptance-examples.md # state/event/theme examples future waves must satisfy
```

### Package Responsibilities

| Package | Owns | Does not own |
|---|---|---|
| `@agentglow/core` | canonical states, event model, state metadata, input normalization contracts, theme token contracts, renderer snapshot shape, controller API names | DOM, React lifecycle, canvas/WebGL/SVG drawing, microphone permission prompts, network calls |
| `@agentglow/react` | `<AgentGlow />`, `useAgentGlowController`, React prop names, accessibility prop pass-through, renderer host selection | state machine internals, visual math, global app state, chat UI |
| Future renderer modules | preset drawing, frame scheduling, feature degradation, device pixel ratio handling | state validation, theme validation, React hooks, microphone capture |
| Demo/examples | product storytelling, simulated events, optional microphone mode, copyable snippets | hidden recording, production analytics, privileged integrations |

## Canonical Agent States

`AgentGlowState` is intentionally operational. It says what the agent is doing or what the user needs to know, not how a renderer should draw it.

| State | Meaning | Motion language | Default label |
|---|---|---|---|
| `idle` | Agent is available but not actively processing. | slow breathing, low energy, stable center | Agent idle |
| `listening` | Agent is actively receiving user speech/input. | receptive expansion, input-reactive rim, calm anticipation | Agent listening |
| `thinking` | Agent is reasoning/planning without external side effects. | orbiting particles, soft pulse, medium tempo | Agent thinking |
| `speaking` | Agent is producing spoken/audio output or streaming an answer. | amplitude-driven bloom, warm forward energy | Agent speaking |
| `tool-running` | Agent is executing a tool, API call, or workflow step. | segmented sweep, mechanical precision, visible work loop | Agent running a tool |
| `waiting` | Agent is paused for user input, approval, dependency, or rate limit. | suspended pulse, amber hold pattern | Agent waiting |
| `blocked` | Agent cannot proceed without intervention or missing capability. | constrained geometry, low-frequency warning pulse | Agent blocked |
| `error` | A failure occurred and needs attention or recovery. | sharp contraction, red fault accent, reduced flourish | Agent error |
| `success` | A task or milestone completed successfully. | confident bloom, brief celebratory shimmer | Agent success |
| `interrupted` | The current turn/work was cancelled, superseded, or externally interrupted. | snapped pause then settle, clear handoff | Agent interrupted |

### State Metadata

Every state exposes metadata so UIs can render non-visual affordances consistently:

- `tone`: `neutral | receptive | active | productive | caution | danger | positive | paused`
- `urgency`: `none | low | medium | high`
- `isTerminal`: true for `success`, `error`, and `interrupted` when used as the last event of a run
- `ariaLabel`: default human-readable label that can be overridden

## Event and Input Model

AgentGlow receives events and continuous inputs. Events change presence state or annotate a run. Inputs modulate the current visual snapshot without changing state by themselves.

### Presence Events

Canonical event names:

- `presence.state.set` — set the visual state directly when the host app already knows it.
- `presence.turn.started` — begin a user/agent turn; usually maps to `listening` or `thinking` depending on source.
- `presence.turn.completed` — mark completion; usually maps to `success` then settles to `idle` by host policy.
- `presence.turn.interrupted` — mark cancellation/supersession; maps to `interrupted`.
- `presence.audio.input` — normalized microphone/user input levels; enriches `listening`.
- `presence.audio.output` — normalized speech/TTS/output levels; enriches `speaking`.
- `presence.tool.started` — maps to `tool-running` with tool metadata.
- `presence.tool.completed` — returns to previous productive state or `success` by host policy.
- `presence.tool.failed` — maps to `error` or `blocked` based on recoverability.
- `presence.wait.started` — maps to `waiting` with reason metadata.
- `presence.blocked` — maps to `blocked` with missing requirement metadata.
- `presence.error` — maps to `error` with safe error metadata.

Events must be safe to log. Do not require raw prompts, secrets, tool payloads, or full error objects in the visual contract.

### Continuous Inputs

| Input | Range | Used by | Notes |
|---|---:|---|---|
| `speechLevel` | `0..1` | `speaking` | TTS/output amplitude after smoothing. |
| `inputLevel` | `0..1` | `listening` | Microphone/user input amplitude after smoothing. |
| `frequencyBands` | array of `0..1` | audio-reactive renderers | Optional low/mid/high or analyser bins. |
| `activityLevel` | `0..1` | `thinking`, `tool-running` | Host-supplied work intensity for non-audio motion. |
| `progress` | `0..1` | `tool-running`, `waiting` | Optional determinate progress. Omit for indeterminate. |

## Theme Token Model

Themes are semantic tokens, not renderer-specific constants. Renderers may derive gradients, particles, and glows from these tokens, but they must preserve contrast and reduced-motion constraints.

### Core Theme Shape

- `palette`
  - `background`: surface behind the presence
  - `surface`: core body / inner geometry
  - `accent`: primary brand energy
  - `accentSecondary`: optional secondary glow
  - `success`, `warning`, `danger`, `muted`: semantic overlays
  - `text`: label/readout color
- `mood`: `calm | focused | energetic | urgent | celebratory`
- `motion`
  - `intensity`: `0..1`
  - `tempo`: `slow | measured | brisk | rapid`
  - `reduced`: boolean host/user preference
- `shape`: `orb | waveform-halo | constellation | console-pulse | minimal-dot-field`
- `density`: `0..1` visual element density
- `glow`: `0..1` bloom/halo strength
- `radius`: `soft | balanced | sharp`
- `contrast`: `auto | standard | high`
- `brand`: optional named tokens for future design systems (`fontFamily`, `logoMark`, `cornerStyle`)

### Preset Names

The V1 preset identifiers are canonical:

- `orb`
- `waveform-halo`
- `constellation`
- `console-pulse`
- `minimal-dot-field`

## Renderer Boundary

A renderer consumes `AgentGlowSnapshot` and returns/draws visual output. It must not own business state.

Renderer inputs:

- `state` and state metadata
- normalized `theme`
- normalized continuous inputs
- safe event metadata (`toolName`, `waitReason`, `message`, `progress`)
- host preferences (`reducedMotion`, `quality`, `pixelRatio`)

Renderer outputs/side effects:

- draw into a supplied canvas/SVG/DOM host
- expose a semantic label/readout to the wrapper
- report capability degradation (`webgl-unavailable`, `low-power-mode`, `reduced-motion`)

Renderer rules:

1. Never request microphone/device permission.
2. Never call the network.
3. Never mutate host app state.
4. Degrade from WebGL/canvas to simpler SVG/DOM without changing public state names.
5. Respect `motion.reduced` by replacing loops with static poses or rare, gentle transitions.

## Public API Naming

### Core

```ts
import {
  AGENT_GLOW_STATES,
  createAgentGlowController,
  getAgentGlowStateMeta,
  normalizeAgentGlowTheme,
  type AgentGlowEvent,
  type AgentGlowSnapshot,
  type AgentGlowState,
  type AgentGlowTheme,
} from '@agentglow/core';
```

Core controller methods are named for host intent:

- `setState(state, meta?)`
- `send(event)`
- `setInput(input)`
- `setTheme(theme)`
- `getSnapshot()`
- `subscribe(listener)`
- `destroy()`

### React

```tsx
import { AgentGlow, useAgentGlowController } from '@agentglow/react';

<AgentGlow
  state="speaking"
  preset="orb"
  theme={{ palette: { accent: '#8B5CF6' }, mood: 'focused' }}
  input={{ speechLevel: 0.62 }}
  agent={{ name: 'Neo', persona: 'calm-operator' }}
  ariaLabel="Neo is speaking"
/>
```

React prop names should mirror core names where possible: `state`, `event`, `input`, `theme`, `preset`, `agent`, `quality`, `reducedMotion`, `ariaLabel`, `onSnapshot`, `onRendererWarning`.

## Accessibility Contract

- Every rendered presence has an accessible name.
- State changes can be surfaced through a polite live region when the host opts in.
- Reduced motion is accepted through explicit prop and/or user media preference.
- Color cannot be the only indicator for `blocked`, `error`, `waiting`, or `success`.
- Theme normalization must be able to choose high-contrast semantic tokens when requested.

## Wave Handoff Notes

Wave 2 should implement the core state/theme engine against `packages/core/src/types.ts` without expanding state names. If a renderer needs extra visual nuance, add metadata or renderer-local derived values; do not create pseudo-states such as `breathing`, `loading`, or `celebrating` in public API.
