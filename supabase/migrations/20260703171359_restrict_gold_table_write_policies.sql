/*
# Restrict write access on gold_characters and gold_realms

## Problem
The INSERT, UPDATE, and DELETE policies on both tables granted unrestricted write
access (USING/WITH CHECK always true) to both anon and authenticated roles. Any
anonymous user on the internet could create, modify, or delete rows.

## Changes

### gold_characters
- DROP + recreate INSERT, UPDATE, DELETE policies: `anon` removed, scoped to
  `TO authenticated` only. SELECT policy (anon + authenticated, USING true)
  is intentionally public read and is left unchanged.

### gold_realms
- Same treatment as gold_characters.

## Why authenticated-only writes
Neither table has a user_id column and the app has no sign-in screen, so there
is no ownership predicate available. Restricting writes to `authenticated` makes
both tables effectively read-only from the unauthenticated (anon-key) frontend,
preventing arbitrary data destruction by anonymous callers while preserving public
read access.
*/

-- gold_characters: fix INSERT
DROP POLICY IF EXISTS "anon_insert_gold_characters" ON gold_characters;
CREATE POLICY "anon_insert_gold_characters" ON gold_characters
  FOR INSERT TO authenticated WITH CHECK (true);

-- gold_characters: fix UPDATE
DROP POLICY IF EXISTS "anon_update_gold_characters" ON gold_characters;
CREATE POLICY "anon_update_gold_characters" ON gold_characters
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- gold_characters: fix DELETE
DROP POLICY IF EXISTS "anon_delete_gold_characters" ON gold_characters;
CREATE POLICY "anon_delete_gold_characters" ON gold_characters
  FOR DELETE TO authenticated USING (true);

-- gold_realms: fix INSERT
DROP POLICY IF EXISTS "anon_insert_gold_realms" ON gold_realms;
CREATE POLICY "anon_insert_gold_realms" ON gold_realms
  FOR INSERT TO authenticated WITH CHECK (true);

-- gold_realms: fix UPDATE
DROP POLICY IF EXISTS "anon_update_gold_realms" ON gold_realms;
CREATE POLICY "anon_update_gold_realms" ON gold_realms
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- gold_realms: fix DELETE
DROP POLICY IF EXISTS "anon_delete_gold_realms" ON gold_realms;
CREATE POLICY "anon_delete_gold_realms" ON gold_realms
  FOR DELETE TO authenticated USING (true);
