# Board Game Night Planner — PRD + SRS

**Document type:** Product Requirements Document (PRD) + Software Requirements Specification (SRS)  
**Target:** Single-page web application  
**Primary constraint:** Final submitted raw source must remain **under 40 KB total**.  
**Goal:** Maximize scores for Completeness, Problem Fit + Design, and Technical + Craft.

---

# 1. Product Requirements Document (PRD)

## 1.1 Product Summary

Board Game Night Planner is a lightweight, single-page application for managing a personal board game collection and quickly choosing a suitable game for a group.

The product replaces fragmented group-chat decision making with one local, persistent interface where the host can:

- record games and core play constraints;
- tag games by category;
- track whether games have been played or are still wanted;
- search and filter the collection;
- randomly select a playable "want to play" game for a specific player count;
- retain all data across refreshes using `localStorage`.

The app should feel playful, fast, obvious, and resilient rather than like a generic CRUD dashboard.

## 1.2 Product Goals

1. Make entering and maintaining a board game collection fast.
2. Make it obvious which games are played versus wanted.
3. Let the user narrow the collection without friction.
4. Make choosing a game for tonight feel fun and decisive.
5. Preserve user data reliably across page reloads.
6. Handle invalid inputs, empty states, and corrupt stored data visibly and safely.
7. Deliver clean engineering within a strict 40 KB raw-source budget.

## 1.3 Non-Goals

The first version does not require:

- accounts, authentication, or cloud sync;
- multiplayer collaboration;
- remote databases or APIs;
- game artwork fetched from external services;
- game ownership across multiple people unless implemented as an optional enhancement;
- advanced recommendations based on history;
- drag-and-drop sorting;
- installation as a PWA.

These features must not displace required rubric-critical behavior.

## 1.4 Target User

Primary user: the recurring host or organizer of casual board game nights who needs to track a modest personal collection and avoid repeatedly asking the group what to play.

Key user needs:

- "What games do I have?"
- "Which ones have we not played yet?"
- "What fits five players?"
- "Show me cooperative games."
- "Just pick something valid for tonight."

## 1.5 Core User Flows

### Flow A — Add a game

1. User opens the add-game form.
2. User enters:
   - game name;
   - minimum players;
   - maximum players;
   - estimated play time in minutes;
   - rating from 1–5;
   - zero or more tags;
   - status: `want to play` or `played`.
3. Form validates before save.
4. Valid game is saved to app state and `localStorage`.
5. New card appears immediately.
6. Confirmation is visible without blocking interaction.

### Flow B — Browse and filter

1. User sees all saved games.
2. User enters text in search and/or chooses tag/status filters.
3. Results update immediately.
4. UI clearly communicates result count.
5. Zero-result state explains how to recover, e.g. clear filters.

### Flow C — Update status

1. User selects a game card.
2. User toggles between `want to play` and `played`.
3. Card badge updates immediately.
4. Change persists to `localStorage`.
5. Picker eligibility updates accordingly.

### Flow D — Pick tonight's game

1. User enters a player count.
2. App derives eligible games where:
   - status is `want to play`; and
   - `minPlayers <= playerCount <= maxPlayers`.
3. User presses the primary randomize button.
4. App randomly selects one eligible game.
5. Result is presented prominently with enough information to confirm fit.
6. Repeated clicks can produce another valid choice.
7. If no games qualify, app explains why and suggests changing player count or adding/marking games as wanted.

## 1.6 Functional Scope

### Required

- Create game.
- View game collection.
- Edit existing game.
- Delete game with accidental-delete protection.
- Tags/categories.
- Played / want-to-play state.
- Search by game name.
- Filter by tag.
- Filter by status.
- Random picker constrained by status and player count.
- Persistent `localStorage`.
- Visible recovery/error state if stored data is corrupt.
- Responsive single-page UI.

Editing and deletion are specified even though the brief only explicitly asks for adding and managing a collection; a collection cannot be credibly "managed" without correcting or removing entries. These functions materially improve completeness and off-happy-path behavior.

### Optional, only if size budget remains healthy

- Sort by rating, title, or play time.
- Seed demo data through an explicit user action.
- Keyboard shortcut focusing search.
- Small celebratory animation on picker result.

