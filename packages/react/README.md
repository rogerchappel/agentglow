# @agentglow/react

React-facing component contract and controller helper for AgentGlow.

```tsx
import { AgentGlow } from '@agentglow/react';

<AgentGlow
  state="speaking"
  preset="waveform-halo"
  input={{ speechLevel: 0.62 }}
  ariaLabel="Assistant is speaking"
/>
```

V1 returns a serialisable element description with an SVG payload so apps can adopt the contract without pulling in heavyweight renderers.
