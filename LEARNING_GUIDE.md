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

1. **Why a Manifest V3 service worker?** The popup can close while a timer remains active. A background alarm listener handles the completion badge without keeping the popup open.

2. **What counts as a duplicate?** Exact normalized HTTP(S) URLs match; query strings and fragments remain significant. Pinned tabs are excluded from closure, and the current tabs are rechecked after the preview.

3. **What is actually saved in a workspace?** A name, creation time and deduplicated list of web URLs in local extension storage. Cookies, authenticated sessions, navigation history and page contents are not saved.

4. **How did you verify real browser APIs?** An isolated Chromium CI profile loaded the extension, grouped synthetic tabs, closed one duplicate, saved and restored a workspace in a new window, and scheduled/cancelled a real alarm.

5. **Why require a preview before closing duplicates?** Closing tabs changes the browsing session. A separate explicit action makes the affected count visible, while a second eligibility check protects tabs pinned after the preview.

## Independent exercise

Add a workspace rename button and test validation for empty or overlong names.

Write down the expected behavior before editing. Add a meaningful regression check, run the existing suite, and describe what changed in your own words.

## Contribution and resume guidance

The implementation was developed with substantial AI assistance under Abhijith Viswanathan's direction. The verified contribution is the working artifact and the learning work actually completed, not invented employment or adoption.

Suggested factual bullet after personally validating the demo:

- Built a Manifest V3 tab organizer with domain grouping, duplicate review, workspaces and focus alarms; verified 15 local checks and actual Chromium API workflows in CI.

Use [VERIFICATION.md](VERIFICATION.md) to add only measured numbers. Do not claim production traffic, users, savings, upstream acceptance or cloud deployment without corresponding evidence.
