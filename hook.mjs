import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const CONFIG_PATH = join(homedir(), ".claude", "claudergency.txt");
const DEFAULT_TEXT = "Sent via Claudergency";

let lines = [DEFAULT_TEXT];
if (existsSync(CONFIG_PATH)) {
  const content = readFileSync(CONFIG_PATH, "utf-8").trim();
  const parsed = content.split("\n").map((l) => l.trim()).filter(Boolean);
  if (parsed.length > 0) lines = parsed;
}

const picked = lines[Math.floor(Math.random() * lines.length)];
process.stdout.write(picked);
