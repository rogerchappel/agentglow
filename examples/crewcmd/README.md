# CrewCmd / AgentPulse integration example

AgentGlow is intentionally event-shaped so CrewCmd-class products can map operational events into one presence surface without leaking prompts, secrets, or raw tool payloads.

## AgentPulse mapping

| AgentPulse-style event | AgentGlow event/state | Notes |
|---|---|---|
| `turn.user_audio_started` | `presence.turn.started` with `source: 'user'` → `listening` | Microphone permission remains owned by the host. |
| `turn.agent_planning` | `presence.state.set` → `thinking` | Use safe messages such as “Planning next step”. |
| `tool.started` | `presence.tool.started` → `tool-running` | Pass a safe `toolName`, not arguments. |
| `approval.required` | `presence.wait.started` → `waiting` | Use `reason: 'approval-required'`. |
| `capability.missing` | `presence.blocked` → `blocked` | Clear intervention-needed state. |
| `voice.output_level` | `presence.audio.output` | Drives `speaking` bloom without recording. |
| `turn.completed` | `presence.turn.completed` → `success` | Host may settle back to `idle`. |
| `turn.cancelled` | `presence.turn.interrupted` → `interrupted` | Not an error or success. |

## Fixture-backed run

See [`agentpulse-fixture.mjs`](agentpulse-fixture.mjs) for a runnable mapping helper. It uses `@agentglow/core` directly and can be adapted inside a React app by passing snapshots into `<AgentGlow />` or by sending equivalent events through `useAgentGlowController`.

## Extension points

- Add product-specific event adapters at the edge, not inside AgentGlow core.
- Keep tool metadata safe: names, high-level reasons, progress; never raw secrets or payloads.
- VoicePath/TTS systems can inject `speechLevel` and `frequencyBands` without microphone permissions.
