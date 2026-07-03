/*
# Restrict realms table to read-only for public access

## Summary
Removes the INSERT, UPDATE, and DELETE RLS policies from the `realms` table.
Realm data is seeded via migrations and is read-only for all public clients.
Only the SELECT policy remains, granting anonymous and authenticated users
read access. Write operations must go through a privileged service-role key.

## Security Changes
- DROP POLICY anon_insert_realms  (was: WITH CHECK (true) — allowed any anon insert)
- DROP POLICY anon_update_realms  (was: USING (true) + WITH CHECK (true) — allowed any anon update)
- DROP POLICY anon_delete_realms  (was: USING (true) — allowed any anon delete)
- SELECT policy (anon_select_realms) is kept unchanged.
*/

DROP POLICY IF EXISTS "anon_insert_realms" ON realms;
DROP POLICY IF EXISTS "anon_update_realms" ON realms;
DROP POLICY IF EXISTS "anon_delete_realms" ON realms;
