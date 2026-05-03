export * from './types.ts';

import {
  AGENT_GLOW_STATES,
  type AgentGlowAudioFrame,
  type AgentGlowAnalyserLike,
  type AgentGlowAudioSmoothingOptions,
  type AgentGlowController,
  type AgentGlowControllerOptions,
  type AgentGlowEvent,
  type AgentGlowEventMeta,
  type AgentGlowInput,
  type AgentGlowPreset,
  type AgentGlowPresetFrame,
  type AgentGlowRenderOptions,
  type AgentGlowSnapshot,
  type AgentGlowSnapshotListener,
  type AgentGlowState,
  type AgentGlowStateMeta,
  type AgentGlowTheme,
  type AgentGlowTimeline,
  type NormalizedAgentGlowTheme,
} from './types.ts';

const STATE_META: Record<AgentGlowState, AgentGlowStateMeta> = {
  idle: { state: 'idle', tone: 'neutral', urgency: 'none', ariaLabel: 'Agent idle', isTerminal: false },
  listening: { state: 'listening', tone: 'receptive', urgency: 'low', ariaLabel: 'Agent listening', isTerminal: false },
  thinking: { state: 'thinking', tone: 'active', urgency: 'low', ariaLabel: 'Agent thinking', isTerminal: false },
  speaking: { state: 'speaking', tone: 'productive', urgency: 'low', ariaLabel: 'Agent speaking', isTerminal: false },
  'tool-running': { state: 'tool-running', tone: 'productive', urgency: 'medium', ariaLabel: 'Agent running a tool', isTerminal: false },
  waiting: { state: 'waiting', tone: 'caution', urgency: 'medium', ariaLabel: 'Agent waiting', isTerminal: false },
  blocked: { state: 'blocked', tone: 'paused', urgency: 'high', ariaLabel: 'Agent blocked', isTerminal: false },
  error: { state: 'error', tone: 'danger', urgency: 'high', ariaLabel: 'Agent error', isTerminal: true },
  success: { state: 'success', tone: 'positive', urgency: 'none', ariaLabel: 'Agent success', isTerminal: true },
  interrupted: { state: 'interrupted', tone: 'paused', urgency: 'medium', ariaLabel: 'Agent interrupted', isTerminal: true },
};

const DEFAULT_THEME: NormalizedAgentGlowTheme = {
  palette: {
    background: '#05030A',
    surface: '#171322',
    accent: '#8B5CF6',
    accentSecondary: '#22D3EE',
    success: '#34D399',
    warning: '#FBBF24',
    danger: '#FB7185',
    muted: '#8B8797',
    text: '#F7F2FF',
  },
  mood: 'focused',
  motion: { intensity: 0.68, tempo: 'measured', reduced: false },
  shape: 'orb',
  density: 0.58,
  glow: 0.72,
  radius: 'balanced',
  contrast: 'auto',
};

const PRESET_LABELS: Record<AgentGlowPreset, string> = {
  orb: 'Layered orb',
  'waveform-halo': 'Waveform halo',
  constellation: 'Constellation field',
  'console-pulse': 'Console pulse',
  'minimal-dot-field': 'Minimal dot field',
};

function clamp(value: unknown, fallback = 0): number {
  const numeric = typeof value === 'number' && Number.isFinite(value) ? value : fallback;
  return Math.min(1, Math.max(0, numeric));
}

function cleanMeta(meta: AgentGlowEventMeta = {}): AgentGlowEventMeta {
  const out: AgentGlowEventMeta = {};
  for (const [key, value] of Object.entries(meta)) {
    if (value === undefined || typeof value === 'function' || typeof value === 'symbol') continue;
    if (key === 'progress') out.progress = clamp(value);
    else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') out[key] = value;
  }
  return out;
}

