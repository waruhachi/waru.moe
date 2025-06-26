'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type CurrentTheme = 'light' | 'dark';

interface SquareGridProps {
	speed?: number;
	squareSize?: number;
	borderColor?: {
		light: string;
		dark: string;
	};
	hoverFillColor?: {
		light: string;
		dark: string;
	};
	backgroundColor?: {
		light: string;
		dark: string;
	};
	className?: string;
}

export function SquareGrid({
	speed = 0.25,
	squareSize = 75,
	borderColor = {
		light: '#c5c5c5',
		dark: '#333',
	},
	hoverFillColor = {
		light: '#d4d4d8',
		dark: '#444',
	},
	backgroundColor = {
		light: '#fafafa',
		dark: '#0a0a0a',
	},
	className = '',
}: SquareGridProps) {
	const { systemTheme } = useTheme() as { systemTheme: CurrentTheme };
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const requestRef = useRef<number | undefined>(undefined);
	const gridOffset = useRef({ x: 0, y: 0 });
	const [hoveredSquare, setHoveredSquare] = useState<{
		x: number;
		y: number;
	} | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) {
			return;
		}

		const ctx = canvas.getContext('2d');
		if (!ctx) {
			return;
		}

		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		const createVignette = () => {
			const vignette = ctx.createRadialGradient(
				canvas.width / 2,
				canvas.height / 2,
				0,
				canvas.width / 2,
				canvas.height / 2,
				Math.min(canvas.width, canvas.height) * 0.4
			);

			if (systemTheme === 'dark') {
				vignette.addColorStop(0, 'rgba(10, 10, 10, 0)');
				vignette.addColorStop(0.2, 'rgba(10, 10, 10, 0.05)');
				vignette.addColorStop(0.5, 'rgba(10, 10, 10, 0.15)');
				vignette.addColorStop(0.75, 'rgba(10, 10, 10, 0.35)');
				vignette.addColorStop(0.9, 'rgba(10, 10, 10, 0.55)');
				vignette.addColorStop(1, 'rgba(10, 10, 10, 0.7)');
			} else {
				vignette.addColorStop(0, 'rgba(250, 250, 250, 0)');
				vignette.addColorStop(0.2, 'rgba(250, 250, 250, 0.05)');
				vignette.addColorStop(0.5, 'rgba(250, 250, 250, 0.15)');
				vignette.addColorStop(0.75, 'rgba(250, 250, 250, 0.35)');
				vignette.addColorStop(0.9, 'rgba(250, 250, 250, 0.55)');
				vignette.addColorStop(1, 'rgba(250, 250, 250, 0.7)');
			}

			return vignette;
		};

		const drawGrid = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			canvas.style.background = backgroundColor[systemTheme];

			const startX =
				Math.floor(gridOffset.current.x / squareSize) * squareSize;
			const startY =
				Math.floor(gridOffset.current.y / squareSize) * squareSize;

			for (
				let x = startX;
				x < canvas.width + squareSize;
				x += squareSize
			) {
				for (
					let y = startY;
					y < canvas.height + squareSize;
					y += squareSize
				) {
					const squareX = x - (gridOffset.current.x % squareSize);
					const squareY = y - (gridOffset.current.y % squareSize);

					if (
						hoveredSquare &&
						Math.floor((x - startX) / squareSize) ===
							hoveredSquare.x &&
						Math.floor((y - startY) / squareSize) ===
							hoveredSquare.y
					) {
						ctx.fillStyle = hoverFillColor[systemTheme];
						ctx.fillRect(squareX, squareY, squareSize, squareSize);
					}

					ctx.strokeStyle = borderColor[systemTheme];
					ctx.strokeRect(squareX, squareY, squareSize, squareSize);
				}
			}

			ctx.fillStyle = createVignette();
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		};

		const updateAnimation = () => {
			gridOffset.current.x =
				(gridOffset.current.x - speed + squareSize) % squareSize;
			gridOffset.current.y =
				(gridOffset.current.y - speed + squareSize) % squareSize;

			drawGrid();
			requestRef.current = requestAnimationFrame(updateAnimation);
		};

		const handleMouseMove = (event: MouseEvent) => {
			const newX = event.clientX;
			const newY = event.clientY;

			const startX =
				Math.floor(gridOffset.current.x / squareSize) * squareSize;
			const startY =
				Math.floor(gridOffset.current.y / squareSize) * squareSize;

			const hoveredSquareX = Math.floor(
				(newX + gridOffset.current.x - startX) / squareSize
			);
			const hoveredSquareY = Math.floor(
				(newY + gridOffset.current.y - startY) / squareSize
			);

			setHoveredSquare({ x: hoveredSquareX, y: hoveredSquareY });
		};

		const handleMouseLeave = () => {
			setHoveredSquare(null);
		};

		window.addEventListener('resize', resizeCanvas);
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseleave', handleMouseLeave);

		resizeCanvas();

		requestRef.current = requestAnimationFrame(updateAnimation);

		return () => {
			window.removeEventListener('resize', resizeCanvas);
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseleave', handleMouseLeave);
			if (requestRef.current) {
				cancelAnimationFrame(requestRef.current);
			}
		};
	}, [
		speed,
		squareSize,
		systemTheme,
		hoveredSquare,
		backgroundColor,
		borderColor,
		hoverFillColor,
	]);

	return (
		<canvas
			className={cn(
				'pointer-events-none fixed inset-0 block h-screen w-screen border-none',
				className
			)}
			ref={canvasRef}
			style={{
				width: '100vw',
				height: '100vh',
			}}
		/>
	);
}
