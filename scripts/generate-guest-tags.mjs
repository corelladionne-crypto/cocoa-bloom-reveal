#!/usr/bin/env node

import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import QRCode from "qrcode";

const count = Number(process.argv[2] ?? 400);
const baseUrl = (process.argv[3] ?? "https://yourdomain.com/tree").replace(/\/$/, "");
const outputDir = process.argv[4] ?? "guest-tags";

if (!Number.isInteger(count) || count < 1) {
  console.error("Usage: node scripts/generate-guest-tags.mjs 400 https://yourdomain.com/tree [output-dir]");
  process.exit(1);
}

await mkdir(outputDir, { recursive: true });

const ids = new Set();
while (ids.size < count) ids.add(randomBytes(4).toString("hex"));

const rows = ["id,url"];
for (const id of ids) {
  const url = `${baseUrl}/${id}`;
  rows.push(`${id},${url}`);
  await QRCode.toFile(path.join(outputDir, `${id}.png`), url, {
    width: 800,
    margin: 2,
    errorCorrectionLevel: "H",
  });
}

await writeFile(path.join(outputDir, "guest-tags.csv"), `${rows.join("\n")}\n`, "utf8");
await writeFile(path.join(outputDir, "guest-tags.json"), JSON.stringify([...ids].map((id) => ({ id, url: `${baseUrl}/${id}` })), null, 2), "utf8");
console.log(`Generated ${count} unique QR codes in ${outputDir}/`);
console.log(`CSV: ${outputDir}/guest-tags.csv`);
console.log(`JSON: ${outputDir}/guest-tags.json`);