Do not include optional work if it pushes total raw source close to 40 KB.

## 1.7 UX Requirements

### Information architecture

The page should have three obvious areas:

1. **Header / summary**
   - product title;
   - concise explanation;
   - collection stats such as total games and wanted count.

2. **Collection**
   - add/edit control;
   - search;
   - status filter;
   - tag filter;
   - responsive game-card grid.

3. **Game Night Picker**
   - player-count input;
   - eligible-game count;
   - large randomize button;
   - result panel or clear empty state.

### Game cards

Every card must surface at minimum:

- name;
- player range;
- play time;
- rating;
- tags;
- status badge.

Card actions must be reachable without relying on hover.

### Visual tone

- Colorful but controlled.
- Distinct status badges.
- Rounded card surfaces.
- Strong primary CTA for randomization.
- High contrast and readable typography.
- Consistent spacing.
- No decorative dependency requiring remote assets.

### Responsive behavior

The app must remain usable at:

- narrow mobile width around 320 px;
- tablet widths;
- desktop widths.

Requirements:

- no horizontal page scrolling;
- controls wrap or stack;
- touch targets remain practical;
- card grid collapses naturally;
- picker CTA remains prominent.

## 1.8 Accessibility Requirements

- Use semantic HTML landmarks and form elements.
- Every input has an explicit label.
- Buttons have accessible names.
- Status and validation feedback cannot rely on color alone.
- Focus states must be visible.
- Modal/dialog behavior, if used, must support Escape and focus management; native `<dialog>` is preferred.
- Dynamic picker/error messages should use an appropriate live region.
- Stars must have a textual accessible equivalent such as `4 of 5 stars`.
- Minimum touch target guideline: approximately 44 × 44 CSS px for primary interactive controls where practical.
- Respect `prefers-reduced-motion`.

## 1.9 Empty, Error, and Edge States

### Empty collection

Show a friendly state with a direct "Add your first game" action.

### No search/filter matches

Show:
- no-match message;
- clear-filter action.

### No picker candidates

Show a non-error empty state:
"No want-to-play games support 7 players."

Provide a relevant next action.

### Invalid form

Block save and show specific inline messages.

Examples:

- missing/blank name;
- player count below 1;
- max players lower than min players;
- play time below 1;
- rating outside 1–5.

### Duplicate names

Duplicate names are allowed because distinct editions may exist, but do not use game name as an identifier.

### Corrupt `localStorage`

Never silently reset or reseed.

Required behavior:

1. catch read/parse/schema failure;
2. preserve the unusable raw payload where feasible until user acts;
3. display a visible recovery message;
4. offer explicit actions such as:
   - reset local collection;
   - retry reload;
5. only reset after explicit user action.

This is rubric-critical.

### Storage write failure

Catch exceptions such as quota/security failures and show a visible message that the latest change could not be persisted.

## 1.10 Success Criteria

A release is ready when:

- every required feature is reachable from the single page;
- refresh preserves valid data;
- corrupt persisted data never triggers a silent reseed;
- invalid data cannot enter persisted state through UI;
- random picker never selects a played game or one outside the entered player count;
- major user flows work by keyboard;
- automated tests cover storage, validation, filtering, and picker logic;
- project uses ES module boundaries;
- domain shapes are documented via TypeScript or JSDoc;
- named exports/functions are used for testable core logic;
- total submission raw source is less than 40 KB.

---

# 2. Software Requirements Specification (SRS)

## 2.1 Recommended Implementation Architecture

Use dependency-free HTML/CSS/JavaScript with native browser APIs.

Suggested file structure:

```text
/
├─ index.html
├─ src/
│  ├─ app.js
│  ├─ model.js
│  ├─ storage.js
│  └─ view.js
├─ styles.css
└─ tests/
   └─ model.test.js
```

Alternative file splits are acceptable, but **do not collapse the application into one source file**.

Rationale:

- ES modules satisfy explicit rubric expectations.
- Pure model functions are independently testable.
- No framework overhead preserves the <40 KB budget.
- Native browser features are enough for the requested functionality.

## 2.2 Technical Constraints

