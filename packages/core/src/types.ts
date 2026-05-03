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
export type AgentGlowTone = 'neutral' | 'receptive' | 'active' | 'productive' | 'caution' | 'danger' | 'positive' | 'paused';
export type AgentGlowUrgency = 'none' | 'low' | 'medium' | 'high';

export interface AgentGlowStateMeta {
  state: AgentGlowState;
  tone: AgentGlowTone;
  urgency: AgentGlowUrgency;
  ariaLabel: string;
  isTerminal: boolean;
}

export type AgentGlowWaitReason = 'approval-required' | 'user-input' | 'rate-limit' | 'dependency' | 'scheduled-resume';
export type AgentGlowBlockedReason = 'missing-permission' | 'missing-input' | 'tool-unavailable' | 'policy' | 'network';

export interface AgentGlowEventMeta {
  runId?: string;
  toolName?: string;
  message?: string;
  reason?: string;
  progress?: number;
  source?: 'user' | 'agent' | 'system';
  recoverable?: boolean;
  [key: string]: unknown;
}

export interface AgentGlowInput {
  speechLevel?: number;
  inputLevel?: number;
  frequencyBands?: readonly number[];
  activityLevel?: number;
  progress?: number;
}

export type AgentGlowEvent =
  | { type: 'presence.state.set'; state: AgentGlowState; meta?: AgentGlowEventMeta }
  | { type: 'presence.turn.started'; source?: 'user' | 'agent' | 'system'; runId?: string; message?: string }
  | { type: 'presence.turn.completed'; runId?: string; message?: string }
  | { type: 'presence.turn.interrupted'; runId?: string; reason?: string; message?: string }
  | ({ type: 'presence.audio.input' } & AgentGlowInput)
  | ({ type: 'presence.audio.output' } & AgentGlowInput)
  | { type: 'presence.tool.started'; toolName: string; runId?: string; message?: string }
  | { type: 'presence.tool.completed'; toolName?: string; runId?: string; message?: string }
  | { type: 'presence.tool.failed'; toolName?: string; runId?: string; recoverable?: boolean; message?: string }
  | { type: 'presence.wait.started'; reason?: AgentGlowWaitReason | string; runId?: string; message?: string }
  | { type: 'presence.blocked'; reason?: AgentGlowBlockedReason | string; runId?: string; message?: string }
  | { type: 'presence.error'; recoverable?: boolean; runId?: string; message?: string };

export type AgentGlowPreset = 'orb' | 'waveform-halo' | 'constellation' | 'console-pulse' | 'minimal-dot-field';
export type AgentGlowMood = 'calm' | 'focused' | 'energetic' | 'urgent' | 'celebratory';
export type AgentGlowTempo = 'slow' | 'measured' | 'brisk' | 'rapid';
export type AgentGlowRadius = 'soft' | 'balanced' | 'sharp';
export type AgentGlowContrast = 'auto' | 'standard' | 'high';
export type AgentGlowQuality = 'auto' | 'high' | 'balanced' | 'low-power';

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

export interface NormalizedAgentGlowPalette {
  background: string;
  surface: string;
  accent: string;
  accentSecondary: string;
  success: string;
  warning: string;
  danger: string;
  muted: string;
  text: string;
}

export interface AgentGlowMotionTokens {
  intensity?: number;
  tempo?: AgentGlowTempo;
  reduced?: boolean;
}

export interface NormalizedAgentGlowMotionTokens {
  intensity: number;
  tempo: AgentGlowTempo;
  reduced: boolean;
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

export interface NormalizedAgentGlowTheme {
  palette: NormalizedAgentGlowPalette;
  mood: AgentGlowMood;
  motion: NormalizedAgentGlowMotionTokens;
  shape: AgentGlowPreset;
  density: number;
  glow: number;
  radius: AgentGlowRadius;
  contrast: AgentGlowContrast;
  brand?: AgentGlowBrandTokens;
}

export interface AgentGlowSnapshot {
  state: AgentGlowState;
  label: string;
  tone: AgentGlowTone;
  urgency: AgentGlowUrgency;
  isTerminal: boolean;
  theme: NormalizedAgentGlowTheme;
  input: Required<Pick<AgentGlowInput, 'speechLevel' | 'inputLevel' | 'activityLevel' | 'progress'>> & { frequencyBands: number[] };
  meta: AgentGlowEventMeta;
  updatedAt: number;
  reducedMotion: boolean;
}

export interface AgentGlowControllerOptions {
  state?: AgentGlowState;
  preset?: AgentGlowPreset;
  theme?: AgentGlowTheme;
  input?: AgentGlowInput;
  reducedMotion?: boolean;
  label?: string;
  now?: () => number;
  smoothing?: number;
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

export interface AgentGlowRendererWarning {
  code: 'webgl-unavailable' | 'low-power-mode' | 'reduced-motion' | 'renderer-fallback' | 'network-disabled';
  message: string;
}

export interface AgentGlowRenderOptions {
  width?: number;
  height?: number;
  quality?: AgentGlowQuality;
  pixelRatio?: number;
  title?: string;
}

export interface AgentGlowPresetFrame {
  preset: AgentGlowPreset;
  label: string;
  svg: string;
  warnings: AgentGlowRendererWarning[];
  fpsTarget: 60 | 30;
}

export interface AgentGlowAudioSmoothingOptions {
  attack?: number;
  release?: number;
  silenceThreshold?: number;
  silenceFrames?: number;
}

export interface AgentGlowAudioFrame {
  level: number;
  bands: number[];
  silent: boolean;
}

export interface AgentGlowTimelineStep {
  event: AgentGlowEvent;
  snapshot: AgentGlowSnapshot;
}

export interface AgentGlowTimeline {
  initial: AgentGlowSnapshot;
  steps: AgentGlowTimelineStep[];
  final: AgentGlowSnapshot;
}

export interface AgentGlowAnalyserLike {
  frequencyBinCount?: number;
  getByteFrequencyData?: (array: Uint8Array) => void;
  getFloatTimeDomainData?: (array: Float32Array) => void;
}

export declare function createAgentGlowController(options?: AgentGlowControllerOptions): AgentGlowController;
export declare function getAgentGlowStateMeta(state: AgentGlowState): AgentGlowStateMeta;
export declare function normalizeAgentGlowTheme(theme?: AgentGlowTheme): NormalizedAgentGlowTheme;
export declare function mapAgentGlowEventToState(event: AgentGlowEvent): AgentGlowState | undefined;
