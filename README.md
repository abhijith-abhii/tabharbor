# TabHarbor

Organize crowded browser sessions for **students and developers**.

Original topic: **Browser Tab Manager & Focus Extension** from [the source post](https://www.instagram.com/p/DdyMaogE4ud/).

> Local portfolio implementation developed with Codex assistance. Measured results and limitations are documented; no production adoption, revenue or hiring outcome is claimed.

## What works

- Domain grouping
- saved workspaces
- focus timer
- duplicate preview

[Demonstration guide](LEARNING_GUIDE.md) · [Recorded checks](reports/test-results.txt) · [Learning and interview guide](LEARNING_GUIDE.md)

## Start

Python 3.12 is the validated Python runtime; Node.js 22+ is used for extension tests. Run commands from this repository directory. Windows users activate `.venv\Scripts\activate` instead of `source`.

```sh
npm test
# Then load this directory as an unpacked extension in Chrome.
```

## Demonstration

Load the folder as an unpacked extension through chrome://extensions with Developer mode. Open two same-domain pages, group them, save a workspace, and restore it. Preview duplicates before closing any.

## Architecture and decisions

Extension popup → pure planning functions → Chrome tabs/groups/storage/alarms APIs.

Stack: Chrome MV3 · JavaScript.

1. Manifest V3 permissions are limited to tabs, groups, local storage and alarms.
2. Exact URL matching avoids merging tabs whose query strings or fragments differ.
3. Duplicate closure requires a preview and explicit click; pinned tabs are protected.

## Verification

```sh
npm test
```

See [VERIFICATION.md](VERIFICATION.md) for actual executed checks, setup verification, model/data results and any outstanding environment limitations. A workflow file alone is not evidence that CI passed.

## Data and attribution

Local browser tabs only. See [DATA_AND_SOURCES.md](DATA_AND_SOURCES.md) for provenance and usage notes. Original project code is MIT unless a preserved source file or dependency states otherwise. Model and third-party data licenses remain separate.

## Limitations and next improvement

Chrome-compatible desktop extension only. Saved workspaces store URLs locally without encryption. Restore opens a new window; it does not restore authenticated state or tab histories. Timer badges need a running browser. Store publication is not included.

Suggested extension: Add a workspace rename button and test validation for empty or overlong names.

## Honest portfolio use

This implementation and documentation were developed with substantial Codex assistance. Before presenting it, run the demonstration, explain the design choices, and complete the suggested independent modification. Do not describe generated code as work experience, an accepted upstream contribution, or a deployed production service.
