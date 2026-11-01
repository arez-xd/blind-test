# Changelog

All notable changes to this skill. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [Semantic Versioning](https://semver.org/).

## [1.3.0] - 2026-11-01

### Added

- **Agent harnesses as arms** (`references/runs.md`, Harnesses). A setting inside one harness (hooks, subagents, a CLAUDE.md, an output style, a permission mode, context compaction) runs like any other arm. Two harnesses run on the same model, pinned by its id, each run started with its harness's headless command, the harness's own system prompt and tools left as they ship; cost is compared by time and tool calls where token counts disagree, and differences in sandbox, network, browsers and scratch folders are evened out or recorded. A product against a product tests the pair of harness and model.
- `examples/prompts.md` has a request for a harness.

### Changed

- The short description names harnesses where it named prompts; the longer lists in the README, SKILL.md and package description name both.

## [1.2.0] - 2026-11-01

### Added

- **Two levels** (`references/levels.md`). A quick check by default: the key and the decision rule before any run, two runs per arm, one blind grader, about five agents. The full test adds calibration, the rewrite of every output into one format and three or more runs per arm before a public number. The agent takes the level the request asks for, or names both with their cost and asks; when it can't ask, it takes the quick check and says so in the first line of the report. It came out of a self-test on a plain request ("check whether this code-review skill is any good"): with Blind Test 1.1.0, all three runs on Haiku went through the full test, starting 13–16 agents and taking 90–110 minutes, against 6–14 minutes without it.

### Changed

- The rewrite before grading goes in parts: the rewriter's prompt asks for the heading first and each finding appended as it goes. In the same self-test, 4 of 8 rewriters on Haiku spent a whole reply, 128k output tokens, before writing anything; `grading.md` now suggests the grader's model for rewriters when the runs use a small one.
- The description names both levels, and "is it any good" among the requests it answers.
- The report and its template open with the level; calibration and the rewrite are marked as steps of the full test; the hand-over starts with the level.
- `examples/prompts.md` has a plain "is it any good?" request.
- Isolation names shared tools: a browser pane or an MCP server the environment offers is one instance for every run at once, so runs launched together see each other's tabs. Each run gets its own headless browser, or those arms run one at a time.
- Build tests: the page's served code is part of the target, since a minified bundle still carries shader sources and constants a run without the skill can read; the request says whether reading it is part of the task. A measured check on a render starts from the original captured twice, the noise floor, and every capture gets a fresh browser profile.
- Writes outside a run folder are checked in the run's tool log and on disk, with the agents it started included.

### Fixed

- Scratch files stay inside the test folder. In the self-test, nested reviewers kept probes in a session scratchpad and in `/tmp`, and each orchestrating run wrote a stderr capture or an empty file to `/tmp`. The run request now names the run folder as the only place to write, scratch files and logs included, and a file left outside it counts as a side effect.

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
