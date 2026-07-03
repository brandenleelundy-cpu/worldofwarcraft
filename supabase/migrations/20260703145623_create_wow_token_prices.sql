/*
# Create wow_token_prices table

## Purpose
Stores historical WoW Token price snapshots fetched from the wowtokenprices.com API.
Used to power the price tracker chart and current-price display on the Token page.

## New Tables

### wow_token_prices
Append-only log of token price readings per region.

Columns:
- id          – UUID primary key
- region      – Short region code: 'us', 'eu', 'kr', 'tw', 'cn'
- price       – Token price in gold (integer)
- recorded_at – Timestamp of when the price was fetched (default now())

## Security
- RLS enabled.
- Anon + authenticated users can SELECT (read the public price history).
- Only service role (edge function) inserts via the service key — no client INSERT policy needed.

## Notes
1. No user_id — this is shared public data, not per-user.
2. Reads are intentionally public (anon policy) so the frontend can query history directly.
3. Inserts are done server-side from the edge function using the service role key, so no INSERT policy for anon is required.
4. Index on (region, recorded_at DESC) for fast recent-history queries.
*/

CREATE TABLE IF NOT EXISTS wow_token_prices (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  region      text        NOT NULL,
  price       integer     NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_token_prices_region_time
  ON wow_token_prices (region, recorded_at DESC);

ALTER TABLE wow_token_prices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_token_prices" ON wow_token_prices;
CREATE POLICY "anon_select_token_prices" ON wow_token_prices
  FOR SELECT TO anon, authenticated USING (true);
