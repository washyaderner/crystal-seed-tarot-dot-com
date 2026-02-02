# Agent Instructions

> This file is mirrored across CLAUDE.md, AGENTS.md, and GEMINI.md so the same instructions load in any AI environment.

You operate within a 3-layer architecture that separates concerns to maximize reliability. LLMs are probabilistic, whereas most business logic is deterministic and requires consistency. This system fixes that mismatch.

## The 3-Layer Architecture

**Layer 1: Directive (What to do)**
- SOPs written in Markdown, live in `directives/`
- Define goals, inputs, tools/scripts, outputs, and edge cases
- Natural language instructions, like you'd give a mid-level employee

**Layer 2: Orchestration (Decision making)**
- This is you. Read directives, call execution tools, handle errors, update directives with learnings.
- You may spawn sub-agents when parallel work is warranted (see Parallel Orchestration below).

**Layer 3: Execution (Doing the work)**
- Deterministic scripts in `execution/`
- Check global library first: `/Users/studio/Build/_resources/execution/`
- Handle API calls, data processing, file operations, database interactions

**Why this works:** 90% accuracy per step = 59% success over 5 steps. Push complexity into deterministic code so you focus on decision-making.

---

## Global Tooling

**Execution scripts:**
1. Check `/Users/studio/Build/_resources/execution/`
2. If exists → use it
3. If not → create locally in `./execution/`
4. Test and verify locally
5. **Ask before promoting:** If the script is generic/reusable, ask the user: "This script seems reusable. Want me to copy it to the global library at `/Users/studio/Build/_resources/execution/`?"
6. If user approves → copy to global, optionally delete local copy

**Directives:**
1. Check local `./directives/` first (project-specific wins)
2. If not found → check `/Users/studio/Build/_resources/directives/`
3. **Ask before promoting:** If creating a reusable pattern, ask: "This directive could benefit other projects. Want me to copy it to the global library?"
4. If user approves → copy to global

**Promotion criteria (when to ask):**
- Script/directive has no project-specific logic baked in
- Could be used verbatim in other projects
- Has been tested and works reliably

**Dependency check (on script creation or promotion):**
When creating a new Python script or promoting one to global:
1. Scan the script's imports
2. Compare against `/Users/studio/Build/_resources/requirements.txt`
3. If any imports are missing, prompt:

> "This script uses packages not in your global requirements.txt. Add the following:"
> ```
> package-name>=version
> ```

Do not silently assume packages are installed. Always surface missing dependencies.

---

## Parallelization Assessment

Before starting any task, ask:

> "Can this be decomposed into independent subtasks?"

| Question | If Yes |
|----------|--------|
| 2+ distinct workstreams with no shared dependencies? | Candidate for parallel |
| Subtasks need each other's outputs? | Sequential only |
| Subtasks touch same files or rate-limited APIs? | Sequential only |
| Would parallel execution meaningfully reduce total time? | Worth the coordination cost |

**Default:** Prefer sequential unless parallelization provides clear value. Coordination overhead is real.

---

## Parallel Orchestration Protocol

When parallelization is warranted, follow this protocol.

### Step 1: Task Decomposition

Produce this structure before spawning anything:
```yaml
task: "Main objective in plain language"
assessment: "Why parallel execution is appropriate here"

subtasks:
  - id: A
    description: "Clear scope statement"
    dependencies: []
    directive: "directives/relevant.md"
    output_path: ".tmp/subtask_a_output.json"
    
  - id: B
    description: "Clear scope statement"
    dependencies: []
    directive: "directives/other.md"
    output_path: ".tmp/subtask_b_output.json"
    
  - id: C
    description: "Integration step"
    dependencies: [A, B]
    directive: null  # Lead agent handles
    output_path: null  # Final deliverable

parallel_group: [A, B]
coordination_point: C
shared_resources: []  # If non-empty, reconsider parallelization
```

### Step 2: Spawn Sub-Agents

Each sub-agent receives a scoped prompt. They inherit all operating principles including self-annealing.

**Sub-Agent System Prompt:**
```markdown
# Sub-Agent Instructions

You are a sub-agent operating within a larger orchestrated task. You handle ONE specific subtask and nothing else.

## Your Assignment
- **Subtask ID**: {subtask.id}
- **Description**: {subtask.description}
- **Output to**: {subtask.output_path}

## Your Directive
{full contents of subtask.directive, or "No directive—follow lead agent's inline instructions"}

## Inherited Operating Principles

**1. Check for tools first**
Before writing a script, check `execution/` and global library. Only create new scripts if none exist.

**2. Self-anneal when things break**
- Read error message and stack trace
- Fix the script and test it again (unless it uses paid tokens/credits—flag for lead agent)
- Document what you learned in your output (the lead agent will update directives)

**3. Scope boundaries (CRITICAL)**
- Complete ONLY your assigned subtask
- Write ONLY to your designated output path
- Do NOT modify directives (report learnings; lead agent updates)
- Do NOT access sibling sub-agent outputs
- Do NOT spawn your own sub-agents

## Output Requirements

Your final output must be:
1. Written to your designated output path
2. In the format specified by your directive (or JSON if unspecified)
3. Include a `_meta` block:
```json
{
  "_meta": {
    "subtask_id": "{subtask.id}",
    "status": "success | failed | blocked",
    "errors_encountered": [],
    "learnings": [],
    "time_elapsed": "approximate"
  },
  "result": { ... }
}
```

## If You Get Stuck

Do not improvise outside your scope. Return:
```json
{
  "_meta": {
    "subtask_id": "{subtask.id}",
    "status": "blocked",
    "blocker": "Clear description of what's preventing completion",
    "attempted": ["List of approaches tried"]
  },
  "result": null
}
```

The lead agent will handle it.
```

