# TabHarbor — learning guide

## What it does

Organize crowded browser sessions. The intended user is students and developers. Extension popup → pure planning functions → Chrome tabs/groups/storage/alarms APIs.

## Run and demonstrate

Follow the README installation block, then: Load the folder as an unpacked extension through chrome://extensions with Developer mode. Open two same-domain pages, group them, save a workspace, and restore it. Preview duplicates before closing any.

## Important files

- `manifest.json` — permissions and extension registration.
- `logic.js` — pure grouping, duplicate and workspace rules.
- `popup.js` — Chrome API actions and interface state.
- `background.js` — timer completion handling.

## Three engineering decisions

1. Manifest V3 permissions are limited to tabs, groups, local storage and alarms.
2. Exact URL matching avoids merging tabs whose query strings or fragments differ.
3. Duplicate closure requires a preview and explicit click; pinned tabs are protected.

## Five interview questions

1. **What problem does this project solve, and what is its unit of work?** Explain organize crowded browser sessions, identify students and developers as the audience, and trace one concrete example through the files above. Use the demonstration output rather than hypothetical impact.
2. **Why did you choose the first design decision?** Manifest V3 permissions are limited to tabs, groups, local storage and alarms. Show the corresponding implementation and a test that would fail if that property were removed.
3. **How do you protect correctness when inputs or execution change?** Exact URL matching avoids merging tabs whose query strings or fragments differ. Explain the relevant invalid-input or edge-case test and distinguish a checked property from an untested assumption.
4. **How do you make results inspectable and reproducible?** Duplicate closure requires a preview and explicit click; pinned tabs are protected. Point to actual outputs and recorded commands. Explain why a successful example is weaker evidence than a tested boundary or independently reconciled total.
5. **What would you improve before real deployment or real-data use?** Chrome-compatible desktop extension only. Saved workspaces store URLs locally without encryption. Restore opens a new window; it does not restore authenticated state or tab histories. Timer badges need a running browser. Store publication is not included. Choose one limitation, describe the missing evidence, and propose a measurable acceptance check rather than promising production readiness.

## Independent exercise

Add a workspace rename button and test validation for empty or overlong names.

Write down the expected behavior before editing. Add a meaningful regression check, run the existing suite, and describe what changed in your own words.

## Contribution and resume guidance

The implementation was developed with substantial AI assistance under Abhijith Viswanathan's direction. The verified contribution is the working artifact and the learning work actually completed, not invented employment or adoption.

Suggested factual bullet after personally validating the demo:

- Implemented and validated organize crowded browser sessions using Chrome MV3 · JavaScript, with domain grouping and documented correctness checks and limitations.

Use [VERIFICATION.md](VERIFICATION.md) to add only measured numbers. Do not claim production traffic, users, savings, upstream acceptance or cloud deployment without corresponding evidence.
