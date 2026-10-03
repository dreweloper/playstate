---
name: done
description: Walk through the Definition of Done for the current branch and prepare the commit and the pull request, asking for confirmation before committing, pushing or opening the PR.
disable-model-invocation: true
---

# Done: Definition of Done check

## Repository state

- Current branch: !`git branch --show-current`
- Working tree:

```!
git status --short
```

- Committed changes against `origin/main`:

```!
git diff --stat origin/main...HEAD
```

## Instructions

The issue number is the number after the type in the branch name (`<type>/<issue-number>-<short-description>`). Read the issue with `gh issue view <number>`. If the branch does not follow the convention or is `main`, stop and ask.

### 1. Walk through the Definition of Done

Go through `CONVENTIONS.md` section 11 in order. Report each item as ✅, ❌ or N/A, with the evidence (command output, file and line, or the reason it does not apply):

1. **Acceptance criteria.** One line per criterion from the issue, each with its evidence.
2. **Checks.** Run `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build` (tests include coverage, which must be at or above the threshold). If a script does not exist yet, report it as "skipped: no script", never as passed.
3. **Documentation,** following the table in `CONVENTIONS.md` section 8: `ARCHITECTURE.md`, package README and JSDoc, `ROADMAP.md`, `ideas-v2.md`.
4. **ADR.** Was a significant decision made? If one is missing, suggest `/adr <title>`. If the branch adds or modifies an ADR with `- **Status:** Proposed`, point it out.
5. **Changeset.** Required if a published package under `packages/` changed. Check with `pnpm changeset status`.
6. **Out of scope.** List problems or ideas found outside the issue and draft a title and body for each new issue. Do not create them.
7. **Review and CI.** Mark as pending: they happen after the pull request is open.

If any item is ❌, stop here and propose how to fix it.

### 2. Prepare the commit

- Stage **explicit paths only**: `git add <path> <path>…`. Never use `git add -A`, `git add --all` or `git add .`, so that only the files reviewed for this task are committed (for example, no stray `.env*` file can slip in).
- Show `git diff --staged --stat`.
- Propose a commit message following Conventional Commits (`CONVENTIONS.md` section 3): `<type>(<scope>): <description>`, imperative, lowercase, no final period, with a short body if useful.
- **Ask for confirmation before running `git commit`.**

### 3. Prepare the pull request

- Check with `gh pr view` whether a pull request already exists for this branch.
  - **If it exists:** after confirmation, only push the new commit (`git push`). Do not run `gh pr create`.
  - **If it does not exist:** continue below.
- Title: Conventional Commits, since the squash merge turns it into the commit on `main`.
- Body: if `.github/pull_request_template.md` exists, follow it. Otherwise include a summary of the changes, `Closes #<issue-number>`, and how each acceptance criterion was verified.
- Show the title and body, then **stop and ask for explicit confirmation** before running `git push -u origin <branch>` and `gh pr create`. Do not push or open the pull request without it.
- If the branch adds or modifies an ADR with `- **Status:** Proposed`, end your response with this reminder: the status must change to `Accepted` in this same pull request, as the last commit before merging, because merged ADRs cannot be edited.

### No attribution

Do not add attribution trailers (such as `Co-Authored-By`) to commits, or attribution footers (such as "Generated with Claude Code") to pull request descriptions.