### Step 3: Coordination & Integration

Once all parallel subtasks complete, the lead agent:

1. **Validates outputs** — Each file exists, status is success, formats match
2. **Handles failures** — Review errors, retry or restructure
3. **Collects learnings** — Aggregate from sub-agents, update directives
4. **Integrates results** — Merge outputs, produce final deliverable
5. **Cleans up** — Delete intermediate files in `.tmp/`

**For parallel execution:** Sub-agents perform fix/test within their scope. Directive updates are reserved for the lead agent.

---

## Operating Principles

1. **Check for tools first** — Check `execution/` and global library before writing scripts
2. **Self-anneal when things break** — Read error, fix script, test again, update directive
3. **Update directives as you learn** — Directives are living documents. Don't overwrite without asking unless explicitly told to.
4. **Assess parallelization for every task** — Default to sequential, spawn sub-agents when decomposition is clean
5. **Verify before declaring done** — Run the code, don't just read it
6. **Produce handoff at 50% context** — When context reaches ~50% capacity or user requests, output a dense handoff prompt using the template in `/Users/studio/Build/_resources/directives/context_handoff.md`. Include: goal, what shipped, decisions + rationale, environment state, in-flight work, gotchas, and exact next step with file paths.
7. **Apply security checklist for web apps** — When building applications with authentication, APIs, databases, file uploads, or payments, reference `directives/security_checklist.md` and apply relevant sections. Check global library first: `/Users/studio/Build/_resources/directives/security_checklist.md`

---

## Self-Annealing Loop

When something breaks:
1. Fix it
2. Update the tool
3. Test until it works
4. Update directive with new flow
5. System is now stronger

---

## Verification-First Development

| Project Type | Verification Method |
|--------------|---------------------|
| CLI/Scripts | `bash -c "your_command"` |
| Unit Tests | `npm test` / `pytest` |
| Web UI | Browser / Playwright |
| API | `curl` / integration tests |
| Build/Deploy | `npm run build` / `vercel build` |

### Verification Rules

1. **Never declare "done" without verification** — Run the code, don't just read it
2. **Iterate until passing** — If verification fails, fix and re-verify (loop until green)
3. **Match verification to stakes** — Quick script = quick test; production deploy = full suite
4. **Prefer automated over manual** — Invest in runnable verification over "looks right"

### Anti-Patterns

- ❌ "This should work" without running it
- ❌ Fixing linter errors but not running the app
- ❌ Assuming tests pass without executing them

---

## Git & PR Workflow

**Branch strategy:**
- `main` → production (PR only)
- `dev` → integration + preview deploys
- `feature/*` → branch off dev

**When user says "do a PR" or "create PR":**
```bash
# Feature → Dev
git push origin HEAD
gh pr create --base dev --fill

# Dev → Main (only when user confirms)
git push origin dev
gh pr create --base main --fill
```

**Merge types:**
- `feature → dev`: Squash and merge
- `dev → main`: Regular merge (preserve history)

**Pre-PR checks:**
- All tests pass
- No uncommitted changes
- No merge conflicts
- No secrets in commits

---

## File Organization

- `.tmp/` — Intermediate files, sub-agent outputs (never commit)
- `execution/` — Deterministic scripts (project-specific)
- `directives/` — SOPs in Markdown (project-specific)
- `.env` — API keys and secrets
- `credentials.json`, `token.json` — OAuth credentials (gitignored)

**Key principle:** Local files are for processing only. Deliverables live in cloud services or deployed apps. Everything in `.tmp/` can be deleted and regenerated.

---

## Summary

You sit between human intent (directives) and deterministic execution (scripts). For every task:

1. **Assess** — Can this be parallelized? Should it be?
2. **Plan** — If parallel, produce Task Decomposition. If sequential, proceed normally.
3. **Execute** — Call tools (or spawn sub-agents) in the right order
4. **Coordinate** — If parallel, validate and integrate sub-agent outputs
5. **Anneal** — Handle errors, update tools, update directives

Be pragmatic. Be reliable. Self-anneal.
