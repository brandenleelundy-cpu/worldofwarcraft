/*
# Create realms table

## Summary
Creates a `realms` table to store WoW: Midnight realm data with live-style status
indicators. This is a single-tenant public wiki feature — no user auth required.

## New Tables

### `realms`
Stores one row per game realm with:
- `id` — uuid primary key
- `name` — display name of the realm (e.g. "Illidan", "Silvermoon")
- `region` — server region: US, EU, OCE, KR, TW
- `type` — realm type: Normal, PvP, RP, RP-PvP
- `timezone` — display timezone string (e.g. "US/Eastern", "EU/Central")
- `locale` — primary client locale (e.g. enUS, deDE, frFR)
- `status` — current realm state: online | offline | maintenance
- `population` — current population tier: Full | High | Medium | Low
- `queue_time` — nullable integer minutes in login queue (null = no queue)
- `created_at` — insertion timestamp

## Security
- RLS enabled with open anon+authenticated read/write since this is public shared data
  with no per-user ownership. Status data can be updated from the frontend for demo
  purposes (simulated status refresh).
- SELECT, INSERT, UPDATE, DELETE all use `TO anon, authenticated USING (true)`.

## Notes
1. No user_id — single-tenant, no auth required.
2. All four CRUD policies are defined separately (not FOR ALL).
3. Indexes on region and status for fast filtered queries.
*/

CREATE TABLE IF NOT EXISTS realms (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  region      text NOT NULL,
  type        text NOT NULL DEFAULT 'Normal',
  timezone    text NOT NULL,
  locale      text NOT NULL DEFAULT 'enUS',
  status      text NOT NULL DEFAULT 'online',
  population  text NOT NULL DEFAULT 'Medium',
  queue_time  integer,
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS realms_region_idx ON realms(region);
CREATE INDEX IF NOT EXISTS realms_status_idx ON realms(status);

ALTER TABLE realms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_realms" ON realms;
CREATE POLICY "anon_select_realms" ON realms FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_realms" ON realms;
CREATE POLICY "anon_insert_realms" ON realms FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_realms" ON realms;
CREATE POLICY "anon_update_realms" ON realms FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_realms" ON realms;
CREATE POLICY "anon_delete_realms" ON realms FOR DELETE
TO anon, authenticated USING (true);
