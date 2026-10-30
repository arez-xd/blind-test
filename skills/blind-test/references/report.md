# Reporting

## The report

`templates/report.template.md` has the sections:

1. **What was tested.** The claims, the target in one line, the request (with its folklore), the arms, the model, runs per arm, the date.
2. **Result table.** Per arm: planted found (with partials), traps flagged, folklore, side effects, tokens. Ranges when there's more than one run.
3. **What only the skill found, what only the baseline found, what neither did.** By class, with one example each.
4. **Beyond the key.** Real problems agents found that nobody planted.
5. **What changed in the skill** after the first round, and the rerun result.
6. **Limits.**

## Honest claims

Numbers from a blind test end up in listings and posts. Keep them true:

- **Say what it was:** "In a blind review of a fictional dashboard with 16 planted problems, the agent with the skill found 15–16; without it, 10." Not "finds 95% of problems".
- **Give the range and the run count.** One run is "in one run".
- **Name the limits next to the number:** one target, one model, the key written by the skill's author. Readers trust a number more when the limits sit beside it.
- **Report the traps.** "0 legitimate decisions reported as failures" is often the more convincing number.
- **Competitors:** publishing their numbers invites a dispute you can't win with a key you wrote. Describe the difference by class ("page rules flag legitimate decisions on product screens") and keep the numbers in your own notes, or invite the competitor to rerun the test.
- **No generalising from one domain.** A result on a dashboard says nothing yet about forms or iOS.

## Keep for next time

The target, the key, the request, the run prompts, the grades and the labels map, in one folder. The next version of the skill reruns the same test, and the change is a fair comparison.
