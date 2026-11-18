This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/create-next-app).

## Content pages

Run `pnpm dev:stephen-daily` from the workspace root, then open `/topics`.
Velite builds and watches MDX in `packages/stephen-contents/articles`.

| Collection URL     | Types                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------- |
| `/topics/dev`      | `post`, `short`                                                                       |
| `/topics/books`    | `life-habits`, `productivity`, `others`                                               |
| `/topics/others`   | `ba-zi`, `i-ching`, `buddhism`, `single`, `journaling`, `inner-compass`, `year-recap` |
| `/topics/doc`      | `doc`                                                                                 |
| `/topics/projects` | `project`                                                                             |
| `/topics/retro`    | `milestone`, `recap` (from `retroType`)                                               |

Lists live at `/topics/[collection]/[type]`; details at
`/topics/[collection]/[type]/[id]`. The ID comes from MDX frontmatter.
Unknown collections/types/IDs and unpublished posts return 404. Metadata uses the
same lookup and the detail route for its canonical path.

All lists use MDX `published` as their source of truth. They sort `createdAt`
newest first, with undated posts last. Collection previews and the home page take
four posts after filtering and sorting. No backend interaction API is connected.
The only initial MDX example is a draft; publish your own articles to populate lists.

Post bodies render on the server through `@repo/stephen-ui/daily-components/mdx`.
Tailwind Typography styles Markdown with `prose prose-sm`, and
`rehype-slug` supplies heading IDs for anchor links. `Button` is available
in article MDX; register additional components in `views/topics/post-detail.tsx`.
The detail page renders a separate header with the cover, title and description above the MDX body; its UI will be expanded incrementally.

The desktop TOC consumes Velite `toc` and optional `audio`. Its curved track follows
nested headings and highlights sections using the page scroll container. Sticky
spacing follows navbar visibility. Long lists scroll inside the sidebar; audio uses
native browser controls.
Only TOC data crosses the client boundary; the MDX body stays server-rendered.

Topics reuse the existing page layout and its request-time edition date.
`generateStaticParams` enumerates published posts, while the layout retains its
existing dynamic rendering behavior.

Run `pnpm --filter stephen-daily test:content` to check publication filtering,
ordering, route matching, URL generation, nested TOC geometry and dot positioning.

## Getting Started

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
