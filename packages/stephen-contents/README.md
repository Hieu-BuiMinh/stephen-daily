# Stephen Contents

Velite biên dịch MDX thành dữ liệu có TypeScript types cho `stephen-daily`.
Giữ nguyên 6 collection và các transform đã có trong package.

Các trang nội dung đã được nối trong `stephen-daily` tại `/topics`.
Xem [route và cách render](../../apps/stephen-daily/README.md#content-pages).
Heading Markdown được gắn `id` bằng `rehype-slug` để khớp với `toc`.

## Viết bài

Tạo file `.mdx` trong các thư mục mà collection đang khai báo:

| Collection     | Thư mục trong package                                                            | Frontmatter riêng                                         |
| -------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `devPost`      | `articles/dev/posts`, `articles/dev/shorts`                                      | `type: post` hoặc `short`                                 |
| `bookRecap`    | `articles/books/life-habits`, `articles/dev/productivity`, `articles/dev/others` | `type: life-habits`, `productivity`, `others`             |
| `docPost`      | `articles/doc`                                                                   | —                                                         |
| `projectPost`  | `articles/projects`                                                              | —                                                         |
| `retroPost`    | `articles/retro`                                                                 | `milestone` bắt buộc; `retroType: MILESTONE` hoặc `RECAP` |
| `shortWriting` | `articles/short-writing`                                                         | `type`: xem `collections/short.collections.ts`            |

Hai đường dẫn `articles/dev/productivity` và `articles/dev/others` ở `bookRecap`
được giữ theo config ban đầu.

Frontmatter chung bắt buộc: `id` duy nhất và `title`. `slug`, `body`, `metadata`,
`toc`, `slugAsParams` được sinh tự động. `published` mặc định là `true`.
`createdAt` không bắt buộc theo schema; nên điền khi muốn sắp xếp theo ngày.
Transform hiện tại luôn ghi `updatedAt` bằng thời điểm build và ghi đè `author`
thành Stephen Ming.

Xem bài mẫu `articles/dev/posts/mdx-example.mdx` (`published: false`).
`to-writes/` vẫn dành cho ghi chú, không nằm trong collection.

## Dùng trong Stephen Daily

```tsx
import { devPost, type DevBlogPost } from 'stephen-contents'
import { MDXContent } from '@repo/stephen-ui/daily-components/mdx'

export function PostBody({ post }: { post: DevBlogPost }) {
	return <MDXContent code={post.body} />
}

const publishedPosts = devPost.filter((post) => post.published)
```

Component render và `MDXContentProps` nằm trong `stephen-ui/daily-components/mdx`
(import đầy đủ: `@repo/stephen-ui/daily-components/mdx`), hoặc barrel `@repo/stephen-ui/daily-components`.
Các package khác khai báo dependency `stephen-contents: workspace:*` rồi import type:

```ts
import type {
	BookRecap,
	DevBlogPost,
	DocBlogPost,
	ProjectPost,
	RetroPost,
	ShortWriting,
	TPost,
	Metadata,
	Body,
	Author,
	TocItem,
	MDXComponents,
} from 'stephen-contents/types'
```

Các type trên cũng được export từ entry `stephen-contents`, cùng `DEV_POST_TYPE`,
`BOOKS_POST_TYPE`, `OTHERS_POST_TYPE` và enum `ARTICLES`.

Velite xuất cả bài nháp; nơi hiển thị tự lọc `published`.
Không đưa bài mẫu vào trang chủ tự động.

HTML trong MDX dùng cú pháp JSX (`className`, `htmlFor`, đóng tag).
CSS nền đã được import tại `apps/stephen-daily/app/globals.css`:

```css
@import '@repo/stephen-ui/styles.css';
```

App quét `articles/` để sinh class Tailwind được dùng trong MDX. Không cần import
CSS trong từng bài; `s.mdx()` của Velite không bundle các import CSS/component.
Với React component, import ở app rồi truyền qua `components`:

```tsx
import { Button } from '@repo/stephen-ui/base/button'

;<MDXContent code={post.body} components={{ Button }} />
```

Sau đó dùng `<Button>Đọc tiếp</Button>` trong MDX. Chỉ render code MDX do repo quản lý.

## Lệnh và editor

Chạy các lệnh sau từ thư mục gốc repo.

Generate nội dung một lần từ MDX vào `packages/stephen-contents/.velite/`:

```bash
pnpm --filter stephen-contents build
```

Chạy app khi viết bài; Next.js tự generate và watch nội dung:

```bash
pnpm dev:stephen-daily
```

Mở [http://localhost:3000/topics](http://localhost:3000/topics) để xem danh sách bài.

Để bài mẫu xuất hiện, đổi `published` trong
`packages/stephen-contents/articles/dev/posts/mdx-example.mdx` thành:

```yaml
published: true
```

Sau đó mở [bài mẫu](http://localhost:3000/topics/dev/post/mdx-example).
Nếu không chạy chế độ watch, chạy lại lệnh build nội dung sau khi sửa MDX.

Watch nội dung độc lập, không chạy app:

```bash
pnpm --filter stephen-contents dev
```

Generate nội dung và kiểm tra TypeScript:

```bash
pnpm --filter stephen-contents check-types
```

Ảnh/file tương đối trong nội dung được Velite xuất vào
`apps/stephen-daily/public/velite/`, phục vụ qua `/velite/`.
Dữ liệu và assets sinh ra được gitignore; Turbo cache cả hai.

Cài hai extension được workspace gợi ý: **MDX** (`unifiedjs.vscode-mdx`) và
**Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`). Mở repo root trong VS Code
để nhận gợi ý tag/thuộc tính JSX, Emmet và class CSS khi viết `.mdx`.
`checkMdx` dùng cho MDX language server; `tsc` chỉ kiểm tra các file TypeScript.

Tham khảo: [Velite MDX](https://velite.js.org/guide/using-mdx),
[Next.js integration](https://velite.js.org/guide/with-nextjs).
