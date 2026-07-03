/*
# Drop unrestricted write policies on gold_characters and gold_realms

## Problem
After the previous migration removed `anon` from INSERT/UPDATE/DELETE policies,
the scanner still flags `authenticated`-scoped write policies with USING/WITH CHECK
always-true. Any authenticated user can freely create, modify, or delete every row
— there is no ownership predicate because neither table has a user_id column.

## Changes
Drop INSERT, UPDATE, and DELETE policies on both tables entirely.

- SELECT policies (public read) are preserved unchanged.
- Only the Supabase service-role key (used by edge functions, bypasses RLS) can
  write to these tables.
- No user-facing write path exists in the current app, so no functionality is lost.

## Security outcome
Rows cannot be inserted, updated, or deleted via the anon-key or any authenticated
JWT. Data can only be mutated by server-side code holding the service-role key.
*/

DROP POLICY IF EXISTS "anon_insert_gold_characters" ON gold_characters;
DROP POLICY IF EXISTS "anon_update_gold_characters" ON gold_characters;
DROP POLICY IF EXISTS "anon_delete_gold_characters" ON gold_characters;

DROP POLICY IF EXISTS "anon_insert_gold_realms" ON gold_realms;
DROP POLICY IF EXISTS "anon_update_gold_realms" ON gold_realms;
DROP POLICY IF EXISTS "anon_delete_gold_realms" ON gold_realms;
