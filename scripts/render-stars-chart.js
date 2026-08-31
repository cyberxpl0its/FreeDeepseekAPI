#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const OUT_SVG = path.join(ROOT, 'docs/assets/stars.svg');
const REPO = process.env.GITHUB_REPOSITORY || 'dekrezz/FreeDeepseekAPI';
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';

function fail(message) {
  throw new Error(message);
}

async function githubJson(url) {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github.star+json',
      'User-Agent': 'free-deepseek-api-star-chart',
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
  });
  if (!res.ok) fail(`GitHub ${res.status} ${url}: ${await res.text()}`);
  return res.json();
}

async function starredAtList() {
  const out = [];
  for (let page = 1; page <= 100; page += 1) {
    const batch = await githubJson(
      `https://api.github.com/repos/${REPO}/stargazers?per_page=100&page=${page}`,
    );
    if (!Array.isArray(batch) || batch.length === 0) break;
    for (const row of batch) {
      if (!row.starred_at) fail('stargazers response missing starred_at; Accept header was ignored');
      out.push(row.starred_at);
    }
    if (batch.length < 100) break;
  }
  return out.sort();
}

function dayKey(iso) {
  return iso.slice(0, 10);
}

function series(createdAt, starredAt) {
  const start = dayKey(createdAt);
  const end = dayKey(new Date().toISOString());
  const counts = new Map();
  let running = 0;
  for (const at of starredAt) {
    running += 1;
    counts.set(dayKey(at), running);
  }
  const days = [];
  for (let d = new Date(`${start}T00:00:00Z`); d <= new Date(`${end}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + 1)) {
    days.push(d.toISOString().slice(0, 10));
  }
  if (days.length === 0) days.push(end);
  let last = 0;
  return days.map((day) => {
    if (counts.has(day)) last = counts.get(day);
    return { day, count: last };
  });
}

function svgChart(points, total) {
  const w = 800;
  const h = 280;
  const padL = 56;
  const padR = 24;
  const padT = 48;
  const padB = 40;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;
  const maxY = Math.max(1, ...points.map((p) => p.count));
  const xy = (i, count) => {
    const x = padL + (points.length === 1 ? plotW : (i / (points.length - 1)) * plotW);
    const y = padT + plotH - (count / maxY) * plotH;
    return [x, y];
  };
  const d = points
    .map((p, i) => {
      const [x, y] = xy(i, p.count);
      return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  const [lx, ly] = xy(points.length - 1, points[points.length - 1].count);
  const start = points[0].day;
  const end = points[points.length - 1].day;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${total} GitHub stars">
  <rect width="${w}" height="${h}" rx="16" fill="#071018"/>
  <text x="${padL}" y="28" fill="#e8f6ff" font-family="ui-sans-serif, system-ui, sans-serif" font-size="18" font-weight="700">GitHub stars</text>
  <text x="${w - padR}" y="28" text-anchor="end" fill="#3ee0c8" font-family="ui-sans-serif, system-ui, sans-serif" font-size="18" font-weight="700">${total}</text>
  <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + plotH}" stroke="#1c2a38"/>
  <line x1="${padL}" y1="${padT + plotH}" x2="${padL + plotW}" y2="${padT + plotH}" stroke="#1c2a38"/>
  <path d="${d}" fill="none" stroke="#3ee0c8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="5" fill="#7c6bff"/>
  <text x="${padL}" y="${h - 14}" fill="#9ab0c4" font-family="ui-sans-serif, system-ui, sans-serif" font-size="12">${start}</text>
  <text x="${w - padR}" y="${h - 14}" text-anchor="end" fill="#9ab0c4" font-family="ui-sans-serif, system-ui, sans-serif" font-size="12">${end}</text>
</svg>
`;
}

async function main() {
  const repo = await githubJson(`https://api.github.com/repos/${REPO}`);
  const starredAt = await starredAtList();
  const points = series(repo.created_at, starredAt);
  const svg = svgChart(points, repo.stargazers_count);
  fs.mkdirSync(path.dirname(OUT_SVG), { recursive: true });
  fs.writeFileSync(OUT_SVG, svg);
  process.stdout.write(`wrote ${OUT_SVG} (${repo.stargazers_count} stars, ${points.length} days)\n`);
}

main().catch((err) => {
  process.stderr.write(`${err.message}\n`);
  process.exit(1);
});
