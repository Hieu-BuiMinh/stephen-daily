# Sticker outlines with SVG filters

A cutout photo feels more like a paper sticker when a light border follows the subject. I use this effect on the landmark photos in the Stephen Daily carousel. The PNGs already have transparent backgrounds, so SVG can use their alpha channel as the starting shape.

## An even outline

`SourceAlpha` describes the opacity of the image. `feMorphology` with `operator="dilate"` expands that shape by five pixels. Flood it with off-white, keep the color inside the expanded shape, then place the original image on top.

## A rough paper edge

The rough version starts with the same outline. `feTurbulence` creates a noise field, and `feDisplacementMap` uses it to nudge the edge. The final composite still uses the original image, so the photo stays sharp. A fixed seed keeps the edge consistent across renders. Change the seed for another variation.

## TSX

Render the filter definitions once per page. Replace the image paths with transparent cutouts of your own.

```tsx
import './sticker.css'

export function StickerExamples() {
	return (
		<>
			<svg className="sticker-filters" aria-hidden="true" focusable="false">
				<defs>
					<filter id="sticker-even" colorInterpolationFilters="sRGB">
						<feMorphology in="SourceAlpha" operator="dilate" radius="5" result="expanded" />
						<feFlood floodColor="#fffdf5" />
						<feComposite in2="expanded" operator="in" result="outline" />
						<feComposite in="SourceGraphic" in2="outline" operator="over" />
					</filter>
					<filter id="sticker-rough" colorInterpolationFilters="sRGB">
						<feMorphology in="SourceAlpha" operator="dilate" radius="5" result="expanded" />
						<feFlood floodColor="#fffdf5" />
						<feComposite in2="expanded" operator="in" result="outline" />
						<feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="7" result="noise" />
						<feDisplacementMap
							in="outline"
							in2="noise"
							scale="5"
							xChannelSelector="R"
							yChannelSelector="G"
							result="roughOutline"
						/>
						<feComposite in="SourceGraphic" in2="roughOutline" operator="over" />
					</filter>
				</defs>
			</svg>
			<img className="sticker sticker-even" src="/bitexco-cutout.png" alt="Bitexco Tower" />
			<img className="sticker sticker-rough" src="/cathedral-cutout.png" alt="Saigon Notre-Dame Cathedral" />
		</>
	)
}
```

## CSS

```css
.sticker-filters {
	position: absolute;
	width: 0;
	height: 0;
}

.sticker {
	display: block;
	max-width: 100%;
	height: auto;
}

.sticker-even {
	filter: url('#sticker-even');
}

.sticker-rough {
	filter: url('#sticker-rough');
}
```

Increase `radius` for a thicker border. Increase `scale` for a rougher edge, or lower `baseFrequency` for broader waves. Leave room around the cutout if a parent clips overflow. An opaque photo produces a rectangular border because its alpha channel describes the whole rectangle.

Reference [W3C Filter Effects Module Level 1](https://www.w3.org/TR/filter-effects-1/).
