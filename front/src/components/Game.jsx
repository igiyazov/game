import { useEffect } from 'react';

export default function Game({ gameTitle, onBack }) {
	useEffect(() => {
		// Перенаправляем на игру в том же окне
		window.location.href = 'https://game.pyramidgames.fun';
	}, []);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-900">
			<div className="text-center text-white">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
				<p>Перенаправление на игру {gameTitle}...</p>
			</div>
		</div>
	);
}