- Static client-only SPA.
- No backend required.
- No mandatory network access.
- Persist data in `window.localStorage`.
- Use ES modules with `<script type="module">`.
- Prefer zero production dependencies.
- Tests may use the runtime's built-in test tooling where available.
- Total raw source in submitted implementation: **< 40 KB**.
- Avoid generated bundles, maps, vendored libraries, large SVGs, webfonts, or base64 media in the submission.

## 2.3 Size Budget

Target budget:

| Area | Target |
|---|---:|
| HTML | 2–3 KB |
| CSS | 7–10 KB |
| JS modules | 14–18 KB |
| tests | 4–6 KB |
| buffer | 4–8 KB |
| **Total target** | **31–37 KB** |

Treat 37 KB as a soft freeze threshold so small final changes do not cross 40 KB.

Add a submission check such as:

```sh
find . -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.ts' \) \
  -not -path './node_modules/*' -print0 | xargs -0 cat | wc -c
```

The exact scoring system may count files differently, so also inspect repository/commit payload before submission.

## 2.4 Data Model

Use JSDoc or TypeScript. JSDoc is recommended to avoid a build step and reduce source size.

Example contract:

```js
/**
 * @typedef {'played'|'want'} GameStatus
 *
 * @typedef {Object} Game
 * @property {string} id
 * @property {string} name
 * @property {number} minPlayers
 * @property {number} maxPlayers
 * @property {number} playMinutes
 * @property {number} rating
 * @property {string[]} tags
 * @property {GameStatus} status
 * @property {number} createdAt
 * @property {number} updatedAt
 */
```

### Invariants

For every persisted `Game`:

- `id`: non-empty stable unique string;
- `name`: trimmed non-empty string;
- `minPlayers`: integer >= 1;
- `maxPlayers`: integer >= `minPlayers`;
- `playMinutes`: integer >= 1;
- `rating`: integer from 1 through 5;
- `tags`: array of unique normalized non-empty strings;
- `status`: exactly `played` or `want`;
- timestamps: finite positive numbers.

## 2.5 Storage Schema

Recommended key:

```text
board-game-night-planner:v1
```

Stored envelope:

```js
{
  version: 1,
  games: [...]
}
```

Versioning the payload enables controlled future migrations.

### Storage requirements

#### SRS-STO-01
On startup, if no storage value exists, load an empty collection.

#### SRS-STO-02
If a valid payload exists, load it.

#### SRS-STO-03
If JSON parsing fails, display a visible recovery state and do not silently overwrite the stored value.

#### SRS-STO-04
If parsed JSON does not match the expected schema, display a visible recovery state.

#### SRS-STO-05
After each successful create/update/delete operation, persist the complete canonical state.

#### SRS-STO-06
If persistence throws, preserve current in-memory UI state but clearly warn that the change is not safely stored.

#### SRS-STO-07
Reset must require explicit user intent.

## 2.6 Functional Requirements

### Game creation

#### SRS-GAM-01
The user shall be able to create a game with name, player range, play time, rating, tags, and status.

#### SRS-GAM-02
The system shall trim textual inputs before validation.

#### SRS-GAM-03
The system shall reject invalid numeric values.

#### SRS-GAM-04
The system shall normalize tags, e.g. trim whitespace and de-duplicate case-insensitively.

#### SRS-GAM-05
The system shall assign a non-name-based unique ID. `crypto.randomUUID()` is preferred, with a tiny fallback only if target browsers require it.

### Game editing

#### SRS-GAM-06
The user shall be able to edit all game fields.

#### SRS-GAM-07
Editing shall retain the stable game ID.

#### SRS-GAM-08
A successful edit shall update `updatedAt` and persist.

### Game deletion

#### SRS-GAM-09
The user shall be able to delete a game.

#### SRS-GAM-10
Deletion shall require confirmation or an undo affordance.

### Status

#### SRS-STA-01
A game shall have exactly one status: `played` or `want`.

#### SRS-STA-02
The user shall be able to change status directly from a game card or editor.

#### SRS-STA-03
Status changes shall immediately alter filter and picker eligibility.

### Search and filters

#### SRS-FIL-01
Search shall match game names case-insensitively.

#### SRS-FIL-02
Tag filtering shall select games containing the chosen tag.

#### SRS-FIL-03
Status filtering shall support at minimum:
- all;
- want to play;
- played.

