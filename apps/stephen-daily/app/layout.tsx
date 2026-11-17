import type { Metadata } from 'next'
import { Playfair_Display, Yeseva_One } from 'next/font/google'
import localFont from 'next/font/local'
import AppProvider from '@/components/providers'
import './globals.css'

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
})
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
})
const yeseva = Yeseva_One({
	variable: '--font-yeseva',
	weight: '400',
	subsets: ['latin', 'vietnamese'],
	display: 'swap',
})
const playfair = Playfair_Display({
	variable: '--font-playfair',
	subsets: ['latin', 'vietnamese'],
	display: 'swap',
})

export const metadata: Metadata = {
	title: 'Stephen Daily',
	description: 'Stephen Daily',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${yeseva.variable} ${playfair.variable} text-fluid`}
				suppressHydrationWarning
			>
				<AppProvider>{children}</AppProvider>
			</body>
		</html>
	)
}
