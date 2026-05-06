import { createAgentGlowController, renderAgentGlowToSvg, } from "../../core/src/index.js";
/**
 * Small host-agnostic controller helper for React apps. In a real React runtime
 * callers can keep this in useMemo/useRef; tests can instantiate it directly
 * without requiring React as a dev dependency.
 */
export function useAgentGlowController(options = {}) {
    const controller = createAgentGlowController(options);
    if (options.onSnapshot)
        controller.subscribe(options.onSnapshot);
    return controller;
}
/**
 * React-facing component contract. The package intentionally keeps rendering
 * host-light for V1: it returns a serialisable element description with an SVG
 * payload, so host React apps can wrap it or dangerouslySetInnerHTML the SVG
 * while the public props and accessibility semantics settle.
 */
export function AgentGlow(props) {
    const controller = createAgentGlowController({
        state: props.state,
        preset: props.preset,
        theme: props.theme,
        input: props.input,
        reducedMotion: props.reducedMotion,
        label: props.ariaLabel,
    });
    if (props.event)
        controller.send(props.event);
    if (props.input)
        controller.setInput(props.input);
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
    for (const warning of frame.warnings)
        props.onRendererWarning?.(warning);
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
function escapeHtml(value) {
    return value.replace(/[&<>\"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]);
}
/**
 * Convenience renderer for docs, server previews, and fixture tests. Host React
 * apps can ignore this and render the SVG through their own component shell.
 */
export function renderAgentGlowElementHtml(element) {
    const className = element.className ? ` class="${escapeHtml(element.className)}"` : '';
    const live = element.liveRegion !== 'off' ? ` aria-live="${element.liveRegion}"` : '';
    return `<div role="${element.role}" aria-label="${escapeHtml(element.ariaLabel)}"${live}${className}>${element.svg}</div>`;
}
