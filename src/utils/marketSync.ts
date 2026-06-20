/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Mapping of known assets to their base price values from INITIAL_ASSETS
const BASE_PRICES: Record<string, number> = {
  crypto_idx: 641.867,
  brazil_powerplay: 143.148,
  africa_knockout: 812.45,
  latam_power: 342.10,
  asia_matchpoint: 1204.50,
  egypt_tempo: 456.90,
  eur_usd: 1.08450,
  gbp_nok: 13.48510,
  aud_zar: 12.18430,
  eur_huf: 392.42000,
  bitcoin: 69420.50,
  ethereum: 3500.00,
  gold: 2342.10,
  brent_oil: 81.45,
  apple: 194.25
};

/**
 * Deterministically computes the price of any asset at any second 't' (Unix epoch second)
 * using combinations of multiple sine, cosine waves and high frequency noise.
 * This guarantees that all devices, tabs, and sessions across the world see identical
 * market prices, ticks, fluctuations, and visual candlestick designs at the same time!
 */
export function getAssetPriceAt(assetId: string, type: string, t: number): number {
  // 1. Generate a stable seeded unique number from asset ID
  let seed = 0;
  const lowerId = assetId.toLowerCase();
  for (let i = 0; i < lowerId.length; i++) {
    seed += lowerId.charCodeAt(i) * (i + 1) * 23;
  }

  // 2. Resolve base price
  const basePrice = BASE_PRICES[lowerId] || 150.0;

  // 3. Multi-frequency waves for market cycle simulation
  // Fine oscillations (ticks/seconds)
  const w1 = Math.sin((t * 0.052) + seed * 0.12) * 0.0016;
  const w2 = Math.cos((t * 0.027) - seed * 0.43) * 0.0009;
  
  // Medium oscillations (minute level trends)
  const w3 = Math.sin((t * 0.0061) + seed * 0.77) * 0.0035;
  const w4 = Math.cos((t * 0.0017) - seed * 1.22) * 0.0085;
  
  // Slow macro trend cycles (10-30 min)
  const w5 = Math.sin((t * 0.00041) + seed * 1.83) * 0.018;
  const w6 = Math.cos((t * 0.00013) - seed * 2.71) * 0.042;
  
  // Very slow epoch trend cycles (hours)
  const w7 = Math.sin((t * 0.000033) + seed * 3.44) * 0.075;

  // High-frequency deterministic deterministic white noise/jitter
  const x = Math.sin(t * 782.359 + seed) * 10000;
  const noise = (x - Math.floor(x) - 0.5) * 0.00035;

  // 4. Calibrate volatility by asset categories
  let volatility = 1.0;
  if (type === 'crypto') {
    volatility = 1.6;
  } else if (type === 'currencies') {
    volatility = 0.28;
  } else if (type === 'commodities') {
    volatility = 0.75;
  } else if (type === 'stocks') {
    volatility = 0.95;
  }

  const netPercentageChange = (w1 + w2 + w3 + w4 + w5 + w6 + w7 + noise) * volatility;

  // Keep price bound to a realistic formula above zero
  return basePrice * (1 + netPercentageChange);
}

/**
 * Returns a slice of the past N seconds of prices ending at the current second t.
 * This forms the solid historical ticks/candles array.
 */
export function getAssetHistoryAt(assetId: string, type: string, currentSec: number, count = 350): number[] {
  const history: number[] = [];
  for (let k = count - 1; k >= 0; k--) {
    const t = currentSec - k;
    history.push(getAssetPriceAt(assetId, type, t));
  }
  return history;
}
