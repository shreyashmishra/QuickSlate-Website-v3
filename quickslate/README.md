QuickSlate is Website A in the shared image system. Its portfolio carousel now consumes
the read-only feed exposed by Website B instead of hardcoded local carousel items.

## Getting Started

Create a local env file first:

```bash
cp .env.example .env.local
```

Required variable:

```bash
WEBSITE_B_PUBLIC_FEED_URL=http://localhost:3001/api/public/images
```

Point this at the public feed served by `website-b-admin`.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
The portfolio page will request carousel images from Website B at request time.

Key integration files:

- `app/Portfolio/page.tsx`
- `app/components/ProjectCarousel.tsx`
- `lib/website-b-carousel.ts`

The QuickSlate carousel:

- fetches Website B's `GET /api/public/images`
- only shows images already filtered and ordered by Website B
- does not list Supabase bucket contents directly
- shows a clean empty/error state if the shared feed is unavailable

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
