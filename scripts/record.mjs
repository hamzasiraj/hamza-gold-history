// Fetches the current gold, silver and USD/PKR prices and appends them to
// data/price-history.json, pruning anything older than 25 hours. Run on a
// schedule by the GitHub Actions workflow in .github/workflows/record-price.yml.

import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'price-history.json');
const MAX_AGE_MS = 25 * 60 * 60 * 1000; // keep 25h of samples

async function loadData() {
  try {
    const raw = await readFile(DATA_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { XAU: [], XAG: [], FX: [] };
  }
}

async function fetchGold(symbol) {
  const res = await fetch(`https://api.gold-api.com/price/${symbol}`);
  if (!res.ok) throw new Error(`gold-api ${symbol} failed: ${res.status}`);
  const data = await res.json();
  return data.price;
}

async function fetchFx() {
  const res = await fetch('https://open.er-api.com/v6/latest/USD');
  if (!res.ok) throw new Error(`fx failed: ${res.status}`);
  const data = await res.json();
  return data.rates.PKR;
}

function prune(arr) {
  const now = Date.now();
  return arr.filter((s) => now - s.t <= MAX_AGE_MS);
}

async function main() {
  const data = await loadData();
  const now = Date.now();
  data.XAU = data.XAU || [];
  data.XAG = data.XAG || [];
  data.FX = data.FX || [];

  try {
    const xau = await fetchGold('XAU');
    data.XAU = prune([...data.XAU, { t: now, p: xau }]);
  } catch (e) {
    console.error('XAU fetch failed:', e.message);
  }

  try {
    const xag = await fetchGold('XAG');
    data.XAG = prune([...data.XAG, { t: now, p: xag }]);
  } catch (e) {
    console.error('XAG fetch failed:', e.message);
  }

  try {
    const fx = await fetchFx();
    data.FX = prune([...data.FX, { t: now, p: fx }]);
  } catch (e) {
    console.error('FX fetch failed:', e.message);
  }

  await mkdir(path.dirname(DATA_PATH), { recursive: true });
  await writeFile(DATA_PATH, JSON.stringify(data));
  console.log(
    `Recorded: XAU=${data.XAU.length} pts, XAG=${data.XAG.length} pts, FX=${data.FX.length} pts`
  );
}

main();