#### SRS-FIL-04
Search, tag, and status filters shall combine using AND semantics.

Example:
`"cat"` + `strategy` + `want` returns games whose name matches "cat", that include strategy, and whose status is want.

#### SRS-FIL-05
The UI shall expose a single action to clear active filters.

#### SRS-FIL-06
Filter controls shall reflect the current state.

### Picker

#### SRS-PIC-01
Player count shall be an integer >= 1.

#### SRS-PIC-02
Eligibility function:

```text
game.status === "want"
AND game.minPlayers <= requestedPlayers
AND game.maxPlayers >= requestedPlayers
```

#### SRS-PIC-03
Random selection shall operate only over eligible games.

#### SRS-PIC-04
With one eligible game, that game shall always be returned.

#### SRS-PIC-05
With zero eligible games, no invalid fallback shall be selected.

#### SRS-PIC-06
The result view shall show:
- selected game's name;
- supported player range;
- play time;
- rating;
- tags when present.

#### SRS-PIC-07
Randomness must be isolated in a named pure/testable function accepting an RNG parameter where practical:

```js
export function pickRandom(games, players, rng = Math.random) { ... }
```

This permits deterministic automated testing.

## 2.7 Named Core API

Keep domain logic in named exports rather than anonymous inline object methods.

Recommended API:

```js
export function validateGame(input) {}
export function normalizeGame(input, existingId) {}
export function addGame(games, game) {}
export function updateGame(games, id, patch) {}
export function deleteGame(games, id) {}
export function filterGames(games, filters) {}
export function getEligibleGames(games, playerCount) {}
export function pickRandom(games, playerCount, rng) {}
export function collectTags(games) {}

export function loadState(storage) {}
export function saveState(storage, state) {}
export function resetState(storage) {}
```

Named functions make core behavior testable, readable, and tree-shake-friendly.

## 2.8 State Management

Use one application state object owned by the app module:

```js
{
  games: [],
  filters: {
    query: '',
    tag: 'all',
    status: 'all'
  },
  pickerPlayers: 4,
  pickerResultId: null
}
```

Rules:

- `app.js` coordinates state transitions.
- `model.js` contains pure domain transformations.
- `storage.js` performs persistence and schema checking.
- `view.js` renders and wires UI-facing behavior.
- Avoid exposing mutable state on `window`.
- Do not use inline global state variables in HTML.

## 2.9 Rendering Strategy

A full framework is unnecessary.

Use:

- HTML shell for page landmarks/forms;
- DOM templates or small named rendering functions for repeated game cards;
- event delegation for card actions when it reduces code;
- text insertion through `textContent`;
- `replaceChildren()` or controlled DOM creation.

Avoid inserting user-provided values through unsanitized `innerHTML`.

## 2.10 Security and Hygiene

Although the app is local-only, scoring can still reward clean security decisions.

Requirements:

- never execute stored strings;
- never inject user strings into HTML markup unsafely;
- prefer `textContent`;
- validate data both at form input and storage-load boundaries;
- catch storage errors;
- no third-party scripts;
- no external analytics;
- no secrets;
- no user tracking;
- use IDs as internal references, not names.

## 2.11 Detailed Validation Rules

### Name

- required;
- trim before save;
- recommended max length: 80 characters.

### Minimum players

- required integer;
- min 1;
- recommended max 99.

### Maximum players

- required integer;
- min 1;
- must be >= minimum players;
- recommended max 99.

### Estimated play time

- required integer minutes;
- min 1;
- recommended max 1440.

### Rating

- required integer 1–5.
- UI may use star buttons/radio controls, but actual submitted value remains numeric.

### Tags

- optional;
- trim;
- ignore empty values;
- case-insensitive de-duplication;
- recommended individual tag max 24 characters;
- render normalized display labels.

### Status

- required enum: `want` or `played`.

## 2.12 Interaction Requirements

### Add/edit form

- submit via button and Enter where semantically appropriate;
- retain user-entered values if validation fails;
- display field-level error near the field;
- on successful add, reset form to sensible defaults;
- on edit cancel, do not mutate persisted state.

### Delete

Preferred compact implementation:
- confirmation dialog; or
- immediate delete with an undo toast.

Use whichever is smaller while remaining clear.

### Filtering

