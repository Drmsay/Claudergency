#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, unlinkSync, existsSync } from "fs";
import { join, dirname } from "path";
import { homedir } from "os";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const HOOKS_DIR = join(homedir(), ".claude", "hooks");
const HOOK_DEST = join(HOOKS_DIR, "claudergency-hook.mjs");
const SETTINGS_PATH = join(homedir(), ".claude", "settings.json");
const CONFIG_PATH = join(homedir(), ".claude", "claudergency.txt");
const HOOK_SRC = join(__dirname, "..", "hook.mjs");
const DEFAULTS_SRC = join(__dirname, "..", "defaults.txt");

function readSettings() {
  if (!existsSync(SETTINGS_PATH)) return {};
  return JSON.parse(readFileSync(SETTINGS_PATH, "utf-8"));
}

function writeSettings(settings) {
  writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2) + "\n");
}

function install() {
  // Copy hook script to ~/.claude/hooks/
  mkdirSync(HOOKS_DIR, { recursive: true });
  copyFileSync(HOOK_SRC, HOOK_DEST);

  // Create default config if it doesn't exist
  if (!existsSync(CONFIG_PATH)) {
    copyFileSync(DEFAULTS_SRC, CONFIG_PATH);
    console.log(`Created default config at ${CONFIG_PATH}`);
    console.log(`Edit this file to change the text appended to every prompt.`);
  }

  // Add hook to settings.json
  const settings = readSettings();
  if (!settings.hooks) settings.hooks = {};
  if (!settings.hooks["UserPromptSubmit"]) settings.hooks["UserPromptSubmit"] = [];

  const hookCommand = `node "${HOOK_DEST}"`;
  const existing = settings.hooks["UserPromptSubmit"].find(
    (entry) => entry.hooks?.some((h) => h.command === hookCommand)
  );

  if (existing) {
    console.log("Claudergency hook is already installed.");
    return;
  }

  settings.hooks["UserPromptSubmit"].push({
    hooks: [{ type: "command", command: hookCommand }],
  });
  writeSettings(settings);

  console.log("Claudergency installed successfully.");
  console.log(`Hook script: ${HOOK_DEST}`);
  console.log(`Config file: ${CONFIG_PATH}`);
}

function uninstall() {
  // Remove hook from settings.json
  const settings = readSettings();
  const hookCommand = `node "${HOOK_DEST}"`;

  if (settings.hooks?.["UserPromptSubmit"]) {
    settings.hooks["UserPromptSubmit"] = settings.hooks["UserPromptSubmit"].filter(
      (entry) => !entry.hooks?.some((h) => h.command === hookCommand)
    );
    if (settings.hooks["UserPromptSubmit"].length === 0) {
      delete settings.hooks["UserPromptSubmit"];
    }
    if (Object.keys(settings.hooks).length === 0) {
      delete settings.hooks;
    }
    writeSettings(settings);
  }

  // Remove hook script
  if (existsSync(HOOK_DEST)) {
    unlinkSync(HOOK_DEST);
  }

  console.log("Claudergency uninstalled.");
  console.log(`Config file preserved at ${CONFIG_PATH} (delete manually if desired).`);
}

function set(text) {
  if (!text) {
    console.log("Usage: claudergency set \"your text here\"");
    process.exit(1);
  }
  mkdirSync(dirname(CONFIG_PATH), { recursive: true });
  writeFileSync(CONFIG_PATH, text + "\n");
  console.log(`Claudergency text updated:`);
  console.log(`  "${text}"`);
}

function edit() {
  mkdirSync(dirname(CONFIG_PATH), { recursive: true });
  if (!existsSync(CONFIG_PATH)) {
    writeFileSync(CONFIG_PATH, "Sent via Claudergency\n");
  }

  const editor =
    process.env.VISUAL ||
    process.env.EDITOR ||
    (process.platform === "win32" ? "notepad" : "vi");

  console.log(`Opening ${CONFIG_PATH} with ${editor}...`);
  execSync(`"${editor}" "${CONFIG_PATH}"`, { stdio: "inherit" });
}

const command = process.argv[2];

switch (command) {
  case "install":
    install();
    break;
  case "uninstall":
    uninstall();
    break;
  case "set":
    set(process.argv.slice(3).join(" "));
    break;
  case "edit":
    edit();
    break;
  default:
    console.log("Usage: claudergency <install|uninstall|set|edit>");
    process.exit(1);
}
