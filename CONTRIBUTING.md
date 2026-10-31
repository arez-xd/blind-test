# Contributing

Thanks for helping. A blind test is worth what its rules are worth: a key that can't be bent after the runs, traps that catch a skill that over-fires, scripts that count correctly. Contributions in that order help most.

## What helps

- **A loophole.** A way a skill, a run or a grader can score better without doing better, or a test that let a weak skill through. Open an issue with the "loophole" template: the setup, what happened, and the rule or check that would close it.
- **A script fix.** A wrong count, a crash on an awkward input, a request the target server mishandles. Add a test that fails before the fix.
- **A kind of target the references don't cover yet:** a CLI, an API, a data pipeline, a mobile app. What the agent gets, how problems are planted without tells, how side effects show.
- **A worked example.** A blind test you ran with the skill on a fictional target, with the key, the grades and the report. Results that didn't favour the skill under test are as welcome as ones that did.

## Ground rules

- **Fictional targets only.** Examples, fixtures and tests use made-up products. No real company, product, person or client material in keys, targets or reports.
- **Local only.** Scripts read and write files in the test folder and serve on 127.0.0.1. No network requests beyond the local target, no environment variables, no credentials.
- **The key comes first.** A change that lets a key be edited after the runs, or lets a run read the key, is a bug.
- **Every rule says how to check it:** a script, a field in the key, a line in the report.
- **Limits travel with numbers.** A number in a README, a listing or an example states the runs, the model, the target and who wrote the key.

## Development

Node.js 18 or newer, no dependencies.

```bash
npm test          # node --test tests/*.test.mjs
npm run check     # node --check on every script
```

The scripts share conventions: `--help` prints usage and exits 0, a usage error exits 2. `score.mjs` exits 1 when a grade is missing, misspelt or not in the key; `blind-labels.mjs` exits 1 when no run has a result; `target-server.mjs` exits 1 when its port is busy. Keep them dependency-free and readable.

## Pull requests

Fill in the checklist in the template. Keep one change per pull request, with a line in `CHANGELOG.md` under an "Unreleased" heading. A change to the rules in `SKILL.md` comes with a rerun of the self-test (`examples/self-test`) or another blind test, and its result.
