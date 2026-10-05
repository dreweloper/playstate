---
name: start-task
description: Start working on a GitHub issue. Reads the issue, plans in plan mode and creates the branch after the plan is approved.
argument-hint: "[issue-number]"
arguments: [issue]
disable-model-invocation: true
---

# Start task: issue #$issue

## Issue

```!
gh issue view $issue
```

## Repository state

- Current branch: !`git branch --show-current`
- Working tree:

```!
git status --short
```

## Instructions

Follow the task cycle in `CLAUDE.md`. Planning happens in plan mode, so it stays read-only. The branch is created only after the plan is approved.

0. **Validate the argument.** If `$issue` is empty or not a number, stop and ask for the issue number. Do nothing else.
1. **Plan mode.** This skill is meant to be invoked in plan mode. If plan mode is not active, call `EnterPlanMode` before doing anything else.
2. **Check the issue.**
   - It is open and has context, acceptance criteria and an out-of-scope section (`CONVENTIONS.md` section 4). If something is missing, say so.
   - Its milestone matches the current phase in `ROADMAP.md`. Do not work ahead of the current phase; if it does not match, stop and ask.
   - If the working tree shown above is not clean, say so now: the branch cannot be created until it is.
3. **Read the relevant context.** Read the ADRs in `docs/adr/` that cover the affected area, `SECURITY-MODEL.md` if the issue touches credentials, OAuth, CORS, caching, rendering of Spotify data or CI, and `packages/<package>/CLAUDE.md` for every package involved.
4. **Derive the branch name** following `CONVENTIONS.md` section 2: `<type>/<issue-number>-<short-description>`.
   - Type from the issue label: `feature` → `feat`, `bug` → `fix`, `docs` → `docs`, `chore` → `chore`. If no label matches, ask.
   - Short description: 2–5 lowercase words from the title, in kebab-case.
5. **Present the plan** with `ExitPlanMode`. It must include:
   - The branch name. Creating the branch is the first step of the plan.
   - Files to create or modify, with a short summary of each change.
   - Alternatives discarded and why.
   - Tests to write first, for logic with clear inputs and outputs.
   - How each acceptance criterion will be verified.
   - What is out of scope, as stated in the issue.
   - Anything that conflicts with `ARCHITECTURE.md`, `CONVENTIONS.md` or an ADR.
6. **After approval, create the branch before changing any file:**
   - If the working tree is not clean, stop and ask.
   - If the branch already exists, `git switch <branch>`.
   - Otherwise, `git fetch origin` and then `git switch -c <branch> origin/main`.
   - Do not change the branch's upstream tracking (no `git branch --unset-upstream` or `--set-upstream-to`): `/done` sets it with `git push -u`.
   - Then implement the plan in small steps.
