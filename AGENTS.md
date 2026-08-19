# 9router Local Fork Maintenance

This file defines repository-level maintenance rules for the local fork in this workspace.

It is intentionally **local-fork specific** and should not be treated as upstream project guidance.
Subsystem guides such as `open-sse/AGENTS.md` remain authoritative for code structure inside their own directories.

## Scope

Use this file for:

- branch selection
- worktree usage
- upstream sync procedure
- local runtime patch maintenance
- deciding which branch the globally linked `9router` CLI should run from

Do not copy these rules into upstream-facing PRs unless the user explicitly asks.

## Branch roles

- `upstream/master`
  - canonical upstream truth
- `master`
  - local clean baseline
  - keep this branch as close to `upstream/master` as possible
  - do not accumulate long-lived local-only patches here
- `local/9router-runtime-patches`
  - long-lived local runtime branch
  - this is the branch that preserves local improvements required on this machine but not yet upstreamed
  - the globally linked `9router` CLI should run from a worktree currently checked out to this branch unless the user explicitly asks otherwise
- `pr/*`
  - one branch per upstream PR
  - scope each branch to a single reviewable line of change
- `refresh/*` and `rebuild/*`
  - temporary construction branches only
  - delete them after the target branch or PR branch has been updated

## Worktree policy

- Keep only the currently active development line as a worktree.
- Do not keep historical reference branches as long-lived worktrees.
- If a branch is only being preserved for history, keep the branch and remove the worktree.
- Before starting a new substantial line of work, decide whether it belongs on:
  - `local/9router-runtime-patches`
  - a fresh `pr/*` branch
  - a short-lived `refresh/*` branch

## Upstream sync policy

- Sync `master` to `upstream/master` before using it as a base for new work.
- Prefer rebuilding local patch branches from the latest `upstream/master` instead of merging upstream into an old dirty local branch.
- When refreshing `local/9router-runtime-patches`:
  1. start from latest `upstream/master`
  2. re-apply only still-needed local commits
  3. drop patches already absorbed upstream
  4. run the smallest meaningful validation set
  5. move the long-lived local branch to the refreshed result

## PR branch policy

- Keep PR branches narrowly scoped.
- Do not mix local runtime-only fixes into upstream PR branches unless the user explicitly decides to upstream them.
- If a PR branch falls behind upstream badly, prefer rebuilding it from current `upstream/master` over forcing a complex rebase on stale history.

## Local runtime policy

- The globally linked `9router` executable in this environment is expected to point into this repository's `cli/cli.js`.
- When the user wants the machine-local 9router to remain usable, preserve that behavior on `local/9router-runtime-patches`.
- If `master` advances upstream and local runtime fixes are still needed, refresh `local/9router-runtime-patches` instead of retargeting the global link to a PR branch.

## Safety rules

- Treat user-local state carefully.
- Do not assume files like `.vscode/settings.json`, local lockfiles, or other workspace-local artifacts are disposable.
- Do not delete local branches or worktrees without first checking whether they are the active runtime line, an active PR line, or the only holder of local-only commits.

## Expected steady state

The preferred steady state for this repository is:

- `master` aligned with `upstream/master`
- `local/9router-runtime-patches` carrying only still-needed local runtime patches
- active upstream work isolated in `pr/*`
- no stale `refresh/*` or `rebuild/*` branches left behind
