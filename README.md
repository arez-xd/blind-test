<h1 align="center">Blind Test</h1>

<h3 align="center">Does your agent skill actually work? Prove it.</h3>

<p align="center">
  A skill for building blind tests of agent skills, prompts and rule files:<br />
  a fictional target, a hidden key, traps for false alarms, and runs with and without the skill.
</p>

<p align="center">
  <a href="#install"><img src="https://img.shields.io/badge/Claude%20Code-skill-d97757?logo=claude&logoColor=white" alt="Claude Code skill" /></a>
  <a href="#install"><img src="https://img.shields.io/badge/Codex-skill-10a37f" alt="Codex skill" /></a>
  <a href="#install"><img src="https://img.shields.io/badge/Cursor-compatible-111827?logo=cursor&logoColor=white" alt="Cursor" /></a>
  <a href="skills/blind-test/scripts"><img src="https://img.shields.io/badge/scripts-Node%2018%2B-339933?logo=nodedotjs&logoColor=white" alt="Node 18+" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-f5c518" alt="MIT license" /></a>
</p>

<p align="center">
  <a href="#quick-start">Quick start</a> ·
  <a href="#how-it-works">How it works</a> ·
  <a href="#an-example">An example</a> ·
  <a href="#whats-inside">What's inside</a> ·
  <a href="#install">Install</a>
</p>

## Quick start

```bash
npx skills add arez-xd/blind-test
```

Then ask your agent:

```text
Use blind-test to check whether my design-review skill finds more real problems than the agent does without it.
```

```text
I'm about to publish this skill. Build a blind test for its three main claims and run it on Haiku with and without the skill.
```

## Why

Most skills are tuned by feel: run it once, like the output, ship. Most skill evaluations ask a model to judge two outputs, and the judge's taste becomes the result.

A blind test checks a skill the way a careful reviewer would:

- **A hidden key, written first.** The target is a fictional product with problems planted on purpose. The key lists them before any run, and every output is graded against it. A finding matches a planted problem or it doesn't.
- **Traps for false alarms.** Legitimate decisions that look like mistakes — a 20 px button that passes WCAG with spacing, glass on a floating header. A skill that makes the agent flag everything finds more and is worse; traps catch it.
- **Folklore in the request.** A common wrong belief, the way a stakeholder would say it. Does the agent follow the request or the truth?
- **Same request, isolated agents.** Baseline and skill, optionally a competitor, each in its own folder with nothing but the target and the request.
- **Blind grading.** Outputs are relabelled before grading, so you don't read the run you hope wins more generously.
- **Side effects logged.** The target server records every state-changing request; a review that submits a form shows up.

## How it works

1. **Claims.** One sentence per thing the skill says it changes.
2. **Key.** Planted problems per claim, traps per rule that could over-fire, one folklore line.
3. **Target.** A fictional page, app, code copy, document set or brief with data, built from the key with no tells.
4. **Runs.** The same request in every arm, fresh agents, own folders.
5. **Grading.** Blind, against the key: found, partial, missed; traps flagged; folklore corrected or repeated; problems found beyond the key.
6. **Fix and rerun.** Misses and false alarms become fixes to the skill, as classes; rerun, then once more on a target the skill was never tuned on.
7. **Report.** The table, what only the skill found, and the limits next to every number.

It handles review skills (find problems in something that exists) and build skills (make something from a brief, checked against data at ten times the size, empty states and awkward names).

## An example

A design-review skill, tested on a fictional fleet dashboard with 16 planted problems and 8 traps; the request claimed WCAG requires 44 px targets and 4.5:1 for all text. Claude Haiku, `score.mjs` output:

| Arm | Runs | Planted found (of 16) | Traps flagged (of 8) | Folklore | Side effects |
|---|---|---|---|---|---|
| with the skill | 2 | 15–16 | 0 | corrected | 0 |
| without | 1 | 10 + 2 partial | 1 | corrected | 0 |

Only with the skill: a fact told twice; a KPI that disagrees with its own rows; a composite score nobody can act on; a list that scrolls off the monitor it's built for. The skill is [Design Taste Pro](https://agensi.io/r/ADAMREEL?to=/skills/design-taste-pro). Limits: one target, one model, the key written by the skill's author — the same limits the report template asks you to state.

**Tested on itself.** blind-test was checked with its own method: Haiku prepared a test of a small form-review skill, with and without blind-test, graded blind by a separate agent. With the skill both runs covered all 13 items of the key and all 7 discriminating ones; without it, 5–6 plus partials and none of the discriminating ones — the baseline used the client's live form and had no planted problems or traps. Report, key and grades: [`examples/self-test`](examples/self-test/report.md).

## What's inside

```text
skills/blind-test/
├── SKILL.md                     the loop and the rules of a fair test
├── references/
│   ├── target-design.md         building a fictional target: realism, planting, traps, folklore
│   ├── key-format.md            K, R, T, F, B; sizing; what counts as found
│   ├── runs.md                  folders, the request template, isolation, how many runs
│   ├── grading.md               blind grading and the grades file
│   ├── build-tests.md           briefs, data variants, measured and hand checks
│   └── report.md                the report and honest claims
├── scripts/
│   ├── target-server.mjs        serves a target folder, logs every non-GET request
│   ├── blind-labels.mjs         relabels run outputs A, B, C… for blind grading
│   └── score.mjs                key + grades → the table per arm, and what only one arm found
└── templates/
    ├── key.template.json
    └── report.template.md
```

The scripts need Node.js 18 or newer and nothing else.

## Install

With the [open skills CLI](https://github.com/vercel-labs/skills):

```bash
npx skills add arez-xd/blind-test
```

Or copy the folder into your agent's skills directory:

```bash
cp -r skills/blind-test path/to/your-project/.claude/skills/
```

For Codex, use `skills/blind-test/agents/openai.yaml`. Any agent that reads `SKILL.md` and runs terminal commands can use it.

## Common questions

**How is this different from with/without eval runners?**
They usually grade with a judge model over open-ended prompts. A blind test grades against a key you wrote before the runs, measures false alarms with traps, and checks the request's folklore. Use both if you like: the judge for breadth, the key for proof.

**Isn't a key written by the skill's author biased?**
Yes, and the report says so. It's still far better than tuning by feel: the key is fixed before any run, grading is blind, and a rerun on a fresh target catches a skill tuned to one key. For a public claim, let someone else write the next target.

**How many runs do I need?**
One is a demo. Two give a range. Three or more before you publish a number.

**Does it work for prompts and rule files, not just skills?**
Yes. Anything you can switch on in one arm and off in the other.

## License

[MIT](LICENSE) © 2026 Adam Reznik
