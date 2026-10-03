---
name: adr
description: Create the next numbered Architecture Decision Record from docs/adr/template.md with status Proposed.
argument-hint: "[title]"
disable-model-invocation: true
---

# New ADR: $ARGUMENTS

## Existing ADRs

```!
ls docs/adr
```

Today's date: !`date +%F`

## Instructions

1. **Validate the argument.** If the title (`$ARGUMENTS`) is empty, stop and ask for it. Do nothing else.
2. **Number.** Take the highest `NNNN` prefix in the list above and add 1, zero-padded to four digits (e.g. `0011` → `0012`).
3. **File name.** `docs/adr/NNNN-<slug>.md`, where the slug is the title in lowercase kebab-case, ASCII only (e.g. `CSS Modules for styled components` → `css-modules-for-styled-components`).
4. **Create it from `docs/adr/template.md`,** keeping the template's exact format:
   - Heading: `# ADR-NNNN: <Title>`, with the title as given.
   - Status line: `- **Status:** Proposed` (a single value replaces the list of options).
   - Date line: `- **Date:** YYYY-MM-DD`, with today's date from above.
   - Fill Context, Decision, Alternatives considered and Consequences from the current conversation when it already contains that information. Otherwise keep the template's guiding questions so the author can fill them in. Never invent reasons that were not discussed.
5. **Register it in `ARCHITECTURE.md`.** Add a line at the end of the "Related decisions" list (section 12), with the same format as the existing ones: `- ADR-NNNN — Title`.
6. **Superseded ADRs.** If the conversation indicates that this ADR replaces another one, ask which. Then change only its status line to `- **Status:** Superseded by ADR-NNNN`, without touching anything else in the old ADR.
7. Show the created file path and its content, and end your response with this reminder: the status must change to `Accepted` in this same pull request, as the last commit before merging, because merged ADRs cannot be edited.