- update without page reload;
- preserve collection data;
- result count visible;
- active filters visibly recognizable.

### Picker

Primary button label examples:
- "Pick Tonight's Game"
- "Randomize Again"

Button interaction should produce satisfying feedback through a small CSS transition. Reduced-motion users should get no unnecessary animation.

## 2.13 Automated Testing Requirements

Automated tests are mandatory.

Minimum logic coverage:

1. valid game validation succeeds;
2. blank name fails;
3. maxPlayers < minPlayers fails;
4. out-of-range rating fails;
5. combined filtering works;
6. tag matching works;
7. status filtering works;
8. eligible picker excludes `played`;
9. picker excludes invalid player ranges;
10. deterministic RNG picks expected candidate;
11. malformed JSON produces a recoverable storage error;
12. invalid stored schema produces a recoverable storage error;
13. save/load round-trip preserves data.

Tests should directly import named functions from modules.

Recommended lightweight approach:

- Node built-in `node:test` + `assert`, if the grading environment supports Node;
- otherwise a tiny browser test harness.

Do not add a large test framework solely for this project.

## 2.14 Example Test Cases

### TC-01 Add valid game

Input:
- Name: Codenames
- Players: 4–8
- Time: 15
- Rating: 4
- Tag: party
- Status: want

Expected:
- saves successfully;
- appears as card;
- survives page reload.

### TC-02 Invalid range

Input:
- minPlayers = 6
- maxPlayers = 4

Expected:
- save blocked;
- clear validation message;
- no `localStorage` mutation.

### TC-03 Filter composition

Given:
- Azul — strategy — played
- The Crew — cooperative — want
- Codenames — party — want

When:
- status = want;
- tag = cooperative.

Expected:
- only The Crew appears.

### TC-04 Valid picker

Given:
- Game A: want, 2–4 players
- Game B: want, 5–6 players
- Game C: played, 2–8 players

When:
- player count = 4.

Expected eligible set:
- Game A only.

Game C must not be returned.

### TC-05 Picker has no match

Given:
- all want games max at 5 players.

When:
- player count = 7.

Expected:
- no result chosen;
- clear message;
- collection unchanged.

### TC-06 Corrupt storage

Stored value:
```text
{this-is-not-json
```

Expected:
- app remains operational enough to explain failure;
- data is not silently overwritten;
- recovery action is visible.

## 2.15 Performance Requirements

Given a local personal collection, optimize for simplicity rather than premature scalability.

Targets:

- initial UI usable immediately on ordinary hardware;
- filter response perceptually instant for hundreds of games;
- no unnecessary network requests;
- render only when state changes;
- avoid expensive animation.

## 2.16 Browser Compatibility

Target modern evergreen browsers supporting:

- ES modules;
- localStorage;
- standard form controls;
- CSS Grid/Flexbox.

Graceful behavior is more important than supporting obsolete browsers.

## 2.17 Rubric-to-Implementation Traceability

## Completeness — target 100/100

| Rubric concern | Implementation evidence |
|---|---|
| Add games | Full validated create form |
| Player min/max | Explicit numeric fields and invariant |
| Play time | Required minute field |
| Rating 1–5 | Required star/radio or select control |
| Tags | Multiple normalized categories |
| Played / want | Explicit enum + badge + toggle |
| Filter/search | Name, tag, status, combinable |
| Random picker | Want-only + player-count constraint |
| Persistence | Versioned localStorage payload |
| Refresh behavior | Load canonical saved state |
| Off happy path | Validation, empty state, no-match state, storage errors |
| Corrupt data | User-visible recovery, never silent reseed |
| Collection management | Edit + delete included |

Release blocker: any required path that is unreachable or produces silent failure.

## Problem Fit + Design — target 100/100

| Rubric concern | Implementation evidence |
|---|---|
| Solves actual host problem | Collection + desired status + constrained decision tool |
| Clarity | Three-area hierarchy: summary, collection, picker |
| Fun | Colorful cards, badges, strong randomize CTA |
| Responsive | Mobile-first wrapping/grid behavior |
| Feedback | Counts, validation, result state, persistence errors |
| Accessibility | Labels, focus, keyboard, non-color status signals |
| Decision speed | Picker is always visible/reachable |
| Empty states | Every zero-state has a useful next action |

