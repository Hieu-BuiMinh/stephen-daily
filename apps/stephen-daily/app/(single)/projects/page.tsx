import type { Metadata } from 'next'
import { ProjectsPageView, projectsDescription } from '@/views/projects.page'

export const metadata: Metadata = { title: 'Projects | Stephen Daily', description: projectsDescription }

export default function ProjectsPage() {
	return <ProjectsPageView />
}