function normalizeInput(input: AgentGlowInput = {}, previous?: AgentGlowSnapshot['input'], smoothing = 0.35): AgentGlowSnapshot['input'] {
  const blend = (next: unknown, prior: number, fallback = 0) => {
    if (next === undefined) return prior ?? fallback;
    return Number((prior + (clamp(next, fallback) - prior) * clamp(smoothing, 0.35)).toFixed(4));
  };
  const prior = previous ?? { speechLevel: 0, inputLevel: 0, activityLevel: 0, progress: 0, frequencyBands: [] };
  return {
    speechLevel: blend(input.speechLevel, prior.speechLevel),
    inputLevel: blend(input.inputLevel, prior.inputLevel),
    activityLevel: blend(input.activityLevel, prior.activityLevel),
    progress: blend(input.progress, prior.progress),
    frequencyBands: input.frequencyBands ? Array.from(input.frequencyBands, (band) => clamp(band)) : prior.frequencyBands,
  };
}


export function mapAgentGlowEventToState(event: AgentGlowEvent): AgentGlowState | undefined {
  switch (event.type) {
    case 'presence.state.set': return event.state;
    case 'presence.turn.started': return event.source === 'user' ? 'listening' : 'thinking';
    case 'presence.turn.completed': return 'success';
    case 'presence.turn.interrupted': return 'interrupted';
    case 'presence.tool.started': return 'tool-running';
    case 'presence.tool.completed': return 'success';
    case 'presence.tool.failed': return event.recoverable === false ? 'blocked' : 'error';
    case 'presence.wait.started': return 'waiting';
    case 'presence.blocked': return 'blocked';
    case 'presence.error': return 'error';
    case 'presence.audio.input':
    case 'presence.audio.output': return undefined;
    default: throw new Error(`Unsupported AgentGlow event: ${(event as { type?: string }).type}`);
  }
}

export function getAgentGlowStateMeta(state: AgentGlowState): AgentGlowStateMeta {
  if (!AGENT_GLOW_STATES.includes(state)) throw new Error(`Unknown AgentGlow state: ${String(state)}`);
  return STATE_META[state];
}

export function normalizeAgentGlowTheme(theme: AgentGlowTheme = {}): NormalizedAgentGlowTheme {
  const contrast = theme.contrast ?? DEFAULT_THEME.contrast;
  const high = contrast === 'high';
  const motion = { ...DEFAULT_THEME.motion, ...theme.motion };
  const palette = { ...DEFAULT_THEME.palette, ...theme.palette };
  if (high || contrast === 'auto') {
    palette.text = theme.palette?.text ?? '#FFFFFF';
    palette.background = theme.palette?.background ?? '#020107';
    palette.muted = theme.palette?.muted ?? '#C9C2D8';
  }
  return {
    palette,
    mood: theme.mood ?? DEFAULT_THEME.mood,
    motion: { intensity: clamp(motion.intensity, DEFAULT_THEME.motion.intensity), tempo: motion.tempo, reduced: Boolean(motion.reduced) },
    shape: theme.shape ?? DEFAULT_THEME.shape,
    density: clamp(theme.density, DEFAULT_THEME.density),
    glow: clamp(theme.glow, DEFAULT_THEME.glow),
    radius: theme.radius ?? DEFAULT_THEME.radius,
    contrast,
    ...(theme.brand ? { brand: { ...theme.brand } } : {}),
  };
}

