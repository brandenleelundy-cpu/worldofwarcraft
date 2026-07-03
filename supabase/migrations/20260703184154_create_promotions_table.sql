/*
# Create promotions table

## Summary
Creates the `promotions` table to power the "Current Sales & Promotions" wiki page.
This table stores all Blizzard/in-game promotions, bonus events, shop sales, and
subscription deals displayed to players.

## New Tables

### `promotions`
Stores each active or upcoming promotion with full metadata.

| Column         | Type          | Description |
|----------------|---------------|-------------|
| id             | uuid          | Primary key |
| title          | text          | Short display name of the promotion |
| category       | text          | One of: shop_sale, bonus_event, subscription_deal, bundle |
| description    | text          | Full description shown on the card |
| short_note     | text          | Optional one-liner shown in summary view |
| discount_text  | text          | Human-readable discount label (e.g. "30% Off", "Double XP") |
| original_price | numeric       | Original price in USD (null for non-priced events) |
| sale_price     | numeric       | Sale price in USD (null for non-priced events) |
| start_date     | timestamptz   | When the promotion becomes active |
| end_date       | timestamptz   | When the promotion expires |
| featured       | boolean       | Whether to show in the featured spotlight section |
| tags           | text[]        | Searchable/filterable tags (e.g. ["Mount", "Exclusive"]) |
| image_url      | text          | Pexels image URL for the card banner |
| sort_order     | integer       | Manual sort weight (lower = shown first) |
| created_at     | timestamptz   | Record creation time |

## Security

- RLS enabled on `promotions`.
- Only a single SELECT policy is added, scoped to `anon` and `authenticated` roles.
- No INSERT / UPDATE / DELETE policies from the client. All data changes go through
  the service-role key (migrations / admin tooling only).

## Notes

1. `USING (true)` on the SELECT policy is intentional: promotion data is public
   reference information — there is no user-private data in this table.
2. No write policies are created, so the anon-key frontend is read-only by design.
*/

