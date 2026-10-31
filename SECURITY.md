# Security

## What the scripts do

- `target-server.mjs` serves one folder on 127.0.0.1. GET and HEAD get files from that folder and from nowhere else; the log, `key.json` and dotfiles are never served, even from inside it. Every other method is answered 405 and written to the log with its first 4 KB.
- `blind-labels.mjs` copies result files from the runs folder into a new folder and writes the label map there.
- `score.mjs` reads the key, the grades and the label map, and prints a table.
- None of them makes a network request beyond the local server, reads environment variables or credentials, or starts other programs.

## Reporting a problem in this repository

If a script could read, serve or change something outside the test folder, or an instruction could lead an agent to touch something real, report it privately through [GitHub's private vulnerability reporting](https://github.com/arez-xd/blind-test/security/advisories/new). Please include the script or file, the input, and what happened. You'll get an answer within a week.

## If a run touches something real

The method keeps agents on a local target, yet an agent may still follow a link it finds or try a service named in the request. If a run reaches a real service, stop the runs, record it as a side effect in the grades, and find out what was sent. If anything was submitted to someone else's service, tell them. Then change the request or the target so the next run can't do it.
