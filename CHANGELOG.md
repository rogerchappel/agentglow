# Changelog

All notable changes to this project will be documented in this file.

This project follows the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
format and uses semantic versioning when versioned releases are published.

## [Unreleased]

### Added

- Local-first `@agentglow/core` presence controller with canonical states, event mapping, deterministic snapshots, theme normalization, and reduced-motion support.
- SVG renderer with five presets: orb, waveform halo, constellation, console pulse, and minimal dot field.
- Audio smoothing, analyser-like frame reading, mock analyser fixtures, and explicit opt-in microphone boundary.
- React-facing component contract, controller helper, and HTML wrapper helper.
- Local fixture CLI: `agentglow-render --fixture tests/fixtures/presence-run.json --out frame.svg`.
- Demo playground, CrewCmd/AgentPulse example, and local Node fixture example.
- PRD, task plan, orchestration docs, API docs, architecture notes, recipes, accessibility/performance/safety guidance, and fixture tests.

### Verified

- `npm test`, `npm run check`, `npm run build`, `bash scripts/validate.sh`, and real CLI fixture smoke.

## Release Links

- Unreleased: `https://github.com/rogerchappel/agentglow/compare/main...HEAD`
- Latest release: `https://github.com/rogerchappel/agentglow/releases/latest`
