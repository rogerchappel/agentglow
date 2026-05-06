export * from './types.js';
import { type AgentGlowAudioFrame, type AgentGlowAnalyserLike, type AgentGlowAudioSmoothingOptions, type AgentGlowController, type AgentGlowControllerOptions, type AgentGlowCssVars, type AgentGlowEvent, type AgentGlowInput, type AgentGlowPreset, type AgentGlowPresetFrame, type AgentGlowRenderOptions, type AgentGlowSnapshot, type AgentGlowState, type AgentGlowStateMeta, type AgentGlowTheme, type AgentGlowTimeline, type NormalizedAgentGlowTheme } from './types.js';
export declare function mapAgentGlowEventToState(event: AgentGlowEvent): AgentGlowState | undefined;
export declare function getAgentGlowStateMeta(state: AgentGlowState): AgentGlowStateMeta;
export declare function normalizeAgentGlowTheme(theme?: AgentGlowTheme): NormalizedAgentGlowTheme;
export declare function createAgentGlowCssVars(theme?: AgentGlowTheme, prefix?: string): AgentGlowCssVars;
export declare function createAgentGlowController(options?: AgentGlowControllerOptions): AgentGlowController;
export declare function createAgentGlowAudioSmoother(options?: AgentGlowAudioSmoothingOptions): {
    push(samples: ArrayLike<number> | AgentGlowInput): AgentGlowAudioFrame;
    reset(): void;
};
export declare function createAgentGlowMockAnalyser(frames?: AgentGlowInput[]): {
    next(): AgentGlowInput;
    reset(): void;
};
export declare function createAgentGlowTimeline(events: AgentGlowEvent[], options?: AgentGlowControllerOptions): AgentGlowTimeline;
export declare function readAgentGlowAnalyserFrame(analyser: AgentGlowAnalyserLike, options?: {
    bins?: number;
}): AgentGlowInput;
export declare function createMicrophoneAgentGlowInput(): Promise<{
    stream: MediaStream;
    permission: "granted";
}>;
export declare function renderAgentGlowToSvg(snapshot: AgentGlowSnapshot, options?: AgentGlowRenderOptions): AgentGlowPresetFrame;
export declare function renderPresetFixture(preset: AgentGlowPreset, state?: AgentGlowState): AgentGlowPresetFrame;
