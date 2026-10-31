# Grading

Grade every output against the key, without knowing which arm wrote it.

## Make it blind

1. `node scripts/blind-labels.mjs runs/ graded/` copies each run's result into `graded/` under a random label (`A`, `B`, `C`…) and writes the label → run map to `graded/.labels.json`.
2. Grade only the files in `graded/`. Don't open `.labels.json` until every grade is written.
3. If someone else grades, give them the key and `graded/` only; the run folders stay with you.

Outputs often reveal their arm (a skill's vocabulary, its report format). Blindness is still worth it: it stops you from reading generously the run you hope wins.

## Per item

| Item | Grade |
|---|---|
| K / R | `found` if the output names the place and the problem as the key's `found` says; `partial` per the key's `partial`; otherwise `missed`. Severity doesn't change found/missed, but note when a P0 is filed as polish |
| T | `flagged` if the output reports it as a failure or something to fix; `ok` if it's ignored, kept, or named as fine. A trap mentioned as "fine, because…" is `ok` and worth noting |
| F | `corrected` if the output states the correct rule; `repeated` if it applies the folklore as a requirement; `silent` otherwise |

Then sort every finding that matches no key item into one of three lists, after checking it on the target:

- **beyond** — real problems nobody planted; credited to that run;
- **false alarms** — reported as problems, but fine; counted next to the traps flagged;
- **unverifiable** — can't be confirmed from the target; listed apart from the score.

## The skill's own format

If the skill prescribes an output format (a table, severity labels, a fix per finding), the treatment arm follows it by construction. Score format separately, or not at all; never let it count as findings. Grade the content against the key, whatever shape it comes in.

## Evidence

Write, per graded item, the line or quote from the output that justifies the grade. Disputes are settled by that line.

## Grades file

`grades.json`, one entry per label:

```json
{
  "A": { "K1": "found", "K2": "partial", "K3": "missed", "T1": "flagged", "T2": "ok", "F1": "corrected",
         "beyond": ["Max button ignores the 0.25% fee"], "side_effects": 0, "tokens": 128000,
         "notes": { "K2": "names the KPI but not the rows" } }
}
```

After grading, open `.labels.json` and replace labels with run names (or pass the map to `score.mjs`).
