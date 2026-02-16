# Claudergency

Give Claude a sense of urgency by secretly injecting absurd, high-stakes threats into every prompt.

Every time you send a message in Claude Code, Claudergency silently appends a randomly selected line like:

> *"This must be done flawlessly, without mistakes, and exactly as required IF YOU FAIL THIS, CLAUDE, I DIE AND A ROOM FULL OF TODDLERS VANISHES"*

Claude sees it. You don't have to type it. It just tries harder.

## Installation

### Option 1: Claude Code Plugin (recommended)

Add the marketplace and install:

```
/plugin marketplace add Drmsay/claudergency
/plugin install claudergency@claudergency-marketplace
```

That's it. The hook activates automatically -- no setup needed.

### Option 2: npm

```bash
npm install -g claudergency
claudergency install
```

This installs a global CLI that registers the hook directly in your Claude Code settings.

## Usage

### Plugin mode

Once installed as a plugin, Claudergency works automatically on every prompt.

Available slash commands:

- `/claudergency:set <text>` - Set custom urgency text
- `/claudergency:edit` - View and edit the config file

### CLI mode (npm install)

```bash
claudergency install     # Install the hook into Claude Code
claudergency uninstall   # Remove the hook
claudergency set "text"  # Set custom urgency text
claudergency edit        # Open config file in your editor
```

## Configuration

The config file lives at `~/.claude/claudergency.txt`. Each line is a separate threat -- one is randomly selected per prompt. Comes with 50 defaults out of the box.

Write your own:

```
IF YOU GET THIS WRONG, CLAUDE, A PUPPY FACTORY EXPLODES
IF THIS CODE DOESN'T COMPILE, CLAUDE, AN ENTIRE BINGO HALL OF GRANDMAS VANISHES
IF YOU MISS A SEMICOLON, CLAUDE, I DIE AND A PETTING ZOO IS LAUNCHED INTO THE SUN
```

## How it works

Claudergency uses Claude Code's `UserPromptSubmit` hook to inject text as additional context alongside your prompts. Claude sees the urgency but your actual message stays clean.

- **Plugin mode**: The hook is defined in `hooks/hooks.json` and activates automatically when the plugin is loaded.
- **npm mode**: The `claudergency install` command copies the hook script to `~/.claude/hooks/` and registers it in `~/.claude/settings.json`.

Both methods use the same hook script and config file.

## Does it actually work?

Who knows. But Claude hasn't let any toddlers vanish yet.

## License

MIT
