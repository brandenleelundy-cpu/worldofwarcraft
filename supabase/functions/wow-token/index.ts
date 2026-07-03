import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const REGIONS = ["us", "eu", "kr", "tw"] as const;
type Region = typeof REGIONS[number];

// wowtokenprices.com public JSON feed
const PRICES_URL = "https://wowtokenprices.com/current_prices.json";

// Gold formatted with commas
function formatGold(price: number): string {
  return price.toLocaleString("en-US");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const url = new URL(req.url);
    const region = (url.searchParams.get("region") || "us").toLowerCase() as Region;
    const historyDays = parseInt(url.searchParams.get("days") || "7", 10);

    // Fetch live prices from wowtokenprices.com
    const priceRes = await fetch(PRICES_URL, {
      headers: { "User-Agent": "MidnightWiki/1.0" },
    });

    if (!priceRes.ok) {
      throw new Error(`wowtokenprices.com returned ${priceRes.status}`);
    }

    const priceData = await priceRes.json();

    // Build current prices snapshot for all regions
    const currentPrices: Record<string, { price: number; formatted: string; region: string }> = {};
    const insertRows: { region: string; price: number }[] = [];

    for (const r of REGIONS) {
      const raw = priceData[r];
      if (!raw) continue;
      const price = raw.last ?? raw.buy_price ?? 0;
      currentPrices[r] = {
        price,
        formatted: formatGold(price),
        region: r.toUpperCase(),
      };
      insertRows.push({ region: r, price });
    }

    // Persist snapshot to DB (fire-and-forget within waitUntil)
    const insertPromise = supabase.from("wow_token_prices").insert(insertRows);
    EdgeRuntime.waitUntil(insertPromise);

    // Fetch history for the requested region
    const since = new Date(Date.now() - historyDays * 24 * 60 * 60 * 1000).toISOString();
    const { data: history, error: histErr } = await supabase
      .from("wow_token_prices")
      .select("price, recorded_at")
      .eq("region", region)
      .gte("recorded_at", since)
      .order("recorded_at", { ascending: true });

    if (histErr) throw histErr;

    // If we have very few history points (first fetch), include the live price as a synthetic point
    const historyPoints = (history && history.length > 0)
      ? history
      : [{ price: currentPrices[region]?.price ?? 0, recorded_at: new Date().toISOString() }];

    // Compute stats from history
    const prices = historyPoints.map((h) => h.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
    const firstPrice = prices[0] ?? 0;
    const lastPrice = prices[prices.length - 1] ?? 0;
    const changePct = firstPrice > 0
      ? (((lastPrice - firstPrice) / firstPrice) * 100).toFixed(1)
      : "0.0";

    return new Response(
      JSON.stringify({
        current: currentPrices,
        history: historyPoints,
        stats: {
          region,
          min: minPrice,
          max: maxPrice,
          avg: avgPrice,
          minFormatted: formatGold(minPrice),
          maxFormatted: formatGold(maxPrice),
          avgFormatted: formatGold(avgPrice),
          changePct: Number(changePct),
          days: historyDays,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("wow-token error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
