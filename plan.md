# MCP Server Plan: Ben Dechrai Site

## Overview

A Model Context Protocol server that exposes the site's content and functionality to AI assistants. Backed by Postgres with pgvector for semantic search. Runs as a stdio server for local use (Claude Code, Claude Desktop) and optionally as Streamable HTTP for remote access.

---

## Architecture

```
mcp-server/
├── package.json              # type: module, dependencies
├── tsconfig.json             # ES2022, Node16
├── src/
│   ├── index.ts              # Entry point: create server, register all, connect transport
│   ├── db.ts                 # Postgres connection pool (pg + pgvector)
│   ├── embeddings.ts         # Embedding generation (Voyager/OpenAI API)
│   ├── tools/
│   │   ├── search.ts         # Semantic search across all content
│   │   ├── articles.ts       # Article CRUD + listing
│   │   ├── events.ts         # Event CRUD + listing
│   │   ├── talks.ts          # Talk CRUD + listing
│   │   └── message.ts        # Send contact message via SMTP
│   ├── resources/
│   │   ├── articles.ts       # Article resources (list + by slug)
│   │   ├── events.ts         # Event resources
│   │   ├── talks.ts          # Talk resources
│   │   └── site-info.ts      # Site metadata, themes, social links
│   └── prompts/
│       ├── bio.ts            # Generate bio in various styles
│       ├── recommend.ts      # Recommend content based on interest
│       └── summarize.ts      # Summarize article(s) for a given audience
├── migrations/
│   ├── 001_create_articles.sql
│   ├── 002_create_events.sql
│   ├── 003_create_talks.sql
│   ├── 004_enable_pgvector.sql
│   └── 005_seed_content.sql  # Migrate from content.ts
└── .env.example
```

---

## Database Schema

### Enable pgvector

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Articles

```sql
CREATE TABLE articles (
  id          SERIAL PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  date        DATE NOT NULL,
  summary     TEXT NOT NULL,
  body        TEXT NOT NULL,
  image       TEXT NOT NULL,
  embedding   vector(1536),  -- for semantic search
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX articles_embedding_idx ON articles
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 10);
```

### Events

```sql
CREATE TABLE events (
  id        SERIAL PRIMARY KEY,
  name      TEXT NOT NULL,
  date      DATE NOT NULL,
  location  TEXT NOT NULL,
  role      TEXT NOT NULL CHECK (role IN ('speaking', 'workshop', 'attending')),
  talk      TEXT,
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Talks

```sql
CREATE TABLE talks (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('talk', 'workshop')),
  event       TEXT NOT NULL,
  date        DATE NOT NULL,
  description TEXT NOT NULL,
  embedding   vector(1536),
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
```

### Messages log (optional — audit trail for contact submissions)

```sql
CREATE TABLE messages (
  id         SERIAL PRIMARY KEY,
  sender     TEXT NOT NULL,
  body       TEXT NOT NULL,
  sent_at    TIMESTAMPTZ DEFAULT now()
);
```

---

## Resources

Resources are read-only data exposed to the client/model.

### `site://info`
Static resource returning site metadata: name, description, available themes, social links, tech stack.

### `articles://list`
Returns all articles (id, slug, title, date, summary). No body — keeps it lightweight.

### `articles://{slug}`
Dynamic resource template. Returns full article by slug including body and image URL.

### `events://list`
Returns all events with name, date, location, role, talk.

### `events://upcoming`
Returns only future events (date >= today).

### `talks://list`
Returns all talks with title, type, event, date, description.

---

## Tools

Tools are model-invoked actions.

### `search`
Semantic search across all content types using pgvector.

```
Input:  { query: string, types?: ("article"|"event"|"talk")[], limit?: number }
Output: Ranked results with content type, title, relevance score, and snippet
```

Implementation: Generate embedding for query, run cosine similarity search across selected tables, merge and rank results.

### `list_articles`
List all articles with optional date range filter.

```
Input:  { from_date?: string, to_date?: string }
Output: Array of { slug, title, date, summary }
```

### `get_article`
Get full article content by slug.

```
Input:  { slug: string }
Output: { slug, title, date, summary, body, image }
```

### `create_article`
Create a new article. Auto-generates embedding.

