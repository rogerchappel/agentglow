export const AGENT_GLOW_STATES = [
  'idle',
  'listening',
  'thinking',
  'speaking',
  'tool-running',
  'waiting',
  'blocked',
  'error',
  'success',
  'interrupted',
] as const;

export type AgentGlowState = (typeof AGENT_GLOW_STATES)[number];

export type AgentGlowTone =
  | 'neutral'
  | 'receptive'
  | 'active'
  | 'productive'
  | 'caution'
  | 'danger'
  | 'positive'
  | 'paused';

export type AgentGlowUrgency = 'none' | 'low' | 'medium' | 'high';

export interface AgentGlowStateMeta {
  state: AgentGlowState;
  tone: AgentGlowTone;
  urgency: AgentGlowUrgency;
  ariaLabel: string;
  isTerminal: boolean;
}

export type AgentGlowEvent =
  | { type: 'presence.state.set'; state: AgentGlowState; meta?: AgentGlowEventMeta }
  | { type: 'presence.turn.started'; source?: 'user' | 'agent' | 'system'; runId?: string }
  | { type: 'presence.turn.completed'; runId?: string }
  | { type: 'presence.turn.interrupted'; runId?: string; reason?: string }
  | ({ type: 'presence.audio.input' } & AgentGlowInput)
  | ({ type: 'presence.audio.output' } & AgentGlowInput)
  | { type: 'presence.tool.started'; toolName: string; runId?: string; message?: string }
  | { type: 'presence.tool.completed'; toolName?: string; runId?: string; message?: string }
  | { type: 'presence.tool.failed'; toolName?: string; runId?: string; recoverable?: boolean; message?: string }
  | { type: 'presence.wait.started'; reason?: AgentGlowWaitReason | string; runId?: string; message?: string }
  | { type: 'presence.blocked'; reason?: AgentGlowBlockedReason | string; runId?: string; message?: string }
  | { type: 'presence.error'; recoverable?: boolean; runId?: string; message?: string };

export interface AgentGlowEventMeta {
  runId?: string;
  toolName?: string;
  message?: string;
  reason?: string;
  progress?: number;
  [key: string]: unknown;
}

export type AgentGlowWaitReason = 'approval-required' | 'user-input' | 'rate-limit' | 'dependency' | 'scheduled-resume';
export type AgentGlowBlockedReason = 'missing-permission' | 'missing-input' | 'tool-unavailable' | 'policy' | 'network';

export interface AgentGlowInput {
  speechLevel?: number;
  inputLevel?: number;
  frequencyBands?: readonly number[];
  activityLevel?: number;
  progress?: number;
}

export type AgentGlowPreset = 'orb' | 'waveform-halo' | 'constellation' | 'console-pulse' | 'minimal-dot-field';

export type AgentGlowMood = 'calm' | 'focused' | 'energetic' | 'urgent' | 'celebratory';
export type AgentGlowTempo = 'slow' | 'measured' | 'brisk' | 'rapid';
export type AgentGlowRadius = 'soft' | 'balanced' | 'sharp';
export type AgentGlowContrast = 'auto' | 'standard' | 'high';

export interface AgentGlowPalette {
  background?: string;
  surface?: string;
  accent?: string;
  accentSecondary?: string;
  success?: string;
  warning?: string;
  danger?: string;
  muted?: string;
  text?: string;
}

export interface AgentGlowMotionTokens {
  intensity?: number;
  tempo?: AgentGlowTempo;
  reduced?: boolean;
}

export interface AgentGlowBrandTokens {
  fontFamily?: string;
  logoMark?: string;
  cornerStyle?: 'rounded' | 'squircle' | 'technical' | 'none';
  [key: string]: unknown;
}

export interface AgentGlowTheme {
  palette?: AgentGlowPalette;
  mood?: AgentGlowMood;
  motion?: AgentGlowMotionTokens;
  shape?: AgentGlowPreset;
  density?: number;
  glow?: number;
  radius?: AgentGlowRadius;
  contrast?: AgentGlowContrast;
  brand?: AgentGlowBrandTokens;
}

export interface AgentGlowSnapshot {
  state: AgentGlowState;
  label: string;
  tone: AgentGlowTone;
  urgency: AgentGlowUrgency;
  isTerminal: boolean;
  theme: Required<Omit<AgentGlowTheme, 'brand'>> & { brand?: AgentGlowBrandTokens };
  input: AgentGlowInput;
  meta: AgentGlowEventMeta;
  updatedAt: number;
}

export interface AgentGlowControllerOptions {
  state?: AgentGlowState;
  preset?: AgentGlowPreset;
  theme?: AgentGlowTheme;
  input?: AgentGlowInput;
  reducedMotion?: boolean;
  label?: string;
}

export interface AgentGlowController {
  setState(state: AgentGlowState, meta?: AgentGlowEventMeta): void;
  send(event: AgentGlowEvent): void;
  setInput(input: AgentGlowInput): void;
  setTheme(theme: AgentGlowTheme): void;
  getSnapshot(): AgentGlowSnapshot;
  subscribe(listener: AgentGlowSnapshotListener): () => void;
  destroy(): void;
}

export type AgentGlowSnapshotListener = (snapshot: AgentGlowSnapshot) => void;

export declare function createAgentGlowController(options?: AgentGlowControllerOptions): AgentGlowController;
export declare function getAgentGlowStateMeta(state: AgentGlowState): AgentGlowStateMeta;
export declare function normalizeAgentGlowTheme(theme?: AgentGlowTheme): AgentGlowSnapshot['theme'];
