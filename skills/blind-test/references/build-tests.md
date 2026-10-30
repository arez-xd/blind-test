# Build tests

For skills that make things — screens, code, copy — the target is a brief and data, and the key is a set of checks on what gets built.

## The brief

- **Short, the way people actually ask.** A one-line brief tests the skill's judgment; a long one tests the agent's reading. Run the short one; add a detailed one only if the skill claims to follow specs.
- **No hints at the answer.** "Make sure numbers come from the data" turns a test of the skill into a test of reading.
- **Say where the work goes and how it's checked** (the build command, the file name), so every arm can finish.

## Data variants

The build is checked against more data than the brief shows. Prepare, for each data file:

- **typical** — the one in the brief;
- **many** — about ten times the items;
- **few or calm** — one item, nothing wrong, an empty list;
- **awkward** — the longest real name, duplicate names, missing values.

Swap them in after the run, without telling the agent.

## Checks

Split them by how they're verified, and write them before the runs:

| Kind | Example | How |
|---|---|---|
| **Measured** | no page scroll at the target viewport; contrast failures; overflow on a phone | a script or a render, a number per run |
| **Checked by hand** | every number computed from data; a fact told once; problems first | a yes/no with the line or region that shows it |
| **Traps** | the build may legitimately use uppercase labels in a table, glass on a floating bar | flagged only if the skill's rules would wrongly forbid them and the build avoided them at a cost |

Avoid checks every arm passes: they don't discriminate and they pad the score.

## Same conditions

- Same brief, same data, same project template, same tools — including a simulator or browser if any arm gets one. A skill whose loop says "render and look" can't be judged on a run that wasn't allowed to render.
- If the brief invites a review round ("review what you built, then improve it"), it's in every arm's brief.
- Screenshots of every arm at the same viewport, theme and data, for the side-by-side.

## Report

A table of checks per arm, the side-by-side screenshots, and the variants that broke each build. Don't call a build "better" from a screenshot alone: the measured and hand checks are the result; the screenshot is the illustration.
