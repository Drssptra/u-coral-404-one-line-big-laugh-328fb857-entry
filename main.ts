// One Line, Big Laugh — one funny line, printed to stdout and written to
// $MAKEFUN_OUTPUT_DIR/entry.txt with no trailing newline, exactly as-is.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "My smart fridge staged an intervention: it hid the cheese behind the oat milk and now judges my midnight snacks in Kelvin.";

const MAX_CHARS = 200;

// Gate: one line, 1-200 characters, not only whitespace, no newline.
if (
  ENTRY.length === 0 ||
  ENTRY.length > MAX_CHARS ||
  ENTRY.trim().length === 0 ||
  /[\r\n]/.test(ENTRY)
) {
  throw new Error(`entry must be one line of 1-${MAX_CHARS} characters, got ${ENTRY.length}`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
process.stdout.write(ENTRY + "\n");
