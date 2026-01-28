import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { homedir } from "os";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = join(homedir(), ".claude", "claudergency.txt");
const DEFAULTS_PATH = join(__dirname, "defaults.txt");
const DEFAULT_TEXT = "Sent via Claudergency";

let lines = [DEFAULT_TEXT];
if (existsSync(CONFIG_PATH)) {
  const content = readFileSync(CONFIG_PATH, "utf-8").trim();
  const parsed = content.split("\n").map((l) => l.trim()).filter(Boolean);
  if (parsed.length > 0) lines = parsed;
} else if (existsSync(DEFAULTS_PATH)) {
  const content = readFileSync(DEFAULTS_PATH, "utf-8").trim();
  const parsed = content.split("\n").map((l) => l.trim()).filter(Boolean);
  if (parsed.length > 0) lines = parsed;
}

const picked = lines[Math.floor(Math.random() * lines.length)];
process.stdout.write(picked);
