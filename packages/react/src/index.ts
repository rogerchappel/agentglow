import type {
  AgentGlowController,
  AgentGlowControllerOptions,
  AgentGlowEvent,
  AgentGlowInput,
  AgentGlowPreset,
  AgentGlowSnapshot,
  AgentGlowState,
  AgentGlowTheme,
} from '@agentglow/core';

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
  quality?: 'auto' | 'high' | 'balanced' | 'low-power';
  reducedMotion?: boolean;
  ariaLabel?: string;
  liveRegion?: 'off' | 'polite';
  className?: string;
  style?: unknown;
  onSnapshot?: (snapshot: AgentGlowSnapshot) => void;
  onRendererWarning?: (warning: AgentGlowRendererWarning) => void;
}

export interface AgentGlowRendererWarning {
  code: 'webgl-unavailable' | 'low-power-mode' | 'reduced-motion' | 'renderer-fallback';
  message: string;
}

export interface UseAgentGlowControllerOptions extends AgentGlowControllerOptions {
  onSnapshot?: (snapshot: AgentGlowSnapshot) => void;
}

export declare function AgentGlow(props: AgentGlowProps): unknown;
export declare function useAgentGlowController(options?: UseAgentGlowControllerOptions): AgentGlowController;