Design principle: the random picker is a first-class action, not an afterthought buried below CRUD controls.

## Technical + Craft — target 100/100

| Rubric concern | Implementation evidence |
|---|---|
| Architecture | Separate ES modules |
| Correctness | Pure domain logic + schema validation |
| Readability | Named exported functions |
| Data shapes | JSDoc typedefs or TypeScript |
| Testing | Automated unit tests |
| Security | Safe DOM insertion, no external scripts |
| Storage robustness | Versioned schema, parse and write error handling |
| Testability | RNG injection, storage dependency injection |
| Detail | Edit/delete, keyboard behavior, edge-state UX |
| Size discipline | Dependency-free implementation + 31–37 KB target |

## 2.18 Explicit Anti-Patterns to Avoid

The final implementation must **not**:

1. silently replace corrupt data with seed/demo content;
2. place the entire app in a single HTML/JS file;
3. expose Model/View/State/Event logic as inline globals;
4. ship with zero automated tests;
5. rely only on implicit runtime data shapes;
6. hide critical logic inside anonymous object methods;
7. use game names as primary IDs;
8. use unsafe `innerHTML` with user values;
9. let the randomizer pick played or player-count-incompatible games;
10. exceed the 40 KB raw-source limit.

## 2.19 Definition of Done

The project is complete only when all statements below are true.

### Functionality

- [ ] User can add a valid game.
- [ ] User can edit a game.
- [ ] User can delete a game safely.
- [ ] User can assign multiple tags.
- [ ] User can mark a game played/want.
- [ ] User can search by name.
- [ ] User can filter by tag.
- [ ] User can filter by status.
- [ ] Filters combine correctly.
- [ ] Picker only uses wanted games.
- [ ] Picker respects player minimum and maximum.
- [ ] Picker handles zero candidates clearly.
- [ ] Valid data survives refresh.

### Robustness

- [ ] Invalid form input cannot persist.
- [ ] Malformed localStorage never crashes into a blank page.
- [ ] Corrupt localStorage is not silently reset.
- [ ] Storage write failures are visible.
- [ ] Empty collection is intentionally designed.
- [ ] No-filter-results state is intentionally designed.

### Craft

- [ ] ES modules are used.
- [ ] Core functions are named exports.
- [ ] JSDoc or TypeScript defines domain shapes.
- [ ] Automated tests exist and pass.
- [ ] User input is rendered safely.
- [ ] No unnecessary production dependencies.
- [ ] Focus states are visible.
- [ ] Responsive layout works at 320 px.

### Submission

- [ ] All raw source combined is below 40 KB.
- [ ] No generated build artifacts are included unnecessarily.
- [ ] No oversized commit contains irrelevant files/assets.
- [ ] README or instructions, if included, are extremely compact.
- [ ] Final manual smoke test completed after a fresh storage reset.

---

# 3. Recommended Build Priority

Implement in this order to minimize rubric risk:

1. Data model + validators.
2. Storage adapter + corrupt-data recovery.
3. Create/edit/delete state operations.
4. Search/filter pure functions.
5. Picker eligibility + deterministic random function.
6. Basic responsive UI.
7. Status/tag visual treatment and empty states.
8. Accessibility pass.
9. Automated tests.
10. Source-size audit and compression/refactor pass.

Never trade correctness, visible error recovery, tests, or module boundaries for cosmetic extras.

---

# 4. Final Scoring Strategy

A "perfect" score cannot be guaranteed because evaluation is external, but this specification is structured to eliminate the obvious rubric deductions.

The strongest submission should demonstrate:

**Completeness:** every requested behavior works, including invalid inputs, empty states, edits, deletion, no-match picker cases, refresh persistence, and corrupt-storage recovery.

**Problem Fit + Design:** the app feels purpose-built for a game-night host, makes status and eligibility visually obvious, works well on mobile, and turns the random picker into the satisfying centerpiece of the experience.

**Technical + Craft:** domain logic is modular and tested, state shapes are explicit, storage is versioned and failure-aware, DOM handling is safe, no globals are used, and the implementation remains comfortably below the 40 KB source cap.

The final implementation should favor a small number of well-designed features that are demonstrably correct over ornamental extras.
