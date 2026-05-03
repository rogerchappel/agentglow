import { readFileSync } from 'node:fs';

const plan = JSON.parse(readFileSync('docs/orchestration.json', 'utf8'));
const taskIds = new Set(plan.tasks.map((task) => task.id));

if (plan.repository !== 'agentglow') throw new Error('Orchestration repository must be agentglow');
if (!Array.isArray(plan.waves) || plan.waves.length === 0) throw new Error('Orchestration needs waves');
if (!Array.isArray(plan.tasks) || plan.tasks.length === 0) throw new Error('Orchestration needs tasks');

for (const wave of plan.waves) {
  for (const id of wave.tasks) {
    if (!taskIds.has(id)) throw new Error(`Wave references unknown task: ${id}`);
  }
}

for (const task of plan.tasks) {
  if (!task.id?.startsWith('agentglow-')) throw new Error(`Invalid task id: ${task.id}`);
  if (task.repo !== 'agentglow') throw new Error(`Invalid task repo for ${task.id}`);
  for (const dependency of task.depends_on ?? []) {
    if (!taskIds.has(dependency)) throw new Error(`${task.id} depends on missing task ${dependency}`);
  }
}

console.log(`Orchestration check passed (${plan.waves.length} waves, ${plan.tasks.length} tasks)`);
