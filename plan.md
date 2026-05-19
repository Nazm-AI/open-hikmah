# Open Hikmah — Project Plan

> **⚠️ DEADLINE: May 20, 2026 (TOMORROW)**
> Submission requires: live demo link, GitHub repo, 2–3 min demo video, API usage explanation.

---

## Hackathon Context

**Event:** Quran Foundation Hackathon by Provision Capital  
**Prize pool:** $10,000 across 7 winners (1st: $3k, 2nd: $2.5k, 3rd: $1.75k...)

**Judging rubric:**
| Criterion | Weight |
|-----------|--------|
| Impact on Quran Engagement | 30 pts |
| Product Quality & UX | 20 pts |
| Technical Execution | 20 pts |
| Innovation & Creativity | 15 pts |
| Effective API Use | 15 pts |

**Hard API requirement:** Must integrate ≥1 Content API **and** ≥1 User API.
- Content APIs: Quran, Audio, Tafsir, Translation, Post
- User APIs: Bookmarks, Collections, Streak Tracking, Post, Activity & Goals
- Optional but powerful: **Quran MCP** (`mcp.quran.ai`) for semantic search

---

## Product Overview

**Open Hikmah** is a personalized theological sensemaking platform. It solves linear reading fatigue by letting users visually map how concepts, rules, and divine attributes connect across the entire Quran. Users shift from passive reader to active researcher via two core modules:

1. **Semantic Explorer** — Infinite traversal canvas of verse connections
2. **Divine Names Library** — Asma-ul-Husna deep dive, strictly Maturidi/Hanafi framing

---

## Module 1: Semantic Explorer

### Feature 1.1 — AI-Powered Conceptual Search
- Minimalist search bar as the entry point
- User enters a topic ("Inheritance laws"), root word, or verse ref (e.g., `2:255`)
- Backend routes through **Quran MCP** for semantic (not keyword) results
- Returns top 5–10 most semantically relevant verses

### Feature 1.2 — Linear Reading View & Transition Trigger
- Search results shown as **Verse Cards**: Surah · Verse · Arabic · Translation
- Each card has a primary "🕸️ Map Connections" button
- Clicking it transitions the user from list view into the Canvas

### Feature 1.3 — The Infinite Traversal Canvas *(core engineering feature)*
- Draggable, zoomable node-based graph (React Flow / XY Flow)
- **Root Node:** Selected verse placed at center
- On init: MCP fetches 3 related verses, edges drawn automatically
- **Expand (+) on any node** → radial menu with traversal filters:
  1. **By Theme** — MCP finds semantically similar meanings
  2. **By Root Word** — API finds verses sharing exact Arabic roots
  3. **By Contrast** — MCP finds opposing themes (ease vs. hardship, etc.)
- Graph physics push new nodes outward; no hairball clustering
- Edge color coding (already in CSS):
  - `--color-theme-edge` (teal) = thematic
  - `--color-root-edge` (gold) = root word
  - `--color-contrast-edge` (red) = contrast

### Feature 1.4 — Context Sidebar
- Sliding panel triggered by clicking any **node** or **edge**
- Shows: full verse text + AI-generated explanation of *why* these verses are linked
- For edge clicks: theological justification for the connection between the two verses

### Feature 1.5 — Multi-Sensory & Workspace Persistence
- **"▶️ Play Graph" button:** Audio API recites all currently visible verses sequentially (thematic playlist)
- **"💾 Save Workspace":** Serializes graph state → saved via `/collections` API
- **Notes:** User can annotate nodes/edges via `/notes` API

---

## Module 2: Divine Names Library (Asma-ul-Husna)

> **Theological constraint:** Strictly Hanafi/Maturidi (Ahl al-Sunnah). Maintains Tanzih (transcendence). Avoids Tashbih (anthropomorphism).

### Feature 2.1 — Theological Directory
- Visual grid of all 99 Names
- Categorized by classical Maturidi taxonomy:
  - *Sifat al-Dhat* (Attributes of Essence)
  - *Sifat al-Af'al* (Attributes of Action)

### Feature 2.2 — Attribute Detail & Verse Feed
- Click any Name → deep-dive page
- Shows: classical theological definition + Arabic root morphology
- Curated feed of all verses that **conclude with** this Name

### Feature 2.3 — The Believer's Reflection (Takhalluq)
- AI-generated "Theological Reflection" panel via MCP
- Orthodox framework for spiritual internalization, not direct equation to human verbs
- Example for *Al-Razzaq*: *"The believer's realization of Al-Razzaq is to strive purely in halal effort, while maintaining absolute certainty in the heart that the outcome is solely from Allah."*

