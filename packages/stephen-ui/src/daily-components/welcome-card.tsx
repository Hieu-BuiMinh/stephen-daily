import { Button } from '@repo/stephen-ui/base/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@repo/stephen-ui/base/card'

export function WelcomeCard() {
	return (
		<Card className="w-full max-w-lg">
			<CardHeader>
				<CardTitle>Stephen Daily</CardTitle>
				<CardDescription>Next.js app with shared UI components, styles, and workspace tooling.</CardDescription>
			</CardHeader>
			<CardFooter>
				<Button asChild variant="outline">
					<a href="https://ui.shadcn.com/docs" target="_blank" rel="noopener noreferrer">
						shadcn/ui documentation
					</a>
				</Button>
			</CardFooter>
		</Card>
	)
}
