# Local Node fixture render

This example renders AgentGlow without a browser, microphone, React runtime, network access, or build step.

```sh
node ../../bin/agentglow-render.mjs \
  --fixture ../../tests/fixtures/presence-run.json \
  --out ./crewcmd-approval.svg
```

Use this pattern in CI to prove that your product state mapping still creates the expected visual presence before shipping UI changes.
