# Orchestration Handoff

## Summary

- Workspace: default
- Repository: agentglow
- Source: assistant-authored from PRD.md by Neo; designed as LLM-quality orchestration with explicit concurrency waves
- Total tasks: 10
- Dispatch now: agentglow-define-presence-contract
- Blocked tasks: agentglow-final-product-review

## Product North Star

Build a design-led visual presence SDK for agent-mode interfaces: stateful, audio-reactive, themeable, accessible, and polished enough to be the default visual layer for CrewCmd-class products.

## Dispatch Prompt

Dispatch Wave 1 first. These tasks may run concurrently:
- agentglow-define-presence-contract

Wait for the whole wave to finish and pass verification before dispatching the next sequential wave. Inside a concurrent wave, assign separate agents to separate branches and merge only after each task meets its acceptance criteria.

## LLM Refinement Notes
- Do not let implementation begin as a generic canvas blob. Lock the state model, theme tokens, and motion language first.
- The renderer, React wrapper, and demo can progress concurrently once the contract exists.
- The demo is a product surface, not an afterthought: it must make the SDK feel desirable in under 30 seconds.
- Accessibility and performance are product features here; they are not cleanup tasks.

## Concurrency Strategy

The best concurrency path is to protect the product contract first, then split work by stable interface boundaries. Do not dispatch renderer/provider/UI/demo work before the contracts they consume are stable. Once a wave is open, prefer parallel agents with narrow ownership and explicit handoff notes.

## Sequential Waves

### Wave 1: Product contract / visual direction

- Mode inside wave: sequential
- Dispatch: now
- Tasks: agentglow-define-presence-contract

### Wave 2: Core implementation lanes

- Mode inside wave: concurrent
- Dispatch: after_dependencies
- Tasks: agentglow-build-core-state-theme-engine, agentglow-create-renderer-presets

### Wave 3: Integration surface lanes

- Mode inside wave: concurrent
- Dispatch: after_dependencies
- Tasks: agentglow-build-react-component, agentglow-audio-reactivity-pipeline

### Wave 4: Demo and ecosystem examples

- Mode inside wave: concurrent
- Dispatch: after_dependencies
- Tasks: agentglow-demo-playground, agentglow-crewcmd-integration-example

### Wave 5: Quality and launch polish

- Mode inside wave: sequential
- Dispatch: after_human_decision
- Tasks: agentglow-quality-accessibility-performance, agentglow-docs-release-polish, agentglow-final-product-review

## Task Dependencies

### agentglow-define-presence-contract: Define the agent presence contract and package architecture

- Phase: foundation
- Repo: agentglow
- Branch: agent/define-presence-contract
- Risk: medium
- Depends on: None
- Can run concurrently with: None
- Dispatchable now: Yes
- Blocked by: None

**Objective**

Specify canonical states, event inputs, theme tokens, renderer boundaries, package layout, and public API naming before any visual work starts.

**Acceptance Criteria**

docs/architecture.md, package skeleton, exported TypeScript types, acceptance examples for idle/listening/thinking/speaking/tool/waiting/blocked/error/success/interrupted.

### agentglow-build-core-state-theme-engine: Build core state machine and theme engine

- Phase: implementation
- Repo: agentglow
- Branch: agent/build-core-state-theme-engine
- Risk: medium
- Depends on: agentglow-define-presence-contract
- Can run concurrently with: agentglow-create-renderer-presets
- Dispatchable now: No
- Blocked by: None

**Objective**

Implement @agentglow/core with validated states, transitions, audio level inputs, theme normalization, reduced-motion options, and deterministic snapshots.

**Acceptance Criteria**

Unit tests cover valid/invalid states, transition metadata, theme defaults, reduced motion, and audio smoothing.

### agentglow-create-renderer-presets: Create the visual renderer and five premium presets

- Phase: implementation
- Repo: agentglow
- Branch: agent/create-renderer-presets
- Risk: medium
- Depends on: agentglow-define-presence-contract
- Can run concurrently with: agentglow-build-core-state-theme-engine
- Dispatchable now: No
- Blocked by: None

**Objective**

Implement a performant renderer with orb, waveform halo, constellation, console pulse, and minimal dot-field presets. Prioritise taste: depth, motion, glow, and brandability.

**Acceptance Criteria**

Preset fixtures render without network access; each state has visible distinction; renderer can degrade gracefully on low-power devices.

### agentglow-build-react-component: Build the React component wrapper and controller hooks

