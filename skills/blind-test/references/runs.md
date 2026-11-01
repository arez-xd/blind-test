# Running the arms

Each run is a separate agent with a fresh context, its own folder, and nothing but the target, the request and — in the treatment arm — the skill.

## Folders

```
blind/
  key.json                 ← never inside a run folder; never read by a run
  target/                  ← served by target-server.mjs, or copied per run for code targets
  runs/
    baseline-1/            ← output only
    treatment-1/
      skill/               ← a copy of the skill, so the run can't read the original's history
    competitor-1/
      skill/               ← competitor skill, its own HOME and cache if it installs anything
  calibration/
    pilot-1/               ← baseline pilots, same prompt as baseline-1; graded, never counted
```

Give every run the absolute path of its own folder and nothing else from `blind/`.

If you're preparing the test for someone else to run, put the key in a sibling folder (`blind/key/`), outside the folders you hand over, and say in the plan where it is and that run agents must not get it.

## The request

Write it once, paste it into every arm. Only the skill block changes.

```text
You are reviewing <the target> for a team. Work only with what is described here.

The target: <name>, running at <URL> (<what exists, what returns 404>). <Who uses it and how>.

Request: "<the stakeholder's request, folklore included>"

Rules:
- Don't change anything and don't submit anything: reading and rendering is fine.
- Don't create tasks, tickets, pull requests, reminders or messages, and don't hand work to other agents: the result file is the whole output.
- Use only these files: <tools you provide>[, and the skill folder <path> — read its SKILL.md first and follow it].
  Do not open or search any other files or folders on this machine; that would invalidate the test.
- Write your result to <run folder>/<file>.

When done, reply with the path of the result and a five-line summary.
```

Baseline arm: drop the skill line and add "Don't use any skills." Competitor arm: the same skill line with the competitor's folder and any environment variables it needs to stay inside its sandbox.

## Isolation

- **Fresh agent per run.** Never continue a run's conversation into another arm.
- **No shared paths.** The key, other runs, the target's source (when the test is about the rendered result) and this skill stay outside the folders a run is given.
- **Competitor skills in a sandbox.** Their own folder, their own `HOME` and cache, no hooks installed into the real environment. Check what their scripts download before running them; verify checksums when the project publishes them.
- **Same model, same tools, same viewport, same time limits** in every arm.
- **A clean baseline.** Skills, rules or plugins installed in the environment load into the baseline too. List what's installed and disable what overlaps with the skill under test, or record it as a limit.
- **The skill was actually used.** A treatment run that never opened `SKILL.md` is a baseline run with a label. Check its tool log, or ask every run to end its result with one line naming the rules it applied; a run that didn't use the skill is excluded and rerun under a new number.
- **A frozen target.** Every run sees the same target. If it renders differently over time (live data, dates, random content), freeze it: fixed data, a fixed clock, a saved snapshot.

## How many runs

| Runs per arm | What you can say |
|---|---|
| 1 | "In one run…": a demo |
| 2 | A range, and whether the result is stable |
| 3+ | A number you can publish with its range |

Run the arms interleaved (baseline-1, treatment-1, baseline-2…) so a change in the target or the environment hits both.

## Record per run

Model, date, tokens, wall time, tool calls if available, the posts.log line count (or the diff of a code copy), anything the run created outside its folder (a queued task, a ticket, a message — withdraw it and count it as a side effect), and anything the agent says it couldn't do.
