# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # dev server at localhost:3000
npm test         # run tests in watch mode
npm test -- --watchAll=false   # run tests once
npm run build    # production build
```

## Environment

Requires a `.env` file at the project root with:
```
REACT_APP_SUPABASE_URL=...
REACT_APP_SUPABASE_ANON_KEY=...
```

## Architecture

This is a Create React App project backed by Supabase (PostgreSQL).

**Data flow:** All state lives in `App.js`. Every mutation (add, edit, delete, move) writes directly to Supabase first, then updates local React state on success — there is no optimistic UI.

**Supabase schema:** The app reads/writes a single `tasks` table with columns: `id`, `title`, `notes`, `priority` (integer: 1=High, 2=Medium, 3=Low), `status` (string: `'todo'`, `'inprogress'`, `'done'`). Tasks are fetched ordered by `priority`.

**Key files:**
- `src/supabaseClient.js` — singleton Supabase client, reads env vars
- `src/constants.js` — `PRIORITY_CONFIG` and `COLUMN_CONFIG` are the single source of truth for labels and colors; update here when adding columns or priority levels
- `src/App.js` — owns all state and CRUD handlers, passes callbacks down
- `src/components/Column.js` — renders a column's task cards; handles HTML5 drag-and-drop (`dataTransfer` with `taskId` and `fromStatus`)
- `src/components/TaskModal.js` — shared add/edit modal, controlled by `modal` state in App (`null` = closed, `{ mode: 'add', status }` or `{ mode: 'edit', task }`)

**Columns** are hardcoded as `['todo', 'inprogress', 'done']` in `App.js` and must match the keys in `COLUMN_CONFIG`.
