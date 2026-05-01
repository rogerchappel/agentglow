# Accessibility

AgentGlow treats accessibility as product behavior, not a cleanup pass.

## Accessible names

Every rendered presence exposes an accessible label derived from state metadata, such as `Agent speaking` or `Agent waiting`. Hosts can override this with `ariaLabel` when an agent name or product-specific wording is clearer.

## Live regions

State changes can be mirrored into a polite live region through the React `liveRegion="polite"` prop or by subscribing to controller snapshots. Avoid assertive announcements unless the host app has a separate urgent workflow.

## Reduced motion

Use `reducedMotion` or `theme.motion.reduced` to request static poses and gentle transitions. The renderer reports a `reduced-motion` warning so tests and host UIs can verify the fallback path.

## Contrast-aware themes

`normalizeAgentGlowTheme({ contrast: 'high' })` strengthens text, muted, and background tokens. Color is never the only cue for `waiting`, `blocked`, `error`, or `success`; state labels and renderer geometry distinguish those states as well.

## Microphone safety

AgentGlow core never requests device permission. Microphone capture is opt-in through host code, and output/TTS levels can be injected directly with `speechLevel` without hidden recording.
