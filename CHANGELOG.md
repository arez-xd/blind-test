# Changelog

All notable changes to this skill. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [Semantic Versioning](https://semver.org/).

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
