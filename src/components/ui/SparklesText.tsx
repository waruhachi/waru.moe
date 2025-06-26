'use client';

import { useEffect, useState } from 'react';
import { Sparkles, type SparklesProps } from '@/components/ui/Sparkles';

interface SparklesTextProps {
	text: string;
	sparklesCount?: number;
	primaryColor?: string;
	secondaryColor?: string;
}

export function SparklesText({
	text,
	sparklesCount = 10,
	primaryColor = '#9E7AFF',
	secondaryColor = '#FE8BBB',
}: SparklesTextProps) {
	const [sparkles, setSparkles] = useState<SparklesProps[]>([]);

	useEffect(() => {
		const generateStar = (): SparklesProps => {
			const starX = `${Math.random() * 100}%`;
			const starY = `${Math.random() * 100}%`;
			const color = Math.random() > 0.5 ? primaryColor : secondaryColor;
			const delay = Math.random() * 2;
			const scale = Math.random() * 1 + 0.5;
			const lifespan = Math.random() * 10 + 5;
			const id = `${starX}-${starY}-${Date.now()}`;
			return {
				id,
				x: starX,
				y: starY,
				color,
				delay,
				scale,
				lifespan,
			};
		};

		const initializeStars = () => {
			const newSparkles = Array.from(
				{ length: sparklesCount },
				generateStar
			);
			setSparkles(newSparkles);
		};

		const updateStars = () => {
			setSparkles((currentSparkles) =>
				currentSparkles.map((star) => {
					if (star.lifespan <= 0) {
						return generateStar();
					}
					return { ...star, lifespan: star.lifespan - 0.1 };
				})
			);
		};

		initializeStars();
		const interval = setInterval(updateStars, 100);

		return () => clearInterval(interval);
	}, [primaryColor, secondaryColor, sparklesCount]);

	return (
		<div className="fixed inset-0 flex items-center justify-center ">
			<span className="relative inline-block">
				{sparkles.map((sparkle) => (
					<Sparkles key={sparkle.id} {...sparkle} />
				))}
				<strong className="pointer-events-none select-none font-bold text-6xl text-black md:text-8xl dark:text-white">
					{text}
				</strong>
			</span>
		</div>
	);
}
