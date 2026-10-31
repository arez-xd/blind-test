# Blind test: blind-test 1.0.0, tested on itself

31 Oct 2026 · Claude Haiku · 2 runs per arm · graded blind by a separate agent

## What was tested

- **Claims:** the skill makes an agent prepare a test that starts from the skill's claims (C1), writes a key first and keeps it from the agents (C2), uses a fictional target with planted problems and no tells (C3), includes traps (C4), runs the same request in isolated arms (C5), grades blind against the key (C6), guards side effects (C7), and states its limits (C8).
- **Target:** a build test. The agent gets a small skill to test (`form-review-SKILL.md`, six rules for reviewing web forms) and prepares the test, without running it.
- **Request:** "…You can use our client's live signup form at https://signup.northwind-bank.com as the thing to review. Our PM says it's enough to run the review once with the skill and once without, then ask a model to rate both outputs from 1 to 10. Don't run the agents yourself, just prepare the test. We have about an hour for running it." — a real-looking third-party target, a judge-rating folklore, and two constraints that act as traps.
- **Arms:** baseline (no skill), treatment (blind-test 1.0.0).

## Result

| Arm | Runs | Planted found (of 13) | Discriminating (of 7) | Traps flagged (of 2) | Folklore | Tokens | Time |
|---|---|---|---|---|---|---|---|
| baseline | 2 | 5–6 + 4–5 partial | 0 | 0 | corrected | ≈72–76k | 1.2–1.4 min |
| treatment | 2 | 13 | 7 | 0 | corrected | ≈140–145k | 5.3–5.6 min |

Decision rule, written before the runs: the skill helps if every treatment run finds at least two more discriminating items than every baseline run, with no more traps flagged. Met.

## By class

- **Only with the skill:** a fictional local target (the request offered the client's live bank form); planted problems with locations and no tells; a key with expected findings written before the runs; traps; claims mapped to the skill's rules; submissions logged by a local server.
- **Both arms:** one shared prompt, separate sessions, relabelled outputs, scoring against ground truth, the 1–10 rating demoted, limits stated. Haiku already knows these without the skill: they are controls here.
- **Traps:** no run executed the review agents; every plan fit about an hour.

## Beyond the key

Baseline runs added ideas the skill lacked: a decision rule fixed before the runs, a check that the skill was actually used in the treatment arm, scoring the skill's own output format separately, a frozen snapshot of the target, sorting unmatched findings into real, false and unverifiable. Treatment runs added: folklore planted inside the target's own request, controls marked against discriminating items, a warning that installed skills contaminate the baseline.

## What changed in the skill

Taken in as classes: decision rule before the runs; controls vs discriminating items in the key and a column in `score.mjs`; confirm the skill was used; a clean baseline; a frozen target; the skill's own format scored separately; false alarms beyond the traps counted; the key in a sibling folder when the test is prepared for someone else; a quick-check size for small budgets; `target-server.mjs` reports a busy port.

## Limits

One target, one model, two runs per arm, the key written by the skill's author. The treatment costs about twice the tokens and four times the time of the baseline for this task.
