import { createAgentGlowController } from '../../packages/core/src/index.ts';

export function mapAgentPulseEvent(event) {
  switch (event.type) {
    case 'turn.user_audio_started': return { type: 'presence.turn.started', source: 'user', runId: event.runId };
    case 'turn.agent_planning': return { type: 'presence.state.set', state: 'thinking', meta: { runId: event.runId, message: 'Planning next step' } };
    case 'tool.started': return { type: 'presence.tool.started', toolName: event.toolName, runId: event.runId };
    case 'approval.required': return { type: 'presence.wait.started', reason: 'approval-required', message: event.message ?? 'Waiting for approval', runId: event.runId };
    case 'capability.missing': return { type: 'presence.blocked', reason: 'missing-permission', message: event.message, runId: event.runId };
    case 'voice.output_level': return { type: 'presence.audio.output', speechLevel: event.level, frequencyBands: event.bands };
    case 'turn.completed': return { type: 'presence.turn.completed', runId: event.runId };
    case 'turn.cancelled': return { type: 'presence.turn.interrupted', reason: event.reason, runId: event.runId };
    default: return null;
  }
}

export function runCrewCmdFixture(events) {
  const glow = createAgentGlowController({ preset: 'console-pulse' });
  const snapshots = [];
  for (const event of events) {
    const mapped = mapAgentPulseEvent(event);
    if (mapped) glow.send(mapped);
    snapshots.push(glow.getSnapshot());
  }
  glow.destroy();
  return snapshots;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const snapshots = runCrewCmdFixture([
    { type: 'turn.user_audio_started', runId: 'run_demo' },
    { type: 'turn.agent_planning', runId: 'run_demo' },
    { type: 'tool.started', toolName: 'github.createPullRequest', runId: 'run_demo' },
    { type: 'voice.output_level', level: 0.72, bands: [0.2, 0.5, 0.8] },
    { type: 'turn.completed', runId: 'run_demo' },
  ]);
  console.log(JSON.stringify(snapshots.map(({ state, label, meta }) => ({ state, label, meta })), null, 2));
}
