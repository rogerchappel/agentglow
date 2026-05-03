# Release Checklist

Use this before tagging the first public AgentGlow release.

## Local gates

- [ ] `npm run check`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] `bash scripts/validate.sh`
- [ ] `node bin/agentglow-render.mjs --fixture tests/fixtures/presence-run.json --out /tmp/agentglow.svg`

## Product review

- [ ] Demo playground opens locally and shows simulated events by default.
- [ ] All five presets are visibly distinct.
- [ ] Blocked/waiting/error states are legible without color alone.
- [ ] Reduced-motion mode returns a static/low-power warning.
- [ ] README positioning stays honest: local-first MVP, not a full chat UI or WebGL engine yet.

## Repository readiness

- [ ] Repo visibility is public.
- [ ] GitHub description: `Local-first visual presence SDK for agent-mode interfaces.`
- [ ] Suggested topics: `agent-ui`, `ai`, `presence`, `react`, `svg`, `local-first`, `accessibility`, `audio-visualizer`, `agent-mode`, `typescript`.
- [ ] Main branch protection is enabled or blocker is documented.
- [ ] First tag/release notes are cut from `CHANGELOG.md`.
