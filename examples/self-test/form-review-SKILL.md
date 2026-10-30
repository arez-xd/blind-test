---
name: form-review
description: Review web forms (signup, checkout, settings) for usability and accessibility and propose fixes. Use when the user asks to review, audit or improve a form.
---

# Form review

Review a form the way a careful UX lead would, then propose concrete fixes.

## Rules

1. **Every field has a visible label.** A placeholder is not a label: it disappears when the user types and fails WCAG 1.3.1 / 3.3.2.
2. **Errors say how to fix, next to the field.** "Invalid input" is not an error message. "Use 8 or more characters" is. Errors appear on blur or submit, not on every keystroke.
3. **Ask only for what the product needs now.** Each optional field costs completion. Flag fields with no stated purpose (date of birth on a newsletter signup).
4. **Mark the minority.** If most fields are required, mark the optional ones ("Optional"), not every required one with an asterisk. Either convention is fine when it's consistent and explained.
5. **Inputs match the data.** `type="email"`, `inputmode="numeric"` for codes, `autocomplete` tokens for name, email, address and one-time codes.
6. **One primary action.** The submit button says what happens ("Create account"), not "Submit".

## Output

A list of findings, each with the field, the problem, the rule it breaks and the fix, most severe first.
