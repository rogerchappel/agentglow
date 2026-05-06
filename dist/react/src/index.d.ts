import { type AgentGlowController, type AgentGlowControllerOptions, type AgentGlowEvent, type AgentGlowInput, type AgentGlowPreset, type AgentGlowQuality, type AgentGlowRendererWarning, type AgentGlowSnapshot, type AgentGlowState, type AgentGlowTheme } from '../../core/src/index.js';
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
export declare function useAgentGlowController(options?: UseAgentGlowControllerOptions): AgentGlowController;
/**
 * React-facing component contract. The package intentionally keeps rendering
 * host-light for V1: it returns a serialisable element description with an SVG
 * payload, so host React apps can wrap it or dangerouslySetInnerHTML the SVG
 * while the public props and accessibility semantics settle.
 */
export declare function AgentGlow(props: AgentGlowProps): AgentGlowElementDescription;
/**
 * Convenience renderer for docs, server previews, and fixture tests. Host React
 * apps can ignore this and render the SVG through their own component shell.
 */
export declare function renderAgentGlowElementHtml(element: AgentGlowElementDescription): string;
export type { AgentGlowController, AgentGlowEvent, AgentGlowInput, AgentGlowPreset, AgentGlowSnapshot, AgentGlowState, AgentGlowTheme, AgentGlowRendererWarning };