export function createAgentGlowController(options: AgentGlowControllerOptions = {}): AgentGlowController {
  let destroyed = false;
  let state = options.state ?? 'idle';
  let theme = normalizeAgentGlowTheme({ ...options.theme, shape: options.preset ?? options.theme?.shape, motion: { ...options.theme?.motion, reduced: options.reducedMotion ?? options.theme?.motion?.reduced } });
  let input = normalizeInput(options.input);
  let meta: AgentGlowEventMeta = {};
  let labelOverride = options.label;
  const now = options.now ?? (() => Date.now());
  const listeners = new Set<AgentGlowSnapshotListener>();
  let updatedAt = now();

  const snapshot = (): AgentGlowSnapshot => {
    const stateMeta = getAgentGlowStateMeta(state);
    return {
      state,
      label: labelOverride ?? stateMeta.ariaLabel,
      tone: stateMeta.tone,
      urgency: stateMeta.urgency,
      isTerminal: stateMeta.isTerminal,
      theme,
      input,
      meta: { ...meta },
      updatedAt,
      reducedMotion: theme.motion.reduced,
    };
  };
  const emit = () => {
    if (destroyed) return;
    updatedAt = now();
    const next = snapshot();
    listeners.forEach((listener) => listener(next));
  };
  const setState = (nextState: AgentGlowState, nextMeta: AgentGlowEventMeta = {}) => {
    getAgentGlowStateMeta(nextState);
    state = nextState;
    meta = cleanMeta(nextMeta);
    if (meta.message && typeof meta.message === 'string') labelOverride = meta.message.length <= 80 ? meta.message : undefined;
    emit();
  };
  return {
    setState,
    send(event: AgentGlowEvent) {
      switch (event.type) {
        case 'presence.state.set': setState(event.state, event.meta); break;
        case 'presence.turn.started':
        case 'presence.turn.completed':
        case 'presence.turn.interrupted': {
          const nextState = mapAgentGlowEventToState(event);
          if (nextState) setState(nextState, event);
          break;
        }
        case 'presence.audio.input': input = normalizeInput({ inputLevel: event.inputLevel, frequencyBands: event.frequencyBands }, input, options.smoothing); emit(); break;
        case 'presence.audio.output': input = normalizeInput({ speechLevel: event.speechLevel, frequencyBands: event.frequencyBands }, input, options.smoothing); emit(); break;
        case 'presence.tool.started':
        case 'presence.tool.completed':
        case 'presence.tool.failed':
        case 'presence.wait.started':
        case 'presence.blocked':
        case 'presence.error': {
          const nextState = mapAgentGlowEventToState(event);
          if (nextState) setState(nextState, event);
          break;
        }
        default: throw new Error(`Unsupported AgentGlow event: ${(event as { type?: string }).type}`);
      }
    },
    setInput(nextInput: AgentGlowInput) { input = normalizeInput(nextInput, input, options.smoothing); meta = { ...meta, ...(nextInput.progress !== undefined ? { progress: input.progress } : {}) }; emit(); },
    setTheme(nextTheme: AgentGlowTheme) { theme = normalizeAgentGlowTheme({ ...theme, ...nextTheme, palette: { ...theme.palette, ...nextTheme.palette }, motion: { ...theme.motion, ...nextTheme.motion } }); emit(); },
    getSnapshot: snapshot,
    subscribe(listener: AgentGlowSnapshotListener) { listeners.add(listener); listener(snapshot()); return () => { listeners.delete(listener); }; },
    destroy() { destroyed = true; listeners.clear(); },
  };
}

export function createAgentGlowAudioSmoother(options: AgentGlowAudioSmoothingOptions = {}) {
  const attack = clamp(options.attack, 0.45);
  const release = clamp(options.release, 0.12);
  const silenceThreshold = options.silenceThreshold ?? 0.025;
  const requiredSilentFrames = options.silenceFrames ?? 6;
  let level = 0;
  let silentFrames = 0;
  return {
    push(samples: ArrayLike<number> | AgentGlowInput): AgentGlowAudioFrame {
      const rawLevel = 'speechLevel' in samples || 'inputLevel' in samples
        ? clamp((samples as AgentGlowInput).speechLevel ?? (samples as AgentGlowInput).inputLevel)
        : Array.from(samples as ArrayLike<number>).reduce((sum, sample) => sum + Math.abs(Number(sample) || 0), 0) / Math.max(1, (samples as ArrayLike<number>).length);
      level = level + (clamp(rawLevel) - level) * (rawLevel > level ? attack : release);
      silentFrames = level < silenceThreshold ? silentFrames + 1 : 0;
      const bands = 'frequencyBands' in samples && (samples as AgentGlowInput).frequencyBands ? Array.from((samples as AgentGlowInput).frequencyBands!, clamp) : [level, Math.min(1, level * 0.75), Math.min(1, level * 0.5)];
      return { level: Number(level.toFixed(4)), bands, silent: silentFrames >= requiredSilentFrames };
    },
    reset() { level = 0; silentFrames = 0; },
  };
}

