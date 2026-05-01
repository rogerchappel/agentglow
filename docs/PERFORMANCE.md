# Performance and quality budget

AgentGlow targets a premium feel while staying practical for dashboards, desktop shells, and mobile devices.

## Frame targets

- Default quality targets a 60fps render path.
- `quality="low-power"` or reduced motion uses a graceful 30fps/static fallback.
- Renderers consume deterministic snapshots and can degrade capability without changing public states.

## Network policy

Core and renderer helpers make no network calls. Tests assert fixture rendering from local data only. Host apps own analytics, telemetry, and device permission prompts.

## Budgets

- Core controller should remain allocation-light: state, theme, input, and metadata only.
- SVG fixtures are suitable for docs, tests, and fallback rendering.
- Future WebGL/canvas renderers should report warnings for `webgl-unavailable`, `low-power-mode`, and `renderer-fallback` rather than failing silently.

## Verification checklist

Run:

```sh
npm test
npm run check
npm run build
bash scripts/validate.sh
```

These checks cover state validation, transition metadata, theme defaults, reduced motion, audio smoothing, renderer fixture generation, React prop smoke tests, no-network core behavior by design, and documentation presence.
