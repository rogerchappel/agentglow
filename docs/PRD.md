# agentglow

Status: ready
Decision: build now

## Scorecard

Total: 88/100
Band: build now
Last scored: 2026-05-01
Scored by: Neo

| Criterion | Points | Notes |
|---|---:|---|
| Problem pain | 18/20 | Every new agent app needs a beautiful, reactive agent-mode surface, but most teams rebuild weak bespoke blobs, waveforms, or chat panes. |
| Demand signal | 18/20 | Strong category validation from the current rush toward agent interfaces, CrewCmd’s own needs, and adjacent React/generative UI projects. |
| V1 buildability | 17/20 | A high-quality React/WebGL visual core is feasible, but the bar must be design-led rather than another simple waveform. |
| Differentiation | 14/15 | A portable, brandable agent-presence layer is sharper than generic chat UI or audio visualizer components. |
| Agentic workflow leverage | 14/15 | Gives CrewCmd, OpenClaw-style apps, mobile apps, and desktop apps a shared emotional/operational agent surface. |
| Distribution potential | 7/10 | Highly demoable: screenshots, videos, themes, microphone reactivity, and “drop this into your Jarvis UI” positioning. |

## Pitch

A stunning, brandable visual presence SDK for agent-mode interfaces: reactive to listening, thinking, speaking, tool use, interruptions, and emotional/operational state.

## Why It Matters

The market is moving from chat boxes to agent command centers. Everyone building a CrewCmd, Claw-style dashboard, mobile assistant, desktop shell, or Jarvis interface needs the same thing: a visual layer that makes an agent feel alive without each product reinventing it badly.

A shared visual SDK lets Roger dogfood the experience in CrewCmd while publishing a reusable open-source layer for the broader agent-app wave.

## Qualification

### Pub Test

“Install one component and your agent gets a beautiful, customisable, audio-reactive visual presence across web, desktop, and mobile.”

### Competitors / Adjacent Tools

- `assistant-ui/assistant-ui` — validates React AI interface demand, but focuses on chat UI rather than an agent presence/visualisation layer.
- `CopilotKit/CopilotKit` — validates frontend agent SDK demand, but focuses on app copilots and generative UI rather than the branded agent-mode core.
- Generic waveform/audio visualizer components — solve only microphone/sound graphics, not agent state, tool state, persona, or product theming.
- Bespoke agent dashboards and “Jarvis” demos — visually compelling but usually one-off, not reusable infrastructure.

### Star / Demand Signal

GitHub search on 2026-05-01 showed strong adjacent demand around agent frontend libraries, including `CopilotKit/CopilotKit`, `tambo-ai/tambo`, and `assistant-ui/assistant-ui`. The gap is not “more chat UI”; the gap is a reusable visual presence layer for agent mode.

### Real Problem

CrewCmd already needs this. Roger wants agent teams to feel operationally alive: listening, speaking, working, waiting for approval, blocked, running tools, escalating, or handing off. Today these states are scattered across UI components rather than expressed through one coherent presence system.

### V1 Buildability

V1 can be a framework-agnostic core plus React package:

- deterministic state machine for agent visual states
- canvas/WebGL/SVG renderer
- microphone analyser input
- speech amplitude input
- theme tokens and presets
- demo playground
- CrewCmd integration example

The challenge is polish, not feasibility. V1 must ship with taste: gradients, depth, motion, theme presets, and performance budgets.

## V1 Scope

- Package: `@agentglow/core` for state, themes, and audio inputs.
- Package: `@agentglow/react` for the primary web component.
- Agent states: idle, listening, thinking, speaking, tool-running, waiting, blocked, success, error, interrupted.
- Audio reactivity from microphone or output analyser: amplitude, frequency bands, silence detection.
- Theme system: colour palette, motion intensity, shape preset, density, glow, brand tokens.
- Presets: orb, waveform halo, constellation, console pulse, minimal dot-field.
- Accessibility: reduced motion, non-audio state labels, contrast-aware themes.
- Demo app with live microphone mode, simulated agent events, and copyable React snippets.
- CrewCmd integration example showing agent state mapping.

## Out of Scope

- Full chat UI.
- TTS/STT implementation.
- Human avatar generation.
- Cloud hosting or analytics.
- A single hard-coded “Roger/CrewCmd” visual style.
- Heavy 3D scenes that fail on low-power devices.

## CLI/API Sketch

```tsx
import { AgentGlow } from '@agentglow/react';

<AgentGlow
  state="speaking"
  theme={{ accent: '#8B5CF6', mood: 'focused', motion: 'smooth' }}
  audioInput={micAnalyser}
  agent={{ name: 'Neo', persona: 'calm-operator' }}
/>
```

```ts
import { createAgentGlowController } from '@agentglow/core';

const glow = createAgentGlowController({ preset: 'orb' });
glow.setState('tool-running', { toolName: 'github.createPullRequest' });
glow.setSpeechLevel(0.62);
```

## Verification

- Unit tests for state machine transitions and theme validation.
- Visual regression snapshots for presets where practical.
- Performance benchmark target: 60fps desktop, graceful 30fps fallback on mobile.
- Demo page with microphone permission disabled by default until user opts in.
- Reduced-motion mode tested.
- README with framework integration examples.
- No network calls in core package.

## Agent Prompt

Build `agentglow` as a local-first, open-source visual presence SDK for agent-mode interfaces. Start with `@agentglow/core`, `@agentglow/react`, and a demo playground. Prioritise taste, performance, accessibility, and clean state mapping over feature sprawl. It should be good enough for CrewCmd to dogfood and polished enough that other agent UI builders want to install it rather than one-shot their own blob.