- Phase: implementation
- Repo: agentglow
- Branch: agent/build-react-component
- Risk: medium
- Depends on: agentglow-define-presence-contract, agentglow-build-core-state-theme-engine
- Can run concurrently with: agentglow-audio-reactivity-pipeline
- Dispatchable now: No
- Blocked by: None

**Objective**

Expose <AgentGlow>, useAgentGlowController, and typed props that make the component easy to drop into agent apps.

**Acceptance Criteria**

React smoke tests cover controlled state, theme updates, audio level injection, reduced motion, and cleanup on unmount.

### agentglow-audio-reactivity-pipeline: Implement microphone/output audio reactivity pipeline

- Phase: implementation
- Repo: agentglow
- Branch: agent/audio-reactivity-pipeline
- Risk: medium
- Depends on: agentglow-build-core-state-theme-engine
- Can run concurrently with: agentglow-build-react-component
- Dispatchable now: No
- Blocked by: None

**Objective**

Add analyser input adapters, amplitude/frequency smoothing, silence handling, permission-safe browser behaviour, and mock analyzers for tests.

**Acceptance Criteria**

Mic is opt-in, no hidden recording, output levels can be injected without device permissions, synthetic tests prove smoothing and silence behaviour.

### agentglow-demo-playground: Build the irresistible demo playground

- Phase: demo
- Repo: agentglow
- Branch: agent/demo-playground
- Risk: medium
- Depends on: agentglow-create-renderer-presets, agentglow-build-react-component, agentglow-audio-reactivity-pipeline
- Can run concurrently with: agentglow-crewcmd-integration-example
- Dispatchable now: No
- Blocked by: None

**Objective**

Create a demo that lets users switch presets, states, themes, audio modes, and copy React snippets. Make it screenshot/video worthy.

**Acceptance Criteria**

Demo has simulated events by default, optional mic mode, copyable snippets, keyboard controls, and a “CrewCmd-style run” scenario.

### agentglow-crewcmd-integration-example: Add CrewCmd/AgentPulse integration examples

- Phase: integration
- Repo: agentglow
- Branch: agent/crewcmd-integration-example
- Risk: low
- Depends on: agentglow-build-react-component
- Can run concurrently with: agentglow-demo-playground
- Dispatchable now: No
- Blocked by: None

**Objective**

Show how AgentPulse-style events map to AgentGlow visual states and how VoicePath speaking events drive reactivity.

**Acceptance Criteria**

Examples are runnable or fixture-backed; README explains mappings and extension points.

### agentglow-quality-accessibility-performance: Harden quality, accessibility, and performance

- Phase: verification
- Repo: agentglow
- Branch: agent/quality-accessibility-performance
- Risk: medium
- Depends on: agentglow-demo-playground, agentglow-crewcmd-integration-example
- Can run concurrently with: agentglow-docs-release-polish, agentglow-final-product-review
- Dispatchable now: No
- Blocked by: None

**Objective**

Add visual/performance smoke checks, accessibility labels, reduced-motion verification, and bundle/perf budgets.

**Acceptance Criteria**

Validation reports 60fps target path, graceful 30fps fallback, no network calls in core, contrast-aware themes, and complete tests.

### agentglow-docs-release-polish: Write launch-grade docs and product positioning

- Phase: documentation
- Repo: agentglow
- Branch: agent/docs-release-polish
- Risk: low
- Depends on: agentglow-quality-accessibility-performance
- Can run concurrently with: agentglow-quality-accessibility-performance, agentglow-final-product-review
- Dispatchable now: No
- Blocked by: None

**Objective**

Document API, concepts, presets, accessibility, performance, examples, and product positioning without overselling unfinished features.

**Acceptance Criteria**

README explains why this is not chat UI or a basic waveform; docs include install, quickstart, recipes, and roadmap.

### agentglow-final-product-review: Final product review and release readiness pass

- Phase: final_validation
- Repo: agentglow
- Branch: agent/final-product-review
- Risk: high
- Depends on: agentglow-docs-release-polish
- Can run concurrently with: agentglow-quality-accessibility-performance, agentglow-docs-release-polish
- Dispatchable now: No
- Blocked by: approve high-risk scope before dispatch

**Objective**

Run the project as a user would: install, render, simulate agent states, inspect demo, verify docs, and cut a release checklist.

**Acceptance Criteria**

Human/product review confirms it feels premium enough for CrewCmd dogfooding before public announcement.