CREATE TABLE IF NOT EXISTS promotions (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text        NOT NULL,
  category       text        NOT NULL CHECK (category IN ('shop_sale','bonus_event','subscription_deal','bundle')),
  description    text        NOT NULL,
  short_note     text,
  discount_text  text,
  original_price numeric(10,2),
  sale_price     numeric(10,2),
  start_date     timestamptz NOT NULL,
  end_date       timestamptz NOT NULL,
  featured       boolean     NOT NULL DEFAULT false,
  tags           text[]      NOT NULL DEFAULT '{}',
  image_url      text,
  sort_order     integer     NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_promotions_category  ON promotions (category);
CREATE INDEX IF NOT EXISTS idx_promotions_end_date  ON promotions (end_date);
CREATE INDEX IF NOT EXISTS idx_promotions_featured  ON promotions (featured) WHERE featured = true;

ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_promotions" ON promotions;
CREATE POLICY "anon_select_promotions" ON promotions FOR SELECT
TO anon, authenticated
USING (true);

/* ── Seed data ────────────────────────────────────────────────────────────── */

INSERT INTO promotions
  (title, category, description, short_note, discount_text,
   original_price, sale_price, start_date, end_date,
   featured, tags, image_url, sort_order)
VALUES

-- Featured: Midsummer Fire Festival
(
  'Midsummer Fire Festival',
  'bonus_event',
  'Azeroth''s annual fire festival returns to Quel''Thalas. Earn double Experience while completing Bonfires, Torch Tossing, and Ahune dailies. The festival decorations are especially vibrant in Silvermoon City''s rebuilt districts this year.',
  'Double XP on all bonfire quests',
  'Double XP',
  NULL, NULL,
  '2026-07-01 00:00:00+00',
  '2026-07-14 23:59:59+00',
  true,
  ARRAY['Bonus XP','Seasonal','Free','Silvermoon'],
  'https://images.pexels.com/photos/1840947/pexels-photo-1840947.jpeg?auto=compress&cs=tinysrgb&w=800',
  1
),

-- Featured: Summer Shop Sale
(
  'Blizzard Shop Summer Sale — Up to 35% Off',
  'shop_sale',
  'The annual Summer Sale is live. Save up to 35% on a curated selection of mounts, pets, and character services. Highlighted items include the Cenarion War Hippogryph, the Enchanted Fey Dragon, and this year''s Summer exclusive: the Void-Touched Hawkstrider.',
  'Up to 35% off selected mounts and pets',
  'Up to 35% Off',
  NULL, NULL,
  '2026-06-27 00:00:00+00',
  '2026-07-20 23:59:59+00',
  true,
  ARRAY['Mount','Pet','Shop','Seasonal'],
  'https://images.pexels.com/photos/1496373/pexels-photo-1496373.jpeg?auto=compress&cs=tinysrgb&w=800',
  2
),

-- Void-Touched Hawkstrider (shop sale, specific item)
(
  'Void-Touched Hawkstrider Mount',
  'shop_sale',
  'A limited-time mount exclusive to the Midnight expansion era. The Hawkstrider has been reimagined with void energy swirling through its feathers, leaving shadow trails as it moves. Available for a limited time during the Summer Sale period.',
  'Midnight-exclusive mount. Limited availability.',
  '20% Off',
  24.99, 19.99,
  '2026-06-27 00:00:00+00',
  '2026-07-20 23:59:59+00',
  false,
  ARRAY['Mount','Exclusive','Midnight','Void'],
  'https://images.pexels.com/photos/635499/pexels-photo-635499.jpeg?auto=compress&cs=tinysrgb&w=800',
  3
),

-- 6-Month Sub Bundle
(
  '6-Month Subscription Bundle',
  'subscription_deal',
  'Subscribe for 6 months and receive the Alabaster Stormtalon flying mount, 1 character boost to level 70, and 30 days of free game time stacked on top of the subscription. Billed as a single payment. Renews as a standard 6-month plan.',
  'Includes exclusive mount + 30 days bonus game time',
  'Best Value',
  NULL, NULL,
  '2026-07-01 00:00:00+00',
  '2026-07-31 23:59:59+00',
  false,
  ARRAY['Subscription','Mount','Game Time','Bundle'],
  'https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg?auto=compress&cs=tinysrgb&w=800',
  4
),

-- Midnight Digital Deluxe Upgrade
(
  'Midnight Digital Deluxe Upgrade — 25% Off',
  'shop_sale',
  'Already own WoW: Midnight Base Edition? Upgrade to Digital Deluxe for 25% off this month. Includes the Harbinger''s Void Drake flying mount, a Banshee spectral pet, the Dark Ranger transmog armor set, and a unique Midnight title.',
  'Existing owners save 25% on the Deluxe upgrade',
  '25% Off',
  39.99, 29.99,
  '2026-07-01 00:00:00+00',
  '2026-07-31 23:59:59+00',
  false,
  ARRAY['Upgrade','Mount','Transmog','Pet','Deluxe'],
  'https://images.pexels.com/photos/1146667/pexels-photo-1146667.jpeg?auto=compress&cs=tinysrgb&w=800',
  5
),

-- Quel'Thalas Collector's Pet Bundle
(
  'Quel''Thalas Collector''s Pet Bundle',
  'bundle',
  'Three exclusive pets that can only be obtained as a bundle: the Silvermoon Firecat, the Ghostlands Sprite, and the Sunwell Mote (a tiny orb of holy energy). All three are animated with Midnight-specific visual effects.',
  'Three exclusive pets, bundle-only availability',
  '3 Pets — Bundle Price',
  29.99, 19.99,
  '2026-07-05 00:00:00+00',
  '2026-07-25 23:59:59+00',
  false,
  ARRAY['Pet','Bundle','Exclusive','Midnight','Quel''Thalas'],
  'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=800',
  6
),

-- Darkmoon Faire Weekend
(
  'Darkmoon Faire Bonus Weekend',
  'bonus_event',
  'The Darkmoon Faire is in town and granting bonus rewards across the board: +10% Experience, +10% Profession skill-ups, and +10% Reputation gains from all sources. Ride the carousel, complete faire quests, and stock up on Darkmoon Tokens.',
  '+10% XP, Professions, and Reputation',
  '+10% Bonus Weekend',
  NULL, NULL,
  '2026-07-05 00:00:00+00',
  '2026-07-07 23:59:59+00',
  false,
  ARRAY['Bonus XP','Professions','Reputation','Darkmoon'],
  'https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&w=800',
  7
),

-- Battle.net Balance Bonus
(
  'WoW Token → Battle.net Balance Bonus',
  'subscription_deal',
  'For a limited weekend, converting a WoW Token to Battle.net Balance grants 15% bonus balance. A token normally converts to $15 USD equivalent — this weekend it converts to $17.25. Stack multiple tokens for maximum value.',
  '+15% bonus when converting WoW Token to Balance',
  '+15% Balance Bonus',
  NULL, NULL,
  '2026-07-10 00:00:00+00',
  '2026-07-12 23:59:59+00',
  false,
  ARRAY['WoW Token','Battle.net Balance','Bonus'],
  'https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg?auto=compress&cs=tinysrgb&w=800',
  8
),

-- Dawn of the Veil Transmog Pack
(
  'Dawn of the Veil Transmog Pack',
  'shop_sale',
  'A new armor appearance set themed around the Void''s encroachment on Quel''Thalas. Available for all armor types (Cloth, Leather, Mail, Plate) as separate purchases or as a full bundle. The set includes a weapon illusion: Void''s Edge.',
  '20% off through July — all armor types available',
  '20% Off',
  19.99, 15.99,
  '2026-07-01 00:00:00+00',
  '2026-07-28 23:59:59+00',
  false,
  ARRAY['Transmog','Void','Armor','Weapon Illusion'],
  'https://images.pexels.com/photos/6430/night-festival-dark-abstract.jpg?auto=compress&cs=tinysrgb&w=800',
  9
),

-- Upcoming: Firelands Timewalking
(
  'Firelands Timewalking (Upcoming)',
  'bonus_event',
  'Timewalking returns to the Firelands! Venture into the iconic Cataclysm raid scaled to your current level. Earn Timewarped Badges to spend at the Timewalking vendor for exclusive mounts, transmogs, and gear. Bonus: Timewalking gear scales to current Midnight ilvl.',
  'Timewalking Badges scale to current ilvl gear',
  'Timewalking Event',
  NULL, NULL,
  '2026-07-16 00:00:00+00',
  '2026-07-23 23:59:59+00',
  false,
  ARRAY['Timewalking','Raid','Firelands','Badges'],
  'https://images.pexels.com/photos/1612461/pexels-photo-1612461.jpeg?auto=compress&cs=tinysrgb&w=800',
  10
),

-- Recruit-a-Friend
(
  'Recruit-a-Friend Program',
  'subscription_deal',
  'Recruit a friend to WoW and both of you earn rewards as they subscribe. New rewards for Midnight: the Spectral Gryphon (at 3 months), the Void-Infused Tabard (at 6 months), and the exclusive Midnight Duo title at 12 months. No expiry on the program itself.',
  'Earn mounts and titles as your recruit subscribes',
  'Ongoing Rewards',
  NULL, NULL,
  '2026-01-01 00:00:00+00',
  '2026-12-31 23:59:59+00',
  false,
  ARRAY['Recruit-a-Friend','Mount','Social','Ongoing'],
  'https://images.pexels.com/photos/1367253/pexels-photo-1367253.jpeg?auto=compress&cs=tinysrgb&w=800',
  11
);
