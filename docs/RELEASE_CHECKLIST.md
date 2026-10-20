# Release Checklist

Use this before tagging the first public AgentGlow release.

## Local gates

Run the complete, non-publishing automated gate with `npm run release:check`. It executes the contract check, tests, runtime build, CLI fixture smoke, and package smoke in sequence, and stops at the first failure. The command only validates locally; it does not create a tag, release, deployment, or package publication.

For targeted diagnosis, the individual gates are `npm run check`, `npm test`, `npm run build`, `npm run smoke`, and `npm run package:smoke`.

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
