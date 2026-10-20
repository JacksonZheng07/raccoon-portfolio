/*
 * Browser side of scripts/seal-vault.ts: derive the key from the password and
 * open the sealed blobs. The key lives only in memory for this page load.
 */

export type VaultFile = { name: string; blob: string; size: number; type: string };
export type VaultCourse = { id: string; code: string; name: string; term: string; notes: string; files: VaultFile[] };

const base = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/vault`;
let sessionKey: CryptoKey | null = null;

const fromB64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function fetchBytes(name: string): Promise<Uint8Array> {
  const r = await fetch(`${base}/${name}`, { cache: "no-store" });
  if (!r.ok) throw new Error(`The vault is missing ${name}.`);
  return new Uint8Array(await r.arrayBuffer());
}

async function open(key: CryptoKey, sealed: Uint8Array): Promise<ArrayBuffer> {
  return crypto.subtle.decrypt({ name: "AES-GCM", iv: sealed.slice(0, 12) }, key, sealed.slice(12));
}

/** Unlocks with a password; throws "wrong-password" when it doesn't open the index. */
export async function unlock(password: string): Promise<VaultCourse[]> {
  const meta = (await (await fetch(`${base}/vault.json`, { cache: "no-store" })).json()) as { salt: string; iterations: number };
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: fromB64(meta.salt), iterations: meta.iterations, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );
  const index = await fetchBytes("index.bin");
  let plain: ArrayBuffer;
  try {
    plain = await open(key, index);
  } catch {
    throw new Error("wrong-password");
  }
  sessionKey = key;
  return (JSON.parse(new TextDecoder().decode(plain)) as { courses: VaultCourse[] }).courses;
}

/** The decrypted courses again, if this page load already unlocked. */
export async function reopen(): Promise<VaultCourse[] | null> {
  if (!sessionKey) return null;
  const plain = await open(sessionKey, await fetchBytes("index.bin"));
  return (JSON.parse(new TextDecoder().decode(plain)) as { courses: VaultCourse[] }).courses;
}

export function lock(): void {
  sessionKey = null;
}

export async function openFile(file: VaultFile): Promise<Blob> {
  if (!sessionKey) throw new Error("The vault is locked.");
  return new Blob([await open(sessionKey, await fetchBytes(file.blob))], { type: file.type });
}