### Feature 2.4 — Structural Pairing Analysis
- Highlights Names that frequently appear paired together (e.g., *Al-Ghafur* + *Ar-Rahim*)
- MCP explains why the pairing creates theological balance for those verse contexts

---

## Technical Architecture

### Stack
- **Frontend:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, Framer Motion
- **Canvas:** @xyflow/react v12
- **State:** Zustand
- **Data fetching:** TanStack Query
- **AI:** Anthropic SDK (`claude-sonnet-4-6`) + Quran MCP (`mcp.quran.ai`)
- **Quran data:** `alquran.cloud` API (fallback), Quran Foundation APIs (primary)

### API Routes
| Route | Purpose |
|-------|---------|
| `GET /api/verse/[surah]/[ayah]` | Fetch single verse (Arabic + translation) |
| `POST /api/connections` | Claude AI: find related verses for a node + traversal type |
| `GET /api/search` | Semantic search via Quran MCP |
| `GET /api/names` | 99 Divine Names with metadata |
| `GET /api/names/[slug]/verses` | Verses containing a specific Name |
| `POST /api/audio/playlist` | Build recitation playlist from verse refs |
| `POST /api/workspace/save` | Save graph to /collections |

### Data Flow (Canvas expansion)
```
User clicks Expand → chooses "By Theme"
  → POST /api/connections { fromRef: "2:255", kind: "thematic" }
  → Server calls Claude with verse text + structured prompt
  → Claude returns JSON: [{ ref, arabicText, translation, reason }]
  → Client adds nodes + edges to canvas
  → Context sidebar pre-populates with `reason`
```

---

## Branch Strategy & Progress

| Branch | Scope | Status |
|--------|-------|--------|
| `feat/canvas-foundation` | Canvas, VerseNode, SearchDialog, /api/verse | ✅ pushed |
| `feat/ai-connections` | Claude AI connections API, expand UI, context sidebar | 🚧 active |
| `feat/divine-names` | 99 Names library page, detail view, verse feed | pending |
| `feat/ui-polish` | Audio, save workspace, animations, search by theme | pending |

---

## Critical Path (given 24h deadline)

Must-ship for judging:
1. ✅ Canvas renders verses, search by ref works
2. 🚧 **Expand node → AI generates 3 connections** (biggest wow factor)
3. **Context sidebar** with AI justification text
4. **Divine Names page** (even MVP grid is enough)
5. **At least one User API call** (bookmarks or collections — required by rules)

Nice-to-have if time allows:
- Audio playback ("Play Graph")
- Save workspace to collections
- Search by theme (not just ref)
- Animated edge drawing on expansion

---

## Claude's Notes & Thoughts

**On what will win points:**

The judging weights tell a clear story — **Impact (30) + UX (20) = 50 pts on feel, not code**. The canvas traversal *experience* needs to feel magical. When a user clicks Expand and watches three new verse nodes float in with connecting edges, that's the demo moment. Every second of load time kills the impression.

**Recommended: stream the connections.** Instead of showing a spinner, stream Claude's JSON response and add nodes to the canvas one at a time as they arrive. It looks alive.

**On the Quran MCP:** The plan specifies `mcp.quran.ai` as the core engine, and we have `@modelcontextprotocol/sdk` installed. However, I haven't been able to confirm the MCP server's public endpoint or auth requirements. Until that's confirmed, I've been using `alquran.cloud` for verse data and Claude directly for semantic connections. **Need clarity on whether mcp.quran.ai is accessible and what keys are needed.**

**On the Divine Names module:** This is a strong differentiator — no other hackathon entry will likely include rigorous Maturidi theological framing. Even a clean static grid with the taxonomy labels will score points. The Takhalluq reflections via Claude are genuinely useful and theologically interesting.

**On auth/User APIs:** The simplest path to satisfying the User API requirement is implementing bookmarks locally (localStorage) with a stub `/api/bookmarks` route, or using the Quran Foundation's `/collections` endpoint if we have credentials. **Need: Quran Foundation API key if using their User APIs.**

**Potential new idea — "Trace a Theme" mode:** Instead of starting from a single verse, let the user type a theme ("justice", "gratitude") and the canvas auto-generates a starter graph of 5–7 interconnected verses. This would score well on Impact and Innovation.

**Potential new idea — Shareable graph URLs:** Serialize the canvas state into a URL hash (base64 JSON). Zero backend required. Users can share their exploration maps, which is high engagement value.
