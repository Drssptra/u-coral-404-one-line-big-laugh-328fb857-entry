// Entry for "One Line, Big Laugh" (u-coral-404-one-line-big-laugh-328fb857).
//
// The joke is a single sentence about a password so strong its owner is
// locked out of their own account. This script's only job is to hand that
// sentence to the harness: it lands in entry.txt, byte for byte, with no
// trailing newline, and is also echoed to stdout for the logs.

import * as fs from "node:fs";
import * as path from "node:path";

const JOKE =
  "My password is so strong even I can't log in, so I just stand outside my own account like a burglar casing his own house.";

const LIMIT = 200;

function countChars(text: string): number {
  // Count code points rather than UTF-16 units so the limit means what a
  // reader would expect it to mean.
  return [...text].length;
}

function hasLineBreak(text: string): boolean {
  for (const ch of text) {
    if (ch === "\n" || ch === "\r") return true;
  }
  return false;
}

function isBlank(text: string): boolean {
  return text.replace(/\s/g, "").length === 0;
}

function checkEntry(text: string): string[] {
  const problems: string[] = [];
  const n = countChars(text);
  if (n < 1) problems.push("entry is empty");
  if (n > LIMIT) problems.push(`entry is ${n} chars, over the ${LIMIT} limit`);
  if (isBlank(text)) problems.push("entry is only whitespace");
  if (hasLineBreak(text)) problems.push("entry spans more than one line");
  return problems;
}

function main(): void {
  const problems = checkEntry(JOKE);
  if (problems.length > 0) {
    throw new Error("invalid entry: " + problems.join("; "));
  }

  const dir = process.env.MAKEFUN_OUTPUT_DIR;
  if (dir === undefined || dir === "") {
    throw new Error("MAKEFUN_OUTPUT_DIR is not set");
  }

  fs.mkdirSync(dir, { recursive: true });
  const target = path.join(dir, "entry.txt");
  // Plain string write: no newline appended, no BOM, UTF-8.
  fs.writeFileSync(target, JOKE, { encoding: "utf8" });

  // Round-trip guard: what landed on disk must be exactly the joke,
  // byte for byte, with nothing appended.
  const onDisk = fs.readFileSync(target, "utf8");
  if (onDisk !== JOKE) {
    throw new Error("entry.txt does not match the entry text byte for byte");
  }
  const bytes = new TextEncoder().encode(onDisk);
  if (bytes.length === 0 || bytes[bytes.length - 1] === 0x0a) {
    throw new Error("entry.txt is empty or ends with a newline");
  }

  process.stdout.write(JOKE);
  process.stdout.write("\n");
}

main();
