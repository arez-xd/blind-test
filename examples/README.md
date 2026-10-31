# Examples

- [`prompts.md`](prompts.md): requests for a review skill, a build skill, a comparison, a prompt or rule file, a quick check, a test prepared for someone else, and a rerun.
- [`self-test/`](self-test/report.md): Blind Test tested with its own method. Haiku prepared a test of a small form-review skill ([`form-review-SKILL.md`](self-test/form-review-SKILL.md)), two runs with Blind Test and two without, graded blind by a separate agent. The report, the key, the grades and the label map; `score.mjs` reproduces the table from them.
- [Under the Hood's blind tests](https://github.com/arez-xd/under-the-hood/tree/main/examples/blind-test): the method on another skill, end to end. Rounds on a made-up AI video studio with the targets, the keys, the grades and every run's report, the fixes and the rerun, and two real services. Round 1 fell short of the decision rule written before it; the page says so and shows what changed.
