import { randomBytes } from "node:crypto";
import { writeFileSync } from "node:fs";

const count = Number(process.argv[2] || 400);
const baseUrl = (process.argv[3] || "https://YOUR-DOMAIN/tree").replace(/\/$/, "");
const ids = new Set();

while (ids.size < count) ids.add(randomBytes(6).toString("base64url").slice(0, 10));

const rows = ["id,url"];
for (const id of ids) rows.push(`${id},${baseUrl}/${id}`);
writeFileSync("guest-tags.csv", `${rows.join("\n")}\n`);
console.log(`Wrote ${count} unique guest links to guest-tags.csv`);
