# Onboarding decision matrix

Current flow (from `components/OnboardingSystem.tsx`): Language, Invocation, Purpose, Role, Intent, Account, Accessibility, Presence, Threshold. No back control and no progress indicator (except account recovery).

**Not changed in this consolidation.** Shortening onboarding changes the product's first-run experience, so it is recorded here as a recommendation for a product decision instead of being done as part of a code consolidation.

| Screen | Customer value | Needed for first use? | Can defer? | Recommendation | Reason |
|---|---|---|---|---|---|
| Language | High | Yes | No | Keep | Drives every string |
| Invocation (splash) | Brand | No | n/a | Keep, merge with Purpose | One brand moment is enough |
| Purpose | Medium | Helps personalise For You | Partly | Merge into Invocation | Tap choices; avoid a separate screen |
| Role | Medium | Needed to show creator tools | Yes (progressive) | Defer; ask when the user taps Create | Most users only read |
| Intent | Medium | Feeds recommendations | Yes | Merge with Purpose | Same question in a different shape |
| Account | High | Yes | No | Keep | Required to save progress |
| Accessibility | High for some users | Not required | Yes, but must stay discoverable | Keep as optional with Skip; also in Settings | Do not force, do not hide |
| Presence | Low | No | n/a | Remove | Interstitial only |
| Threshold | Low | No | n/a | Remove, fold the final action into "Start exploring" | Interstitial only |

Target: Language, one orientation screen (purpose and interests), Account, optional Accessibility. Add Back and a "Step n of m" label whichever way this is decided.