export function createAgentGlowMockAnalyser(frames: AgentGlowInput[] = []) {
  let index = 0;
  return {
    next(): AgentGlowInput {
      const frame = frames[index] ?? { inputLevel: 0, speechLevel: 0, frequencyBands: [0, 0, 0] };
      index = Math.min(index + 1, frames.length);
      return frame;
    },
    reset() { index = 0; },
  };
}


export function createAgentGlowTimeline(events: AgentGlowEvent[], options: AgentGlowControllerOptions = {}): AgentGlowTimeline {
  const controller = createAgentGlowController(options);
  const initial = controller.getSnapshot();
  const steps = events.map((event) => {
    controller.send(event);
    return { event, snapshot: controller.getSnapshot() };
  });
  const final = controller.getSnapshot();
  controller.destroy();
  return { initial, steps, final };
}

export function readAgentGlowAnalyserFrame(analyser: AgentGlowAnalyserLike, options: { bins?: number } = {}): AgentGlowInput {
  const binCount = Math.max(1, options.bins ?? analyser.frequencyBinCount ?? 32);
  const frequency = new Uint8Array(binCount);
  const timeDomain = new Float32Array(binCount);
  analyser.getByteFrequencyData?.(frequency);
  analyser.getFloatTimeDomainData?.(timeDomain);
  const frequencyBands = Array.from(frequency, (value) => clamp(value / 255));
  const speechLevel = timeDomain.some(Boolean)
    ? clamp(timeDomain.reduce((sum, sample) => sum + Math.abs(sample), 0) / timeDomain.length)
    : clamp(frequencyBands.reduce((sum, band) => sum + band, 0) / frequencyBands.length);
  return { speechLevel, inputLevel: speechLevel, activityLevel: Math.max(speechLevel, ...frequencyBands), frequencyBands };
}

export async function createMicrophoneAgentGlowInput() {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    throw new Error('Microphone input requires a browser host with getUserMedia and explicit user activation.');
  }
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  return { stream, permission: 'granted' as const };
}

