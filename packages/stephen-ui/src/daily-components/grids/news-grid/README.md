# NewsGrid

Grid 12 cột. Mỗi `NewsGrid.Section` mặc định chiếm 12 cột và giữ thứ tự DOM.
`colSpan` nhận 1–12; `colStart` nhận 1–12 hoặc `auto`. Đảm bảo vị trí bắt đầu
và số cột chiếm không vượt quá 12 cột của grid.

```tsx
import { NewsGrid } from '@repo/stephen-ui/daily-components'

;<NewsGrid className="gap-x-6 gap-y-12">
	<NewsGrid.Section className="md:col-span-9 md:col-start-4">
		<h2>Grid System</h2>
	</NewsGrid.Section>

	<NewsGrid.Section colSpan={12} className="md:col-span-3 md:col-start-4">
		<h3>Bài thứ nhất</h3>
	</NewsGrid.Section>
	<NewsGrid.Section colSpan={12} className="md:col-span-3">
		<h3>Bài thứ hai</h3>
	</NewsGrid.Section>
	<NewsGrid.Section colSpan={12} className="md:col-span-3">
		<h3>Bài thứ ba</h3>
	</NewsGrid.Section>
</NewsGrid>
```

Truyền số cột trực tiếp khi layout không cần đổi theo breakpoint:

```tsx
<NewsGrid>
	<NewsGrid.Section colSpan={8}>Bài chính</NewsGrid.Section>
	<NewsGrid.Section colSpan={4}>Cột phụ</NewsGrid.Section>
	<NewsGrid.Section colSpan={6} colStart={7}>
		Nội dung lệch phải, chừa trống 6 cột đầu.
	</NewsGrid.Section>
</NewsGrid>
```

Các props HTML, `children`, `className`, `style` và ref được truyền xuống element.
Dùng Tailwind `row-start-*`, `row-span-*`, `min-h-*` khi cần nhịp dọc hoặc khoảng
trống như bản thiết kế. Grid không thêm nội dung, đường kẻ hay quản lý state.
