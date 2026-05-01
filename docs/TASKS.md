# Task Queue: agentglow

Source: assistant-authored from PRD.md by Neo; designed as LLM-quality orchestration with explicit concurrency waves
Format: assistant-authored orchestration derived from docs/PRD.md

## Product North Star

Build a design-led visual presence SDK for agent-mode interfaces: stateful, audio-reactive, themeable, accessible, and polished enough to be the default visual layer for CrewCmd-class products.

## Tasks

### agentglow-define-presence-contract: Define the agent presence contract and package architecture

- Repo: `agentglow`
- Phase: `foundation`
- Risk: `medium`
- Branch: `agent/define-presence-contract`
- Depends on: None

**Objective**

Specify canonical states, event inputs, theme tokens, renderer boundaries, package layout, and public API naming before any visual work starts.

**Acceptance Criteria**

docs/architecture.md, package skeleton, exported TypeScript types, acceptance examples for idle/listening/thinking/speaking/tool/waiting/blocked/error/success/interrupted.

### agentglow-build-core-state-theme-engine: Build core state machine and theme engine

- Repo: `agentglow`
- Phase: `implementation`
- Risk: `medium`
- Branch: `agent/build-core-state-theme-engine`
- Depends on: `agentglow-define-presence-contract`

**Objective**

Implement @agentglow/core with validated states, transitions, audio level inputs, theme normalization, reduced-motion options, and deterministic snapshots.

**Acceptance Criteria**

Unit tests cover valid/invalid states, transition metadata, theme defaults, reduced motion, and audio smoothing.

### agentglow-create-renderer-presets: Create the visual renderer and five premium presets

- Repo: `agentglow`
- Phase: `implementation`
- Risk: `medium`
- Branch: `agent/create-renderer-presets`
- Depends on: `agentglow-define-presence-contract`

**Objective**

Implement a performant renderer with orb, waveform halo, constellation, console pulse, and minimal dot-field presets. Prioritise taste: depth, motion, glow, and brandability.

**Acceptance Criteria**

Preset fixtures render without network access; each state has visible distinction; renderer can degrade gracefully on low-power devices.

### agentglow-build-react-component: Build the React component wrapper and controller hooks

- Repo: `agentglow`
- Phase: `implementation`
- Risk: `medium`
- Branch: `agent/build-react-component`
- Depends on: `agentglow-define-presence-contract`, `agentglow-build-core-state-theme-engine`

**Objective**

Expose <AgentGlow>, useAgentGlowController, and typed props that make the component easy to drop into agent apps.

**Acceptance Criteria**

React smoke tests cover controlled state, theme updates, audio level injection, reduced motion, and cleanup on unmount.

### agentglow-audio-reactivity-pipeline: Implement microphone/output audio reactivity pipeline

- Repo: `agentglow`
- Phase: `implementation`
- Risk: `medium`
- Branch: `agent/audio-reactivity-pipeline`
- Depends on: `agentglow-build-core-state-theme-engine`

**Objective**

Add analyser input adapters, amplitude/frequency smoothing, silence handling, permission-safe browser behaviour, and mock analyzers for tests.

**Acceptance Criteria**

Mic is opt-in, no hidden recording, output levels can be injected without device permissions, synthetic tests prove smoothing and silence behaviour.

### agentglow-demo-playground: Build the irresistible demo playground

- Repo: `agentglow`
- Phase: `demo`
- Risk: `medium`
- Branch: `agent/demo-playground`
- Depends on: `agentglow-create-renderer-presets`, `agentglow-build-react-component`, `agentglow-audio-reactivity-pipeline`

**Objective**

Create a demo that lets users switch presets, states, themes, audio modes, and copy React snippets. Make it screenshot/video worthy.

**Acceptance Criteria**

Demo has simulated events by default, optional mic mode, copyable snippets, keyboard controls, and a “CrewCmd-style run” scenario.

### agentglow-crewcmd-integration-example: Add CrewCmd/AgentPulse integration examples

- Repo: `agentglow`
- Phase: `integration`
- Risk: `low`
- Branch: `agent/crewcmd-integration-example`
- Depends on: `agentglow-build-react-component`

**Objective**

Show how AgentPulse-style events map to AgentGlow visual states and how VoicePath speaking events drive reactivity.

**Acceptance Criteria**

Examples are runnable or fixture-backed; README explains mappings and extension points.

### agentglow-quality-accessibility-performance: Harden quality, accessibility, and performance

- Repo: `agentglow`
- Phase: `verification`
- Risk: `medium`
- Branch: `agent/quality-accessibility-performance`
- Depends on: `agentglow-demo-playground`, `agentglow-crewcmd-integration-example`

**Objective**

Add visual/performance smoke checks, accessibility labels, reduced-motion verification, and bundle/perf budgets.

**Acceptance Criteria**

Validation reports 60fps target path, graceful 30fps fallback, no network calls in core, contrast-aware themes, and complete tests.

### agentglow-docs-release-polish: Write launch-grade docs and product positioning

- Repo: `agentglow`
- Phase: `documentation`
- Risk: `low`
- Branch: `agent/docs-release-polish`
- Depends on: `agentglow-quality-accessibility-performance`

**Objective**

Document API, concepts, presets, accessibility, performance, examples, and product positioning without overselling unfinished features.

**Acceptance Criteria**

README explains why this is not chat UI or a basic waveform; docs include install, quickstart, recipes, and roadmap.

### agentglow-final-product-review: Final product review and release readiness pass

- Repo: `agentglow`
- Phase: `final_validation`
- Risk: `high`
- Branch: `agent/final-product-review`
- Depends on: `agentglow-docs-release-polish`

**Objective**

Run the project as a user would: install, render, simulate agent states, inspect demo, verify docs, and cut a release checklist.

**Acceptance Criteria**

Human/product review confirms it feels premium enough for CrewCmd dogfooding before public announcement.