function esc(value: string): string { return value.replace(/[&<>\"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]!); }

export function renderAgentGlowToSvg(snapshot: AgentGlowSnapshot, options: AgentGlowRenderOptions = {}): AgentGlowPresetFrame {
  const width = options.width ?? 320;
  const height = options.height ?? 320;
  const cx = width / 2;
  const cy = height / 2;
  const size = Math.min(width, height);
  const theme = snapshot.theme;
  const p = theme.palette;
  const energy = Math.max(snapshot.input.speechLevel, snapshot.input.inputLevel, snapshot.input.activityLevel, snapshot.state === 'success' ? 0.82 : 0.18);
  const reduced = snapshot.reducedMotion || options.quality === 'low-power';
  const warnings = reduced ? [{ code: snapshot.reducedMotion ? 'reduced-motion' : 'low-power-mode', message: 'Renderer is using a static low-motion pose.' } as const] : [];
  const fpsTarget = options.quality === 'low-power' ? 30 : 60;
  const accent = snapshot.state === 'error' ? p.danger : snapshot.state === 'waiting' || snapshot.state === 'blocked' ? p.warning : snapshot.state === 'success' ? p.success : p.accent;
  const title = esc(options.title ?? snapshot.label);
  const base = `<svg role="img" aria-label="${title}" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><title>${title}</title><rect width="100%" height="100%" rx="${theme.radius === 'sharp' ? 8 : 28}" fill="${p.background}"/><defs><radialGradient id="g"><stop offset="0" stop-color="${p.surface}"/><stop offset="0.55" stop-color="${accent}" stop-opacity="0.62"/><stop offset="1" stop-color="${p.accentSecondary}" stop-opacity="0"/></radialGradient><filter id="glow"><feGaussianBlur stdDeviation="${8 + theme.glow * 16}" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
  const pulse = reduced ? '' : `<animateTransform attributeName="transform" attributeType="XML" type="scale" values="1;${(1 + energy * 0.08).toFixed(3)};1" dur="${theme.motion.tempo === 'rapid' ? 0.9 : 1.8}s" repeatCount="indefinite"/>`;
  let body = '';
  if (theme.shape === 'orb') body = `<g transform="translate(${cx} ${cy})"><circle r="${size * (0.2 + energy * 0.06)}" fill="url(#g)" filter="url(#glow)">${pulse}</circle><circle r="${size * 0.31}" fill="none" stroke="${accent}" stroke-width="2" stroke-opacity="0.45" stroke-dasharray="8 12"/></g>`;
  if (theme.shape === 'waveform-halo') body = `<g fill="none" stroke="${accent}" stroke-linecap="round">${Array.from({ length: 28 }, (_, i) => { const a = (i / 28) * Math.PI * 2; const amp = 18 + energy * 36 * ((i % 5) / 5 + 0.35); const x1 = cx + Math.cos(a) * size * 0.22; const y1 = cy + Math.sin(a) * size * 0.22; const x2 = cx + Math.cos(a) * (size * 0.22 + amp); const y2 = cy + Math.sin(a) * (size * 0.22 + amp); return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke-width="${1 + energy * 4}" opacity="${0.35 + energy * 0.45}"/>`; }).join('')}</g>`;
  if (theme.shape === 'constellation') body = `<g>${Array.from({ length: 22 }, (_, i) => { const x = 40 + ((i * 53) % (width - 80)); const y = 40 + ((i * 89) % (height - 80)); return `<circle cx="${x}" cy="${y}" r="${2 + ((i % 4) * energy)}" fill="${i % 3 ? accent : p.accentSecondary}" opacity="${0.35 + energy * 0.55}"/>`; }).join('')}<circle cx="${cx}" cy="${cy}" r="${size * 0.18}" fill="none" stroke="${accent}" opacity="0.7"/></g>`;
  if (theme.shape === 'console-pulse') body = `<g>${Array.from({ length: 9 }, (_, i) => `<rect x="${44 + i * 26}" y="${cy - 12 - (i % 3) * energy * 18}" width="14" height="${24 + energy * 42 * ((i % 4 + 1) / 4)}" rx="4" fill="${accent}" opacity="${0.35 + i / 14}"/>`).join('')}<path d="M46 ${cy + size * 0.22} H ${width - 46}" stroke="${p.muted}" stroke-width="2" stroke-dasharray="4 8"/></g>`;
  if (theme.shape === 'minimal-dot-field') body = `<g>${Array.from({ length: 36 }, (_, i) => `<circle cx="${28 + ((i * 41) % (width - 56))}" cy="${28 + ((i * 67) % (height - 56))}" r="${1.5 + energy * (i % 5)}" fill="${i % 6 === 0 ? accent : p.muted}" opacity="${0.25 + energy * 0.5}"/>`).join('')}</g>`;
  const readout = `<text x="${cx}" y="${height - 24}" text-anchor="middle" fill="${p.text}" font-family="${theme.brand?.fontFamily ?? 'Inter, system-ui, sans-serif'}" font-size="14">${esc(snapshot.label)}</text>`;
  return { preset: theme.shape, label: `${PRESET_LABELS[theme.shape]} / ${snapshot.state}`, svg: `${base}${body}${readout}</svg>`, warnings, fpsTarget };
}

export function renderPresetFixture(preset: AgentGlowPreset, state: AgentGlowState = 'thinking'): AgentGlowPresetFrame {
  const controller = createAgentGlowController({ state, preset, input: { activityLevel: 0.66, speechLevel: state === 'speaking' ? 0.72 : 0 } });
  return renderAgentGlowToSvg(controller.getSnapshot(), { quality: 'balanced' });
}
