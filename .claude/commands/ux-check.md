# UX Check Command

When /ux-check is called, read `.claude/skills/ui-ux-pro-max/SKILL.md` and run a full audit of the current screen or component against all 10 priority categories.

Report findings as a markdown table:

| # | Severity | Category | Rule | Violation Found | Recommended Fix |
|---|----------|----------|------|-----------------|-----------------|

Severity levels:
- 🔴 **Critical** — accessibility or data loss risk, must fix before shipping
- 🟠 **High** — significant UX degradation, fix in current sprint
- 🟡 **Medium** — noticeable polish issue, fix when touching the component
- 🟢 **Low** — minor improvement, backlog

After the table, output:
1. A pass/fail verdict per category
2. The top 3 most impactful fixes to prioritise
3. Estimated effort for each fix (S/M/L)
