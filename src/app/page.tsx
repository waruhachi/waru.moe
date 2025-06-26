import { SparklesText } from '@/components/ui/SparklesText';
import { SquareGrid } from '@/components/ui/SquareGrid';

export default function Home() {
	return (
		<>
			<SquareGrid />
			<SparklesText
				primaryColor="#3B82F6"
				secondaryColor="#EAB308"
				sparklesCount={5}
				text="Coming Soon"
			/>
		</>
	);
}
