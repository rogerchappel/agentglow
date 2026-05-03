# Safety

AgentGlow is intentionally local-first UI infrastructure.

## Guarantees for V1

- The core package performs no network calls.
- The SVG renderer is deterministic from an `AgentGlowSnapshot`.
- Microphone access is opt-in only through `createMicrophoneAgentGlowInput()` and should be called from explicit user UI.
- Output/speech levels can be injected as numbers; no audio capture is required for normal use.
- Fixtures and demo simulations run without device permissions.
- Agent state labels are exposed as non-audio accessibility text.

## Integration guidance

- Do not imply AgentGlow is listening unless your app is actually in a user-authorized listening state.
- Map blocked/waiting states clearly when human approval or missing permissions are required.
- Respect reduced-motion preferences and provide a non-animated fallback.
- Keep product telemetry outside AgentGlow; this repository does not ship analytics.
