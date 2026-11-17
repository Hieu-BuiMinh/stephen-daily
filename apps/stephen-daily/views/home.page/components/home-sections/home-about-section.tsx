import { NewsGrid } from '@repo/stephen-ui/daily-components'
import Image from 'next/image'

function HomeAboutSection() {
	const experienceYears = new Date().getFullYear() - 2022 + 1

	return (
		<NewsGrid className="px-2">
			<NewsGrid.Section className="flex h-fit flex-col gap-4 md:col-start-1 md:col-end-4">
				<h2 className="bg-foreground text-background text-[clamp(1.125rem,2vw,1.625rem)] leading-tight font-semibold text-center p-3 uppercase font-yeseva">
					Write Your Own Story
				</h2>
				<p className="text-justify text-sm">
					I’m Stephen, a front-end developer with {experienceYears} years of experience turning ideas into
					interfaces people can use with ease. I care about the details that make a website feel right: clear
					layouts, thoughtful interactions, and code that stays readable as a product grows. For me, good
					front-end work connects how an interface looks with how it feels to use, across screen sizes and
					everyday situations.
				</p>
				<p className="text-justify text-sm">
					I approach my work with discipline, curiosity, and a willingness to keep learning. I enjoy breaking
					down complex problems, refining small details, and finding practical solutions that are easy to
					maintain. This journal is where I share what I build, the lessons I take from each project, and the
					ideas that shape my perspective on code, design, and life beyond the screen.
				</p>
				<div className="flex flex-col gap-3 font-semibold text-[clamp(1rem,1.8vw,1.5rem)] leading-tight p-3 uppercase font-yeseva text-justify border">
					<span>Discipline</span>
					<span>Passion</span>
					<span>Stoicism</span>
				</div>
			</NewsGrid.Section>

			<NewsGrid.Section className="md:col-start-4 md:col-end-13">
				<NewsGrid className="h-full grid-rows-[auto_1fr]">
					<NewsGrid.Section className="@container relative flex min-h-72 flex-col gap-4 border-b md:min-h-125">
						<h3 className="relative z-10 w-[70%] border-b-4 border-double border-foreground pb-4 font-playfair tracking-[-0.045em]">
							<span className="block text-[clamp(1rem,4.3cqw,3.5rem)] leading-[1.15] italic">
								You are the main -
							</span>
							<span className="mt-1 block text-[clamp(1.75rem,8cqw,7rem)] leading-none font-black uppercase">
								Character
							</span>
							<span className="mt-3 block text-[clamp(0.75rem,3cqw,2.5rem)] leading-tight font-semibold uppercase">
								In your own story
							</span>
						</h3>

						<Image
							src="/assets/images/hero/01.png"
							alt="hero-image"
							width={350}
							height={500}
							className="absolute bottom-0 right-0 w-25 sm:w-40 md:w-60 lg:w-100 z-10"
						/>
						<span className="size-full absolute inset-0 overflow-hidden flex items-center justify-center">
							<span className="size-full relative flex">
								<span className="absolute right-0 bottom-0 size-[clamp(12rem,70cqw,43.75rem)] translate-x-[28.57%] translate-y-[28.57%] rounded-full bg-brand"></span>
							</span>
						</span>
					</NewsGrid.Section>
					<NewsGrid.Section className="space-y-4 text-justify text-sm">
						<p>
							Since 2022, I’ve been building for the web and learning through the work itself. My focus is
							on responsive layouts, accessible interactions, and front-end code that is practical to
							maintain. I enjoy the space where design meets engineering: refining typography, shaping a
							smooth interaction, and making a complex screen feel simple. Every project is another chance
							to ask better questions and build something a little more useful. I value the quieter parts
							of the process just as much: understanding what people need, discussing the trade-offs, and
							revisiting the details after the first version is done. Progress often comes from small,
							deliberate improvements rather than a complete rewrite. That is the mindset I bring to my
							work: stay curious, keep things clear, and give each decision the attention it deserves.
						</p>
						<p>
							Beyond the screen, I try to carry that same intention into everyday life. Discipline helps
							me show up, passion keeps me interested, and stoicism reminds me to focus on what I can
							control. Stephen Daily is a place to put those thoughts into words: an ongoing record of
							things I am learning, questions I am still exploring, and moments worth remembering. I hope
							something here sparks an idea, offers a useful perspective, or simply gives you a reason to
							pause and think.
						</p>
					</NewsGrid.Section>
				</NewsGrid>
			</NewsGrid.Section>
		</NewsGrid>
	)
}

export default HomeAboutSection
