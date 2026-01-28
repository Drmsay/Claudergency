import { copyFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { homedir } from "os";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = join(homedir(), ".claude", "claudergency.txt");
const DEFAULTS_SRC = join(__dirname, "defaults.txt");

if (!existsSync(CONFIG_PATH) && existsSync(DEFAULTS_SRC)) {
  mkdirSync(dirname(CONFIG_PATH), { recursive: true });
  copyFileSync(DEFAULTS_SRC, CONFIG_PATH);
}
