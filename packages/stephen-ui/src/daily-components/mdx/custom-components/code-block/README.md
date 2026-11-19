# MdxCodeBlock in MDX

`MdxCodeBlock` is available in MDX without an import. Place each fenced code block
directly inside the component, with blank lines between the JSX tags and the code
fences. For multiple snippets, provide one unique label per snippet in `labels`,
in the same order.

````mdx
<MdxCodeBlock labels={['pnpm', 'npm']} fileName="terminal">

```bash
pnpm install
```

```bash
npm install
```

</MdxCodeBlock>
````

For a single snippet, omit `labels`. The `fileName` prop is optional. To
highlight specific lines, add a line range after the language. For example,
`{2,4-6}` highlights line 2 and lines 4 through 6.

````mdx
<MdxCodeBlock fileName="example.ts">

```ts {2}
const name = 'Stephen'
console.log(name)
```

</MdxCodeBlock>
````

The copy button copies the active snippet without line numbers.

## References

- [Clerk Docs](https://clerk.com/docs) and the [React quickstart](https://clerk.com/docs/quickstarts/react) inspired the tab layout.
- [Clerk React quickstart MDX source](https://github.com/clerk/clerk-docs/blob/main/docs/quickstarts/react.mdx?plain=1)
- [Shiki class-based dark mode](https://shiki.matsu.io/guide/dual-themes#class-based-dark-mode)
- [Shiki rehype integration](https://shiki.style/packages/rehype)
