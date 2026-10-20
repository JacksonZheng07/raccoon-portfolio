/**
 * Encrypt private/classes into public/vault for the Vault app.
 *
 *   npm run vault:seal
 *
 * The password comes from VAULT_PASSWORD, else private/.vault-password (one
 * is generated there on first run). private/ is git-ignored; only the sealed
 * output is committed, so the public repo never holds a readable note or file.
 *
 * Format: vault.json (salt + KDF parameters, public), index.bin (encrypted
 * course list, notes and file names), and one <random>.bin per file. Every
 * .bin is a 12-byte IV followed by AES-256-GCM ciphertext.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { webcrypto } from "node:crypto";

const SRC = path.join(process.cwd(), "private", "classes");
const OUT = path.join(process.cwd(), "public", "vault");
const PASSWORD_FILE = path.join(process.cwd(), "private", ".vault-password");
const ITERATIONS = 600_000;

const COURSES: Record<string, { code: string; name: string; term: string }> = {
  CS3800: { code: "CS 3800", name: "Theory of Computation", term: "Fall 2026" },
  MATH2331: { code: "MATH 2331", name: "Linear Algebra", term: "Fall 2026" },
  MATH2341: { code: "MATH 2341", name: "Differential Equations and Linear Algebra", term: "Fall 2026" },
  MATH3081: { code: "MATH 3081", name: "Probability and Statistics", term: "Summer 2 2026" },
  MATH2321: { code: "MATH 2321", name: "Calculus 3", term: "Summer 2 2026" },
  MATH1341: { code: "MATH 1341", name: "Calculus 1", term: "Fall 2025" },
};

// Newest term first, matching the Academic timeline.
const TERM_ORDER = ["Fall 2026", "Summer 2 2026", "Summer 1 2026", "Spring 2026", "Fall 2025"];

const subtle = webcrypto.subtle;
const b64 = (bytes: Uint8Array) => Buffer.from(bytes).toString("base64");

function password(): string {
  if (process.env.VAULT_PASSWORD) return process.env.VAULT_PASSWORD;
  if (existsSync(PASSWORD_FILE)) return readFileSync(PASSWORD_FILE, "utf8").trim();
  const generated = Buffer.from(webcrypto.getRandomValues(new Uint8Array(18))).toString("base64url");
  writeFileSync(PASSWORD_FILE, `${generated}\n`, { mode: 0o600 });
  console.log(`Generated a vault password in private/.vault-password`);
  return generated;
}

async function seal(key: CryptoKey, data: Uint8Array): Promise<Buffer> {
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const cipher = new Uint8Array(await subtle.encrypt({ name: "AES-GCM", iv }, key, data));
  return Buffer.concat([iv, cipher]);
}

const TYPES: Record<string, string> = { ".pdf": "application/pdf", ".tex": "text/plain", ".txt": "text/plain", ".md": "text/markdown" };

async function main(): Promise<void> {
  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const base = await subtle.importKey("raw", new TextEncoder().encode(password()), "PBKDF2", false, ["deriveKey"]);
  const key = await subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  );

  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });

  const courses = [];
  const ids = readdirSync(SRC)
    .filter((d) => COURSES[d])
    .sort((a, b) => TERM_ORDER.indexOf(COURSES[a]!.term) - TERM_ORDER.indexOf(COURSES[b]!.term) || a.localeCompare(b));
  for (const id of ids) {
    const dir = path.join(SRC, id);
    const notesPath = path.join(dir, "notes.md");
    const files = [];
    for (const name of readdirSync(path.join(dir, "files")).sort()) {
      const bytes = readFileSync(path.join(dir, "files", name));
      const blob = `${Buffer.from(webcrypto.getRandomValues(new Uint8Array(12))).toString("hex")}.bin`;
      writeFileSync(path.join(OUT, blob), await seal(key, bytes));
      files.push({ name, blob, size: bytes.length, type: TYPES[path.extname(name).toLowerCase()] ?? "application/octet-stream" });
    }
    courses.push({
      id,
      ...COURSES[id],
      notes: existsSync(notesPath) ? readFileSync(notesPath, "utf8") : "",
      files,
    });
    console.log(`${id}: ${existsSync(notesPath) ? "notes + " : ""}${files.length} files`);
  }

  const index = new TextEncoder().encode(JSON.stringify({ courses }));
  writeFileSync(path.join(OUT, "index.bin"), await seal(key, index));
  writeFileSync(
    path.join(OUT, "vault.json"),
    `${JSON.stringify({ version: 1, kdf: "PBKDF2-SHA-256", iterations: ITERATIONS, salt: b64(salt) }, null, 2)}\n`,
  );
  console.log(`Sealed ${courses.length} courses into public/vault`);
}

main().catch((cause: unknown) => {
  console.error(cause instanceof Error ? cause.message : cause);
  process.exit(1);
});
