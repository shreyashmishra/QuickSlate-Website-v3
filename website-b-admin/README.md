# QuickSlate Website B Admin Portal

Website B is an authenticated admin portal built with:

- Next.js 16 App Router
- TypeScript
- Tailwind CSS 4
- Auth0
- Prisma
- PostgreSQL
- Supabase Storage

Current scope includes:

- Auth0 login/logout
- Prisma-backed `allowed_users` access control
- image uploads to Supabase Storage
- image metadata persisted in PostgreSQL
- metadata editing
- soft delete
- admin-only permanent delete
- visibility and display-order controls
- public carousel feed for Website A

Still intentionally excluded:

- direct Website A browser access to the database
- Google Drive support
- Supabase Auth login
- background jobs or image processing

## Project structure

```text
app/
  api/images/            Route handlers for image CRUD
  api/public/images/     Read-only public carousel feed
  dashboard/             Protected dashboard UI
examples/
  website-a-carousel.ts  Sample Website A fetch + mapping code
components/dashboard/    Image manager client UI
lib/
  api/                   Typed JSON response helpers
  auth/                  Auth0 session + role helpers
  images/                Validation, repository, and image services
  storage/               Supabase Storage service
  prisma.ts              Shared Prisma client
prisma/
  migrations/            Prisma SQL migrations
  schema.prisma          Prisma schema
types/
  auth.ts                Auth-related types
  images.ts              Image payload types
  public-images.ts       Shared public feed contract
proxy.ts                 Auth0 request boundary for Next.js 16
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Required variables:

- `APP_BASE_URL`
- `AUTH0_DOMAIN`
- `AUTH0_CLIENT_ID`
- `AUTH0_CLIENT_SECRET`
- `AUTH0_SECRET`
- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`
- `IMAGE_UPLOAD_MAX_BYTES`

Generate `AUTH0_SECRET` with:

```bash
openssl rand -hex 32
```

## Auth0 setup

Create a **Regular Web Application** in Auth0 and configure:

- Allowed Callback URL: `http://localhost:3000/auth/callback`
- Allowed Logout URL: `http://localhost:3000`

For production, replace those URLs with the deployed domain.

## Database setup

This app uses Prisma for all PostgreSQL access and migrations.

Required tables:

- `allowed_users`
- `images`

Apply migrations with:

```bash
npm run db:migrate
```

The Prisma migrations:

- create the `portal_role` enum
- create `allowed_users`
- seed `shreyashmishra2016@gmail.com` as an active admin
- create `images`
- add indexes and constraints for management queries

## Supabase setup

This app uses Supabase only for:

- the PostgreSQL database connection used by Prisma
- the `carousel-images` Storage bucket

Important:

- Do not use Supabase Auth for end-user login in this app.
- Do not upload directly from the browser to Supabase in this phase.
- The server uploads to Storage using `SUPABASE_SERVICE_ROLE_KEY`.

Create a public bucket named:

```text
carousel-images
```

## Local development

```bash
npm install
npm run db:generate
npm run dev
```

If the database schema has not been applied yet:

```bash
npm run db:migrate
```

## Verification commands

```bash
npm run lint
npm run typecheck
npm run build
```

## API routes

- `GET /api/images`
- `POST /api/images/upload`
- `PATCH /api/images/[id]`
- `DELETE /api/images/[id]`
- `DELETE /api/images/[id]/permanent`
- `GET /api/public/images`

All routes:

- validate the Auth0 session server-side
- validate allowlist membership server-side
- enforce ownership or admin checks server-side
- return typed JSON success/error responses

The public feed route:

- is read-only
- does not require Auth0 login
- only returns visible, non-deleted image metadata
- does not expose direct database access or raw bucket listings to Website A

## Authorization rules

- `uploader`
  - view active images
  - upload images
  - edit text metadata on their own images
  - soft delete their own images
- `admin`
  - view all active images
  - view deleted images
  - upload images
  - update title, caption, alt text, visibility, and display order
  - soft delete any image
  - permanently delete any image

## Upload rules

- Allowed file types: `jpg`, `jpeg`, `png`, `webp`
- Max file size: 10 MB
- Files are stored in:

```text
uploads/{year}/{month}/{user-hash}/{uuid}.{ext}
```

- Metadata only is stored in PostgreSQL
- Raw binaries are stored only in Supabase Storage

## Public carousel feed

Endpoint:

```text
GET /api/public/images
```

Query parameters:

- `limit`
  Default: `20`
  Range: `1` to `100`
- `order`
  Optional.
  Current supported value: `carousel`

Filtering rules:

- `deleted_at IS NULL`
- `is_visible = true`

Ordering rules:

1. `display_order ASC`
2. `created_at DESC`

Response shape:

```json
{
  "ok": true,
  "data": {
    "images": [
      {
        "id": "uuid",
        "title": "Homepage hero",
        "caption": "Spring campaign",
        "alt_text": "Team working at a table",
        "public_url": "https://.../storage/v1/object/public/...",
        "storage_path": "uploads/2026/04/abc123/file.webp",
        "display_order": 0,
        "created_at": "2026-04-17T12:00:00.000Z"
      }
    ],
    "meta": {
      "count": 1,
      "generated_at": "2026-04-17T12:00:01.000Z",
      "limit": 20,
      "order": "display_order_asc_created_at_desc"
    }
  }
}
```

Caching:

- the endpoint returns `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`
- Website A should preferably fetch this feed server-side
- the design stays compatible with future image optimization or signed-URL changes because Website A consumes metadata, not raw storage listings

## Website A integration

Website A should fetch this endpoint from server-side code, then map the result into its existing carousel component input.

Sample code lives in:

```text
examples/website-a-carousel.ts
```

That file includes:

- `fetchSharedCarouselImages()`
- `mapPublicImagesToCarouselItems()`
- `WebsiteACarouselItem`

The shared response types live in:

```text
types/public-images.ts
```

Integration rules for Website A:

- consume `GET /api/public/images`
- do not list files directly from the Supabase bucket
- do not read the PostgreSQL database directly from the browser
- rely on the returned ordering instead of any storage-level ordering
- hidden or soft-deleted images are excluded automatically by Website B

## Phase 3 direction

The current schema and management flows are ready for:

- moderation workflows
- richer asset organization
- future signed URL support without changing Website A's data contract

without replacing Auth0, Prisma, or the server-side upload architecture.
