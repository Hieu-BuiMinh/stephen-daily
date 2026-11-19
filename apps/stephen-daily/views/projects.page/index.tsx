import { SectionHeaderPrimary } from '@repo/stephen-ui/daily-components'
import { PostList } from '@/views/topics.page/components/post-list'
import { getPublishedPosts, projectPosts } from '@/views/topics.page/data'

export const projectsDescription = 'Selected work, experiments, and things I have built.'

export function ProjectsPageView() {
	return (
		<>
			<SectionHeaderPrimary headingAs="h1" title="Projects" subtitle={projectsDescription} />
			<PostList posts={getPublishedPosts([{ posts: projectPosts }])} />
		</>
	)
}
