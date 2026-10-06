# Branching and release workflow

One repository is the source of truth: `creova-gif/SEEN`. See `REPOSITORY_MAP.md`.

## Branches

| Branch | Purpose | Deploys to | Who uses it |
|---|---|---|---|
| `main` | Production and the testers' build. Always releasable. | https://seen-sigma-eight.vercel.app (Vercel production) | **Testers and the public** |
| `develop` | Integration branch for ongoing work. May contain unfinished-but-merged features. | Vercel preview alias `seen-git-develop-creovas-projects.vercel.app` (Vercel login required) | **Developers**, internal review |
| `feature/<name>` | One feature, branched from `develop`. | Per-push Vercel preview | Author and reviewers |
| `fix/<name>` | One bug fix, branched from `develop` (or from `main` for a hotfix). | Per-push Vercel preview | Author and reviewers |
| `release/<x.y>` | Optional stabilisation branch cut from `develop` before a production release. Only bug fixes land on it. | Per-push Vercel preview | Release owner, testers doing pre-release checks |
| `archive/*` (tags) | Frozen copies of retired branches. Never developed on. | none | nobody |

Legacy branches `dev` and `staging` are fully contained in `main` and are retired in favour of `develop`; do not use them.

## Why testers are not disturbed

Vercel deploys only the production branch (`main`) to the production domain. Every other push gets its own preview URL and never replaces the production deployment. The production branch changes only when a reviewed merge lands on `main`. Branch protection (below) enforces that.

Testers always use https://seen-sigma-eight.vercel.app. Send a tester a preview URL only when you want them to try something unreleased.

Preview deployments sit behind Vercel's SSO protection (project setting "all except custom domains"), so only team members can open them.

## Day-to-day

```bash
git fetch origin
git checkout develop && git pull
git checkout -b feature/search-filters          # or fix/reader-crash
# work, commit small
npm run check && npm run test:e2e               # before opening the PR
git push -u origin feature/search-filters
# open a PR into develop
```

Rules:
- PRs target `develop`, never `main` (except hotfixes and release merges).
- Squash or merge-commit; do not force-push shared branches.
- Keep each PR to one concern. Update docs and the screen matrix in the same PR.
- CI must be green (typecheck, unit tests, build, audit, E2E with accessibility scans).

## Releasing to testers

1. Make sure `develop` is green and the preview looks right.
2. Optional for larger drops: `git checkout -b release/1.2 develop`, deploy a preview, fix only bugs on that branch.
3. Open a PR `develop` (or `release/1.2`) → `main`. Require CI, the smoke checklist in `docs/release/RELEASE_READINESS.md`, and one approval.
4. Merge. Vercel promotes the new build to production automatically.
5. If the merge came from `release/*`, merge `main` back into `develop`.
6. Tag the release: `git tag -a v1.2.0 -m "..." && git push origin v1.2.0`.

## Hotfix (production is broken)

1. `git checkout -b fix/<name> main`, fix, add a test.
2. PR into `main`, merge after CI is green.
3. Merge `main` back into `develop` the same day.
4. To undo a bad release quickly: promote the previous deployment in Vercel (see `ROLLBACK.md`), then fix forward.

## Branch protection (settings to apply on GitHub)

Settings → Branches → add rules for `main` and `develop`:

- Require a pull request before merging (1 approval for `main`).
- Require status checks: `Typecheck · unit tests · build`, `Database RLS tests · secret scan`, `End-to-end journeys`.
- Require branches to be up to date; block force pushes and deletion.
- Do not allow bypass for administrators on `main`.

Repository settings cannot be changed from the development tooling used here; these rules need an owner to apply them once.

## Naming

`feature/<kebab-name>`, `fix/<kebab-name>`, `release/<major.minor>`. Tool-generated branches (for example `claude/*`) are fine for short-lived work but must be merged or deleted when done; they are not long-lived.
