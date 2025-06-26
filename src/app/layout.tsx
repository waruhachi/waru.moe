import type { Metadata } from 'next';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import localFont from 'next/font/local';

import { ThemeProvider } from '@/components/themeProvider';
import './globals.css';

const Bumbbled = localFont({
	src: '../fonts/Bumbbled.otf',
});

export const metadata: Metadata = {
	title: 'waru.moe',
	description: 'You know me no better than I know myself',
	icons: {
		icon: [
			{
				rel: 'icon',
				type: 'image/png',
				url: '/icon/iconLight.png',
				media: '(prefers-color-scheme: light)',
			},
			{
				rel: 'icon',
				type: 'image/png',
				url: '/icon/iconDark.png',
				media: '(prefers-color-scheme: dark)',
			},
		],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html className={Bumbbled.className} lang="en" suppressHydrationWarning>
			<body>
				<Analytics />
				<SpeedInsights />
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					disableTransitionOnChange
					enableSystem
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
