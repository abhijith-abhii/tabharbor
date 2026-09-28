# TabHarbor — verification

Verification date: 28 September 2026. Tests and examples were executed; they are not illustrative pass claims.

- Project checks: 15 passed.
- Dependency/setup verification: see the project-specific reproduction or runtime requirements.
- Main browser/API workflow: see project-specific demonstration evidence.
- Publication: [public repository](https://github.com/abhijith-abhii/tabharbor) verified under **abhijith-abhii**.

## Verification boundaries
- Verified with bundled Chromium on Linux CI; Chrome Web Store publication is not included.


## Evidence
- `reports/test-results.txt`: actual test output.
- `reports/clean-setup.json`: isolated setup result where applicable.
- `reports/publication-check.json`: credential-pattern and file audit.
- `DATA_AND_SOURCES.md`: source and license notes.

## GitHub verification

- [Extension tests: passed](https://github.com/abhijith-abhii/tabharbor/actions/runs/36416828703)

Verified source revision: `782b7bbc64e6fd129ca0d8b872377313261e4ee9`. Subsequent presentation-only changes do not change that implementation evidence.

Actual Chromium extension integration passed five workflow stages, with real tabs, tab groups, local storage, windows and alarms. Synthetic test pages were used. See `reports/browser-integration.json` and the application screenshot.
