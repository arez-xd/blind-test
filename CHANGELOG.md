# Changelog

All notable changes to this skill. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [Semantic Versioning](https://semver.org/).

## [1.1.0] - 2026-11-01

### Added

- **Calibration** (`references/calibration.md`, step 4 of the loop). Two pilot runs of the baseline, graded against the key, decide which planted problems are controls and which discriminate. A target the pilots find too easy gets one revision where their attention was thin, and the key is then frozen by its sha256. It came out of two code-review rounds: in one, the baseline found all 12 items predicted as discriminating; in the next, two pilots without the skill found 16 of 17 planted problems before any counted run.
- **Normalization before blind grading** (`references/grading.md`). Run paths are stripped before relabelling, and each output is rewritten into one neutral format by its own agent, so a skill's format doesn't name its arm. The rewriter's prompt is included.
- **`refcheck.mjs`**: checks that each rewrite kept every `file:line` of its original, and prints the heading of any place it lost.
- **Grading in pieces**: one output at a time, one grades file per label, merged at the end.

### Changed

- The loop has nine steps: calibration after the target check; stripping, relabelling and normalizing inside blind grading.
- The grader's copy of the key leaves out `role` and anything that describes the arms.
- The key format and the key template carry `role`; the report template has Calibration and Grading sections; the hand-over lists the calibration.
- Tests: 27 `node:test` cases, four of them for `refcheck.mjs`.

## [1.0.0] - 2026-11-01

First public release.

### Added

- **The method.** Claims first; then a key of planted problems (K), real problems (R), traps (T) and folklore (F), written before any run together with the decision rule; a fictional target built from the key with no tells; the same request, word for word, in every arm, each run a fresh agent in its own folder; blind grading against the key; a report with the limits next to every number.
- **Fair-test checks.** Controls marked apart from discriminating items; a check that each treatment run actually used the skill; a clean baseline with overlapping skills switched off; a frozen target; the skill's own output format scored separately; false alarms beyond the traps counted; a quick-check size for small budgets.
- **Review and build tests.** Planted problems in something that exists, or a brief whose result is checked against data at ten times the size, empty states and awkward names.
- **Scripts** (Node 18+, no dependencies): `target-server.mjs` serves a target on 127.0.0.1 and logs every request that would change something; `blind-labels.mjs` relabels run outputs for blind grading; `score.mjs` turns the key and the grades into a table per arm and lists what only one arm found.
- **Templates:** `key.template.json`, `report.template.md`.
- **Evidence:** Blind Test tested with its own method, in `examples/self-test` (report, key, grades, labels).
- **Tests:** 23 `node:test` cases for the three scripts and the docs, CI on Node 18, 20 and 22.
