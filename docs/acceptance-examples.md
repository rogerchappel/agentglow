# AgentGlow Acceptance Examples

These examples define the minimum observable contract for each canonical state. They are intentionally implementation-neutral so core, React, renderer, and demo work can share the same acceptance target.

## Shared Fixture

```ts
const theme = {
  palette: { accent: '#8B5CF6', background: '#05030A', text: '#F7F2FF' },
  mood: 'focused',
  motion: { intensity: 0.7, tempo: 'measured' },
  glow: 0.72,
  density: 0.58,
  contrast: 'auto',
};
```

## State Examples

### `idle`

```ts
glow.setState('idle');
expect(glow.getSnapshot()).toMatchObject({
  state: 'idle',
  label: 'Agent idle',
  urgency: 'none',
});
```

Acceptance: calm resting pose, no implied recording or work, accessible label says the agent is idle.

### `listening`

```ts
glow.send({ type: 'presence.turn.started', source: 'user' });
glow.setInput({ inputLevel: 0.48, frequencyBands: [0.2, 0.5, 0.3] });
```

Acceptance: receptive animation responds to user input level, microphone permission remains host-owned, label communicates listening.

### `thinking`

```ts
glow.setState('thinking', { runId: 'run_123', message: 'Planning next step' });
glow.setInput({ activityLevel: 0.64 });
```

Acceptance: productive reasoning motion without tool/progress affordance, safe metadata only, no raw prompt content required.

### `speaking`

```ts
glow.setState('speaking');
glow.setInput({ speechLevel: 0.62, frequencyBands: [0.1, 0.4, 0.8] });
```

Acceptance: speech output level drives bloom/wave intensity, state remains understandable when audio input is omitted.

### `tool-running`

```ts
glow.send({
  type: 'presence.tool.started',
  toolName: 'github.createPullRequest',
  runId: 'run_123',
});
glow.setInput({ progress: 0.35, activityLevel: 0.8 });
```

Acceptance: renderer shows deliberate work-in-progress distinct from thinking, safe tool name may be displayed, determinate progress is optional.

### `waiting`

```ts
glow.send({
  type: 'presence.wait.started',
  reason: 'approval-required',
  message: 'Waiting for PR approval',
});
```

Acceptance: paused/hold visual language, caution tone, no error implication, label tells the user the agent is waiting.

### `blocked`

```ts
glow.send({
  type: 'presence.blocked',
  reason: 'missing-permission',
  message: 'GitHub token cannot create releases',
});
```

Acceptance: clear intervention-needed state, high enough contrast without relying only on color, metadata remains safe and concise.

### `error`

```ts
glow.send({
  type: 'presence.error',
  recoverable: true,
  message: 'Renderer failed to initialise; using fallback',
});
```

Acceptance: fault is visibly distinct from blocked, red/danger semantic token is available, renderer can still degrade gracefully.

### `success`

```ts
glow.send({ type: 'presence.turn.completed', runId: 'run_123' });
```

Acceptance: short positive completion cue, then host may settle to idle; snapshot can mark terminal success for run history.

### `interrupted`

```ts
glow.send({
  type: 'presence.turn.interrupted',
  runId: 'run_123',
  reason: 'superseded-by-new-user-input',
});
```

Acceptance: clear cancellation/supersession cue, not styled as failure, renderer settles without celebratory or error affordance.
