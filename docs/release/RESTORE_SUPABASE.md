# Showing SEEN now, restoring Supabase later

**Today:** the live app runs on the demo adapter (data stored in each visitor's browser). It needs no server, so a paused Supabase project does not affect it. Switch: `src/app/services/backend.ts` stays on demo unless `VITE_BACKEND=supabase` and the URL and anon key are set.

**The project:** `seen`, ref `cddipfbiqnxouvgsndly`, region ca-central-1 (Montreal), status paused. Resuming from the dashboard is free until 16 Jul 2027; data, backups and storage are kept. A free project pauses again after a week without activity. Pro (no auto-pause, daily backups) is only needed once real customers use it.

**When ready to restore (about 30 minutes, no code changes):**
1. Dashboard > project `seen` > Restore project. Wait for status Healthy.
2. Settings > API: copy the project URL and the anon (public) key. Never copy the service key into the repo or Vercel.
3. Apply `supabase/migrations/0001_core_schema.sql` (SQL editor or `supabase db push`). Run `npm run test:db` locally first.
4. Authentication > Providers > Google: add the OAuth client ID and secret. Add redirect URLs for production and Vercel previews. Google's consent screen review can take days, so start it early.
5. Vercel > Environment variables: `VITE_BACKEND=supabase`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and for share previews `SUPABASE_URL`, `SUPABASE_ANON_KEY`. Redeploy.
6. Run the checklist in `docs/release/BACKEND_CUTOVER.md` (staging first, flag flip is reversible, demo data is discarded with a notice).

**Not built yet:** the Supabase adapter itself (the code that implements `services/contracts` against Supabase). It can be written now against the local test database and switched on at step 5.
