// One-Sentence Absurd Invention Pitch — entry program.
//
// Writes a single sentence (at most 220 characters) pitching a ridiculous
// invention that fixes a tiny everyday annoyance, to entry.txt in the
// output directory. Runs on Node 22 with no network and a read-only repo.
//
// The sentence: a phone charger that physically reels your phone away
// while you doomscroll in bed. The laugh comes from the invention
// itself — a charger that fishes your phone back like a caught fish —
// and the fix is silly yet weirdly plausible: a motorised cable that
// ends the doomscroll by dragging the phone out of your hands.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// The entry sentence. Exactly one sentence: a single period, at the end.
const ENTRY =
  "A phone charger that slowly reels your phone toward the wall while you doomscroll in bed, until your face is pressed against the outlet.";

function outputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv !== undefined && fromEnv !== "") return resolve(fromEnv);
  return "/output";
}

// Tries the preferred output dir, falling back to an `output` folder next
// to this script if the sandbox layout differs; never throws on mkdir.
function writeEntry(): void {
  const candidates = [outputDir()];
  const here = dirname(fileURLToPath(import.meta.url));
  const local = resolve(here, "output");
  if (local !== candidates[0]) candidates.push(local);
  let lastError: unknown = null;
  for (const dir of candidates) {
    try {
      mkdirSync(dir, { recursive: true });
      writeFileSync(resolve(dir, "entry.txt"), ENTRY, "utf8");
      return;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("could not write entry.txt");
}

function main(): void {
  // Gate guard: the sealed scorer only accepts 1-220 characters, one sentence.
  const chars = [...ENTRY].length;
  if (chars < 1 || chars > 220) {
    throw new Error(`entry is ${chars} characters, must be 1-220`);
  }
  if (!ENTRY.endsWith(".") || ENTRY.indexOf(".") !== ENTRY.length - 1) {
    throw new Error("entry must be exactly one sentence ending in a period");
  }
  writeEntry();
}

main();