```
Input:  { slug, title, date, summary, body, image }
Output: { id, slug }
```

### `update_article`
Update an existing article. Re-generates embedding.

```
Input:  { slug: string, updates: Partial<Article> }
Output: { slug, updated_fields: string[] }
```

### `list_events`
List events, optionally filtered to upcoming only.

```
Input:  { upcoming_only?: boolean }
Output: Array of { name, date, location, role, talk }
```

### `create_event` / `update_event`
CRUD for events.

### `list_talks`
List all talks.

```
Input:  { type?: "talk" | "workshop" }
Output: Array of { title, type, event, date, description }
```

### `create_talk` / `update_talk`
CRUD for talks.

### `send_message`
Send a contact message via SMTP (same as existing Netlify function).

```
Input:  { sender: string, message: string }
Output: { success: boolean, error?: string }
```

Logs to messages table for audit trail.

### `find_related`
Given an article slug, find semantically related content across all types.

```
Input:  { slug: string, limit?: number }
Output: Ranked related articles, events, and talks
```

### `rebuild_embeddings`
Re-generate embeddings for all content (admin utility).

```
Input:  { types?: ("article"|"event"|"talk")[] }
Output: { articles_updated, events_updated, talks_updated }
```

---

## Prompts

Reusable prompt templates exposed to the client.

### `bio`
Generate a bio for Ben in a specified style.

```
Args: { style: "professional" | "casual" | "conference" | "twitter", max_words?: number }
```

Fetches site info + recent articles/talks to ground the bio.

### `recommend`
Recommend content based on a visitor's interest.

```
Args: { interest: string }
```

Runs semantic search, returns curated recommendation with reasoning.

### `summarize`
Summarize one or more articles for a target audience.

```
Args: { slugs: string[], audience: "developer" | "manager" | "general" }
```

---

## Dependencies

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.26.0",
    "zod": "^3.25.0",
    "pg": "^8.13.0",
    "pgvector": "^0.2.0",
    "nodemailer": "^8.0.1"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/pg": "^8.11.0",
    "@types/nodemailer": "^7.0.10",
    "typescript": "^5.7.0"
  }
}
```

Embedding generation: Use the Voyager API or OpenAI embeddings API via a simple fetch call in `embeddings.ts` — no heavy SDK needed. Configurable via `EMBEDDING_API_KEY` and `EMBEDDING_MODEL` env vars.

---

## Environment Variables

```
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/bendechrai

# Embeddings
EMBEDDING_API_KEY=...
EMBEDDING_MODEL=text-embedding-3-small  # or voyage-3-lite
EMBEDDING_DIMENSIONS=1536

# SMTP (for send_message)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
CONTACT_EMAIL=...
```

---

## Transport

### Primary: stdio (local development)

```typescript
const transport = new StdioServerTransport();
await server.connect(transport);
```

Configured in `.mcp.json` at repo root:

```json
{
  "mcpServers": {
    "bendechrai": {
      "command": "node",
      "args": ["mcp-server/build/index.js"],
      "env": {
        "DATABASE_URL": "postgresql://..."
      }
    }
  }
}
```

### Future: Streamable HTTP (remote access)

Could be deployed as a standalone Node.js service or as a Netlify/Cloudflare function for remote AI assistant access. Would add auth (API key or OAuth 2.1).

---

## Migration Path from content.ts

1. Create Postgres database and run migrations
2. `005_seed_content.sql` inserts current content.ts data into tables
3. Generate initial embeddings via `rebuild_embeddings` tool
4. Website frontend switches from importing `content.ts` to fetching from an API route (or at build time via a data-fetching script that queries Postgres and writes a JSON file for static export)
5. content.ts can be kept as a fallback/type reference during transition

---

## Implementation Order

1. **Scaffold** — project setup, package.json, tsconfig, db.ts connection
2. **Migrations** — create tables, enable pgvector, seed data
3. **Resources** — read-only data exposure (articles, events, talks, site-info)
4. **Read tools** — list_articles, get_article, list_events, list_talks, search, find_related
5. **Write tools** — create/update article/event/talk, send_message
6. **Embeddings** — embedding generation, rebuild_embeddings tool
7. **Prompts** — bio, recommend, summarize
8. **Integration** — .mcp.json config, test with Claude Code
