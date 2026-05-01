# AgentGlow recipes

## Approval wait state

```ts
glow.send({
  type: 'presence.wait.started',
  reason: 'approval-required',
  message: 'Waiting for PR approval',
});
```

Use `waiting`, not `blocked`, when the next action is expected and healthy.

## Tool progress

```ts
glow.send({ type: 'presence.tool.started', toolName: 'github.createPullRequest' });
glow.setInput({ progress: 0.35, activityLevel: 0.8 });
```

Progress is optional. Omit it for indeterminate tool loops.

## TTS/output reactivity without a microphone

```ts
glow.setState('speaking');
glow.send({ type: 'presence.audio.output', speechLevel: 0.62, frequencyBands: [0.1, 0.4, 0.8] });
```

This path needs no device permission because the host already owns the output signal.

## Reduced motion host preference

```tsx
<AgentGlow state="thinking" reducedMotion quality="low-power" />
```

Renderers should replace loops with stable poses and report warnings for verification.
