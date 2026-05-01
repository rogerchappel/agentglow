import {
  createAgentGlowController,
  renderAgentGlowToSvg,
  type AgentGlowController,
  type AgentGlowControllerOptions,
  type AgentGlowEvent,
  type AgentGlowInput,
  type AgentGlowPreset,
  type AgentGlowQuality,
  type AgentGlowRendererWarning,
  type AgentGlowSnapshot,
  type AgentGlowState,
  type AgentGlowTheme,
} from '../../core/src/index.ts';

export interface AgentGlowAgentDescriptor {
  name?: string;
  persona?: string;
  avatarUrl?: string;
}

export interface AgentGlowProps {
  state?: AgentGlowState;
  event?: AgentGlowEvent;
  input?: AgentGlowInput;
  theme?: AgentGlowTheme;
  preset?: AgentGlowPreset;
  agent?: AgentGlowAgentDescriptor;
  quality?: AgentGlowQuality;
  reducedMotion?: boolean;
  ariaLabel?: string;
  liveRegion?: 'off' | 'polite';
  className?: string;
  style?: Record<string, unknown>;
  onSnapshot?: (snapshot: AgentGlowSnapshot) => void;
  onRendererWarning?: (warning: AgentGlowRendererWarning) => void;
}

export interface UseAgentGlowControllerOptions extends AgentGlowControllerOptions {
  onSnapshot?: (snapshot: AgentGlowSnapshot) => void;
}

export interface AgentGlowElementDescription {
  type: 'AgentGlow';
  role: 'img';
  ariaLabel: string;
  liveRegion: 'off' | 'polite';
  className?: string;
  style?: Record<string, unknown>;
  snapshot: AgentGlowSnapshot;
  svg: string;
}

/**
 * Small host-agnostic controller helper for React apps. In a real React runtime
 * callers can keep this in useMemo/useRef; tests can instantiate it directly
 * without requiring React as a dev dependency.
 */
export function useAgentGlowController(options: UseAgentGlowControllerOptions = {}): AgentGlowController {
  const controller = createAgentGlowController(options);
  if (options.onSnapshot) controller.subscribe(options.onSnapshot);
  return controller;
}

/**
 * React-facing component contract. The package intentionally keeps rendering
 * host-light for V1: it returns a serialisable element description with an SVG
 * payload, so host React apps can wrap it or dangerouslySetInnerHTML the SVG
 * while the public props and accessibility semantics settle.
 */
export function AgentGlow(props: AgentGlowProps): AgentGlowElementDescription {
  const controller = createAgentGlowController({
    state: props.state,
    preset: props.preset,
    theme: props.theme,
    input: props.input,
    reducedMotion: props.reducedMotion,
    label: props.ariaLabel,
  });

  if (props.event) controller.send(props.event);
  if (props.input) controller.setInput(props.input);
  if (props.theme || props.preset || props.reducedMotion !== undefined) {
    controller.setTheme({
      ...props.theme,
      shape: props.preset ?? props.theme?.shape,
      motion: { ...props.theme?.motion, reduced: props.reducedMotion ?? props.theme?.motion?.reduced },
    });
  }

  const snapshot = controller.getSnapshot();
  props.onSnapshot?.(snapshot);
  const frame = renderAgentGlowToSvg(snapshot, { quality: props.quality, title: props.ariaLabel ?? `${props.agent?.name ? `${props.agent.name}: ` : ''}${snapshot.label}` });
  for (const warning of frame.warnings) props.onRendererWarning?.(warning);
  controller.destroy();

  return {
    type: 'AgentGlow',
    role: 'img',
    ariaLabel: props.ariaLabel ?? snapshot.label,
    liveRegion: props.liveRegion ?? 'off',
    className: props.className,
    style: props.style,
    snapshot,
    svg: frame.svg,
  };
}

export type { AgentGlowController, AgentGlowEvent, AgentGlowInput, AgentGlowPreset, AgentGlowSnapshot, AgentGlowState, AgentGlowTheme, AgentGlowRendererWarning };
